import test from "node:test";
import assert from "node:assert/strict";
import {
  DEV_MODE,
  MENTAL_MATH_QUESTION_COUNT,
  MEMORY_REQUIRED_LEVEL,
  STAGES,
  advanceMazeLevel,
  buildInitialProgress,
  createMazeState,
  distance,
  isMazePointInFinish,
  isMazePointInScareZone,
  isMazePointSafe,
  isMazePointOnWall,
  isMazeReadyToComplete,
  isPointInsideRect,
  isStagePassed,
  pickRandomItems,
  resetMazeState,
  scareMazeState,
  surviveMazeScareState,
  serializeProgress,
} from "../app.js";

test("initial progress starts at the landing stage with no completed stages", () => {
  const progress = buildInitialProgress();

  assert.equal(progress.currentStage, "intro");
  assert.deepEqual(progress.completedStages, []);
});

test("production difficulty is active", () => {
  assert.equal(DEV_MODE, false);
  assert.equal(MENTAL_MATH_QUESTION_COUNT, 9);
  assert.equal(MEMORY_REQUIRED_LEVEL, 9);
});

test("mental math requires all configured questions correct", () => {
  assert.equal(
    isStagePassed("mental-math", {
      correct: MENTAL_MATH_QUESTION_COUNT - 1,
      total: MENTAL_MATH_QUESTION_COUNT,
    }),
    false,
  );
  assert.equal(
    isStagePassed("mental-math", {
      correct: MENTAL_MATH_QUESTION_COUNT,
      total: MENTAL_MATH_QUESTION_COUNT,
    }),
    true,
  );
  assert.equal(
    isStagePassed("mental-math", {
      correct: MENTAL_MATH_QUESTION_COUNT,
      total: MENTAL_MATH_QUESTION_COUNT + 1,
    }),
    false,
  );
});

test("challenge flow includes memory and maze without NC", () => {
  assert.deepEqual(
    STAGES.map((stage) => stage.id),
    ["mental-math", "memory", "maze"],
  );
  assert.equal(isStagePassed("nc", { passedTasks: 3, totalTasks: 3 }), false);
  assert.equal(isStagePassed("gymi", { correctParts: 3, requiredParts: 3 }), false);
});

test("memory requires reaching the configured level", () => {
  assert.equal(
    isStagePassed("memory", {
      reachedLevel: MEMORY_REQUIRED_LEVEL - 1,
      requiredLevel: MEMORY_REQUIRED_LEVEL,
    }),
    false,
  );
  assert.equal(
    isStagePassed("memory", {
      reachedLevel: MEMORY_REQUIRED_LEVEL,
      requiredLevel: MEMORY_REQUIRED_LEVEL,
    }),
    true,
  );
});

test("maze requires reaching the goal without hitting a wall", () => {
  assert.equal(isStagePassed("maze", { reachedGoal: false, hitWall: false }), false);
  assert.equal(isStagePassed("maze", { reachedGoal: true, hitWall: true }), false);
  assert.equal(isStagePassed("maze", { reachedGoal: true, hitWall: false }), true);
});

test("maze rejects points outside the board bounds", () => {
  const rect = { left: 100, top: 50, right: 500, bottom: 450 };

  assert.equal(isPointInsideRect(100, 50, rect), true);
  assert.equal(isPointInsideRect(500, 450, rect), true);
  assert.equal(isPointInsideRect(99, 200, rect), false);
  assert.equal(isPointInsideRect(300, 451, rect), false);
});

test("maze detects Pranx wall points and safe blue points", () => {
  const rect = { left: 100, top: 50, right: 500, bottom: 450 };
  const point = (xPercent, yPercent) => ({
    clientX: rect.left + (xPercent / 100) * (rect.right - rect.left),
    clientY: rect.top + (yPercent / 100) * (rect.bottom - rect.top),
  });

  assert.equal(isMazePointOnWall(1, point(30, 75), rect), false);
  assert.equal(isMazePointOnWall(1, point(70, 50), rect), true);
  assert.equal(isMazePointOnWall(2, point(45, 32), rect), true);
  assert.equal(isMazePointOnWall(2, point(84, 88), rect), false);
  assert.equal(isMazePointOnWall(3, point(12, 88), rect), false);
  assert.equal(isMazePointOnWall(3, point(80, 60), rect), true);
});

test("maze treats the level three scare and finish rectangles as safe overlays", () => {
  const rect = { left: 0, top: 0, right: 1000, bottom: 1000 };

  assert.equal(isMazePointOnWall(3, { clientX: 630, clientY: 240 }, rect), true);
  assert.equal(isMazePointSafe(3, { clientX: 630, clientY: 240 }, rect, { allowScareZones: true }), true);
  assert.equal(isMazePointSafe(3, { clientX: 660, clientY: 180 }, rect, { allowFinish: true }), true);
  assert.equal(isMazePointInScareZone({ clientX: 680, clientY: 310 }, rect), true);
  assert.equal(isMazePointInFinish(3, { clientX: 660, clientY: 180 }, rect), true);
});

test("maze distance helper measures pointer movement between sampled points", () => {
  assert.equal(distance(0, 0, 3, 4), 5);
  assert.equal(distance(10, 10, 10, 10), 0);
});

test("maze state starts on level one and inactive", () => {
  assert.deepEqual(createMazeState(), {
    level: 1,
    active: false,
    scared: false,
    scareSurvived: false,
  });
});

test("maze finish advances from level one to two and two to three", () => {
  assert.deepEqual(advanceMazeLevel({ level: 1, active: true, scared: false, scareSurvived: false }), {
    level: 2,
    active: true,
    scared: false,
    scareSurvived: false,
  });
  assert.deepEqual(advanceMazeLevel({ level: 2, active: true, scared: false, scareSurvived: false }), {
    level: 3,
    active: true,
    scared: false,
    scareSurvived: false,
  });
});

test("maze scare must be survived before level three can complete", () => {
  const scared = scareMazeState({ level: 3, active: true, scared: false, scareSurvived: false });

  assert.deepEqual(scared, {
    level: 3,
    active: true,
    scared: true,
    scareSurvived: false,
  });
  assert.equal(isMazeReadyToComplete(scared), false);

  const survived = surviveMazeScareState(scared);
  assert.deepEqual(survived, {
    level: 3,
    active: true,
    scared: false,
    scareSurvived: true,
  });
  assert.equal(isMazeReadyToComplete(survived), true);

  assert.deepEqual(resetMazeState(scared), {
    level: 1,
    active: false,
    scared: false,
    scareSurvived: false,
  });
});

test("random picker returns the requested number without mutating the source", () => {
  const source = ["a", "b", "c", "d"];
  const picked = pickRandomItems(source, 2, () => 0.1);

  assert.equal(picked.length, 2);
  assert.ok(picked.every((item) => source.includes(item)));
  assert.deepEqual(source, ["a", "b", "c", "d"]);
});

test("progress serialization keeps only known stage ids", () => {
  const progress = serializeProgress({
    currentStage: "nc",
    completedStages: ["mental-math", "unknown", STAGES[2].id, "gymi", "nc"],
  });

  assert.deepEqual(progress, {
    currentStage: "intro",
    completedStages: ["mental-math", "maze"],
  });
});

export const STAGES = [
  { id: "mental-math", title: "Mathi", shortTitle: "Mathi" },
  { id: "memory", title: "Memory", shortTitle: "Memory" },
  { id: "maze", title: "Labyrinth", shortTitle: "Labyrinth" },
];

const STORAGE_KEY = "leonBirthdayChallengeProgress";
export const DEV_MODE = false;
const NORMAL_MENTAL_MATH_QUESTION_COUNT = 6;
const NORMAL_MEMORY_REQUIRED_LEVEL = 8;

export const MENTAL_MATH_QUESTION_COUNT = DEV_MODE ? 1 : NORMAL_MENTAL_MATH_QUESTION_COUNT;
const MENTAL_MATH_SECONDS = 40;
export const MEMORY_REQUIRED_LEVEL = DEV_MODE ? 1 : NORMAL_MEMORY_REQUIRED_LEVEL;
const MEDIA_BASE = "./bilder%3Avideos";

const INTRO_PHOTOS = [
  { src: `${MEDIA_BASE}/matura.jpeg`, alt: "Gruppenfoto im Anzug" },
  { src: `${MEDIA_BASE}/benleon.jpeg`, alt: "Ben und Leon" },
  { src: `${MEDIA_BASE}/gruppenfoto.jpeg`, alt: "Gruppenfoto draussen" },
  { src: `${MEDIA_BASE}/tessin.jpeg`, alt: "Leon im Tessin" },
  { src: `${MEDIA_BASE}/67.jpeg`, alt: "Gemeinsames Essen" },
];

const REWARD_VIDEOS = [
  { src: `${MEDIA_BASE}/catdance-browser.mp4`, label: "Cat Dance" },
  { src: `${MEDIA_BASE}/tanz-browser.mp4`, label: "Tanz" },
];
const FINAL_HINT_WORD = "WORT";

const MENTAL_MATH_BANK = [
  { question: "18 + 27", answer: 45 },
  { question: "46 - 18", answer: 28 },
  { question: "7 × 8", answer: 56 },
  { question: "72 ÷ 9", answer: 8 },
  { question: "24 + 35", answer: 59 },
  { question: "83 - 47", answer: 36 },
  { question: "6 × 9", answer: 54 },
  { question: "64 ÷ 8", answer: 8 },
  { question: "29 + 38", answer: 67 },
  { question: "91 - 56", answer: 35 },
  { question: "8 × 7", answer: 56 },
  { question: "81 ÷ 9", answer: 9 },
  { question: "33 + 44", answer: 77 },
  { question: "70 - 29", answer: 41 },
  { question: "9 × 6", answer: 54 },
  { question: "56 ÷ 7", answer: 8 },
  { question: "47 + 26", answer: 73 },
  { question: "62 - 38", answer: 24 },
  { question: "5 × 12", answer: 60 },
  { question: "90 ÷ 10", answer: 9 },
  { question: "36 + 28", answer: 64 },
  { question: "100 - 63", answer: 37 },
  { question: "11 × 6", answer: 66 },
  { question: "84 ÷ 7", answer: 12 },
  { question: "58 + 19", answer: 77 },
  { question: "75 - 34", answer: 41 },
  { question: "4 × 13", answer: 52 },
  { question: "96 ÷ 8", answer: 12 },
  { question: "22 + 49", answer: 71 },
  { question: "88 - 39", answer: 49 },
  { question: "12 × 5", answer: 60 },
  { question: "99 ÷ 9", answer: 11 },
];

export function buildInitialProgress() {
  return {
    currentStage: "intro",
    completedStages: [],
  };
}

export function serializeProgress(input = {}) {
  const validStageIds = new Set(STAGES.map((stage) => stage.id));
  const completedStages = Array.isArray(input.completedStages)
    ? input.completedStages.filter((id) => validStageIds.has(id))
    : [];
  const currentStage =
    input.currentStage === "intro" ||
    input.currentStage === "complete" ||
    validStageIds.has(input.currentStage)
      ? input.currentStage
      : "intro";

  return {
    currentStage,
    completedStages: [...new Set(completedStages)],
  };
}

export function isStagePassed(stageId, result) {
  if (stageId === "mental-math") {
    return result.correct === MENTAL_MATH_QUESTION_COUNT && result.total === MENTAL_MATH_QUESTION_COUNT;
  }

  if (stageId === "memory") {
    return result.reachedLevel >= result.requiredLevel;
  }

  if (stageId === "maze") {
    return result.reachedGoal === true && result.hitWall === false;
  }

  return false;
}

export function pickRandomItems(items, count, rng = Math.random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy.slice(0, count);
}

export function createMazeState() {
  return {
    level: 1,
    active: false,
    scared: false,
    scareSurvived: false,
  };
}

export function advanceMazeLevel(state) {
  return {
    ...state,
    level: Math.min(3, state.level + 1),
    scared: false,
    scareSurvived: false,
  };
}

export function scareMazeState(state) {
  return {
    ...state,
    active: true,
    scared: true,
    scareSurvived: false,
  };
}

export function resetMazeState() {
  return createMazeState();
}

export function surviveMazeScareState(state) {
  return {
    ...state,
    active: true,
    scared: false,
    scareSurvived: true,
  };
}

export function isMazeReadyToComplete(state) {
  return state.level === 3 && state.active === true && state.scared === false && state.scareSurvived === true;
}

export const MAZE_WALLS = {
  1: [
    { id: "w1", x: 0, y: 0, w: 100, h: 15 },
    { id: "w2", x: 0, y: 0, w: 20, h: 100 },
    { id: "w3", x: 90, y: 0, w: 10, h: 100 },
    { id: "w4", x: 0, y: 85, w: 100, h: 15 },
    { id: "w5", x: 55, y: 23, w: 40, h: 62 },
  ],
  2: [
    { id: "w6", x: 0, y: 0, w: 100, h: 8 },
    { id: "w7", x: 0, y: 0, w: 8, h: 100 },
    { id: "w8", x: 92, y: 0, w: 8, h: 100 },
    { id: "w9", x: 0, y: 92, w: 100, h: 8 },
    { id: "w10", x: 27, y: 27, w: 73, h: 13 },
    { id: "w11", x: 7, y: 53, w: 72, h: 11 },
    { id: "w12", x: 20, y: 76, w: 73, h: 8 },
    { id: "w13", x: 20, y: 76, w: 73, h: 10 },
  ],
  3: [
    { id: "w14", x: 0, y: 0, w: 100, h: 22 },
    { id: "w15", x: 0, y: 0, w: 8, h: 100 },
    { id: "w16", x: 92, y: 0, w: 8, h: 100 },
    { id: "w17", x: 0, y: 92, w: 100, h: 8 },
    { id: "w18", x: 17, y: 51, w: 76, h: 31 },
    { id: "w19", x: 4, y: 8, w: 56, h: 38 },
    { id: "w20", x: 69, y: 22, w: 28, h: 50 },
    { id: "w21", x: 54, y: 35, w: 13, h: 11 },
    { id: "w22", x: 57, y: 22, w: 8, h: 4 },
    { id: "w23", x: 71, y: 8, w: 27, h: 15 },
    { id: "w24", x: 62, y: 27, w: 15, h: 6 },
  ],
};

export const MAZE_FINISHES = {
  1: { x: 75, y: 15, w: 16, h: 8 },
  2: { x: 78, y: 86, w: 18, h: 6 },
  3: { x: 62, y: 12, w: 10, h: 10 },
};

export const MAZE_SCARE_ZONES = [
  { id: "s1", x: 61, y: 21, w: 12, h: 6 },
  { id: "s2", x: 56, y: 21, w: 4, h: 13 },
  { id: "s3", x: 62, y: 27, w: 11, h: 5 },
];

export function isPointInsideRect(clientX, clientY, rect) {
  const bounds = getRectBounds(rect);
  return (
    clientX >= bounds.left &&
    clientX <= bounds.right &&
    clientY >= bounds.top &&
    clientY <= bounds.bottom
  );
}

export function isMazePointOnWall(level, point, boardRect) {
  return isMazePointInRects(MAZE_WALLS[level] ?? [], point, boardRect);
}

export function isMazePointInFinish(level, point, boardRect) {
  return isMazePointInRects([MAZE_FINISHES[level]], point, boardRect);
}

export function isMazePointInScareZone(point, boardRect) {
  return isMazePointInRects(MAZE_SCARE_ZONES, point, boardRect);
}

export function isMazePointSafe(level, point, boardRect, options = {}) {
  if (!isPointInsideRect(point.clientX, point.clientY, boardRect)) return false;
  if (options.allowFinish && isMazePointInFinish(level, point, boardRect)) return true;
  if (options.allowScareZones && level === 3 && isMazePointInScareZone(point, boardRect)) return true;
  return !isMazePointOnWall(level, point, boardRect);
}

function isMazePointInRects(rects, point, boardRect) {
  const bounds = getRectBounds(boardRect);
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  if (width <= 0 || height <= 0) return false;

  const xPercent = ((point.clientX - bounds.left) / width) * 100;
  const yPercent = ((point.clientY - bounds.top) / height) * 100;

  return rects.filter(Boolean).some((rect) => (
    xPercent >= rect.x &&
    xPercent <= rect.x + rect.w &&
    yPercent >= rect.y &&
    yPercent <= rect.y + rect.h
  ));
}

function getRectBounds(rect) {
  return {
    left: rect.left,
    top: rect.top,
    right: Number.isFinite(rect.right) ? rect.right : rect.left + rect.width,
    bottom: Number.isFinite(rect.bottom) ? rect.bottom : rect.top + rect.height,
  };
}

function renderMazeWalls() {
  return Object.entries(MAZE_WALLS).flatMap(([level, walls]) => (
    walls.map((wall) => `
      <div
        class="wall lev${level}"
        id="${wall.id}"
        style="left: ${wall.x}%; top: ${wall.y}%; width: ${wall.w}%; height: ${wall.h}%;"
      ></div>
    `)
  )).join("");
}

function readProgress() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return serializeProgress(stored);
  } catch {
    return buildInitialProgress();
  }
}

function writeProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeProgress(progress)));
  } catch {
    // Progress still works for the current session if storage is unavailable.
  }
}

function createApp() {
  const root = document.querySelector("[data-app]");
  const resetButton = document.querySelector("[data-reset]");
  let progress = readProgress();
  let timerId = null;
  let memory = null;

  function setProgress(nextProgress) {
    progress = serializeProgress(nextProgress);
    writeProgress(progress);
    render();
  }

  function clearTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function completeStage(stageId) {
    const completedStages = [...new Set([...progress.completedStages, stageId])];
    const nextStage = getNextStageId(stageId);
    setProgress({
      currentStage: nextStage,
      completedStages,
    });
  }

  function getNextStageId(stageId) {
    const index = STAGES.findIndex((stage) => stage.id === stageId);
    return STAGES[index + 1]?.id ?? "complete";
  }

  function render() {
    clearTimer();
    root.mazeCleanup?.();
    root.mazeCleanup = null;
    memory = null;
    root.innerHTML = `
      ${renderProgress()}
      <main class="screen">
        ${renderCurrentScreen()}
      </main>
    `;
    bindCurrentScreen();
  }

  function renderProgress() {
    return `
      <nav class="stage-nav" aria-label="Fortschritt">
        ${STAGES.map((stage, index) => {
          const done = progress.completedStages.includes(stage.id);
          const active = progress.currentStage === stage.id;
          return `
            <div class="stage-pill ${done ? "is-done" : ""} ${active ? "is-active" : ""}">
              <span>${index + 1}</span>
              <strong>${stage.shortTitle}</strong>
            </div>
          `;
        }).join("")}
      </nav>
    `;
  }

  function renderCurrentScreen() {
    if (progress.currentStage === "intro") return renderIntro();
    if (progress.currentStage === "mental-math") return renderMentalMathIntro();
    if (progress.currentStage === "memory") return renderMemoryIntro();
    if (progress.currentStage === "maze") return renderMazeIntro();
    return renderComplete();
  }

  function renderIntro() {
    return `
      <section class="intro-layout">
        <div class="intro-copy">
          <h1>Alles Gueti zum Geburi Leon!</h1>
          <p class="lead">Schaffsch du au die ufgabe?</p>
          <button class="primary" data-start>Starte</button>
        </div>
        <div class="photo-collage" aria-label="Fotos">
          ${INTRO_PHOTOS.map((photo, index) => `
            <figure class="photo-frame frame-${index + 1}">
              <img src="${photo.src}" alt="${photo.alt}" loading="${index === 0 ? "eager" : "lazy"}">
            </figure>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderMentalMathIntro() {
    return `
      <section class="panel narrow">
        <p class="eyebrow">Station 1</p>
        <h2>Chopfrechne</h2>
        <p>${MENTAL_MATH_QUESTION_COUNT} ${MENTAL_MATH_QUESTION_COUNT === 1 ? "ufgab" : "ufgabe"} in 40 sekunde. ${MENTAL_MATH_QUESTION_COUNT === 1 ? "Sie" : "Alli"} ${MENTAL_MATH_QUESTION_COUNT === 1 ? "muss" : "münd"} korrekt si.</p>
        <button class="primary" data-start-mental>starte</button>
      </section>
    `;
  }

  function renderMentalMathAttempt() {
    const attempt = {
      tasks: pickRandomItems(MENTAL_MATH_BANK, MENTAL_MATH_QUESTION_COUNT),
      index: 0,
      correct: 0,
      finished: false,
    };
    root.innerHTML = `
      ${renderProgress()}
      <main class="screen">
        <section class="panel math-focus">
          <div class="challenge-head">
            <div>
              <p class="eyebrow">Station 1</p>
              <h2>Kopfrechnen</h2>
            </div>
            <div class="timer big-timer" data-timer>40</div>
          </div>
          <form class="single-math" data-mental-form>
            <div class="question-progress" data-question-progress>Frage 1 / ${MENTAL_MATH_QUESTION_COUNT}</div>
            <div class="big-question" data-question>${attempt.tasks[0].question}</div>
            <input class="big-answer" inputmode="decimal" autocomplete="off" name="answer" aria-label="Antwort">
            <button class="primary" type="submit">witer</button>
          </form>
        </section>
      </main>
    `;

    const form = document.querySelector("[data-mental-form]");
    const input = form.elements.answer;

    function finishAttempt(reason = "complete") {
      if (attempt.finished) return;
      attempt.finished = true;
      clearTimer();
      evaluateMentalMath(attempt.correct, attempt.tasks.length, reason);
    }

    function showCurrentQuestion() {
      document.querySelector("[data-question-progress]").textContent = `Frage ${attempt.index + 1} / ${attempt.tasks.length}`;
      document.querySelector("[data-question]").textContent = attempt.tasks[attempt.index].question;
      input.value = "";
      input.focus();
    }

    startCountdown(MENTAL_MATH_SECONDS, finishAttempt);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const task = attempt.tasks[attempt.index];
      if (!compareNumbers(input.value, task.answer)) {
        finishAttempt("wrong");
        return;
      }
      attempt.correct += 1;
      attempt.index += 1;
      if (attempt.index >= attempt.tasks.length) {
        finishAttempt();
        return;
      }
      showCurrentQuestion();
    });
    input.focus();
  }

  function evaluateMentalMath(correct, total, reason = "complete") {
    const passed = isStagePassed("mental-math", { correct, total });
    const message = reason === "wrong"
      ? `Falsch. ${correct} von ${MENTAL_MATH_QUESTION_COUNT} hesch gschafft gha.`
      : `${correct} vo ${total} richtig. du bruchsch: ${MENTAL_MATH_QUESTION_COUNT} vo ${MENTAL_MATH_QUESTION_COUNT}.`;
    renderResult({
      stageId: "mental-math",
      title: passed ? "guet gmacht" : "lock in leon, ich han gmeint du wärsch guet in mathi?",
      message,
      passed,
      retryLabel: "Nomal versueche",
      retryAction: renderMentalMathAttempt,
    });
  }

  function renderMemoryIntro() {
    return `
      <section class="panel narrow">
        <p class="eyebrow">Station 2</p>
        <h2>Memory</h2>
        <p>Ziel isch Level ${MEMORY_REQUIRED_LEVEL}.</p>
        <button class="primary" data-start-memory>Memory starte</button>
      </section>
    `;
  }

  function startMemoryAttempt() {
    memory = {
      level: 1,
      sequence: [],
      inputIndex: 0,
      acceptingInput: false,
      requiredLevel: MEMORY_REQUIRED_LEVEL,
    };
    root.innerHTML = `
      ${renderProgress()}
      <main class="screen">
        <section class="panel">
          <div class="challenge-head">
            <div>
              <p class="eyebrow">Station 2</p>
              <h2>Memory</h2>
            </div>
            <div class="level-badge" data-memory-level>Level 1 / ${MEMORY_REQUIRED_LEVEL}</div>
          </div>
          <div class="memory-grid" data-memory-grid>
            ${Array.from({ length: 16 }, (_, index) => `
              <button class="memory-cell" type="button" data-cell="${index}" aria-label="Feld ${index + 1}"></button>
            `).join("")}
          </div>
          <p class="status-line" data-memory-status>Abfolg merke.</p>
        </section>
      </main>
    `;
    document.querySelector("[data-memory-grid]").addEventListener("click", handleMemoryClick);
    playNextMemoryLevel();
  }

  function playNextMemoryLevel() {
    memory.acceptingInput = false;
    memory.inputIndex = 0;
    memory.sequence.push(Math.floor(Math.random() * 16));
    document.querySelector("[data-memory-level]").textContent = `Level ${memory.level} / ${memory.requiredLevel}`;
    document.querySelector("[data-memory-status]").textContent = "Abfolg merke.";
    playSequence(memory.sequence, () => {
      memory.acceptingInput = true;
      document.querySelector("[data-memory-status]").textContent = "jetzt musch d abfolg widerhole.";
    });
  }

  function playSequence(sequence, done) {
    const cells = [...document.querySelectorAll("[data-cell]")];
    sequence.forEach((cellIndex, stepIndex) => {
      setTimeout(() => {
        cells[cellIndex].classList.add("is-lit");
        setTimeout(() => cells[cellIndex].classList.remove("is-lit"), 380);
      }, stepIndex * 650);
    });
    setTimeout(done, sequence.length * 650 + 100);
  }

  function handleMemoryClick(event) {
    const button = event.target.closest("[data-cell]");
    if (!button || !memory?.acceptingInput) return;
    const cellIndex = Number(button.dataset.cell);
    button.classList.add("is-hit");
    setTimeout(() => button.classList.remove("is-hit"), 160);

    if (cellIndex !== memory.sequence[memory.inputIndex]) {
      memory.acceptingInput = false;
      renderResult({
        stageId: "memory",
        title: "Schwach",
        message: `Erreichts Level: ${memory.level}. Ziel: Level ${memory.requiredLevel}.`,
        passed: false,
        retryLabel: "Memory neu starte",
        retryAction: startMemoryAttempt,
      });
      return;
    }

    memory.inputIndex += 1;
    if (memory.inputIndex < memory.sequence.length) return;

    if (isStagePassed("memory", { reachedLevel: memory.level, requiredLevel: memory.requiredLevel })) {
      renderResult({
        stageId: "memory",
        title: "Alli Statione bestande",
        message: "Du chasch witer zum nächste level",
        passed: true,
        retryLabel: "Memory neu starte",
        retryAction: startMemoryAttempt,
      });
      return;
    }

    memory.level += 1;
    setTimeout(playNextMemoryLevel, 500);
  }

  function renderMazeIntro() {
    return `
      <section class="panel narrow">
        <p class="eyebrow">Station 3</p>
        <h2>Labyrinth</h2>
        <button class="primary" data-start-maze>Labyrinth starte</button>
      </section>
    `;
  }

  function startMazeAttempt() {
    root.mazeCleanup?.();
    root.innerHTML = `
      ${renderProgress()}
      <main class="screen">
        <section class="maze-stage">
          <div class="challenge-head">
            <div>
              <p class="eyebrow">Station 3</p>
              <h2>Cursor Maze</h2>
            </div>
            <button class="secondary mini-reset" type="button" data-maze-reset>Restart</button>
          </div>
          <div class="prank-maze level1 normalcursor" data-maze-board>
            ${renderMazeWalls()}
            <button class="maze-start-prank" type="button" data-maze-start>START</button>
            <div class="maze-finish" data-maze-finish aria-label="Finish"></div>
            <div class="scare-zone scare-one" data-scare-zone></div>
            <div class="scare-zone scare-two" data-scare-zone></div>
            <div class="scare-zone scare-three" data-scare-zone></div>
            <div class="maze-level-label" data-maze-level>Level 1</div>
            <div class="trail-layer" data-trail-layer></div>
          </div>
          <p class="status-line" data-maze-status>Klicke START und erreiche die karierte Zielflagge.</p>
        </section>
      </main>
    `;

    let state = createMazeState();
    const board = document.querySelector("[data-maze-board]");
    const start = document.querySelector("[data-maze-start]");
    const finish = document.querySelector("[data-maze-finish]");
    const status = document.querySelector("[data-maze-status]");
    const restart = document.querySelector("[data-maze-reset]");
    const trailLayer = document.querySelector("[data-trail-layer]");
    const keysDown = new Set();
    let keyboardTimer = null;
    let lastPoint = null;
    let failResetId = null;
    let scareSession = null;

    function renderMazeState() {
      board.className = `prank-maze level${state.level} ${state.active ? "" : "normalcursor"} ${state.scared ? "is-scared" : ""} ${state.scareSurvived ? "has-survived-scare" : ""}`;
      document.querySelector("[data-maze-level]").textContent = `Level ${state.level}`;
      if (state.scared) {
        status.textContent = "Still bleiben.";
      } else if (state.scareSurvived) {
        status.textContent = "Weiter bis zur Zielflagge.";
      } else {
        status.textContent = state.active
          ? "Du döffsch nöd ah d wänd cho"
          : "";
      }
      start.hidden = state.active;
      start.textContent = state.active ? "GO!" : "START";
    }

    function resetMaze() {
      clearScareSession();
      if (failResetId) {
        clearTimeout(failResetId);
        failResetId = null;
      }
      state = resetMazeState();
      clearTrail();
      stopKeyboardMove();
      renderMazeState();
    }

    start.addEventListener("click", () => {
      const startRect = start.getBoundingClientRect();
      const startX = startRect.left + startRect.width / 2;
      const startY = startRect.top + startRect.height / 2;
      state = { ...state, active: true, scared: false, scareSurvived: false };
      status.textContent = "Wiiter bis zum ziel";
      prepareScareAudio();
      renderMazeState();
      addTrailPoint(startX, startY, true);
    });

    finish.addEventListener("pointerenter", (event) => handleMazeFinish(event.clientX, event.clientY));

    document.querySelectorAll("[data-scare-zone]").forEach((zone) => {
      zone.addEventListener("pointerenter", (event) => {
        if (state.active && state.level === 3 && !state.scared && !state.scareSurvived) {
          triggerMazeScare(event.clientX, event.clientY);
        }
      });
    });

    board.addEventListener("pointermove", (event) => {
      if (!state.active || state.scared) return;
      addTrailSegment(event.clientX, event.clientY);
    });

    document.addEventListener("pointermove", handleMazeDocumentPointerMove);

    board.addEventListener("touchmove", (event) => {
      if (!state.active || state.scared) return;
      const touch = event.touches[0];
      if (!touch) return;
      addTrailSegment(touch.clientX, touch.clientY);
      event.preventDefault();
    }, { passive: false });

    restart.addEventListener("click", resetMaze);
    document.addEventListener("keydown", handleMazeKeyDown);
    document.addEventListener("keyup", handleMazeKeyUp);

    function triggerMazeScare(clientX, clientY) {
      if (state.scared || state.scareSurvived) return;
      if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
        lastPoint = { x: clientX, y: clientY };
      }
      state = scareMazeState(state);
      stopKeyboardMove();
      renderMazeState();
      scareSession = triggerJumpscare(() => {
        scareSession = null;
        if (!state.scared) return;
        state = surviveMazeScareState(state);
        renderMazeState();
      });
    }

    function handleMazeFinish(clientX, clientY) {
      if (!state.active || state.scared) return;
      if (state.level < 3) {
        state = advanceMazeLevel(state);
        clearTrail();
        renderMazeState();
        if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
          addTrailPoint(clientX, clientY, true);
        }
        return;
      }
      if (!isMazeReadyToComplete(state)) {
        triggerMazeScare(clientX, clientY);
        return;
      }
      clearScareSession();
      clearTrail();
      stopKeyboardMove();
      renderResult({
        stageId: "maze",
        title: "Maze absolviert",
        message: "Du bechunnsch en Hinwis",
        passed: true,
        retryLabel: "Maze neu starten",
        retryAction: startMazeAttempt,
      });
    }

    function failMaze() {
      if (!state.active) return;
      clearScareSession();
      state = { ...state, active: false, scared: false, scareSurvived: false };
      board.classList.add("dead");
      status.textContent = "Nomal.";
      stopKeyboardMove();
      if (failResetId) clearTimeout(failResetId);
      failResetId = setTimeout(resetMaze, 420);
    }

    function handleMazeDocumentPointerMove(event) {
      if (!state.active) return;
      const boardRect = board.getBoundingClientRect();
      const point = { clientX: event.clientX, clientY: event.clientY };
      if (!isMazePointSafe(state.level, point, boardRect, {
        allowFinish: state.level === 3,
        allowScareZones: state.level === 3,
      })) {
        failMaze();
      }
    }

    function addTrailPoint(clientX, clientY, force = false) {
      if (!state.active || state.scared) return;
      if (!force && lastPoint && distance(lastPoint.x, lastPoint.y, clientX, clientY) < 4) return;
      const boardRect = board.getBoundingClientRect();
      if (!isPointInsideRect(clientX, clientY, boardRect)) {
        failMaze();
        return;
      }
      lastPoint = { x: clientX, y: clientY };
      const dot = document.createElement("div");
      dot.className = "trail-dot";
      dot.style.left = `${clientX - boardRect.left}px`;
      dot.style.top = `${clientY - boardRect.top}px`;
      trailLayer.append(dot);
      while (trailLayer.children.length > 10) {
        trailLayer.firstElementChild.remove();
      }
      checkMazeHit(clientX, clientY, boardRect);
    }

    function addTrailSegment(clientX, clientY) {
      if (!lastPoint) {
        addTrailPoint(clientX, clientY, true);
        return;
      }
      const steps = Math.max(2, Math.ceil(distance(lastPoint.x, lastPoint.y, clientX, clientY) / 6));
      const startPoint = lastPoint;
      for (let step = 1; step <= steps; step += 1) {
        const x = startPoint.x + ((clientX - startPoint.x) * step) / steps;
        const y = startPoint.y + ((clientY - startPoint.y) * step) / steps;
        addTrailPoint(x, y, true);
        if (!state.active || state.scared) break;
      }
    }

    function checkMazeHit(clientX, clientY, boardRect = board.getBoundingClientRect()) {
      if (!state.active || state.scared) return;
      if (!isPointInsideRect(clientX, clientY, boardRect)) {
        failMaze();
        return;
      }
      const point = { clientX, clientY };
      if (isMazePointInFinish(state.level, point, boardRect)) {
        handleMazeFinish(clientX, clientY);
        return;
      }
      if (state.level === 3 && !state.scareSurvived && isMazePointInScareZone(point, boardRect)) {
        triggerMazeScare(clientX, clientY);
        return;
      }
      const hit = document.elementFromPoint(clientX, clientY);
      if (hit?.closest("[data-maze-finish]")) {
        handleMazeFinish(clientX, clientY);
        return;
      }
      if (hit?.closest("[data-scare-zone]") && state.level === 3 && !state.scareSurvived) {
        triggerMazeScare(clientX, clientY);
        return;
      }
      if (!isMazePointSafe(state.level, point, boardRect, {
        allowFinish: true,
        allowScareZones: state.level === 3,
      })) {
        failMaze();
      }
    }

    function handleMazeKeyDown(event) {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      if (!state.active) {
        start.click();
      }
      keysDown.add(event.key);
      if (!keyboardTimer) {
        keyboardTimer = setInterval(moveKeyboardTrail, 30);
      }
    }

    function handleMazeKeyUp(event) {
      keysDown.delete(event.key);
      if (keysDown.size === 0) {
        stopKeyboardMove();
      }
    }

    function moveKeyboardTrail() {
      if (!state.active || state.scared || !lastPoint) {
        stopKeyboardMove();
        return;
      }
      const step = 6;
      const dx = (keysDown.has("ArrowRight") ? 1 : 0) - (keysDown.has("ArrowLeft") ? 1 : 0);
      const dy = (keysDown.has("ArrowDown") ? 1 : 0) - (keysDown.has("ArrowUp") ? 1 : 0);
      if (dx === 0 && dy === 0) return;
      const normalizer = dx !== 0 && dy !== 0 ? Math.SQRT1_2 : 1;
      const boardRect = board.getBoundingClientRect();
      const nextX = Math.max(boardRect.left, Math.min(boardRect.right, lastPoint.x + dx * step * normalizer));
      const nextY = Math.max(boardRect.top, Math.min(boardRect.bottom, lastPoint.y + dy * step * normalizer));
      addTrailSegment(nextX, nextY);
    }

    function stopKeyboardMove() {
      if (keyboardTimer) {
        clearInterval(keyboardTimer);
        keyboardTimer = null;
      }
      keysDown.clear();
    }

    function clearTrail() {
      lastPoint = null;
      trailLayer.innerHTML = "";
    }

    function clearScareSession() {
      if (!scareSession) return;
      scareSession.cancel();
      scareSession = null;
    }

    root.mazeCleanup = () => {
      document.removeEventListener("keydown", handleMazeKeyDown);
      document.removeEventListener("keyup", handleMazeKeyUp);
      document.removeEventListener("pointermove", handleMazeDocumentPointerMove);
      if (failResetId) clearTimeout(failResetId);
      clearScareSession();
      stopKeyboardMove();
    };

    renderMazeState();
  }

  function triggerJumpscare(afterScare) {
    playScareSound();
    const overlay = document.createElement("div");
    overlay.className = "jumpscare";
    overlay.innerHTML = `
      <img src="./jumpscare-gif.png.gif" alt="Jumpscare">
    `;
    document.body.append(overlay);
    const timeoutId = setTimeout(() => {
      overlay.remove();
      afterScare();
    }, 2800);

    return {
      cancel() {
        clearTimeout(timeoutId);
        overlay.remove();
      },
    };
  }

  function renderResult({ stageId, title, message, passed, retryLabel, retryAction }) {
    root.innerHTML = `
      ${renderProgress()}
      <main class="screen">
        <section class="panel narrow result ${passed ? "is-pass" : "is-fail"}">
          <p class="eyebrow">${passed ? "bstande" : "widerhole"}</p>
          <h2>${title}</h2>
          <p>${message}</p>
          <div class="actions">
            ${passed ? `<button class="primary" data-next-stage>wiiter</button>` : ""}
            <button class="secondary" data-retry>${retryLabel}</button>
          </div>
        </section>
      </main>
    `;
    document.querySelector("[data-retry]").addEventListener("click", retryAction);
    const nextButton = document.querySelector("[data-next-stage]");
    if (nextButton) {
      nextButton.addEventListener("click", () => completeStage(stageId));
    }
  }

  function renderComplete() {
    return `
      <section class="reward-screen">
        <div class="reward-copy">
          <h2 class="reward-title">du hesch es gschafft</h2>
        </div>
        <div class="reward-videos" aria-label="">
          ${REWARD_VIDEOS.map((video, index) => `
            <figure class="reward-video">
              <video src="${video.src}" autoplay muted loop playsinline preload="auto" aria-label="${video.label}"></video>
              <div class="confetti-layer" aria-hidden="true">
                ${Array.from({ length: 18 }, (_, confettiIndex) => {
                  const width = 7 + (confettiIndex % 4) * 3;
                  const height = 10 + (confettiIndex % 3) * 4;
                  const duration = 1.8 + (confettiIndex % 5) * 0.34;
                  const delay = (confettiIndex % 9) * -0.24;
                  const driftMid = ((confettiIndex % 5) - 2) * 16;
                  const driftEnd = ((confettiIndex % 7) - 3) * 18;

                  return `
                    <span style="--x: ${(index * 19 + confettiIndex * 37) % 100}%; --hue: ${(index * 71 + confettiIndex * 43) % 360}deg; --turn: ${(index * 7 + confettiIndex) * 19}deg; --w: ${width}px; --h: ${height}px; --duration: ${duration}s; --delay: ${delay}s; --drift-mid: ${driftMid}px; --drift-end: ${driftEnd}px;"></span>
                  `;
                }).join("")}
              </div>
            </figure>
          `).join("")}
        </div>
        <div class="final-hint" aria-label="Hinweis">${FINAL_HINT_WORD}</div>
      </section>
    `;
  }

  function bindCurrentScreen() {
    document.querySelector("[data-start]")?.addEventListener("click", () => {
      setProgress({ ...progress, currentStage: "mental-math" });
    });
    document.querySelector("[data-start-mental]")?.addEventListener("click", renderMentalMathAttempt);
    document.querySelector("[data-start-memory]")?.addEventListener("click", startMemoryAttempt);
    document.querySelector("[data-start-maze]")?.addEventListener("click", startMazeAttempt);
  }

  function startCountdown(seconds, onEnd) {
    let remaining = seconds;
    const timer = document.querySelector("[data-timer]");
    timer.textContent = formatTime(remaining);
    timerId = setInterval(() => {
      remaining -= 1;
      timer.textContent = formatTime(remaining);
      if (remaining <= 0) {
        clearTimer();
        onEnd();
      }
    }, 1000);
  }

  function formatTime(seconds) {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const rest = String(seconds % 60).padStart(2, "0");
      return `${minutes}:${rest}`;
    }
    return String(seconds);
  }

  resetButton.addEventListener("click", () => {
    clearTimer();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors and reset the in-memory state.
    }
    progress = buildInitialProgress();
    render();
  });

  render();
}

function compareNumbers(actual, expected) {
  const normalizedActual = Number(String(actual).trim().replace(",", "."));
  const normalizedExpected = Number(String(expected).trim().replace(",", "."));
  if (!Number.isFinite(normalizedActual) || !Number.isFinite(normalizedExpected)) {
    return false;
  }
  return Math.abs(normalizedActual - normalizedExpected) < 0.001;
}

export function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

let scareAudioContext = null;

function prepareScareAudio() {
  if (typeof window === "undefined") return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  scareAudioContext ??= new AudioContext();
  if (scareAudioContext.state === "suspended") {
    scareAudioContext.resume();
  }
}

function playScareSound() {
  if (!scareAudioContext) {
    prepareScareAudio();
  }
  if (!scareAudioContext) return;
  if (scareAudioContext.state === "suspended") {
    scareAudioContext.resume();
  }

  const now = scareAudioContext.currentTime;
  const duration = 1.15;
  const master = scareAudioContext.createGain();
  const filter = scareAudioContext.createBiquadFilter();
  const compressor = scareAudioContext.createDynamicsCompressor();

  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.62, now + 0.035);
  master.gain.exponentialRampToValueAtTime(0.46, now + 0.26);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  filter.type = "bandpass";
  filter.frequency.setValueAtTime(980, now);
  filter.frequency.exponentialRampToValueAtTime(2600, now + 0.18);
  filter.frequency.exponentialRampToValueAtTime(1500, now + duration);
  filter.Q.setValueAtTime(8, now);

  compressor.threshold.setValueAtTime(-22, now);
  compressor.knee.setValueAtTime(22, now);
  compressor.ratio.setValueAtTime(9, now);
  compressor.attack.setValueAtTime(0.004, now);
  compressor.release.setValueAtTime(0.18, now);

  const noiseBuffer = createScareNoiseBuffer(scareAudioContext, duration);
  const noise = scareAudioContext.createBufferSource();
  noise.buffer = noiseBuffer;

  const scream = scareAudioContext.createOscillator();
  const screamGain = scareAudioContext.createGain();
  scream.type = "sawtooth";
  scream.frequency.setValueAtTime(520, now);
  scream.frequency.exponentialRampToValueAtTime(1080, now + 0.16);
  scream.frequency.exponentialRampToValueAtTime(620, now + duration);
  screamGain.gain.setValueAtTime(0.0001, now);
  screamGain.gain.exponentialRampToValueAtTime(0.36, now + 0.025);
  screamGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  const wobble = scareAudioContext.createOscillator();
  const wobbleGain = scareAudioContext.createGain();
  wobble.frequency.setValueAtTime(19, now);
  wobbleGain.gain.setValueAtTime(55, now);
  wobble.connect(wobbleGain);
  wobbleGain.connect(scream.frequency);

  const thump = scareAudioContext.createOscillator();
  const thumpGain = scareAudioContext.createGain();
  thump.type = "sine";
  thump.frequency.setValueAtTime(72, now);
  thump.frequency.exponentialRampToValueAtTime(38, now + 0.28);
  thumpGain.gain.setValueAtTime(0.0001, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.5, now + 0.012);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

  noise.connect(filter);
  filter.connect(master);
  scream.connect(screamGain);
  screamGain.connect(master);
  thump.connect(thumpGain);
  thumpGain.connect(master);
  master.connect(compressor);
  compressor.connect(scareAudioContext.destination);

  noise.start(now);
  scream.start(now);
  wobble.start(now);
  thump.start(now);
  noise.stop(now + duration);
  scream.stop(now + duration);
  wobble.stop(now + duration);
  thump.stop(now + 0.4);
}

function createScareNoiseBuffer(audioContext, duration) {
  const length = Math.floor(audioContext.sampleRate * duration);
  const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < length; index += 1) {
    const progress = index / length;
    const attack = Math.min(1, progress / 0.035);
    const decay = Math.max(0, 1 - progress);
    data[index] = (Math.random() * 2 - 1) * attack * Math.pow(decay, 0.28);
  }

  return buffer;
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", createApp);
}

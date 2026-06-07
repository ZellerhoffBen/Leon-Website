# Leon Birthday Challenge Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clean static HTML/CSS/JavaScript scaffold for Leon's birthday challenge website.

**Architecture:** The app is a client-only flow with four locked stages and a final reveal. Challenge data and validation helpers live in `app.js`; the DOM layer renders one stage at a time and stores progress in `localStorage`.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node's built-in test runner.

---

### Task 1: Core Rules

**Files:**
- Create: `tests/app.test.js`
- Create: `app.js`

- [x] Add tests for stage passing thresholds, random task selection, and resettable progress.
- [x] Implement the minimal exported helpers used by tests.

### Task 2: Static Interface

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Modify: `app.js`

- [x] Build the landing screen, stage shell, result states, and global reset button.
- [x] Add interactive handlers for mental math, NC tasks, gymi math, and memory grid.

### Task 3: Verification

**Files:**
- Read: all created files

- [x] Run the Node test suite.
- [x] Run a browser smoke check against the static page.

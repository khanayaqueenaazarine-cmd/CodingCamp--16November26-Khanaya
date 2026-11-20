# Implementation Plan: Life Dashboard

## Overview

The Life Dashboard is a fully implemented single-page static web application. All tasks below document completed work across three files (`index.html`, `css/style.css`, `js/app.js`). No build step, server, or third-party framework is used. All user data is persisted in `localStorage`.

## Tasks

- [x] 1. Project Scaffold
  - [x] 1.1 Create `index.html` shell with `<!DOCTYPE html>`, `<html lang="en">`, `<head>`, and `<body>` elements
    - Includes `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`, and `<title>`
    - _Requirements: 1.1, 2.1_
  - [x] 1.2 Create `css/style.css` and link it from `index.html` via `<link rel="stylesheet">`
    - _Requirements: 4.7_
  - [x] 1.3 Create `js/app.js` and load it from `index.html` via `<script src="js/app.js" defer>`
    - _Requirements: 1.1_

- [x] 2. Helper Utilities
  - [x] 2.1 Implement `$(id)` shorthand for `document.getElementById`
    - _Requirements: 1.1_
  - [x] 2.2 Implement `pad(n)` to zero-pad a single digit using `String(n).padStart(2, '0')`
    - _Requirements: 2.1, 5.1_
  - [x] 2.3 Implement `saveJSON(key, value)` to serialize and write to `localStorage`
    - _Requirements: 3.3, 4.5, 5.8, 6.3, 7.3_
  - [x] 2.4 Implement `loadJSON(key, fallback)` with try/catch returning `fallback` on null or parse error
    - _Requirements: 3.10, 4.2, 5.1, 6.1, 6.15, 7.1_

- [x] 3. CSS Design Token System
  - [x] 3.1 Define `:root` custom properties for the light theme: `--radius`, `--gap`, `--transition`, `--bg`, `--surface`, `--surface-alt`, `--border`, `--text`, `--text-muted`, `--accent`, `--accent-hover`, `--accent-fg`, `--danger`, `--danger-hover`, `--success`, `--warning`, `--shadow`, `--shadow-lg`
    - _Requirements: 4.1, 4.7_
  - [x] 3.2 Define `body.dark` overrides for colour and shadow tokens (`--bg`, `--surface`, `--surface-alt`, `--border`, `--text`, `--text-muted`, `--accent`, `--accent-hover`, `--shadow`, `--shadow-lg`)
    - _Requirements: 4.3, 4.4, 4.7_
  - [x] 3.3 Apply smooth transition to `body` for `background-color` and `color` using `var(--transition)`
    - _Requirements: 4.7_
  - [x] 3.4 Define button variant classes: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.icon-btn`
    - _Requirements: 4.7_

- [x] 4. Topbar Layout
  - [x] 4.1 Add `<header class="topbar">` to `index.html` with three child regions: `.topbar-left`, `.topbar-center`, `.topbar-right`
    - _Requirements: 1.1_
  - [x] 4.2 Style `.topbar` as `position: sticky; top: 0; z-index: 100` with flex row, `justify-content: space-between`, and `border-bottom`
    - _Requirements: 1.1_
  - [x] 4.3 Place `#greeting-text` span, `#user-name` span, and `#edit-name-btn` icon button in `.topbar-left`
    - _Requirements: 1.2, 1.4, 3.1_
  - [x] 4.4 Place `#current-time` div and `#current-date` div in `.topbar-center`
    - _Requirements: 2.1, 2.3_
  - [x] 4.5 Place `#theme-toggle` button in `.topbar-right`
    - _Requirements: 4.5, 4.6_

- [x] 5. Card Grid Layout
  - [x] 5.1 Add `<main class="grid">` to `index.html` containing three `.card` section elements (timer, todo, links)
    - _Requirements: 1.1_
  - [x] 5.2 Style `main.grid` as `display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); max-width: 1300px; margin: 0 auto`
    - _Requirements: 1.1_
  - [x] 5.3 Style `.card` with `background: var(--surface)`, `border-radius: var(--radius)`, `border: 1px solid var(--border)`, `box-shadow: var(--shadow)`, and hover elevation to `--shadow-lg`
    - _Requirements: 4.7_

- [x] 6. Live Clock and Date
  - [x] 6.1 Implement `updateClock()` to write `HH:MM:SS` (24-hour, zero-padded) to `#current-time` using `new Date()` and `pad()`
    - _Requirements: 2.1, 2.2_
  - [x] 6.2 Implement date formatting in `updateClock()` to write `Weekday, Month Day, Year` to `#current-date` using `DAYS[7]` and `MONTHS[12]` constant arrays
    - _Requirements: 2.3, 2.4_
  - [x] 6.3 Call `updateClock()` once on page load and schedule `setInterval(updateClock, 1000)` for subsequent updates
    - _Requirements: 2.2, 2.4_

- [x] 7. Greeting Header
  - [x] 7.1 Implement `getGreeting(hour)` returning `'Good morning'` (0–11), `'Good afternoon'` (12–16), `'Good evening'` (17–20), `'Good night'` (21–23)
    - _Requirements: 1.2_
  - [x] 7.2 Call `getGreeting(new Date().getHours())` inside `updateClock()` and write the result to `#greeting-text`
    - _Requirements: 1.2, 1.3_

- [x] 8. Light/Dark Theme Toggle
  - [x] 8.1 Initialise `isDark` boolean from `loadJSON('theme', false)`
    - _Requirements: 4.1, 4.2_
  - [x] 8.2 Implement `applyTheme()` to toggle `body.dark` / `body.light` classes and set `themeToggle.textContent` to `'☀️'` (dark mode) or `'🌙'` (light mode)
    - _Requirements: 4.3, 4.4, 4.6_
  - [x] 8.3 Attach click handler on `#theme-toggle` to flip `isDark`, call `saveJSON('theme', isDark)`, and call `applyTheme()`
    - _Requirements: 4.5_
  - [x] 8.4 Call `applyTheme()` at module initialisation to restore persisted theme on page load
    - _Requirements: 4.1, 4.2_

- [x] 9. Custom User Name
  - [x] 9.1 Add `#name-modal.modal.hidden` to `index.html` with `.modal-box` containing `#name-input`, `#name-save-btn`, and `#name-cancel-btn`
    - _Requirements: 3.2_
  - [x] 9.2 Style `.modal` as `position: fixed; inset: 0; z-index: 999` with semi-transparent backdrop and `backdrop-filter: blur(4px)`; `.modal.hidden` sets `display: none`
    - _Requirements: 3.2_
  - [x] 9.3 Implement `loadName()` to read `'userName'` from localStorage (fallback `'Friend'`) and write it to `#user-name`
    - _Requirements: 3.1, 3.10_
  - [x] 9.4 Attach click handler on `#edit-name-btn` to remove `hidden` from modal, pre-fill `nameInput` (empty when name is `'Friend'`), and focus the input
    - _Requirements: 3.2_
  - [x] 9.5 Attach click handler on `#name-save-btn`: trim value; if non-empty, persist to `localStorage` key `'userName'` and update `#user-name` span; always hide modal
    - _Requirements: 3.3, 3.4_
  - [x] 9.6 Attach click handler on `#name-cancel-btn` to add `hidden` to modal
    - _Requirements: 3.5_
  - [x] 9.7 Attach `keydown` handler on `#name-input` for Enter (triggers save) and Escape (triggers cancel)
    - _Requirements: 3.6, 3.7_
  - [x] 9.8 Attach click handler on `#name-modal` backdrop (target === modal element) to trigger cancel
    - _Requirements: 3.8_
  - [x] 9.9 Set `maxlength="30"` on `#name-input`
    - _Requirements: 3.9_
  - [x] 9.10 Call `loadName()` at module initialisation
    - _Requirements: 3.1, 3.10_

- [x] 10. Focus Timer Widget
  - [x] 10.1 Add timer card HTML to `index.html`: `#timer-display`, Start / Stop / Reset buttons, `#pomodoro-minutes` input, `#pomodoro-set` button, `#timer-status`
    - _Requirements: 5.1_
  - [x] 10.2 Implement `formatTime(secs)` returning `MM:SS` using `pad()`
    - _Requirements: 5.1, 5.2_
  - [x] 10.3 Implement `renderTimer()` to write `formatTime(remaining)` to `#timer-display`
    - _Requirements: 5.1_
  - [x] 10.4 Implement `setTimerState(running, finished)` to toggle `.running` and `.finished` classes on `#timer-display`
    - _Requirements: 5.2, 5.5, 5.6, 5.7_
  - [x] 10.5 Implement `startTimer()` with guard conditions (already running, remaining = 0), `setInterval` decrementing `remaining`, and completion handling that applies `.finished` and sets status text
    - _Requirements: 5.2, 5.3, 5.4, 5.7_
  - [x] 10.6 Implement `stopTimer()` to clear interval, set `timerRunning = false`, call `setTimerState(false, false)`, and set status `'Paused'`
    - _Requirements: 5.5_
  - [x] 10.7 Implement `resetTimer()` to clear interval, restore `remaining = totalSeconds`, call `renderTimer()` and `setTimerState(false, false)`, and set status `'Ready'`
    - _Requirements: 5.6_
  - [x] 10.8 Attach click handlers on Start / Stop / Reset buttons to call their respective functions
    - _Requirements: 5.2, 5.5, 5.6_
  - [x] 10.9 Implement `#pomodoro-set` click handler: `parseInt` with range check 1–120; on valid input update `pomodoroMinutes`, `totalSeconds`, persist to `localStorage` key `'pomodoroMinutes'`, call `resetTimer()`, show `'{n} min'` status; on invalid show error message
    - _Requirements: 5.8, 5.9_
  - [x] 10.10 Initialise `pomodoroMinutes` from `loadJSON('pomodoroMinutes', 25)`, set `pomodoroInput.value`, and call `renderTimer()` on page load
    - _Requirements: 5.1_
  - [x] 10.11 Style `.running` class on `#timer-display` with `color: var(--success)` and `.finished` with `color: var(--warning)` and `pulse` keyframe animation
    - _Requirements: 5.2, 5.7_

- [x] 11. To-Do List Widget
  - [x] 11.1 Add todo card HTML to `index.html`: `#todo-input` with `maxlength="120"`, `#todo-add-btn`, `#todo-list` ul, `#todo-empty`
    - _Requirements: 6.2, 6.5_
  - [x] 11.2 Implement `saveTasks()` to call `saveJSON('tasks', tasks)`
    - _Requirements: 6.3, 6.6, 6.7, 6.9, 6.12_
  - [x] 11.3 Implement `escapeHTML(str)` using a temporary `<div>` with `textContent` and reading `innerHTML`
    - _Requirements: 6.13_
  - [x] 11.4 Implement `renderTasks()` to clear `#todo-list`, show `#todo-empty` when array is empty, and build `<li class="todo-item">` for each task with checkbox, text span, and action buttons
    - _Requirements: 6.1, 6.2, 6.6, 6.7_
  - [x] 11.5 Implement `addTask(text)` to trim, guard on empty, push `{ id: Date.now(), text, done: false }`, call `saveTasks()` and `renderTasks()`
    - _Requirements: 6.3, 6.4, 6.14_
  - [x] 11.6 Implement `toggleTask(id, done)` to find task by id, update `done`, call `saveTasks()` and `renderTasks()`
    - _Requirements: 6.6, 6.7_
  - [x] 11.7 Implement `deleteTask(id)` to filter tasks array by id, call `saveTasks()` and `renderTasks()`
    - _Requirements: 6.12_
  - [x] 11.8 Implement `startEdit(li, task)` to replace text span with focused `<input class="todo-edit-input">` pre-filled with current text, and replace action buttons with Save and Cancel; Save trims value and updates `task.text` if non-empty; Cancel/Escape calls `renderTasks()`
    - _Requirements: 6.8, 6.9, 6.10, 6.11_
  - [x] 11.9 Attach click handler on `#todo-add-btn` and keydown Enter on `#todo-input` to call `addTask(todoInput.value)` and clear input
    - _Requirements: 6.3_
  - [x] 11.10 Style `.todo-item.done` with `opacity: 0.55` and `.todo-text` with `text-decoration: line-through; color: var(--text-muted)`; style `.todo-edit-input` with accent border
    - _Requirements: 6.6, 6.7_
  - [x] 11.11 Call `renderTasks()` at module initialisation to restore saved tasks on page load
    - _Requirements: 6.1, 6.15_

- [x] 12. Quick Links Widget
  - [x] 12.1 Add links card HTML to `index.html`: `#link-name-input` with `maxlength="30"`, `#link-url-input` with `maxlength="200"`, `#link-add-btn`, `#links-grid`, `#links-empty`
    - _Requirements: 7.5, 7.6_
  - [x] 12.2 Implement `saveLinks()` to call `saveJSON('quickLinks', links)`
    - _Requirements: 7.3, 7.9_
  - [x] 12.3 Implement `normaliseURL(url)` to trim and prepend `'https://'` if the string does not already start with `http://` or `https://` (case-insensitive)
    - _Requirements: 7.3_
  - [x] 12.4 Implement `renderLinks()` to clear `#links-grid`, show `#links-empty` when array is empty, and build `.link-chip` for each link containing favicon `<img>` with Google S2 URL and `onerror="this.style.display='none'"`, `<a target="_blank" rel="noopener noreferrer">`, and delete `<button>`
    - _Requirements: 7.1, 7.2, 7.7, 7.8, 7.11_
  - [x] 12.5 Attach click handler on `#link-add-btn` and keydown Enter on `#link-url-input`: trim name, normalise URL; if either is empty apply `var(--danger)` border to URL input for 1500 ms and return; otherwise push `{ id: Date.now(), name, url }`, call `saveLinks()` and `renderLinks()`, clear both inputs, focus name input
    - _Requirements: 7.3, 7.4_
  - [x] 12.6 Style `.link-chip` as pill shape (`border-radius: 50px`), `max-width: 220px`, flex row, with `.btn-delete` for the ✕ button
    - _Requirements: 7.11_
  - [x] 12.7 Call `renderLinks()` at module initialisation to restore saved links on page load
    - _Requirements: 7.1, 7.10_

- [x] 13. Responsive Layout
  - [x] 13.1 Add `@media (max-width: 600px)` breakpoint reducing clock font-size to `1.5rem` and timer display to `3rem`
    - _Requirements: 2.1, 5.1_
  - [x] 13.2 Reduce topbar and grid padding in the same breakpoint
    - _Requirements: 1.1_

## Notes

- All tasks are completed. This document records the existing implementation for traceability.
- Each task references specific requirements from `requirements.md` for full coverage mapping.
- Property-based tests for correctness properties (Properties 1–10 in `design.md`) are not yet written; they are excluded here as no test framework is currently present in the project.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4"] },
    { "id": 2, "tasks": ["3.1", "3.2", "3.3", "3.4"] },
    { "id": 3, "tasks": ["4.1", "4.2", "4.3", "4.4", "4.5"] },
    { "id": 4, "tasks": ["5.1", "5.2", "5.3"] },
    { "id": 5, "tasks": ["6.1", "6.2", "6.3", "7.1", "7.2", "8.1", "8.2", "8.3", "8.4", "9.1", "9.2", "9.3", "9.4", "9.5", "9.6", "9.7", "9.8", "9.9", "9.10", "10.1", "10.2", "10.3", "10.4", "10.5", "10.6", "10.7", "10.8", "10.9", "10.10", "10.11", "11.1", "11.2", "11.3", "11.4", "11.5", "11.6", "11.7", "11.8", "11.9", "11.10", "11.11", "12.1", "12.2", "12.3", "12.4", "12.5", "12.6", "12.7"] },
    { "id": 6, "tasks": ["13.1", "13.2"] }
  ]
}
```

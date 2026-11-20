# Requirements Document

## Introduction

The Life Dashboard is a single-page, browser-based personal productivity tool. It runs entirely client-side with no backend; all state is persisted in the browser's `localStorage`. The dashboard presents four independent widgets in a responsive card grid: a live clock with time-sensitive greeting, a customisable user name, a countdown Focus Timer, a To-Do List, and a Quick Links launcher. A sticky top bar hosts the greeting, clock, and a light/dark theme toggle. All widgets are visible simultaneously on a single screen without navigation.

---

## Glossary

- **Dashboard**: The single HTML page (`index.html`) that hosts all widgets within a responsive CSS grid layout.
- **Widget**: A self-contained card section within the Dashboard that displays and manages one area of functionality (timer, tasks, links, etc.).
- **Pomodoro**: A time-management technique using a fixed countdown interval (default 25 minutes) for focused work. The Focus Timer widget implements this pattern.
- **Quick Link**: A named URL bookmark stored by the user and displayed as a pill-shaped chip in the Quick Links widget.
- **localStorage**: The browser's built-in key/value persistence API, used by the Dashboard to save all user data between page loads. No server communication occurs.
- **Design Token**: A CSS custom property defined on `:root` (e.g. `--accent`, `--bg`) that centralises colour, spacing, and transition values for both the light and dark themes.

---

## Requirements

### Requirement 1: Greeting Header

**User Story:** As a user, I want a persistent top bar that shows my name and a time-appropriate greeting, so that the dashboard feels personal whenever I open it.

#### Acceptance Criteria

1. THE Dashboard SHALL display a top bar whose top edge remains fixed at the top of the viewport regardless of vertical scroll position.
2. WHEN the page loads, THE Dashboard SHALL display a greeting phrase in the top bar based on the current local hour:
   - Hours 0–11: "Good morning"
   - Hours 12–16: "Good afternoon"
   - Hours 17–20: "Good evening"
   - Hours 21–23: "Good night"
3. WHILE the page is open, THE Dashboard SHALL re-evaluate and update the greeting phrase within 1 second of the local hour crossing a boundary listed in criterion 2, without requiring a page reload.
4. WHEN the page loads, THE Dashboard SHALL display the user's saved name (up to 30 characters) immediately after the greeting phrase and a comma; IF no name has been saved, THEN THE Dashboard SHALL display "Friend" in place of the name.

> **Assumption:** The greeting boundaries are inclusive at the lower bound (e.g. exactly 12:00:00 triggers "Good afternoon"). This is consistent with the `< 12`, `< 17`, `< 21` checks in `app.js`.

---

### Requirement 2: Live Clock and Date

**User Story:** As a user, I want to see the current time and date at a glance, so that I can stay aware of the time while working.

#### Acceptance Criteria

1. THE Dashboard SHALL display the current local time in `HH:MM:SS` format (24-hour, zero-padded, range 00:00:00 to 23:59:59) in the top bar centre.
2. THE Dashboard SHALL update the time display every 1 second using the browser's local system clock, with no manual refresh required.
3. THE Dashboard SHALL display the current local date below the time in the format `Weekday, Month Day, Year` (e.g. "Thursday, November 20, 2026"), where Weekday is the full English day name, Month is the full English month name, Day is a 1–2 digit day without padding, and Year is the 4-digit year.
4. THE Dashboard SHALL update the date display whenever the displayed day changes, detected on each 1-second tick.
5. IF the browser's system clock becomes unavailable or returns an invalid value, THEN THE Dashboard SHALL display `--:--:--` for the time and `---` for the date until a valid clock value is returned.

---

### Requirement 3: Custom User Name

**User Story:** As a user, I want to set my name in the greeting, so that the dashboard addresses me personally rather than with a generic placeholder.

#### Acceptance Criteria

1. WHEN the page loads and no name has been saved, THE Dashboard SHALL display "Friend" as the default name in the greeting.
2. WHEN the user clicks the pencil (✏️) button in the top bar, THE Dashboard SHALL open a modal dialog containing a text input pre-populated with the current name (empty if the current name is "Friend").
3. WHEN the modal is open and the user clicks "Save" with a non-empty trimmed name of 1 to 30 characters, THE Dashboard SHALL update the displayed greeting name, persist it to `localStorage` under the key `'userName'`, and close the modal.
4. IF the modal is open and the user clicks "Save" with an input that is empty or contains only whitespace characters, THEN THE Dashboard SHALL close the modal without changing the stored or displayed name.
5. WHEN the modal is open and the user clicks "Cancel", THE Dashboard SHALL close the modal without changing the stored name.
6. WHEN the modal is open and the user presses Enter, THE Dashboard SHALL execute the same action as clicking "Save".
7. WHEN the modal is open and the user presses Escape, THE Dashboard SHALL execute the same action as clicking "Cancel".
8. WHEN the modal is open and the user clicks the backdrop (outside the modal box), THE Dashboard SHALL close the modal without saving.
9. THE Name_Input SHALL accept a maximum of 30 characters, rejecting any input beyond the 30th character.
10. WHEN the page loads and a name has been previously saved under `localStorage` key `'userName'`, THE Dashboard SHALL display that saved name in the greeting immediately without user interaction.

> **Assumption:** The name input is not pre-populated when the current display value is "Friend" (the code sets `nameInput.value` to `''` in that case). This is treated as intentional UX to avoid the user having to clear the placeholder name.

---

### Requirement 4: Light / Dark Theme

**User Story:** As a user, I want to switch between a light and dark colour scheme, so that the dashboard is comfortable to use in different lighting conditions.

#### Acceptance Criteria

1. WHEN the page loads and no theme preference has been saved, THE Dashboard SHALL apply the light theme by default.
2. WHEN the page loads and a theme preference has been saved to `localStorage` under the key `'theme'`, THE Dashboard SHALL restore that preference within one render frame (before first paint).
3. THE Dashboard SHALL apply the light theme by adding the class `light` to `<body>` and removing the class `dark`.
4. THE Dashboard SHALL apply the dark theme by adding the class `dark` to `<body>` and removing the class `light`.
5. WHEN the user clicks the theme toggle button, THE Dashboard SHALL switch to the opposite theme and persist the new value to `localStorage` under the key `'theme'`.
6. WHEN the theme switches to dark, THE Dashboard SHALL update the toggle button icon to ☀️; WHEN the theme switches to light, THE Dashboard SHALL update the toggle button icon to 🌙.
7. THE Dashboard SHALL apply all colour and shadow changes through CSS custom properties so that every visible component reflects the new theme without a page reload.
8. IF `localStorage` is unavailable or write access is denied, THEN THE Dashboard SHALL still apply the requested theme for the current session and continue operating without an error being surfaced to the user.

---

### Requirement 5: Focus Timer

**User Story:** As a user, I want a configurable countdown timer, so that I can structure focused work sessions using the Pomodoro technique.

#### Acceptance Criteria

1. WHEN the page loads, THE Focus_Timer SHALL initialise with a duration loaded from `localStorage` key `'pomodoroMinutes'` if the stored value is a whole number between 1 and 120 inclusive (defaulting to 25 minutes if no value is stored or the stored value is outside that range), and display the remaining time as `MM:SS`.
2. WHEN the user clicks "Start" and the timer is not already running and remaining time is greater than zero, THE Focus_Timer SHALL begin counting down by 1 second per second, update the `MM:SS` display each second, change the display colour to green (via CSS class `running`), and show the status text "Focus! 🎯".
3. WHEN the user clicks "Start" and the timer is already running, THE Focus_Timer SHALL take no action.
4. WHEN the user clicks "Start" and remaining time is zero, THE Focus_Timer SHALL take no action.
5. WHEN the user clicks "Stop", THE Focus_Timer SHALL pause the countdown, remove the `running` class from the display, and show the status text "Paused".
6. WHEN the user clicks "Reset", THE Focus_Timer SHALL stop any running countdown, restore remaining time to the full configured duration, remove the CSS classes `running` and `finished` from the display, and show the status text "Ready".
7. WHEN the remaining time reaches zero during an active countdown, THE Focus_Timer SHALL stop the countdown, apply the CSS class `finished` (amber colour with pulse animation) to the display, and show the status text "Time's up! Take a break 🎉".
8. WHEN the user enters a whole number between 1 and 120 (inclusive) in the duration input and clicks "Apply", THE Focus_Timer SHALL update the configured duration, persist it to `localStorage` key `'pomodoroMinutes'`, reset the timer to the new duration, and show the status text "{n} min" confirming the change.
9. IF the user enters a value that is non-numeric, empty, a decimal, negative, or outside 1–120 and clicks "Apply", THEN THE Focus_Timer SHALL display the status text "Enter a value between 1 and 120." and not change the duration.

> **Assumption:** Clicking "Stop" when the timer is already stopped or "Reset" when the timer is already idle has no harmful side effect — the existing state is re-applied. This is consistent with how `clearInterval` behaves on a null/cleared interval.

---

### Requirement 6: To-Do List

**User Story:** As a user, I want to manage a list of tasks, so that I can track what I need to accomplish during my work sessions.

#### Acceptance Criteria

1. WHEN the page loads, THE Todo_List SHALL restore all previously saved tasks from `localStorage` key `'tasks'` and display them in the order they were added.
2. WHEN the page loads and no tasks are saved, THE Todo_List SHALL display the empty-state message "No tasks yet. Add one above!".
3. WHEN the user types text in the task input and clicks "Add" or presses Enter, THE Todo_List SHALL trim leading/trailing whitespace and, if the result is non-empty (at least 1 character), append a new task with that text and `done: false`, persist the updated array to `localStorage`, and re-render the list.
4. WHEN the user clicks "Add" or presses Enter with an empty or whitespace-only input, THE Todo_List SHALL take no action and retain focus on the task input field.
5. THE Task_Input SHALL accept a maximum of 120 characters, rejecting any input beyond the 120th character.
6. WHEN the user checks the checkbox on a task, THE Todo_List SHALL mark that task `done: true`, persist the update, and visually indicate completion with strikethrough text and reduced opacity.
7. WHEN the user unchecks the checkbox on a completed task, THE Todo_List SHALL mark that task `done: false`, persist the update, and remove the completion styling.
8. WHEN the user clicks the edit (✏️) button on a task, THE Todo_List SHALL replace the task text with an inline text input pre-filled with the current task text and replace the action buttons with "Save" and "Cancel" controls.
9. WHEN in inline edit mode, the user clicks "Save" or presses Enter with a non-empty trimmed value (at least 1 character), THE Todo_List SHALL update the task text to the trimmed value, persist the change, and re-render the list.
10. WHEN in inline edit mode, the user clicks "Save" or presses Enter with an empty or whitespace-only value, THE Todo_List SHALL take no action and retain focus on the inline edit input.
11. WHEN in inline edit mode, the user presses Escape or clicks "Cancel", THE Todo_List SHALL discard the edit and re-render the list without changes.
12. WHEN the user clicks the delete (🗑️) button on a task, THE Todo_List SHALL remove that task from the array, persist the update, and re-render the list.
13. THE Todo_List SHALL sanitise all task text before inserting it into the DOM to prevent cross-site scripting (XSS).
14. THE Todo_List SHALL assign each task a unique numeric ID equal to `Date.now()` at the time of creation.
15. IF `localStorage` is unavailable or throws an error during read or write, THEN THE Todo_List SHALL continue operating in-memory for the current session without crashing.

> **Assumption:** The inline edit input does not enforce a character maximum. The original `maxlength="120"` applies only to the add-task input field; no `maxlength` is set on the dynamically created edit input in `app.js`.

---

### Requirement 7: Quick Links

**User Story:** As a user, I want to save and launch URLs with a single click, so that I can access my most-used websites quickly from the dashboard.

#### Acceptance Criteria

1. WHEN the page loads, THE Quick_Links SHALL restore all previously saved links from `localStorage` key `'quickLinks'` and display them as pill chips.
2. WHEN the page loads and no links are saved, THE Quick_Links SHALL display the empty-state message "No links yet. Add one above!".
3. WHEN the user provides both a non-empty label (1–30 characters) and a non-empty URL (1–200 characters) and clicks "Add", THE Quick_Links SHALL normalise the URL (prepending `https://` if no `http://` or `https://` protocol is present), store a new link object `{ id, name, url }`, persist the updated array to `localStorage` key `'quickLinks'`, and re-render the chip grid.
4. IF the user clicks "Add" without providing both a label and a URL, THEN THE Quick_Links SHALL apply a red border to the URL input for 1500 ms and not add a link.
5. THE Label_Input SHALL accept a maximum of 30 characters, rejecting any input beyond 30 characters.
6. THE URL_Input SHALL accept a maximum of 200 characters, rejecting any input beyond 200 characters.
7. WHEN a link chip is rendered, THE Quick_Links SHALL attempt to display a 16×16 favicon image fetched from `https://www.google.com/s2/favicons?domain={url}&sz=16` and hide the image element if the image fails to load.
8. WHEN the user clicks a link chip's anchor, THE Quick_Links SHALL open the URL in a new browser tab with `rel="noopener noreferrer"`.
9. WHEN the user clicks the ✕ button on a link chip, THE Quick_Links SHALL remove that link, persist the update, and re-render the chip grid; IF no links remain after removal, THEN THE Quick_Links SHALL display the empty-state message "No links yet. Add one above!".
10. THE Quick_Links SHALL sanitise link labels and URLs by escaping HTML special characters before inserting them into the DOM to prevent cross-site scripting (XSS).
11. WHEN a link chip is rendered, THE Quick_Links SHALL display the chip as a pill shape (border-radius 50px) containing, in order: the favicon image (or hidden placeholder), the linked label text, and a ✕ delete button.

> **Assumption:** URL validation beyond protocol normalisation is not performed. If a user enters text with no recognisable protocol (e.g. "example.com"), the Dashboard prepends `https://` and stores the result. No further format checking occurs.

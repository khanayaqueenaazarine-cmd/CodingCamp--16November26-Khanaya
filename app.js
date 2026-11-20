/* ═══════════════════════════════════════════════════════
   app.js  —  To-Do Dashboard
   All data persisted with localStorage.
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ───────────────────────────────────────────────────────
   HELPERS
─────────────────────────────────────────────────────── */
const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, '0');

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadJSON(key, fallback) {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

/* ───────────────────────────────────────────────────────
   THEME  (bonus: light / dark mode)
─────────────────────────────────────────────────────── */
const themeToggle = $('theme-toggle');
let isDark = loadJSON('theme', false);

function applyTheme() {
  document.body.classList.toggle('dark', isDark);
  document.body.classList.toggle('light', !isDark);
  themeToggle.textContent = isDark ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  saveJSON('theme', isDark);
  applyTheme();
});

applyTheme();

/* ───────────────────────────────────────────────────────
   CLOCK & GREETING
─────────────────────────────────────────────────────── */
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function getGreeting(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

function updateClock() {
  const now  = new Date();
  const h    = now.getHours();
  const m    = now.getMinutes();
  const s    = now.getSeconds();

  $('current-time').textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  $('current-date').textContent =
    `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  $('greeting-text').textContent = getGreeting(h);
}

updateClock();
setInterval(updateClock, 1000);

/* ───────────────────────────────────────────────────────
   CUSTOM NAME  (bonus: custom name in greeting)
─────────────────────────────────────────────────────── */
const nameModal     = $('name-modal');
const nameInput     = $('name-input');
const nameSaveBtn   = $('name-save-btn');
const nameCancelBtn = $('name-cancel-btn');
const editNameBtn   = $('edit-name-btn');
const userNameSpan  = $('user-name');

function loadName() {
  const name = loadJSON('userName', 'Friend');
  userNameSpan.textContent = name;
}

editNameBtn.addEventListener('click', () => {
  nameInput.value = userNameSpan.textContent === 'Friend' ? '' : userNameSpan.textContent;
  nameModal.classList.remove('hidden');
  nameInput.focus();
});

nameSaveBtn.addEventListener('click', () => {
  const val = nameInput.value.trim();
  if (val) {
    saveJSON('userName', val);
    userNameSpan.textContent = val;
  }
  nameModal.classList.add('hidden');
});

nameCancelBtn.addEventListener('click', () => {
  nameModal.classList.add('hidden');
});

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') nameSaveBtn.click();
  if (e.key === 'Escape') nameCancelBtn.click();
});

nameModal.addEventListener('click', (e) => {
  if (e.target === nameModal) nameCancelBtn.click();
});

loadName();

/* ───────────────────────────────────────────────────────
   FOCUS TIMER  (bonus: change Pomodoro time)
─────────────────────────────────────────────────────── */
const timerDisplay   = $('timer-display');
const timerStart     = $('timer-start');
const timerStop      = $('timer-stop');
const timerReset     = $('timer-reset');
const timerStatus    = $('timer-status');
const pomodoroInput  = $('pomodoro-minutes');
const pomodoroSetBtn = $('pomodoro-set');

let pomodoroMinutes = loadJSON('pomodoroMinutes', 25);
let totalSeconds    = pomodoroMinutes * 60;
let remaining       = totalSeconds;
let timerInterval   = null;
let timerRunning    = false;

pomodoroInput.value = pomodoroMinutes;

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${pad(m)}:${pad(s)}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(remaining);
}

function setTimerState(running, finished) {
  timerDisplay.classList.toggle('running', running && !finished);
  timerDisplay.classList.toggle('finished', finished);
}

function startTimer() {
  if (timerRunning) return;
  if (remaining === 0) return;

  timerRunning = true;
  setTimerState(true, false);
  timerStatus.textContent = 'Focus! 🎯';

  timerInterval = setInterval(() => {
    remaining -= 1;
    renderTimer();

    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timerStatus.textContent = "Time's up! Take a break 🎉";
      setTimerState(false, true);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  setTimerState(false, false);
  timerStatus.textContent = 'Paused';
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  remaining = totalSeconds;
  renderTimer();
  setTimerState(false, false);
  timerStatus.textContent = 'Ready';
}

timerStart.addEventListener('click', startTimer);
timerStop.addEventListener('click', stopTimer);
timerReset.addEventListener('click', resetTimer);

pomodoroSetBtn.addEventListener('click', () => {
  const val = parseInt(pomodoroInput.value, 10);
  if (isNaN(val) || val < 1 || val > 120) {
    timerStatus.textContent = 'Enter a value between 1 and 120.';
    return;
  }
  pomodoroMinutes = val;
  totalSeconds    = val * 60;
  saveJSON('pomodoroMinutes', val);
  resetTimer();
  timerStatus.textContent = `Timer set to ${val} min`;
});

renderTimer();

/* ───────────────────────────────────────────────────────
   TO-DO LIST
─────────────────────────────────────────────────────── */
const todoInput   = $('todo-input');
const todoAddBtn  = $('todo-add-btn');
const todoListEl  = $('todo-list');
const todoEmptyEl = $('todo-empty');

// Each task: { id, text, done }
let tasks = loadJSON('tasks', []);

function saveTasks() {
  saveJSON('tasks', tasks);
}

function renderTasks() {
  todoListEl.innerHTML = '';

  if (tasks.length === 0) {
    todoEmptyEl.style.display = 'block';
    return;
  }
  todoEmptyEl.style.display = 'none';

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (task.done ? ' done' : '');
    li.dataset.id = task.id;

    li.innerHTML = `
      <input type="checkbox" class="todo-check" ${task.done ? 'checked' : ''} title="Mark done" />
      <span class="todo-text">${escapeHTML(task.text)}</span>
      <div class="todo-actions">
        <button class="btn-edit" title="Edit">✏️</button>
        <button class="btn-delete" title="Delete">🗑️</button>
      </div>
    `;

    // Check / uncheck
    li.querySelector('.todo-check').addEventListener('change', (e) => {
      toggleTask(task.id, e.target.checked);
    });

    // Edit
    li.querySelector('.btn-edit').addEventListener('click', () => {
      startEdit(li, task);
    });

    // Delete
    li.querySelector('.btn-delete').addEventListener('click', () => {
      deleteTask(task.id);
    });

    todoListEl.appendChild(li);
  });
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  tasks.push({ id: Date.now(), text: trimmed, done: false });
  saveTasks();
  renderTasks();
}

function toggleTask(id, done) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.done = done;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

function startEdit(li, task) {
  const textSpan    = li.querySelector('.todo-text');
  const actionsDiv  = li.querySelector('.todo-actions');
  const currentText = task.text;

  // Replace text span with an input
  const editInput = document.createElement('input');
  editInput.type      = 'text';
  editInput.className = 'todo-edit-input';
  editInput.value     = currentText;
  editInput.maxLength = 120;
  textSpan.replaceWith(editInput);
  editInput.focus();

  // Replace actions with save button
  actionsDiv.innerHTML = `
    <button class="btn-save-edit">Save</button>
    <button class="btn-delete">Cancel</button>
  `;

  const saveEdit = () => {
    const newText = editInput.value.trim();
    if (newText) {
      task.text = newText;
      saveTasks();
    }
    renderTasks();
  };

  actionsDiv.querySelector('.btn-save-edit').addEventListener('click', saveEdit);
  actionsDiv.querySelector('.btn-delete').addEventListener('click', () => renderTasks()); // cancel
  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  saveEdit();
    if (e.key === 'Escape') renderTasks();
  });
}

todoAddBtn.addEventListener('click', () => {
  addTask(todoInput.value);
  todoInput.value = '';
});

todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') todoAddBtn.click();
});

renderTasks();

/* ───────────────────────────────────────────────────────
   QUICK LINKS
─────────────────────────────────────────────────────── */
const linkNameInput = $('link-name-input');
const linkUrlInput  = $('link-url-input');
const linkAddBtn    = $('link-add-btn');
const linksGrid     = $('links-grid');
const linksEmpty    = $('links-empty');

// Each link: { id, name, url }
let links = loadJSON('quickLinks', []);

function saveLinks() {
  saveJSON('quickLinks', links);
}

function normaliseURL(url) {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return 'https://' + trimmed;
}

function renderLinks() {
  linksGrid.innerHTML = '';

  if (links.length === 0) {
    linksEmpty.style.display = 'block';
    return;
  }
  linksEmpty.style.display = 'none';

  links.forEach((link) => {
    const chip = document.createElement('div');
    chip.className = 'link-chip';

    const favicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(link.url)}&sz=16`;

    chip.innerHTML = `
      <img src="${favicon}" alt="" width="16" height="16"
           onerror="this.style.display='none'" />
      <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer"
         title="${escapeHTML(link.url)}">${escapeHTML(link.name)}</a>
      <button class="btn-delete" title="Remove">✕</button>
    `;

    chip.querySelector('.btn-delete').addEventListener('click', () => {
      links = links.filter((l) => l.id !== link.id);
      saveLinks();
      renderLinks();
    });

    linksGrid.appendChild(chip);
  });
}

linkAddBtn.addEventListener('click', () => {
  const name = linkNameInput.value.trim();
  const url  = normaliseURL(linkUrlInput.value);

  if (!name || !url) {
    linkUrlInput.style.borderColor = 'var(--danger)';
    setTimeout(() => { linkUrlInput.style.borderColor = ''; }, 1500);
    return;
  }

  links.push({ id: Date.now(), name, url });
  saveLinks();
  renderLinks();

  linkNameInput.value = '';
  linkUrlInput.value  = '';
  linkNameInput.focus();
});

linkUrlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') linkAddBtn.click();
});

renderLinks();

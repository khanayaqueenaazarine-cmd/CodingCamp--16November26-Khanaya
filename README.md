# My To-Do Dashboard

A clean, minimal productivity dashboard built with plain HTML, CSS, and Vanilla JavaScript. No frameworks, no backend — everything runs in the browser and persists via `localStorage`.

## Features

| Feature | Details |
|---|---|
| **Greeting** | Shows your name, current time, date, and a time-based greeting (morning / afternoon / evening / night) |
| **Focus Timer** | 25-minute Pomodoro timer with Start, Stop, and Reset. Configurable duration (1–120 min). |
| **To-Do List** | Add, edit, check off, and delete tasks. All tasks saved in localStorage. |
| **Quick Links** | Save and open your favourite websites with one click. Links saved in localStorage. |
| **Dark / Light Mode** | Toggle between themes. Preference saved in localStorage. |
| **Custom Name** | Click the ✏️ icon to set your name. Saved in localStorage. |

## File Structure

```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

## Running Locally

Just open `index.html` in any modern browser. No build step or server needed.

## Deploying to GitHub Pages

1. Push this repo to GitHub (use GitHub Desktop or the CLI).
2. Go to **Settings → Pages** in your GitHub repository.
3. Under **Source**, select **Deploy from a branch**, choose `main` (or `master`), root `/`.
4. Click **Save**. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

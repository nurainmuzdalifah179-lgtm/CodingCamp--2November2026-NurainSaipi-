// To-Do List Life Dashboard - vanilla JavaScript, single file.
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const KEYS = { tasks: 'tasks', links: 'links', theme: 'theme', name: 'customName' };

  // ---------- Local Storage helpers ----------
  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }
  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  let tasks = load(KEYS.tasks, []);
  let links = load(KEYS.links, []);
  let customName = load(KEYS.name, '');

  // ---------- Greeting, time and date ----------
  function greetingFor(hour) {
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  }
  function updateClock() {
    const now = new Date();
    $('clock').textContent = now.toLocaleTimeString('en-GB');
    $('date').textContent = now.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    const name = customName ? ', ' + customName : '';
    $('greeting').textContent = greetingFor(now.getHours()) + name;
  }

  // ---------- Challenge: custom name ----------
  $('name-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const value = $('name-input').value.trim();
    if (value.length < 1 || value.length > 50) {
      $('name-error').textContent = 'Name must be 1-50 characters.';
      return;
    }
    $('name-error').textContent = '';
    customName = value;
    if (!save(KEYS.name, customName)) $('name-error').textContent = 'Could not save the name.';
    updateClock();
  });

  // ---------- Challenge: light / dark mode ----------
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    $('theme-btn').textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  }
  $('theme-btn').addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    save(KEYS.theme, next);
  });

  // ---------- Focus timer ----------
  // Challenge: change Pomodoro time (1-120 minutes, saved in Local Storage)
  let minutes = load('pomodoroMinutes', 25);
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 120) minutes = 25;
  let duration = minutes * 60;
  let remaining = duration;
  let timerId = null;

  function showTimer() {
    const m = String(Math.floor(remaining / 60)).padStart(2, '0');
    const s = String(remaining % 60).padStart(2, '0');
    $('timer').textContent = m + ':' + s;
  }
  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }
  $('start').addEventListener('click', () => {
    if (timerId !== null || remaining === 0) return;
    $('timer-msg').textContent = '';
    timerId = setInterval(() => {
      remaining -= 1;
      showTimer();
      if (remaining <= 0) {
        stopTimer();
        $('timer-msg').textContent = 'Focus session complete!';
      }
    }, 1000);
  });
  $('stop').addEventListener('click', stopTimer);
  $('reset').addEventListener('click', () => {
    stopTimer();
    remaining = duration;
    $('timer-msg').textContent = '';
    showTimer();
  });

  $('time-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const value = Number($('minutes').value);
    if (!Number.isInteger(value) || value < 1 || value > 120) {
      $('time-error').textContent = 'Enter a whole number from 1 to 120.';
      return;
    }
    stopTimer();
    minutes = value;
    duration = minutes * 60;
    remaining = duration;
    $('timer-msg').textContent = '';
    $('time-error').textContent = save('pomodoroMinutes', minutes) ? '' : 'Could not save the time.';
    showTimer();
  });

  // ---------- To-do list ----------
  function validTask(text, ignoreId) {
    if (text.length < 1 || text.length > 200) return 'Task must be 1-200 characters.';
    const lower = text.toLowerCase();
    // Challenge: prevent duplicate tasks (case-insensitive)
    if (tasks.some((t) => t.id !== ignoreId && t.text.toLowerCase() === lower)) {
      return 'This task already exists.';
    }
    return '';
  }
  function persistTasks() {
    $('task-error').textContent = save(KEYS.tasks, tasks) ? '' : 'Could not save tasks.';
  }
  function renderTasks() {
    const list = $('task-list');
    list.innerHTML = '';
    tasks.forEach((task) => {
      const li = document.createElement('li');
      if (task.done) li.className = 'done';

      const check = document.createElement('input');
      check.type = 'checkbox';
      check.checked = task.done;
      check.style.flex = '0 0 auto';
      check.addEventListener('change', () => {
        task.done = check.checked;
        persistTasks();
        renderTasks();
      });

      const text = document.createElement('span');
      text.textContent = task.text;

      const edit = document.createElement('button');
      edit.className = 'small';
      edit.textContent = 'Edit';
      edit.addEventListener('click', () => {
        const input = prompt('Edit task:', task.text);
        if (input === null) return;
        const value = input.trim();
        const error = validTask(value, task.id);
        if (error) { $('task-error').textContent = error; return; }
        task.text = value;
        persistTasks();
        renderTasks();
      });

      const del = document.createElement('button');
      del.className = 'danger';
      del.textContent = 'Delete';
      del.addEventListener('click', () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        persistTasks();
        renderTasks();
      });

      li.append(check, text, edit, del);
      list.appendChild(li);
    });
  }
  $('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const value = $('task-input').value.trim();
    const error = validTask(value, null);
    if (error) { $('task-error').textContent = error; return; }
    tasks.push({ id: Date.now() + Math.random(), text: value, done: false });
    $('task-input').value = '';
    persistTasks();
    renderTasks();
  });

  // ---------- Quick links ----------
  function renderLinks() {
    const box = $('links');
    box.innerHTML = '';
    links.forEach((link) => {
      const wrap = document.createElement('div');
      wrap.className = 'link-item';

      const open = document.createElement('button');
      open.className = 'primary';
      open.textContent = link.name;
      open.addEventListener('click', () => window.open(link.url, '_blank', 'noopener'));

      const del = document.createElement('button');
      del.className = 'small';
      del.textContent = 'x';
      del.setAttribute('aria-label', 'Delete ' + link.name);
      del.addEventListener('click', () => {
        links = links.filter((l) => l.id !== link.id);
        $('link-error').textContent = save(KEYS.links, links) ? '' : 'Could not save links.';
        renderLinks();
      });

      wrap.append(open, del);
      box.appendChild(wrap);
    });
  }
  $('link-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('link-name').value.trim();
    let url = $('link-url').value.trim();
    if (!name || name.length > 50 || !url) {
      $('link-error').textContent = 'Enter a name (max 50 characters) and a URL.';
      return;
    }
    if (links.length >= 20) {
      $('link-error').textContent = 'You can save up to 20 links.';
      return;
    }
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    links.push({ id: Date.now() + Math.random(), name: name, url: url });
    $('link-name').value = '';
    $('link-url').value = '';
    $('link-error').textContent = save(KEYS.links, links) ? '' : 'Could not save links.';
    renderLinks();
  });

  // ---------- Start ----------
  applyTheme(load(KEYS.theme, 'light'));
  $('name-input').value = customName;
  updateClock();
  setInterval(updateClock, 1000);
  $('minutes').value = minutes;
  showTimer();
  renderTasks();
  renderLinks();
})();
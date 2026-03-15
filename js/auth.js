// ── GreenTrack Auth ──────────────────────────────
// Client-side auth using localStorage

function getUsers() {
  return JSON.parse(localStorage.getItem('gt_users') || '{}');
}

function saveUsers(users) {
  localStorage.setItem('gt_users', JSON.stringify(users));
}

function setCurrentUser(username) {
  localStorage.setItem('gt_current_user', username);
}

function getCurrentUser() {
  return localStorage.getItem('gt_current_user');
}

function logout() {
  localStorage.removeItem('gt_current_user');
  window.location.href = 'login.html';
}

// ── Tab switching ──
function switchTab(tab) {
  const tabs = document.querySelectorAll('.tab-btn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (tab === 'login') {
    tabs[0].classList.add('active');
    tabs[1].classList.remove('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  } else {
    tabs[0].classList.remove('active');
    tabs[1].classList.add('active');
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  }
}

// ── Login ──
function handleLogin() {
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginError');

  errEl.classList.remove('show');

  if (!username || !password) {
    errEl.textContent = 'Please fill in all fields.';
    errEl.classList.add('show');
    return;
  }

  const users = getUsers();

  if (!users[username]) {
    errEl.textContent = 'No account found with that username.';
    errEl.classList.add('show');
    return;
  }

  if (users[username].password !== btoa(password)) {
    errEl.textContent = 'Incorrect password. Try again.';
    errEl.classList.add('show');
    return;
  }

  setCurrentUser(username);
  showToast('Welcome back, ' + (users[username].displayName || username) + '! 🌿', 'success');
  setTimeout(() => window.location.href = 'index.html', 800);
}

// ── Register ──
function handleRegister() {
  const username = document.getElementById('regUser').value.trim().toLowerCase();
  const displayName = document.getElementById('regName').value.trim();
  const password = document.getElementById('regPass').value;
  const errEl = document.getElementById('regError');

  errEl.classList.remove('show');

  if (!username || !password) {
    errEl.textContent = 'Username and password are required.';
    errEl.classList.add('show');
    return;
  }

  if (username.length < 3) {
    errEl.textContent = 'Username must be at least 3 characters.';
    errEl.classList.add('show');
    return;
  }

  if (password.length < 4) {
    errEl.textContent = 'Password must be at least 4 characters.';
    errEl.classList.add('show');
    return;
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    errEl.textContent = 'Username: lowercase letters, numbers, underscores only.';
    errEl.classList.add('show');
    return;
  }

  const users = getUsers();

  if (users[username]) {
    errEl.textContent = 'That username is already taken.';
    errEl.classList.add('show');
    return;
  }

  users[username] = {
    password: btoa(password),
    displayName: displayName || username,
    createdAt: Date.now(),
    goal: 8.4 // default daily goal in kg CO2
  };

  saveUsers(users);
  setCurrentUser(username);
  showToast('Account created! Let\'s track your carbon 🌿', 'success');
  setTimeout(() => window.location.href = 'index.html', 800);
}

// ── Toast ──
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icon = type === 'success' ? '✓' : '⚠';
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Guard ── (call on protected pages)
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  const users = getUsers();
  if (!users[user]) {
    localStorage.removeItem('gt_current_user');
    window.location.href = 'login.html';
    return null;
  }
  return { username: user, ...users[user] };
}
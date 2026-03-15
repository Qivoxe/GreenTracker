// ── GreenTrack Dashboard Logic ───────────────────

// ── Data helpers ─────────────────────────────────

function getLogs(username) {
  return JSON.parse(localStorage.getItem(`gt_logs_${username}`) || '[]');
}

function saveLogs(username, logs) {
  localStorage.setItem(`gt_logs_${username}`, JSON.stringify(logs));
}

function getUserData(username) {
  const users = JSON.parse(localStorage.getItem('gt_users') || '{}');
  return users[username] || {};
}

function saveUserData(username, data) {
  const users = JSON.parse(localStorage.getItem('gt_users') || '{}');
  users[username] = { ...users[username], ...data };
  localStorage.setItem('gt_users', JSON.stringify(users));
}

// ── CO2 Formula ──────────────────────────────────
// Total CO₂ = (travel km × 0.12) + (electricity units × 0.82) + (meals × 2.5)
function calcCO2(travel, electricity, meals) {
  return +(travel * 0.12 + electricity * 0.82 + meals * 2.5).toFixed(2);
}

function getCO2Level(kg) {
  if (kg <= 4)   return { label: 'Excellent', color: 'var(--green)',  badge: 'badge-green' };
  if (kg <= 7)   return { label: 'Good',      color: 'var(--yellow)', badge: 'badge-yellow' };
  if (kg <= 10)  return { label: 'Moderate',  color: 'var(--yellow)', badge: 'badge-yellow' };
  return           { label: 'High',      color: 'var(--red)',    badge: 'badge-red' };
}

// ── State ─────────────────────────────────────────
let currentUser = null;
let userData = null;
let logs = [];
let chart = null;
let currentSection = 'dashboard';

// ── Init ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const authData = requireAuth();
  if (!authData) return;

  currentUser = authData.username;
  userData = getUserData(currentUser);
  logs = getLogs(currentUser);

  // Set username display
  document.getElementById('navUser').textContent = userData.displayName || currentUser;
  document.getElementById('navAvatar').textContent = (userData.displayName || currentUser)[0].toUpperCase();

  // Set today's date in log form
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('logDate').value = today;
  document.getElementById('logDate').max = today;

  // Set goal input
  document.getElementById('goalInput').value = userData.goal || 8.4;

  // Init sections
  renderDashboard();
  renderHistory();
  renderLeaderboard();

  // Init chart (after small delay for DOM)
  setTimeout(() => initChart(), 100);
});

// ── Navigation ────────────────────────────────────
function showSection(name) {
  currentSection = name;

  document.querySelectorAll('.section').forEach(s => {
    s.style.display = 'none';
  });
  document.getElementById('section-' + name).style.display = 'block';

  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.section === name);
  });

  if (name === 'dashboard') renderDashboard();
  if (name === 'history')   renderHistory();
  if (name === 'leaderboard') renderLeaderboard();
  if (name === 'goals')     renderGoals();
}

// ── Dashboard ─────────────────────────────────────
function renderDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === today);
  const goal = userData.goal || 8.4;

  // Today's stats
  const todayCO2 = todayLog ? todayLog.total : 0;
  const level = getCO2Level(todayCO2);

  document.getElementById('stat-today').textContent = todayCO2.toFixed(1);
  document.getElementById('stat-today-badge').className = `badge ${level.badge}`;
  document.getElementById('stat-today-badge').textContent = level.label;

  // Weekly avg
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const weekLogs = logs.filter(l => l.date >= weekAgo);
  const weekAvg = weekLogs.length
    ? (weekLogs.reduce((s, l) => s + l.total, 0) / weekLogs.length).toFixed(1)
    : '—';
  document.getElementById('stat-week').textContent = weekAvg;

  // Total entries
  document.getElementById('stat-entries').textContent = logs.length;

  // Best day
  const best = logs.reduce((b, l) => (!b || l.total < b.total) ? l : b, null);
  document.getElementById('stat-best').textContent = best ? best.total.toFixed(1) : '—';

  // Goal progress
  const pct = Math.min(100, (todayCO2 / goal) * 100);
  document.getElementById('goal-progress-bar').style.width = pct + '%';
  document.getElementById('goal-progress-bar').style.background =
    pct <= 60 ? 'linear-gradient(90deg, var(--green-dim), var(--green))' :
    pct <= 90 ? 'linear-gradient(90deg, var(--green-dim), var(--yellow))' :
    'linear-gradient(90deg, var(--yellow), var(--red))';
  document.getElementById('goal-progress-text').textContent =
    `${todayCO2.toFixed(1)} / ${goal} kg  (${pct.toFixed(0)}% of daily goal)`;

  // Breakdown
  if (todayLog) {
    document.getElementById('bd-travel').textContent = (todayLog.travel * 0.12).toFixed(2) + ' kg';
    document.getElementById('bd-elec').textContent   = (todayLog.electricity * 0.82).toFixed(2) + ' kg';
    document.getElementById('bd-food').textContent   = (todayLog.meals * 2.5).toFixed(2) + ' kg';
    document.getElementById('bd-travel-input').textContent = todayLog.travel + ' km';
    document.getElementById('bd-elec-input').textContent   = todayLog.electricity + ' units';
    document.getElementById('bd-food-input').textContent   = todayLog.meals + ' meals';
  } else {
    ['bd-travel','bd-elec','bd-food'].forEach(id => document.getElementById(id).textContent = '— kg');
    ['bd-travel-input','bd-elec-input','bd-food-input'].forEach(id => document.getElementById(id).textContent = '—');
  }

  // Update chart
  if (chart) updateChart();
}

// ── Chart ─────────────────────────────────────────
function initChart() {
  const ctx = document.getElementById('co2Chart');
  if (!ctx) return;

  const data = getChartData();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'CO₂ (kg)',
        data: data.values,
        borderColor: '#6db87a',
        backgroundColor: 'rgba(109,184,122,0.08)',
        borderWidth: 2,
        pointBackgroundColor: '#6db87a',
        pointBorderColor: '#0d0f0e',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4,
      }, {
        label: 'Goal',
        data: data.labels.map(() => userData.goal || 8.4),
        borderColor: '#3d6b4777',
        borderWidth: 1,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false,
        tension: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1f1c',
          borderColor: '#252d28',
          borderWidth: 1,
          titleColor: '#e8e4d9',
          bodyColor: '#a09b8e',
          padding: 12,
          callbacks: {
            label: ctx => `  ${ctx.dataset.label}: ${ctx.raw} kg CO₂`
          }
        }
      },
      scales: {
        x: {
          grid: { color: '#252d2855' },
          ticks: { color: '#a09b8e', font: { size: 11, family: "'DM Mono', monospace" } }
        },
        y: {
          grid: { color: '#252d2855' },
          ticks: { color: '#a09b8e', font: { size: 11, family: "'DM Mono', monospace" }, callback: v => v + 'kg' },
          beginAtZero: true,
        }
      }
    }
  });
}

function updateChart() {
  if (!chart) return;
  const data = getChartData();
  chart.data.labels = data.labels;
  chart.data.datasets[0].data = data.values;
  chart.data.datasets[1].data = data.labels.map(() => userData.goal || 8.4);
  chart.update('active');
}

function getChartData() {
  const range = parseInt(document.getElementById('chartRange')?.value || '14');
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const recent = sorted.slice(-range);

  return {
    labels: recent.map(l => {
      const d = new Date(l.date + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    values: recent.map(l => l.total)
  };
}

// ── Log entry ─────────────────────────────────────
function submitLog() {
  const date        = document.getElementById('logDate').value;
  const travel      = parseFloat(document.getElementById('logTravel').value) || 0;
  const electricity = parseFloat(document.getElementById('logElec').value)   || 0;
  const meals       = parseFloat(document.getElementById('logMeals').value)  || 0;

  if (!date) {
    showToast('Please select a date.', 'error');
    return;
  }

  const total = calcCO2(travel, electricity, meals);

  // Preview
  document.getElementById('logPreviewTotal').textContent = total.toFixed(2) + ' kg CO₂';
  document.getElementById('logPreviewBreakdown').innerHTML = `
    <span>🚗 ${(travel * 0.12).toFixed(2)} kg</span>
    <span>⚡ ${(electricity * 0.82).toFixed(2)} kg</span>
    <span>🍽 ${(meals * 2.5).toFixed(2)} kg</span>
  `;

  const existing = logs.findIndex(l => l.date === date);
  const entry = { date, travel, electricity, meals, total, loggedAt: Date.now() };

  if (existing >= 0) {
    logs[existing] = entry;
    showToast('Entry updated for ' + date, 'success');
  } else {
    logs.push(entry);
    showToast('Logged ' + total + ' kg CO₂ for ' + date + ' 🌿', 'success');
  }

  saveLogs(currentUser, logs);

  // Reset & refresh
  document.getElementById('logTravel').value = '';
  document.getElementById('logElec').value   = '';
  document.getElementById('logMeals').value  = '';

  if (currentSection === 'dashboard') renderDashboard();
  if (currentSection === 'history')   renderHistory();
  renderLeaderboard();
}

function updateLogPreview() {
  const travel      = parseFloat(document.getElementById('logTravel').value) || 0;
  const electricity = parseFloat(document.getElementById('logElec').value)   || 0;
  const meals       = parseFloat(document.getElementById('logMeals').value)  || 0;
  const total       = calcCO2(travel, electricity, meals);
  const level       = getCO2Level(total);

  document.getElementById('logPreviewTotal').textContent = total.toFixed(2) + ' kg CO₂';
  document.getElementById('logPreviewTotal').style.color = level.color;
  document.getElementById('logPreviewBreakdown').innerHTML = `
    <span>🚗 ${(travel * 0.12).toFixed(2)}</span>
    <span>⚡ ${(electricity * 0.82).toFixed(2)}</span>
    <span>🍽 ${(meals * 2.5).toFixed(2)}</span>
  `;
}

// ── History ───────────────────────────────────────
function renderHistory() {
  const container = document.getElementById('historyList');
  if (!container) return;

  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));

  if (!sorted.length) {
    container.innerHTML = `
      <div style="text-align:center;padding:60px 0;color:var(--cream-dim);">
        <div style="font-size:2rem;margin-bottom:12px;">🌱</div>
        No entries yet. Start by logging today's activities.
      </div>`;
    return;
  }

  container.innerHTML = sorted.map((log, i) => {
    const level = getCO2Level(log.total);
    const d = new Date(log.date + 'T00:00:00');
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return `
      <div class="card history-row" style="margin-bottom:8px;display:grid;grid-template-columns:1fr auto auto;gap:16px;align-items:center;animation:fadeUp 0.3s ${i * 0.04}s both;">
        <div>
          <div style="font-weight:500;margin-bottom:4px;">${dateStr}</div>
          <div style="font-size:0.8rem;color:var(--cream-dim);display:flex;gap:16px;">
            <span>🚗 ${log.travel} km → ${(log.travel * 0.12).toFixed(2)} kg</span>
            <span>⚡ ${log.electricity} u → ${(log.electricity * 0.82).toFixed(2)} kg</span>
            <span>🍽 ${log.meals} meals → ${(log.meals * 2.5).toFixed(2)} kg</span>
          </div>
        </div>
        <div>
          <span class="badge ${level.badge}">${level.label}</span>
        </div>
        <div style="text-align:right;">
          <div style="font-family:var(--font-serif);font-size:1.4rem;color:${level.color}">${log.total.toFixed(1)}</div>
          <div style="font-size:0.75rem;color:var(--cream-dim)">kg CO₂</div>
        </div>
      </div>
    `;
  }).join('');
}

function exportCSV() {
  if (!logs.length) {
    showToast('No data to export.', 'error');
    return;
  }

  const header = 'Date,Travel (km),Electricity (units),Meals,Total CO2 (kg)\n';
  const rows = [...logs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(l => `${l.date},${l.travel},${l.electricity},${l.meals},${l.total}`)
    .join('\n');

  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `greentrack_${currentUser}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported! 📁', 'success');
}

function clearHistory() {
  if (!confirm('Delete ALL log entries? This cannot be undone.')) return;
  logs = [];
  saveLogs(currentUser, logs);
  renderHistory();
  renderDashboard();
  renderLeaderboard();
  showToast('History cleared.', 'success');
}

// ── Leaderboard ───────────────────────────────────
function renderLeaderboard() {
  const container = document.getElementById('leaderboardList');
  if (!container) return;

  const allUsers = JSON.parse(localStorage.getItem('gt_users') || '{}');
  const entries = [];

  for (const [username, data] of Object.entries(allUsers)) {
    const userLogs = getLogs(username);
    if (!userLogs.length) continue;

    const total = userLogs.reduce((s, l) => s + l.total, 0);
    const avg   = total / userLogs.length;
    entries.push({
      username,
      displayName: data.displayName || username,
      avg: +avg.toFixed(2),
      entries: userLogs.length,
      isMe: username === currentUser
    });
  }

  // Sort by lowest avg
  entries.sort((a, b) => a.avg - b.avg);

  if (!entries.length) {
    container.innerHTML = `
      <div style="text-align:center;padding:60px;color:var(--cream-dim);">
        No users have logged data yet.
      </div>`;
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];

  container.innerHTML = entries.map((e, i) => {
    const level = getCO2Level(e.avg);
    return `
      <div class="card" style="display:grid;grid-template-columns:48px 1fr auto;align-items:center;gap:16px;margin-bottom:8px;${e.isMe ? 'border-color:var(--green-dim);' : ''}animation:fadeUp 0.3s ${i * 0.06}s both;">
        <div style="text-align:center;font-size:${i < 3 ? '1.4rem' : '0.9rem'};color:var(--cream-dim);font-family:var(--font-mono);">
          ${i < 3 ? medals[i] : '#' + (i + 1)}
        </div>
        <div>
          <div style="font-weight:500;${e.isMe ? 'color:var(--green)' : ''}">
            ${e.displayName}${e.isMe ? ' <span style="font-size:0.75rem;color:var(--green)">(you)</span>' : ''}
          </div>
          <div style="font-size:0.8rem;color:var(--cream-dim)">${e.entries} entries logged</div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:var(--font-serif);font-size:1.5rem;color:${level.color}">${e.avg.toFixed(1)}</div>
          <div style="font-size:0.75rem;color:var(--cream-dim)">avg kg/day</div>
        </div>
      </div>`;
  }).join('');
}

// ── Goals ─────────────────────────────────────────
function renderGoals() {
  userData = getUserData(currentUser);
  const goal = userData.goal || 8.4;
  document.getElementById('goalInput').value = goal;

  // Weekly summary
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const weekLogs = logs.filter(l => l.date >= weekAgo);
  const hitGoal  = weekLogs.filter(l => l.total <= goal).length;
  const missed   = weekLogs.length - hitGoal;

  document.getElementById('goal-hit').textContent   = hitGoal;
  document.getElementById('goal-missed').textContent = missed;
  document.getElementById('goal-streak').textContent = calcStreak();

  // Goal ring
  const todayLog = logs.find(l => l.date === new Date().toISOString().split('T')[0]);
  const todayCO2 = todayLog ? todayLog.total : 0;
  const pct = Math.min(100, (todayCO2 / goal) * 100);

  const circle = document.getElementById('goalRingCircle');
  if (circle) {
    const circumference = 2 * Math.PI * 54;
    const offset = circumference * (1 - pct / 100);
    circle.style.strokeDasharray  = circumference;
    circle.style.strokeDashoffset = offset;
    circle.style.stroke =
      pct <= 60 ? 'var(--green)' :
      pct <= 90 ? 'var(--yellow)' : 'var(--red)';
  }

  document.getElementById('goalRingVal').textContent  = todayCO2.toFixed(1);
  document.getElementById('goalRingGoal').textContent = '/ ' + goal + ' kg';
}

function calcStreak() {
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  const goal   = userData.goal || 8.4;
  let streak = 0;

  const today    = new Date().toISOString().split('T')[0];
  let checkDate  = today;

  for (const log of sorted) {
    if (log.date === checkDate && log.total <= goal) {
      streak++;
      const d = new Date(checkDate + 'T00:00:00');
      d.setDate(d.getDate() - 1);
      checkDate = d.toISOString().split('T')[0];
    } else if (log.date < checkDate) {
      break;
    }
  }
  return streak;
}

function saveGoal() {
  const goal = parseFloat(document.getElementById('goalInput').value);
  if (!goal || goal <= 0) {
    showToast('Please enter a valid goal.', 'error');
    return;
  }
  saveUserData(currentUser, { goal });
  userData = getUserData(currentUser);
  showToast('Goal updated to ' + goal + ' kg/day ✓', 'success');
  renderGoals();
  updateChart();
}

// ── Toast ─────────────────────────────────────────
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
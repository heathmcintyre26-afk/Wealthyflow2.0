/* =========================================================
   WealthyFlow 2.0 — Admin Dashboard JS
   ========================================================= */

'use strict';

// ── Admin auth (SHA-256 of "Pass1698$") ──────────────────────
const ADMIN_USERNAME = 'thetymes1';
const ADMIN_PASS_HASH = '09b094b6483cf7033366ce3eaa1c4f028fd819e247f6d5c5adc28b0b1a5c08e1';

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── DOM ───────────────────────────────────────────────────────
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// ── Data Store (in-memory) ────────────────────────────────────
const DATA = {
  users: [
    { id: 1, name: 'Marcus Johnson', email: 'marcus@email.com', plan: 'Pro', courses: 7, spent: '$1,234', joined: '2024-01-12', status: 'active' },
    { id: 2, name: 'Aria Thompson', email: 'aria@email.com', plan: 'Elite', courses: 12, spent: '$3,891', joined: '2024-02-05', status: 'active' },
    { id: 3, name: 'Devon Clarke', email: 'devon@email.com', plan: 'Basic', courses: 3, spent: '$291', joined: '2024-03-18', status: 'active' },
    { id: 4, name: 'Zara Patel', email: 'zara@email.com', plan: 'Pro', courses: 5, spent: '$885', joined: '2024-03-29', status: 'active' },
    { id: 5, name: 'Elijah Williams', email: 'elijah@email.com', plan: 'Elite', courses: 18, spent: '$6,244', joined: '2024-04-02', status: 'active' },
    { id: 6, name: 'Sofia Martinez', email: 'sofia@email.com', plan: 'Basic', courses: 2, spent: '$197', joined: '2024-04-15', status: 'pending' },
    { id: 7, name: 'Caleb Robinson', email: 'caleb@email.com', plan: 'Pro', courses: 8, spent: '$1,594', joined: '2024-05-01', status: 'active' },
    { id: 8, name: 'Naomi Foster', email: 'naomi@email.com', plan: 'Elite', courses: 15, spent: '$4,785', joined: '2024-05-14', status: 'active' },
    { id: 9, name: 'Isaiah Reed', email: 'isaiah@email.com', plan: 'Basic', courses: 1, spent: '$97', joined: '2024-06-01', status: 'inactive' },
    { id: 10, name: 'Luna Chen', email: 'luna@email.com', plan: 'Pro', courses: 9, spent: '$2,007', joined: '2024-06-08', status: 'active' },
  ],
  courses: [
    { id: 1, title: 'Millionaire Mindset Blueprint', category: 'Mindset', students: 4218, revenue: '$831,546', status: 'published', rating: 4.9 },
    { id: 2, title: 'Elite Morning Rituals', category: 'Mindset', students: 3801, revenue: '$368,697', status: 'published', rating: 4.8 },
    { id: 3, title: 'Abundance Frequency Mastery', category: 'Mindset', students: 2912, revenue: '$427,064', status: 'published', rating: 4.7 },
    { id: 4, title: 'Fearless Wealth Psychology', category: 'Mindset', students: 1703, revenue: '$506,191', status: 'published', rating: 4.9 },
    { id: 5, title: 'Focus & Flow State Mastery', category: 'Mindset', students: 3134, revenue: '$398,018', status: 'published', rating: 4.7 },
    { id: 6, title: 'The Wealth Identity Shift', category: 'Mindset', students: 2201, revenue: '$763,747', status: 'published', rating: 5.0 },
    { id: 7, title: 'Real Estate Investment Mastery', category: 'Mastery', students: 5623, revenue: '$2,795,031', status: 'published', rating: 4.9 },
    { id: 8, title: 'High-Ticket Sales Domination', category: 'Mastery', students: 4102, revenue: '$1,628,494', status: 'published', rating: 4.8 },
    { id: 9, title: 'Digital Business Empire', category: 'Mastery', students: 7241, revenue: '$2,150,577', status: 'published', rating: 4.8 },
    { id: 10, title: 'Stock Market Mastery Pro', category: 'Mastery', students: 6317, revenue: '$2,823,699', status: 'published', rating: 4.7 },
    { id: 11, title: 'WealthFlow Crypto Foundations', category: 'Crypto', students: 9812, revenue: '$1,932,564', status: 'published', rating: 4.9 },
    { id: 12, title: 'DeFi Yield Maximizer', category: 'Crypto', students: 5438, revenue: '$1,887,186', status: 'published', rating: 4.8 },
    { id: 13, title: 'Crypto Trading Mastery', category: 'Crypto', students: 6712, revenue: '$2,996,264', status: 'published', rating: 4.9 },
    { id: 14, title: 'NFT & Digital Assets Pro', category: 'Crypto', students: 4108, revenue: '$1,014,676', status: 'draft', rating: 4.6 },
    { id: 15, title: 'Altcoin Gems Research Framework', category: 'Crypto', students: 3301, revenue: '$1,310,597', status: 'published', rating: 4.8 },
  ],
  activity: [
    { icon: '🎉', bg: 'rgba(201,168,76,0.12)', text: '<strong>Elijah Williams</strong> enrolled in <strong>Crypto Trading Mastery</strong>', time: '2 min ago' },
    { icon: '💰', bg: 'rgba(34,197,94,0.12)', text: 'New sale: <strong>Real Estate Investment Mastery</strong> — $497', time: '8 min ago' },
    { icon: '⭐', bg: 'rgba(201,168,76,0.12)', text: '<strong>Naomi Foster</strong> left a 5-star review on <strong>Millionaire Mindset Blueprint</strong>', time: '15 min ago' },
    { icon: '👤', bg: 'rgba(59,130,246,0.12)', text: 'New user registered: <strong>Sofia Martinez</strong>', time: '22 min ago' },
    { icon: '💰', bg: 'rgba(34,197,94,0.12)', text: 'New sale: <strong>DeFi Yield Maximizer</strong> — $347', time: '31 min ago' },
    { icon: '🎓', bg: 'rgba(107,63,160,0.12)', text: '<strong>Luna Chen</strong> completed <strong>Focus & Flow State Mastery</strong>', time: '45 min ago' },
    { icon: '💰', bg: 'rgba(34,197,94,0.12)', text: 'New sale: <strong>High-Ticket Sales Domination</strong> — $397', time: '1h ago' },
    { icon: '📧', bg: 'rgba(59,130,246,0.12)', text: 'Email campaign sent to <strong>12,847</strong> subscribers', time: '2h ago' },
  ],
  revenueMonths: [
    { label: 'Jan', value: 68 },
    { label: 'Feb', value: 74 },
    { label: 'Mar', value: 82 },
    { label: 'Apr', value: 71 },
    { label: 'May', value: 89 },
    { label: 'Jun', value: 95 },
    { label: 'Jul', value: 88 },
    { label: 'Aug', value: 103 },
    { label: 'Sep', value: 97 },
    { label: 'Oct', value: 115 },
    { label: 'Nov', value: 128 },
    { label: 'Dec', value: 142 },
  ]
};

// ── Login ─────────────────────────────────────────────────────
function initLogin() {
  const form = $('#login-form');
  const errorEl = $('#login-error');
  const togglePw = $('#toggle-pw');
  const pwInput = $('#pw-input');
  const submitBtn = $('#login-submit');

  if (!form) return;

  // Toggle password visibility
  togglePw?.addEventListener('click', () => {
    const isText = pwInput.type === 'text';
    pwInput.type = isText ? 'password' : 'text';
    togglePw.textContent = isText ? '👁' : '🙈';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = $('#username-input').value.trim();
    const password = pwInput.value;

    if (!username || !password) {
      showError('Please enter both username and password.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Authenticating…';

    try {
      const hash = await sha256(password);
      if (username === ADMIN_USERNAME && hash === ADMIN_PASS_HASH) {
        // Success
        submitBtn.textContent = '✓ Access Granted';
        submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        sessionStorage.setItem('wf_admin_auth', '1');
        setTimeout(() => showDashboard(), 600);
      } else {
        showError('Invalid username or password. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Access Dashboard';
      }
    } catch {
      showError('Authentication error. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Access Dashboard';
    }
  });

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.add('show');
    setTimeout(() => errorEl.classList.remove('show'), 4000);
  }

  // Check existing session
  if (sessionStorage.getItem('wf_admin_auth') === '1') {
    showDashboard();
  }
}

// ── Show Dashboard ────────────────────────────────────────────
function showDashboard() {
  $('#login-screen').style.display = 'none';
  const dash = $('#dashboard');
  dash.classList.add('visible');
  dash.style.display = 'flex';
  renderDashboard();
}

// ── Sidebar Navigation ────────────────────────────────────────
function initSidebarNav() {
  const items = $$('.sidebar-nav-item');
  const pages = $$('.page');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.page;
      if (!target) return;

      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      pages.forEach(p => p.classList.remove('active'));
      const page = document.getElementById(`page-${target}`);
      if (page) page.classList.add('active');

      // Update topbar title
      const topTitle = $('#topbar-title');
      if (topTitle) topTitle.textContent = item.querySelector('.nav-label')?.textContent || 'Dashboard';

      // Close mobile sidebar
      $('#sidebar')?.classList.remove('mobile-open');
    });
  });

  // Mobile toggle
  $('#sidebar-toggle')?.addEventListener('click', () => {
    $('#sidebar')?.classList.toggle('mobile-open');
  });

  // Logout
  $('#logout-btn')?.addEventListener('click', () => {
    sessionStorage.removeItem('wf_admin_auth');
    location.reload();
  });
}

// ── Render Dashboard Overview ─────────────────────────────────
function renderDashboard() {
  renderStats();
  renderRevenueChart();
  renderDonutChart();
  renderActivityFeed();
  renderRecentUsers();
  renderUsersPage();
  renderCoursesPage();
  renderAnalyticsPage();
  initAdminTabs();
  initCoursesAdminTabs();
  initModals();
  initSettings();
  animateStatCounters();
}

function renderStats() {
  const stats = [
    { id: 'stat-users', value: 12847, prefix: '', suffix: '' },
    { id: 'stat-revenue', value: 2847392, prefix: '$', suffix: '' },
    { id: 'stat-enrollments', value: 47231, prefix: '', suffix: '' },
    { id: 'stat-courses', value: 15, prefix: '', suffix: '' },
  ];
  // Values are already in the HTML, just animate them
}

function animateStatCounters() {
  const targets = {
    'stat-users': { value: 12847, prefix: '', suffix: '' },
    'stat-revenue': { value: 2847392, prefix: '$', suffix: '' },
    'stat-enrollments': { value: 47231, prefix: '', suffix: '' },
    'stat-courses': { value: 15, prefix: '', suffix: '' },
  };

  Object.entries(targets).forEach(([id, cfg]) => {
    const el = document.getElementById(id);
    if (!el) return;
    let start = null;
    const duration = 1800;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(eased * cfg.value);
      el.textContent = cfg.prefix + val.toLocaleString() + cfg.suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

function renderRevenueChart() {
  const chart = $('#revenue-bars');
  if (!chart) return;
  const max = Math.max(...DATA.revenueMonths.map(m => m.value));
  chart.innerHTML = DATA.revenueMonths.map((m, i) => `
    <div class="bar-group">
      <div class="bar bar-gold" style="height:${(m.value/max)*140}px" title="$${m.value}k"></div>
      <span class="bar-label">${m.label}</span>
    </div>
  `).join('');
}

function renderDonutChart() {
  const svg = $('#donut-svg');
  if (!svg) return;

  const segments = [
    { label: 'Crypto', pct: 42, color: '#22c55e' },
    { label: 'Mastery', pct: 35, color: '#9b6fd0' },
    { label: 'Mindset', pct: 23, color: '#c9a84c' },
  ];

  const size = 120;
  const r = 44;
  const cx = size / 2, cy = size / 2;
  let cumulative = 0;

  const paths = segments.map(seg => {
    const start = cumulative;
    cumulative += seg.pct;
    const a1 = (start / 100) * 2 * Math.PI - Math.PI / 2;
    const a2 = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    const large = seg.pct > 50 ? 1 : 0;
    return `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="${seg.color}" opacity="0.85"/>`;
  });

  // Center hole
  svg.innerHTML = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      ${paths.join('')}
      <circle cx="${cx}" cy="${cy}" r="26" fill="var(--bg-card)"/>
      <text x="${cx}" y="${cy + 4}" text-anchor="middle" fill="#c9a84c" font-size="11" font-weight="700">Revenue</text>
    </svg>
  `;

  // Legend
  const legend = $('#donut-legend');
  if (legend) {
    legend.innerHTML = segments.map(s => `
      <div class="legend-item">
        <span class="legend-dot" style="background:${s.color}"></span>
        <span class="legend-name">${s.label}</span>
        <span class="legend-pct">${s.pct}%</span>
      </div>
    `).join('');
  }
}

function renderActivityFeed() {
  const list = $('#activity-list');
  if (!list) return;
  list.innerHTML = DATA.activity.map(a => `
    <div class="activity-item">
      <div class="activity-icon" style="background:${a.bg}">${a.icon}</div>
      <div class="activity-body">
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>
  `).join('');
}

function renderRecentUsers() {
  const tbody = $('#recent-users-tbody');
  if (!tbody) return;
  tbody.innerHTML = DATA.users.slice(0, 5).map(u => `
    <tr>
      <td class="td-primary">${u.name}</td>
      <td>${u.email}</td>
      <td><span class="status-badge status-${u.status === 'active' ? 'active' : u.status === 'pending' ? 'pending' : 'inactive'}">${u.status}</span></td>
      <td>${u.plan}</td>
      <td class="td-primary">${u.spent}</td>
    </tr>
  `).join('');
}

// ── Users Page ────────────────────────────────────────────────
function renderUsersPage(filter = 'all') {
  const tbody = $('#users-tbody');
  if (!tbody) return;

  let users = DATA.users;
  if (filter !== 'all') {
    users = users.filter(u => u.status === filter || u.plan.toLowerCase() === filter.toLowerCase());
  }

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:32px;height:32px;background:linear-gradient(135deg,#a07830,#c9a84c);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#0a0a0a;font-size:0.75rem;flex-shrink:0">${u.name.charAt(0)}</div>
          <span class="td-primary">${u.name}</span>
        </div>
      </td>
      <td>${u.email}</td>
      <td>${u.joined}</td>
      <td><span class="status-badge status-${u.plan === 'Elite' ? 'active' : u.plan === 'Pro' ? 'pending' : 'inactive'}">${u.plan}</span></td>
      <td>${u.courses}</td>
      <td class="td-primary">${u.spent}</td>
      <td><span class="status-badge status-${u.status === 'active' ? 'active' : u.status === 'pending' ? 'pending' : 'inactive'}">${u.status}</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="editUser(${u.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})">Remove</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.editUser = function(id) {
  const user = DATA.users.find(u => u.id === id);
  if (!user) return;
  showToast(`Editing user: ${user.name}`, 'info');
  // In a real app, open edit modal
};

window.deleteUser = function(id) {
  const user = DATA.users.find(u => u.id === id);
  if (!user) return;
  if (confirm(`Remove ${user.name} from the platform?`)) {
    DATA.users = DATA.users.filter(u => u.id !== id);
    renderUsersPage();
    showToast(`${user.name} has been removed.`, 'success');
  }
};

// ── Courses Page ──────────────────────────────────────────────
function renderCoursesPage(filter = 'all') {
  const tbody = $('#courses-tbody');
  if (!tbody) return;

  let courses = DATA.courses;
  if (filter !== 'all') {
    courses = courses.filter(c => c.category === filter || c.status === filter);
  }

  const catEmoji = { Mindset: '🧠', Mastery: '⚡', Crypto: '₿' };

  tbody.innerHTML = courses.map(c => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="font-size:1.3rem">${catEmoji[c.category] || '📚'}</div>
          <span class="td-primary">${c.title}</span>
        </div>
      </td>
      <td>${c.category}</td>
      <td>${c.students.toLocaleString()}</td>
      <td class="td-primary">${c.revenue}</td>
      <td>⭐ ${c.rating}</td>
      <td><span class="status-badge status-${c.status === 'published' ? 'published' : 'draft'}">${c.status}</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="editCourse(${c.id})">Edit</button>
          <button class="btn btn-${c.status === 'published' ? 'danger' : 'green'} btn-sm" onclick="toggleCourse(${c.id})">${c.status === 'published' ? 'Unpublish' : 'Publish'}</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.editCourse = function(id) {
  const course = DATA.courses.find(c => c.id === id);
  if (!course) return;
  // Populate modal
  $('#course-modal-title').textContent = 'Edit Course';
  $('#course-title-input').value = course.title;
  $('#course-cat-select').value = course.category;
  $('#course-status-select').value = course.status;
  $('#course-modal-overlay').classList.remove('hidden');
  $('#course-modal-overlay').dataset.editId = id;
};

window.toggleCourse = function(id) {
  const course = DATA.courses.find(c => c.id === id);
  if (!course) return;
  course.status = course.status === 'published' ? 'draft' : 'published';
  renderCoursesPage();
  showToast(`"${course.title}" is now ${course.status}.`, 'success');
};

// ── Analytics Page ────────────────────────────────────────────
function renderAnalyticsPage() {
  const sparkBars = $$('.spark-bar');
  const vals = [40, 55, 48, 70, 62, 80, 75, 90, 85, 95, 100, 88];
  sparkBars.forEach((bar, i) => {
    bar.style.height = vals[i % vals.length] + '%';
  });
}

// ── Admin Tabs (Users page) ────────────────────────────────────
function initAdminTabs() {
  $$('.admin-tabs').forEach(tabBar => {
    const tabs = tabBar.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const group = tabBar.dataset.group;
        const target = tab.dataset.pane;

        if (group) {
          $$(`[data-group="${group}"] ~ .tab-pane, .tab-pane[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
        }
        const pane = tabBar.nextElementSibling?.id === `pane-${target}`
          ? tabBar.nextElementSibling
          : document.getElementById(`pane-${target}`);
        if (pane) pane.classList.add('active');

        // Trigger re-render based on filter
        if (target === 'all-users' || target === 'active-users' || target === 'pending-users') {
          const filterMap = { 'all-users': 'all', 'active-users': 'active', 'pending-users': 'pending' };
          renderUsersPage(filterMap[target] || 'all');
        }
      });
    });
  });
}

// ── Courses Admin Tabs ────────────────────────────────────────
function initCoursesAdminTabs() {
  const bar = $('#courses-tab-bar');
  if (!bar) return;
  bar.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      bar.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter || 'all';
      renderCoursesPage(filter);
    });
  });
}

// ── Modals ────────────────────────────────────────────────────
function initModals() {
  // Add user modal
  $('#add-user-btn')?.addEventListener('click', () => {
    $('#user-modal-overlay').classList.remove('hidden');
    $('#user-form').reset();
    $('#user-modal-title').textContent = 'Add New User';
  });

  // Add course modal
  $('#add-course-btn')?.addEventListener('click', () => {
    $('#course-modal-overlay').classList.remove('hidden');
    $('#course-form').reset();
    $('#course-modal-title').textContent = 'Add New Course';
    delete $('#course-modal-overlay').dataset.editId;
  });

  // Close modals
  $$('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.modal-overlay').forEach(o => o.classList.add('hidden'));
    });
  });

  $$('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.add('hidden');
    });
  });

  // Save user
  $('#user-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#user-name-input').value.trim();
    const email = $('#user-email-input').value.trim();
    const plan = $('#user-plan-select').value;

    const newUser = {
      id: DATA.users.length + 1,
      name,
      email,
      plan,
      courses: 0,
      spent: '$0',
      joined: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    DATA.users.push(newUser);
    renderUsersPage();
    renderRecentUsers();
    $('#user-modal-overlay').classList.add('hidden');
    showToast(`User "${name}" added successfully!`, 'success');
  });

  // Save course
  $('#course-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = $('#course-title-input').value.trim();
    const category = $('#course-cat-select').value;
    const status = $('#course-status-select').value;
    const editId = $('#course-modal-overlay').dataset.editId;

    if (editId) {
      const course = DATA.courses.find(c => c.id === parseInt(editId));
      if (course) {
        course.title = title;
        course.category = category;
        course.status = status;
        showToast(`"${title}" updated!`, 'success');
      }
    } else {
      DATA.courses.push({
        id: DATA.courses.length + 1,
        title,
        category,
        students: 0,
        revenue: '$0',
        status,
        rating: 0
      });
      showToast(`Course "${title}" created!`, 'success');
    }
    renderCoursesPage();
    $('#course-modal-overlay').classList.add('hidden');
  });
}

// ── Settings ──────────────────────────────────────────────────
function initSettings() {
  const saveBtn = $('#save-settings-btn');
  saveBtn?.addEventListener('click', () => {
    showToast('Settings saved successfully!', 'success');
  });
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const container = $('#toast-container');
  if (!container) return;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span class="toast-text">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Search bar ────────────────────────────────────────────────
function initSearch() {
  const searchBar = $('#topbar-search');
  if (!searchBar) return;
  searchBar.addEventListener('click', () => {
    showToast('Search functionality coming soon!', 'info');
  });
}

// ── Notification bell ──────────────────────────────────────────
function initNotifications() {
  const bell = $('#notif-bell');
  if (!bell) return;
  bell.addEventListener('click', () => {
    showToast('3 new enrollments in the last hour! 🎉', 'success');
  });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initSidebarNav();
  initSearch();
  initNotifications();
});

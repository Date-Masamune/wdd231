// ====== NAV TOGGLE (shared header) ======
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
});

// ====== DIRECTORY LOGIC ======
const directoryEl = document.getElementById('directory');
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');

const DATA_URL = 'data/members.json';

// Footer dates
const yearSpan = document.getElementById('year');
const lastModSpan = document.getElementById('lastModified');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();
if (lastModSpan) lastModSpan.textContent = document.lastModified;

const state = { view: 'grid', members: [] };

async function loadMembers() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.members = Array.isArray(data) ? data : (data.members || []);
    render();
  } catch (err) {
    console.error('Failed to load members:', err);
    if (directoryEl) {
      directoryEl.innerHTML = '<p role="alert">Unable to load member directory right now.</p>';
    }
  }
}

function toCardHTML(m) {
  const levelMap = { 1: 'member', 2: 'silver', 3: 'gold' };
  const lvl = levelMap[m.membershipLevel] || 'member';
  const lvlLabel = lvl[0].toUpperCase() + lvl.slice(1);
  const lvlBadge = `<span class="badge ${lvl}">${lvlLabel}</span>`;

  const website = m.website ? `<a href="${m.website}" target="_blank" rel="noopener">Website</a>` : '';
  const phone = m.phone ? `<a href="tel:${m.phone}">${m.phone}</a>` : '';
  const email = m.email ? `<a href="mailto:${m.email}">${m.email}</a>` : '';
  const address = m.address ? `<p>${m.address}</p>` : '';
  const logo = m.logo || 'images/placeholder-logo.png';

  return `
    <article class="card" tabindex="0">
      <header>
        <img class="logo" src="${logo}" loading="lazy" width="56" height="56"
             alt="${m.name} logo"
             onerror="this.src='images/placeholder-logo.png'">
        <div>
          <h2>${m.name}</h2>
          <div class="badges">${lvlBadge}</div>
        </div>
      </header>
      <div class="meta">
        ${address}
        ${m.category ? `<p>${m.category}</p>` : ''}
        <p>
          ${website}
          ${website && (phone || email) ? ' · ' : ''}
          ${phone}
          ${(phone && email) ? ' · ' : ''}
          ${email}
        </p>
      </div>
    </article>
  `;
}

function render() {
  if (!directoryEl) return;
  directoryEl.className = state.view === 'grid' ? 'cards' : 'list';
  directoryEl.innerHTML = state.members.map(toCardHTML).join('');
}

function setView(view) {
  state.view = view;

  if (gridBtn && listBtn) {
    gridBtn.classList.toggle('is-active', view === 'grid');
    listBtn.classList.toggle('is-active', view === 'list');
    gridBtn.setAttribute('aria-pressed', view === 'grid');
    listBtn.setAttribute('aria-pressed', view === 'list');
  }

  render();
}

if (gridBtn) gridBtn.addEventListener('click', () => setView('grid'));
if (listBtn) listBtn.addEventListener('click', () => setView('list'));

loadMembers();

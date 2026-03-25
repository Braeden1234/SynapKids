/* ─────────────────────────────────────────────
   COMPONENT LOADER
   Fetches navbar.html and footer.html and injects
   them into every page, then marks the active link.
───────────────────────────────────────────── */
async function loadComponents() {
  const base = document.currentScript
    ? new URL('.', document.currentScript.src).href
    : './';

  // Inject navbar
  const navEl = document.getElementById('navbar-placeholder');
  if (navEl) {
    try {
      const r = await fetch(base + 'components/navbar.html');
      navEl.innerHTML = await r.text();
      markActiveNav();
    } catch (e) { console.warn('Could not load navbar', e); }
  }

  // Inject footer
  const ftEl = document.getElementById('footer-placeholder');
  if (ftEl) {
    try {
      const r = await fetch(base + 'components/footer.html');
      ftEl.innerHTML = await r.text();
    } catch (e) { console.warn('Could not load footer', e); }
  }
}

// Highlight the nav link that matches the current page filename
function markActiveNav() {
  const file = location.pathname.split('/').pop() || 'index.html';
  const map = {
    'index.html': 'nl-home',
    'about.html': 'nl-about',
    'staff.html': 'nl-about',
    'programs.html': 'nl-about',
    'resources.html': 'nl-resources',
    'articles.html': 'nl-resources',
    'involve.html': 'nl-involve',
    'chapters.html': 'nl-involve',
    'donate.html': 'nl-donate',
    'sponsor.html': 'nl-donate',
    'contact.html': 'nl-contact',
  };
  const id = map[file];
  if (id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('act');
  }
}

document.addEventListener('DOMContentLoaded', loadComponents);

/* ─────────────────────────────────────────────
   NAV TOGGLE (hamburger)
───────────────────────────────────────────── */
function toggleNav() {
  document.getElementById('navMenu').classList.toggle('open');
  document.getElementById('burger').classList.toggle('open');
}

function closeNav() {
  const m = document.getElementById('navMenu');
  const b = document.getElementById('burger');
  if (m) m.classList.remove('open');
  if (b) b.classList.remove('open');
}

document.addEventListener('click', e => {
  const nav = document.getElementById('mainNav');
  if (nav && !nav.contains(e.target)) closeNav();
});

/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
function reveal() {
  document.querySelectorAll('.fade:not(.in)').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 32)
      el.classList.add('in');
  });
}
window.addEventListener('scroll', reveal, { passive: true });
window.addEventListener('load', () => setTimeout(reveal, 80));

/* ─────────────────────────────────────────────
   WATCH AN AD MODAL
───────────────────────────────────────────── */
let adTimer = null, adInterval = null;
const AD_DURATION = 15;

function openAdModal() {
  document.getElementById('adModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  startAd();
}

function closeAdModal() {
  clearTimers();
  document.getElementById('adModal').style.display = 'none';
  document.body.style.overflow = '';
  document.getElementById('adWatchingState').style.display = 'block';
  document.getElementById('adDoneState').style.display = 'none';
  document.getElementById('adProgressBar').style.width = '0%';
  document.getElementById('adEarningDisplay').textContent = '$0.00';
  document.getElementById('skipCountdown').textContent = AD_DURATION;
  document.getElementById('adNextBtn').style.display = 'block';
  resetNextBtn();
  document.getElementById('adCloseBtn').disabled = true;
  document.getElementById('adCloseBtn').style.cursor = 'not-allowed';
  document.getElementById('adCloseBtn').style.color = 'rgba(255,255,255,0.3)';
}

function resetNextBtn() {
  const btn = document.getElementById('adNextBtnEl');
  btn.disabled = true;
  btn.style.cursor = 'not-allowed';
  btn.style.color = 'rgba(255,255,255,0.4)';
  btn.style.borderColor = 'rgba(255,255,255,0.25)';
  btn.innerHTML = 'Next &rarr; <span id="skipCountdown" style="opacity:0.7">' + AD_DURATION + '</span>s';
}

function enableNextBtn() {
  const btn = document.getElementById('adNextBtnEl');
  btn.disabled = false;
  btn.style.cursor = 'pointer';
  btn.style.color = 'white';
  btn.style.borderColor = 'rgba(255,255,255,0.7)';
  btn.innerHTML = 'Next &rarr;';
  btn.onmouseover = () => { btn.style.background = 'rgba(255,255,255,0.15)'; };
  btn.onmouseout = () => { btn.style.background = 'rgba(0,0,0,0.65)'; };
}

function finishAdEarly() {
  clearTimers();
  finishAd(0.02);
}

function startAd() {
  const totalMs = AD_DURATION * 1000;
  const startTime = Date.now();
  const maxEarning = 0.02;
  document.getElementById('adWatchingState').style.display = 'block';
  document.getElementById('adDoneState').style.display = 'none';
  document.getElementById('adProgressBar').style.width = '0%';
  document.getElementById('adNextBtn').style.display = 'block';
  resetNextBtn();
  document.getElementById('adCloseBtn').disabled = true;
  document.getElementById('adCloseBtn').style.cursor = 'not-allowed';
  document.getElementById('adCloseBtn').style.color = 'rgba(255,255,255,0.3)';
  adInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const pct = Math.min(elapsed / totalMs, 1);
    const remaining = Math.max(Math.ceil((totalMs - elapsed) / 1000), 0);
    document.getElementById('adProgressBar').style.width = (pct * 100) + '%';
    const cd = document.getElementById('skipCountdown');
    if (cd) cd.textContent = remaining;
    document.getElementById('adEarningDisplay').textContent = '$' + (pct * maxEarning).toFixed(4);
    if (remaining <= 0) enableNextBtn();
    if (pct >= 1) { clearTimers(); finishAd(maxEarning); }
  }, 250);
}

function finishAd(earned) {
  document.getElementById('adNextBtn').style.display = 'none';
  document.getElementById('adWatchingState').style.display = 'none';
  document.getElementById('adDoneState').style.display = 'block';
  document.getElementById('adFinalAmt').textContent = '$' + earned.toFixed(2);
  const btn = document.getElementById('adCloseBtn');
  btn.disabled = false;
  btn.style.cursor = 'pointer';
  btn.style.color = 'rgba(255,255,255,0.7)';
}

function replayAd() {
  document.getElementById('adEarningDisplay').textContent = '$0.00';
  startAd();
}

function clearTimers() {
  clearInterval(adInterval);
  clearTimeout(adTimer);
  adInterval = null;
  adTimer = null;
}

document.addEventListener('DOMContentLoaded', () => {
  const adModal = document.getElementById('adModal');
  if (adModal) adModal.addEventListener('click', e => { if (e.target === adModal) closeAdModal(); });
});

/* ─────────────────────────────────────────────
   GET INVOLVED TABS
───────────────────────────────────────────── */
function showGiForm(type, btn) {
  document.querySelectorAll('.gi-opt').forEach(b => b.classList.remove('sel'));
  if (btn) btn.classList.add('sel');
  document.querySelectorAll('.gi-form-area').forEach(a => a.classList.remove('show'));
  const el = document.getElementById('gi-' + type);
  if (el) {
    el.classList.add('show');
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }
}

/* ─────────────────────────────────────────────
   CHAPTER APPLICATION (multi-step form)
───────────────────────────────────────────── */
function toStep(n) {
  [1, 2, 3].forEach(i => document.getElementById('step' + i).style.display = 'none');
  document.getElementById('step' + n).style.display = 'block';
  const L = ['Step 1 of 3 — About You', 'Step 2 of 3 — Your Community', 'Step 3 of 3 — Your Vision'];
  document.getElementById('stepLbl').textContent = L[n - 1];
  document.getElementById('progFill').style.width = ['33%', '66%', '100%'][n - 1];
  document.getElementById('formCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function countChars(fid, cid, max) {
  const f = typeof fid === 'string' ? document.getElementById(fid) : fid;
  const c = document.getElementById(cid);
  if (f && c) c.textContent = Math.min(f.value.length, max);
}

function submitApp() {
  if (!document.getElementById('agreeBox').checked) {
    alert('Please agree to the Chapter Guidelines before submitting.');
    return;
  }
  document.getElementById('formCard').style.display = 'none';
  const s = document.getElementById('successCard');
  s.style.display = 'block';
  s.classList.add('in');
  s.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─────────────────────────────────────────────
   CHAPTERS PAGE
───────────────────────────────────────────── */
const ALL_CHAPTERS = [
  { name: 'Pontiac Community Chapter', city: 'Pontiac', state: 'Michigan', type: 'School-Based', ages: 'K–8', pres: 'Sofia Tran', year: 2024, color: '#1C3D6A' },
  { name: 'Detroit Metro Chapter', city: 'Detroit', state: 'Michigan', type: 'School-Based', ages: 'High School', pres: 'Kofi Jackson', year: 2023, color: '#2A6B40' },
  { name: 'Ann Arbor University Chapter', city: 'Ann Arbor', state: 'Michigan', type: 'University', ages: 'Community', pres: 'Priya Mehta', year: 2024, color: '#4A2B8C' },
  { name: 'Houston Heights Chapter', city: 'Houston', state: 'Texas', type: 'Community', ages: 'All Ages', pres: 'Lucia Mendez', year: 2023, color: '#7A3B1A' },
  { name: 'Dallas Crossroads Chapter', city: 'Dallas', state: 'Texas', type: 'School-Based', ages: 'K–12', pres: 'Andre Williams', year: 2024, color: '#1e4d8c' },
  { name: 'Austin Youth Chapter', city: 'Austin', state: 'Texas', type: 'Community', ages: 'Middle School', pres: 'Elena Park', year: 2025, color: '#2E7D52' },
  { name: 'Oakland Unified Chapter', city: 'Oakland', state: 'California', type: 'School-Based', ages: 'K–12', pres: 'Aisha Nakamura', year: 2023, color: '#4A2B8C' },
  { name: 'LA Westside Chapter', city: 'Los Angeles', state: 'California', type: 'Community', ages: 'Elementary', pres: 'Marco Rivera', year: 2024, color: '#7A5B1A' },
  { name: 'San Diego Harbor Chapter', city: 'San Diego', state: 'California', type: 'Hospital', ages: 'All Ages', pres: 'Dana Kim', year: 2025, color: '#1C5A7A' },
  { name: 'Chicago South Side Chapter', city: 'Chicago', state: 'Illinois', type: 'School-Based', ages: 'Elementary', pres: 'DeShawn Williams', year: 2023, color: '#1e4d8c' },
  { name: 'Chicago Northshore Chapter', city: 'Evanston', state: 'Illinois', type: 'University', ages: 'Community', pres: 'Layla Hassan', year: 2024, color: '#5B2A8C' },
  { name: 'Columbus Central Chapter', city: 'Columbus', state: 'Ohio', type: 'School-Based', ages: 'Middle School', pres: 'Remi Okafor', year: 2023, color: '#7A5B1A' },
  { name: 'Cleveland Heights Chapter', city: 'Cleveland', state: 'Ohio', type: 'Community', ages: 'All Ages', pres: 'Tanya Brooks', year: 2024, color: '#2A6B40' },
  { name: 'Atlanta Youth Chapter', city: 'Atlanta', state: 'Georgia', type: 'Community', ages: 'All Ages', pres: 'Tariq Patterson', year: 2023, color: '#1E4D2B' },
  { name: 'Savannah Chapter', city: 'Savannah', state: 'Georgia', type: 'School-Based', ages: 'K–8', pres: 'Amara Diallo', year: 2025, color: '#7A3B1A' },
  { name: 'Brooklyn Bridges Chapter', city: 'Brooklyn', state: 'New York', type: 'Community', ages: 'K–8', pres: 'Zara Hussain', year: 2023, color: '#8C1E4A' },
  { name: 'Bronx Rising Chapter', city: 'Bronx', state: 'New York', type: 'School-Based', ages: 'High School', pres: 'Isaiah Torres', year: 2024, color: '#1C2E4A' },
  { name: 'Buffalo Community Chapter', city: 'Buffalo', state: 'New York', type: 'Community', ages: 'All Ages', pres: 'Nina Chen', year: 2025, color: '#4A2B8C' },
  { name: 'Miami Shores Chapter', city: 'Miami', state: 'Florida', type: 'Community', ages: 'All Ages', pres: 'Carlos Leal', year: 2024, color: '#1C5A7A' },
  { name: 'Orlando Wellness Chapter', city: 'Orlando', state: 'Florida', type: 'Hospital', ages: 'All Ages', pres: 'Bianca James', year: 2025, color: '#2A6B40' },
  { name: 'Phoenix Desert Chapter', city: 'Phoenix', state: 'Arizona', type: 'Community', ages: 'All Ages', pres: 'Nia Brooks', year: 2024, color: '#2B4D1E' },
  { name: 'Tucson Chapter', city: 'Tucson', state: 'Arizona', type: 'School-Based', ages: 'K–8', pres: 'David Cruz', year: 2025, color: '#7A3B1A' },
  { name: 'Seattle Eastside Chapter', city: 'Seattle', state: 'Washington', type: 'School-Based', ages: 'High School', pres: 'Marcus Kim', year: 2024, color: '#3B1A6A' },
  { name: 'Tacoma Chapter', city: 'Tacoma', state: 'Washington', type: 'Community', ages: 'All Ages', pres: 'Rosa Nguyen', year: 2025, color: '#1C5A7A' },
  { name: 'Nashville Harmony Chapter', city: 'Nashville', state: 'Tennessee', type: 'School-Based', ages: 'Elementary', pres: 'Fatima Diallo', year: 2025, color: '#6A1A2E' },
  { name: 'Memphis Youth Chapter', city: 'Memphis', state: 'Tennessee', type: 'Community', ages: 'All Ages', pres: 'Jordan Webb', year: 2025, color: '#2A6B40' },
  { name: 'Philadelphia Chapter', city: 'Philadelphia', state: 'Pennsylvania', type: 'School-Based', ages: 'K–12', pres: 'Aaliyah Moore', year: 2024, color: '#1C2E4A' },
  { name: 'Pittsburgh Chapter', city: 'Pittsburgh', state: 'Pennsylvania', type: 'University', ages: 'Community', pres: 'Sam Zhang', year: 2025, color: '#5B2A8C' },
];

function buildStateJump() {
  const states = [...new Set(ALL_CHAPTERS.map(c => c.state))].sort();
  const wrap = document.getElementById('stateJump');
  if (!wrap) return;
  wrap.innerHTML = states.map(s =>
    `<button onclick="jumpState('${s}')" style="font-family:'Nunito',sans-serif;font-size:0.75rem;font-weight:700;padding:6px 14px;border-radius:50px;border:1.5px solid var(--rule);background:white;color:var(--muted);cursor:pointer;transition:all 0.18s" onmouseover="this.style.background='var(--navy)';this.style.color='white';this.style.borderColor='var(--navy)'" onmouseout="this.style.background='white';this.style.color='var(--muted)';this.style.borderColor='var(--rule)'">${s}</button>`
  ).join('');
}

function jumpState(st) {
  document.getElementById('chapState').value = st;
  filterChaps();
}

function filterChaps() {
  const q = (document.getElementById('chapSearch')?.value || '').toLowerCase();
  const st = (document.getElementById('chapState')?.value || '');
  const tp = (document.getElementById('chapType')?.value || '');
  const list = ALL_CHAPTERS.filter(c => {
    const qok = !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.state.toLowerCase().includes(q) || c.pres.toLowerCase().includes(q);
    const sok = !st || c.state === st;
    const tok = !tp || c.type === tp;
    return qok && sok && tok;
  });
  renderChaps(list);
}

function renderChaps(list) {
  const grid = document.getElementById('chapsGrid');
  const none = document.getElementById('chapsNone');
  const cnt = document.getElementById('chapCount');
  if (!grid) return;
  if (cnt) cnt.textContent = list.length ? `${list.length} chapter${list.length !== 1 ? 's' : ''} found` : '';
  none.style.display = list.length ? 'none' : 'block';
  grid.style.display = list.length ? 'grid' : 'none';
  grid.innerHTML = list.map(c => `
    <div style="background:white;border-radius:18px;border:1px solid var(--rule);overflow:hidden;transition:transform 0.22s,box-shadow 0.22s;display:flex;flex-direction:column" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 36px rgba(28,46,74,0.1)'" onmouseout="this.style.transform='';this.style.boxShadow=''">
      <div style="height:8px;background:${c.color}"></div>
      <div style="padding:22px;flex:1;display:flex;flex-direction:column">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px">
          <div style="font-family:'Baloo 2',cursive;font-size:1rem;font-weight:700;color:var(--navy);line-height:1.3">${c.name}</div>
          <span style="font-size:0.62rem;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;padding:3px 9px;border-radius:50px;background:var(--warm);border:1px solid var(--rule);color:var(--muted);white-space:nowrap;flex-shrink:0">${c.type}</span>
        </div>
        <div style="display:flex;align-items:center;gap:5px;font-size:0.8rem;font-weight:700;color:var(--muted);margin-bottom:14px">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${c.city}, ${c.state}
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
          <span style="font-size:0.68rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;padding:3px 9px;border-radius:50px;background:var(--blue-l);color:var(--blue)">${c.ages}</span>
          <span style="font-size:0.68rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;padding:3px 9px;border-radius:50px;background:var(--coral-l);color:var(--coral)">Est. ${c.year}</span>
        </div>
        <div style="margin-top:auto;display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px solid var(--rule)">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:28px;height:28px;border-radius:50%;background:${c.color};display:flex;align-items:center;justify-content:center;font-family:'Baloo 2',cursive;font-size:0.65rem;font-weight:700;color:white;flex-shrink:0">${c.pres.split(' ').map(n => n[0]).join('')}</div>
            <div>
              <div style="font-size:0.75rem;font-weight:700;color:var(--text)">${c.pres}</div>
              <div style="font-size:0.67rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;font-weight:700">Chapter President</div>
            </div>
          </div>
          <button onclick="alert('Request sent! ${c.pres} will be in touch within 3 days.')" style="font-family:'Baloo 2',cursive;font-size:0.75rem;font-weight:700;padding:7px 16px;border-radius:50px;border:2px solid var(--coral);background:transparent;color:var(--coral);cursor:pointer;transition:all 0.18s;white-space:nowrap" onmouseover="this.style.background='var(--coral)';this.style.color='white'" onmouseout="this.style.background='transparent';this.style.color='var(--coral)'">Join →</button>
        </div>
      </div>
    </div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('chapsGrid')) {
    buildStateJump();
    renderChaps(ALL_CHAPTERS);
  }
});

/* ─────────────────────────────────────────────
   ARTICLES PAGE
───────────────────────────────────────────── */
const ARTS = [
  { id: 1, cat: 'anxiety', title: 'Why Kids Worry: A Brain-Based Explanation', excerpt: 'Understanding the amygdala helps us respond to anxious children with more empathy and less frustration.', author: 'Dr. James Rivera', initials: 'JR', ac: '#7B54C8', date: 'Mar 12, 2026', min: 5, cc: '#2B6CB8' },
  { id: 2, cat: 'parenting', title: 'Five Ways to Talk to Your Child About Big Feelings', excerpt: 'Simple, science-backed conversation starters that build emotional vocabulary and trust between parent and child.', author: 'Sam Torres', initials: 'ST', ac: '#2B7A3D', date: 'Mar 8, 2026', min: 4, cc: '#E05B42' },
  { id: 3, cat: 'mindfulness', title: 'Breathing Exercises That Actually Work for Kids', excerpt: 'Four evidence-based techniques for children ages 5–12, with tips on making them stick as daily habits.', author: 'Dr. Leila Okonkwo', initials: 'LO', ac: '#3D9959', date: 'Feb 28, 2026', min: 3, cc: '#3B82C4' },
  { id: 4, cat: 'neuroscience', title: 'The Developing Brain: Ages 6–12 Explained', excerpt: "A parent-friendly guide to what's happening in your child's brain during middle childhood — and why it matters.", author: 'Dr. Sophie Nakamura', initials: 'SN', ac: '#C4883B', date: 'Feb 20, 2026', min: 7, cc: '#7B54C8' },
  { id: 5, cat: 'emotions', title: 'Teaching Kids the Emotional Color Wheel', excerpt: 'How to use color-coded emotion charts to help children identify nuanced feelings beyond "happy" and "sad."', author: 'Priya Patel', initials: 'PP', ac: '#9B5CD6', date: 'Feb 14, 2026', min: 4, cc: '#C4883B' },
  { id: 6, cat: 'school', title: 'How to Support an Anxious Child at School', excerpt: 'Practical strategies for teachers and school counselors — from morning routines to de-escalation.', author: 'Marcus Webb', initials: 'MW', ac: '#2B6CB8', date: 'Feb 7, 2026', min: 6, cc: '#3B82C4' },
  { id: 7, cat: 'anxiety', title: 'When Worry Becomes a Problem: Signs to Watch For', excerpt: 'The difference between normal childhood worry and clinical anxiety — and what to do when things escalate.', author: 'Dr. Amir Hassan', initials: 'AH', ac: '#C84D33', date: 'Jan 30, 2026', min: 5, cc: '#E05B42' },
  { id: 8, cat: 'parenting', title: 'Screen Time and Emotional Health: The Real Picture', excerpt: "Moving past the panic — a nuanced look at what research actually says about screens and children's wellbeing.", author: 'Dr. Sophie Nakamura', initials: 'SN', ac: '#C4883B', date: 'Jan 22, 2026', min: 6, cc: '#E05B42' },
  { id: 9, cat: 'emotions', title: 'Grief in Children: What It Looks Like, How to Help', excerpt: 'Children grieve differently than adults. Understanding those differences is the first step toward meaningful support.', author: 'Dr. Maya Chen', initials: 'MC', ac: '#3B82C4', date: 'Jan 15, 2026', min: 7, cc: '#7B54C8' },
  { id: 10, cat: 'neuroscience', title: "Stress Hormones and the Child's Brain", excerpt: 'Cortisol, adrenaline, and oxytocin — how stress chemistry shapes learning, behavior, and emotional resilience.', author: 'Dr. James Rivera', initials: 'JR', ac: '#7B54C8', date: 'Jan 8, 2026', min: 8, cc: '#7B54C8' },
  { id: 11, cat: 'mindfulness', title: 'The 5-4-3-2-1 Grounding Technique for Kids', excerpt: 'Step-by-step guide to teaching this sensory grounding exercise in an age-appropriate, engaging way.', author: 'Grace Kimani', initials: 'GK', ac: '#C84D33', date: 'Dec 20, 2025', min: 3, cc: '#3B82C4' },
  { id: 12, cat: 'school', title: 'Building Emotional Safety in the Classroom', excerpt: 'How educators can create conditions where every student feels safe enough to learn, take risks, and be themselves.', author: 'Marcus Webb', initials: 'MW', ac: '#2B6CB8', date: 'Dec 12, 2025', min: 5, cc: '#3B82C4' },
];

const CATMAP = { anxiety: 'Anxiety', emotions: 'Emotions', parenting: 'Parenting', mindfulness: 'Mindfulness', neuroscience: 'Neuroscience', school: 'School' };
let curCat = 'all', curSort = 'newest';

function buildArts() { renderArts(); }

function setCat(c, btn) {
  curCat = c;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('act'));
  btn.classList.add('act');
  renderArts();
}

function sortArts(v) { curSort = v; renderArts(); }
function filterArts() { renderArts(); }

function renderArts() {
  const q = (document.getElementById('artSearch')?.value || '').toLowerCase();
  let list = ARTS.filter(a => {
    const cOk = curCat === 'all' || a.cat === curCat;
    const qOk = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.author.toLowerCase().includes(q);
    return cOk && qOk;
  });
  if (curSort === 'oldest') list = [...list].reverse();
  if (curSort === 'az') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
  if (curSort === 'quick') list = [...list].sort((a, b) => a.min - b.min);
  const grid = document.getElementById('artGrid');
  const cnt = document.getElementById('artCount');
  if (!grid) return;
  if (cnt) cnt.textContent = list.length ? `Showing ${list.length} article${list.length !== 1 ? 's' : ''}` : 'No articles found';
  grid.innerHTML = list.length ? list.map(a => `
    <div class="art-card fade in">
      <div class="ac-top" style="background:${a.cc}"></div>
      <div class="ac-body">
        <div class="ac-tags"><span class="ac-cat" style="background:${a.cc}">${CATMAP[a.cat]}</span><span class="ac-time">${a.min} min read</span></div>
        <div class="ac-title">${a.title}</div>
        <p class="ac-excerpt">${a.excerpt}</p>
        <div class="ac-footer">
          <div class="ac-author-wrap"><div class="ac-av" style="background:${a.ac}">${a.initials}</div><div><div class="ac-name">${a.author}</div><div class="ac-date">${a.date}</div></div></div>
          <span class="ac-read">Read &rarr;</span>
        </div>
      </div>
    </div>`).join('') : `<div class="no-arts"><strong>No articles found</strong><p>Try a different search or category.</p></div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('artGrid')) buildArts();
});

/* ─────────────────────────────────────────────
   DONATE PAGE
───────────────────────────────────────────── */
let selectedAmt = 50, freq = 'once';

function selectTier(el, amt) {
  document.querySelectorAll('.donate-tier').forEach(t => { t.style.borderColor = 'var(--rule)'; t.style.background = 'white'; });
  el.style.borderColor = 'var(--coral)';
  el.style.background = 'var(--coral-l)';
  document.getElementById('customAmt').value = '';
  selectedAmt = amt;
  updateDonateDisplay();
}

function selectCustom() {
  document.querySelectorAll('.donate-tier').forEach(t => { t.style.borderColor = 'var(--rule)'; t.style.background = 'white'; });
  const v = parseFloat(document.getElementById('customAmt').value) || 0;
  selectedAmt = v;
  updateDonateDisplay();
}

function setFreq(f) {
  freq = f;
  document.getElementById('freqOnce').style.background = f === 'once' ? 'var(--navy)' : 'transparent';
  document.getElementById('freqOnce').style.color = f === 'once' ? 'white' : 'var(--muted)';
  document.getElementById('freqMonthly').style.background = f === 'monthly' ? 'var(--navy)' : 'transparent';
  document.getElementById('freqMonthly').style.color = f === 'monthly' ? 'white' : 'var(--muted)';
  document.getElementById('monthlyNote').style.display = f === 'monthly' ? 'block' : 'none';
  updateDonateDisplay();
}

function updateDonateDisplay() {
  const d = document.getElementById('donateDisplay');
  const b = document.getElementById('btnAmt');
  const fd = document.getElementById('freqDisplay');
  const label = selectedAmt ? `$${selectedAmt}` : '$—';
  if (d) d.textContent = label;
  if (b) b.textContent = label;
  if (fd) fd.textContent = freq === 'monthly' ? '/month' : '/one-time';
}

function fmtCard(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 16);
  el.value = v.match(/.{1,4}/g)?.join(' ') || v;
}

function submitDonate() {
  if (!selectedAmt || selectedAmt < 1) { alert('Please select or enter a donation amount.'); return; }
  const form = document.querySelector('#donateFormWrap');
  const s = document.getElementById('donateSuccess');
  if (form && s) {
    form.querySelectorAll('input, button:not(#donateSuccess *), .fg, [data-hide]').forEach(el => el.style.display = 'none');
    s.style.display = 'block';
  }
}

/* ─────────────────────────────────────────────
   SPONSOR PAGE
───────────────────────────────────────────── */
const SPONSOR_BENEFITS = [
  { label: 'Newsletter logo placement', community: true, champion: true, partner: true, founding: true },
  { label: 'Website sponsor listing', community: true, champion: true, partner: true, founding: true },
  { label: 'Annual impact report', community: true, champion: true, partner: true, founding: true },
  { label: 'Social media features', community: '1×', champion: '4×', partner: '12×', founding: 'Unlimited' },
  { label: 'Logo on chapter materials', community: false, champion: true, partner: true, founding: true },
  { label: 'Named program sponsor', community: false, champion: true, partner: true, founding: true },
  { label: 'Certificate of partnership', community: false, champion: true, partner: true, founding: true },
  { label: 'Mid-year impact call', community: false, champion: true, partner: true, founding: true },
  { label: 'Named chapter sponsor', community: false, champion: false, partner: true, founding: true },
  { label: 'Logo on printed kits', community: false, champion: false, partner: true, founding: true },
  { label: 'Speaking slot at summit', community: false, champion: false, partner: true, founding: true },
  { label: 'Bi-annual exec meetings', community: false, champion: false, partner: true, founding: true },
  { label: 'Co-branded press release', community: false, champion: false, partner: true, founding: true },
  { label: '"Presented by" naming rights', community: false, champion: false, partner: false, founding: true },
  { label: 'Advisory Council seat', community: false, champion: false, partner: false, founding: true },
  { label: 'Custom co-branded program', community: false, champion: false, partner: false, founding: true },
  { label: 'Dedicated account manager', community: false, champion: false, partner: false, founding: true },
  { label: 'Quarterly exec briefings', community: false, champion: false, partner: false, founding: true },
];

function buildSponsorTable() {
  const tb = document.getElementById('sponsorTable');
  if (!tb || tb.innerHTML) return;
  const check = (v, col) => {
    if (v === false) return `<span style="color:var(--rule);font-size:1.1rem">—</span>`;
    if (v === true) {
      const colors = { community: '#2E7D52', champion: 'var(--blue)', partner: 'var(--coral)', founding: 'var(--gold)' };
      return `<span style="color:${colors[col]};font-size:1.1rem;font-weight:700">✓</span>`;
    }
    return `<span style="font-size:0.78rem;font-weight:700;color:var(--muted)">${v}</span>`;
  };
  tb.innerHTML = SPONSOR_BENEFITS.map((b, i) => `
    <tr style="border-bottom:1px solid var(--rule);${i % 2 === 0 ? 'background:rgba(251,247,243,0.5)' : ''}">
      <td style="padding:12px 16px;color:var(--text);font-weight:600">${b.label}</td>
      <td style="text-align:center;padding:12px">${check(b.community, 'community')}</td>
      <td style="text-align:center;padding:12px">${check(b.champion, 'champion')}</td>
      <td style="text-align:center;padding:12px;background:rgba(224,91,66,0.03)">${check(b.partner, 'partner')}</td>
      <td style="text-align:center;padding:12px">${check(b.founding, 'founding')}</td>
    </tr>`).join('');
}

function openSponsorInquiry(tier) {
  document.getElementById('modalTierLabel').textContent = tier;
  document.getElementById('sponsorInquiryForm').style.display = 'block';
  document.getElementById('sponsorInquirySuccess').style.display = 'none';
  document.getElementById('sponsorModal').style.display = 'flex';
  buildSponsorTable();
}

function closeSponsorModal() {
  document.getElementById('sponsorModal').style.display = 'none';
}

function submitSponsorInquiry() {
  document.getElementById('sponsorInquiryForm').style.display = 'none';
  document.getElementById('sponsorInquirySuccess').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('sponsorModal')) {
    document.getElementById('sponsorModal').addEventListener('click', e => {
      if (e.target === document.getElementById('sponsorModal')) closeSponsorModal();
    });
  }
  if (document.getElementById('sponsorTable')) buildSponsorTable();
});

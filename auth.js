/**
 * WebBuilder — Auth System v4
 * ✓ Russian text: navbar uses clamp() — font shrinks, bar stays same height
 * ✓ Renamed to "WebBuilder" (no Pro) everywhere
 * ✓ All 3 languages fully translated (RO/EN/RU)
 * ✓ Login/Register inside mobile hamburger menu (3-line icon)
 * ✓ Language-change re-renders all auth UI instantly
 * ✓ "My Orders" → links to payment.html (shows all orders)
 * ✓ Auto-fills order form when logged in
 */
(function () {
'use strict';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRANSLATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AT = {
  ro: {
    btnGuest:'Cont', logout:'Deconectare',
    loginTitle:'Bine ai revenit!', loginSub:'Loghează-te pentru comenzile tale',
    regTitle:'Creează cont', regSub:'Înregistrare gratuită',
    lName:'Numele tău', lEmail:'Email', lPass:'Parolă', lPhone:'Telefon (opțional)',
    loginBtn:'Loghează-te', regBtn:'Creează cont',
    noAcc:'Nu ai cont?', hasAcc:'Ai deja cont?',
    toReg:'Înregistrează-te', toLogin:'Loghează-te',
    hello:'Salut', myOrders:'Comenzile mele',
    signing:'Se conectează…', creating:'Se creează…',
    errPass:'Parolă incorectă.', errNoUser:'Nu există cont cu acest email.',
    errInUse:'Emailul este deja folosit.', errWeak:'Parola trebuie min. 6 caractere.',
    errEmail:'Email invalid.', errGen:'Eroare. Încearcă din nou.',
    filled:'Date completate automat ✓',
    mobSection:'CONT', mobLogin:'Loghează-te / Înregistrează-te',
    mobAs:'Conectat ca', mobOrders:'Comenzile Mele', mobOut:'Deconectare',
  },
  en: {
    btnGuest:'Account', logout:'Sign Out',
    loginTitle:'Welcome back!', loginSub:'Sign in to track your orders',
    regTitle:'Create account', regSub:'Register for free',
    lName:'Your name', lEmail:'Email', lPass:'Password', lPhone:'Phone (optional)',
    loginBtn:'Sign In', regBtn:'Create Account',
    noAcc:"Don't have an account?", hasAcc:'Already have an account?',
    toReg:'Register', toLogin:'Sign In',
    hello:'Hello', myOrders:'My Orders',
    signing:'Signing in…', creating:'Creating…',
    errPass:'Incorrect password.', errNoUser:'No account with this email.',
    errInUse:'Email already in use.', errWeak:'Password must be 6+ characters.',
    errEmail:'Invalid email.', errGen:'Error. Please try again.',
    filled:'Details auto-filled ✓',
    mobSection:'ACCOUNT', mobLogin:'Sign In / Register',
    mobAs:'Signed in as', mobOrders:'My Orders', mobOut:'Sign Out',
  },
  ru: {
    btnGuest:'Войти', logout:'Выйти',
    loginTitle:'С возвращением!', loginSub:'Войдите для отслеживания заказов',
    regTitle:'Создать аккаунт', regSub:'Регистрация бесплатна',
    lName:'Ваше имя', lEmail:'Email', lPass:'Пароль', lPhone:'Телефон (необяз.)',
    loginBtn:'Войти', regBtn:'Создать',
    noAcc:'Нет аккаунта?', hasAcc:'Уже есть аккаунт?',
    toReg:'Регистрация', toLogin:'Войти',
    hello:'Привет', myOrders:'Мои заказы',
    signing:'Вход…', creating:'Создание…',
    errPass:'Неверный пароль.', errNoUser:'Аккаунт не найден.',
    errInUse:'Email уже используется.', errWeak:'Пароль минимум 6 символов.',
    errEmail:'Неверный email.', errGen:'Ошибка. Попробуйте снова.',
    filled:'Данные заполнены ✓',
    mobSection:'АККАУНТ', mobLogin:'Войти / Регистрация',
    mobAs:'Вошли как', mobOrders:'Мои заказы', mobOut:'Выйти',
  }
};
function t(k) {
  const lang = localStorage.getItem('preferred-language') || 'en';
  return (AT[lang] || AT.en)[k] || k;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _auth = null, _db = null;
let currentUser = null, userProfile = {};
let isRegMode = false, modalOpen = false;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FIREBASE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initAuth() {
  try {
    if (typeof FIREBASE_CONFIG === 'undefined' || FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') return;
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    _auth = firebase.auth();
    _db = firebase.firestore();
    _auth.onAuthStateChanged(user => {
      currentUser = user;
      if (user) loadUserProfile(user);
      else { userProfile = {}; localStorage.removeItem('wbp_user'); renderAll(); }
    });
  } catch(e) { console.warn('Auth init:', e); }
}

async function loadUserProfile(user) {
  if (_db) {
    try {
      const doc = await _db.collection('users').doc(user.uid).get();
      userProfile = doc.exists ? doc.data() : {};
    } catch(e) { userProfile = {}; }
  }
  const name = userProfile.displayName || user.displayName || user.email.split('@')[0];
  localStorage.setItem('wbp_user', JSON.stringify({
    uid: user.uid, email: user.email,
    displayName: name, phone: userProfile.phone || ''
  }));
  renderAll();
  tryAutofillForm();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CSS
// Key fix: font-size uses clamp() — Russian Cyrillic is wider per char,
// clamp ensures the pill/button never breaks the nav height.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function injectStyles() {
  const s = document.createElement('style');
  s.id = 'auth-styles';
  s.textContent = `
  /* ── Nav wrap ── */
  #auth-nav-wrap {
    display: flex; align-items: center;
    margin-left: 10px; position: relative; flex-shrink: 0; min-width: 0;
  }
  /* Hidden on mobile — shown inside hamburger menu */
  @media (max-width: 900px) { #auth-nav-wrap { display: none !important; } }

  /* ── Guest button ──
     clamp(min, preferred, max) keeps Russian short words from expanding layout */
  .auth-btn-guest {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 22px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white; font-weight: 700; border: none; cursor: pointer;
    font-family: inherit; white-space: nowrap; transition: all .2s;
    box-shadow: 0 2px 10px rgba(59,130,246,.3);
    font-size: clamp(0.68rem, 1.1vw, 0.85rem);
    max-width: 130px; overflow: hidden; text-overflow: ellipsis;
  }
  .auth-btn-guest:hover { opacity:.9; transform:translateY(-1px); }

  /* ── Logged-in pill ── */
  .auth-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px 4px 4px; border-radius: 22px;
    background: rgba(59,130,246,.08); border: 1.5px solid rgba(59,130,246,.2);
    cursor: pointer; transition: background .18s; position: relative;
    max-width: 200px; min-width: 0;
  }
  .auth-pill:hover { background: rgba(59,130,246,.14); }
  .auth-pill-av {
    width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg,#3b82f6,#8b5cf6);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: .72rem; font-weight: 800;
  }
  .auth-pill-name {
    font-size: clamp(0.65rem, 1.05vw, 0.8rem);
    font-weight: 600; color: #1e293b;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    min-width: 0; flex: 1; max-width: 95px;
  }
  .auth-pill-chev { font-size: .58rem; color: #94a3b8; flex-shrink: 0; }

  /* ── Dropdown ── */
  .auth-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    background: white; border-radius: 14px; min-width: 195px;
    box-shadow: 0 12px 40px rgba(0,0,0,.14);
    border: 1px solid #e2e8f0; overflow: hidden;
    display: none; z-index: 2001;
  }
  .auth-dropdown.open { display: block; animation: authDrop .16s ease; }
  @keyframes authDrop { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
  .auth-dd-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 16px; font-size: .84rem; font-weight: 500; color: #1e293b;
    cursor: pointer; transition: background .12s;
    border: none; background: none; width: 100%; text-align: left;
    font-family: inherit; text-decoration: none;
  }
  .auth-dd-item:hover { background: #f8fafc; }
  .auth-dd-item.danger { color: #ef4444; }
  .auth-dd-item i { width: 16px; text-align: center; opacity: .65; }
  .auth-dd-sep { height: 1px; background: #f1f5f9; margin: 3px 0; }

  /* ── Modal ── */
  #auth-modal-bg {
    position: fixed; inset: 0; background: rgba(15,23,42,.52);
    backdrop-filter: blur(6px); z-index: 9995;
    display: flex; align-items: center; justify-content: center; padding: 16px;
    opacity: 0; pointer-events: none; transition: opacity .22s;
  }
  #auth-modal-bg.open { opacity:1; pointer-events: all; }
  .auth-modal {
    background: white; border-radius: 22px; width: 100%; max-width: 390px;
    box-shadow: 0 30px 80px rgba(0,0,0,.22); overflow: hidden;
    transform: scale(.95) translateY(8px); transition: transform .22s ease;
  }
  #auth-modal-bg.open .auth-modal { transform: scale(1) translateY(0); }
  .auth-modal-head {
    background: linear-gradient(135deg,#3b82f6,#8b5cf6);
    padding: 24px 24px 18px; color: white; text-align: center; position: relative;
  }
  .auth-modal-head h3 { font-size: 1.2rem; font-weight: 800; margin-bottom: 3px; }
  .auth-modal-head p { font-size: .78rem; opacity: .85; margin: 0; }
  .auth-modal-close {
    position: absolute; top: 12px; right: 12px;
    background: rgba(255,255,255,.18); border: none; color: white;
    width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
    font-size: .76rem; display: flex; align-items: center; justify-content: center;
  }
  .auth-modal-close:hover { background: rgba(255,255,255,.32); }
  .auth-modal-body { padding: 20px 22px 24px; }
  .auth-field { margin-bottom: 12px; }
  .auth-field label {
    display: block; font-size: .7rem; font-weight: 700;
    color: #64748b; text-transform: uppercase; letter-spacing: .4px; margin-bottom: 5px;
  }
  .auth-field input {
    width: 100%; padding: 10px 13px; border: 2px solid #e2e8f0; border-radius: 10px;
    font-family: inherit; font-size: .88rem; color: #1e293b;
    outline: none; transition: border-color .18s;
  }
  .auth-field input:focus { border-color: #3b82f6; }
  .auth-submit-btn {
    width: 100%; padding: 12px;
    background: linear-gradient(135deg,#3b82f6,#8b5cf6);
    color: white; border: none; border-radius: 10px;
    font-family: inherit; font-size: .92rem; font-weight: 700;
    cursor: pointer; transition: all .18s; margin-top: 4px;
  }
  .auth-submit-btn:hover { opacity:.9; transform:translateY(-1px); }
  .auth-submit-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
  .auth-error {
    background: #fee2e2; color: #7f1d1d;
    padding: 8px 12px; border-radius: 8px; font-size: .8rem;
    margin-top: 9px; display: none;
  }
  .auth-switch { text-align: center; margin-top: 13px; font-size: .79rem; color: #64748b; }
  .auth-switch a { color: #3b82f6; font-weight: 700; cursor: pointer; }
  .auth-switch a:hover { text-decoration: underline; }

  /* ── Auto-fill notice ── */
  .auth-form-notice {
    background: rgba(16,185,129,.08); border: 1.5px solid rgba(16,185,129,.25);
    border-radius: 9px; padding: 8px 12px; font-size: .79rem; font-weight: 600;
    color: #065f46; display: none; margin-bottom: 10px;
    align-items: center; gap: 7px;
  }
  .auth-form-notice.show { display: flex; }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     MOBILE MENU AUTH SECTION
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  .mob-auth-section {
    border-top: 1px solid rgba(255,255,255,.1);
    padding: 14px 0 10px; margin-top: 4px;
  }
  .mob-auth-label {
    font-size: .63rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1px; color: #64748b; padding: 0 20px 8px; display: block;
  }
  .mob-auth-cta {
    display: flex; align-items: center; gap: 13px;
    padding: 12px 20px; background: none; border: none;
    color: #e2e8f0; font-size: .9rem; font-weight: 600;
    cursor: pointer; font-family: inherit; width: 100%; text-align: left;
    transition: background .14s;
  }
  .mob-auth-cta:hover { background: rgba(255,255,255,.05); }
  .mob-auth-cta-icon {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg,#3b82f6,#8b5cf6);
    display: flex; align-items: center; justify-content: center;
    font-size: .9rem; color: white;
  }
  .mob-auth-user { padding: 0 16px 6px; }
  .mob-auth-chip {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,.06); border-radius: 12px;
    padding: 10px 14px; margin-bottom: 6px;
  }
  .mob-auth-av {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg,#3b82f6,#8b5cf6);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: .8rem; font-weight: 800;
  }
  .mob-auth-info { flex: 1; min-width: 0; }
  .mob-auth-info span:first-child { display: block; font-size: .62rem; color: #64748b; }
  .mob-auth-info span:last-child {
    display: block; font-size: .84rem; font-weight: 600; color: #e2e8f0;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .mob-auth-link {
    display: flex; align-items: center; gap: 11px;
    padding: 10px 20px; background: none; border: none;
    color: #94a3b8; font-size: .84rem; font-weight: 500;
    cursor: pointer; font-family: inherit; width: 100%;
    text-align: left; transition: all .14s; text-decoration: none;
  }
  .mob-auth-link:hover { color: #e2e8f0; background: rgba(255,255,255,.04); }
  .mob-auth-link.red { color: #f87171; }
  .mob-auth-link.red:hover { color: #ef4444; }
  .mob-auth-link i { width: 16px; text-align: center; font-size: .84rem; }
  `;
  document.head.appendChild(s);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUILD MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildModal() {
  const bg = document.createElement('div');
  bg.id = 'auth-modal-bg';
  bg.innerHTML = `
  <div class="auth-modal">
    <div class="auth-modal-head">
      <button class="auth-modal-close" onclick="authCloseModal()"><i class="fas fa-times"></i></button>
      <h3 id="auth-m-title"></h3>
      <p id="auth-m-sub"></p>
    </div>
    <div class="auth-modal-body">
      <div class="auth-form-notice" id="auth-form-notice">
        <i class="fas fa-check-circle"></i>
        <span id="auth-form-notice-text"></span>
      </div>
      <div class="auth-field" id="auth-name-field" style="display:none">
        <label id="auth-lbl-name"></label>
        <input type="text" id="auth-name-input" autocomplete="name">
      </div>
      <div class="auth-field">
        <label id="auth-lbl-email"></label>
        <input type="email" id="auth-email-input" autocomplete="email">
      </div>
      <div class="auth-field">
        <label id="auth-lbl-pass"></label>
        <input type="password" id="auth-pass-input" placeholder="••••••••" autocomplete="current-password">
      </div>
      <div class="auth-field" id="auth-phone-field" style="display:none">
        <label id="auth-lbl-phone"></label>
        <input type="tel" id="auth-phone-input" autocomplete="tel">
      </div>
      <button class="auth-submit-btn" id="auth-submit-btn" onclick="authSubmit()"></button>
      <div class="auth-error" id="auth-error"></div>
      <div class="auth-switch">
        <span id="auth-switch-text"></span>
        <a onclick="authToggleMode()" id="auth-switch-link"></a>
      </div>
    </div>
  </div>`;
  document.body.appendChild(bg);
  bg.addEventListener('click', e => { if (e.target === bg) authCloseModal(); });
  ['auth-email-input','auth-pass-input','auth-name-input','auth-phone-input'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') authSubmit();
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUILD NAV WRAP (desktop only)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildNavWrap() {
  const nav = document.querySelector('.nav-container');
  if (!nav || document.getElementById('auth-nav-wrap')) return;
  const wrap = document.createElement('div');
  wrap.id = 'auth-nav-wrap';
  nav.appendChild(wrap);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUILD MOBILE AUTH SECTION (inside hamburger)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildMobileSection() {
  if (document.getElementById('mob-auth-section')) return;
  const footer = document.querySelector('.mobile-menu-footer');
  if (!footer) return;
  const sec = document.createElement('div');
  sec.id = 'mob-auth-section';
  sec.className = 'mob-auth-section';
  footer.parentNode.insertBefore(sec, footer);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RENDER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderAll() { renderNav(); renderMobile(); }

function renderNav() {
  const wrap = document.getElementById('auth-nav-wrap');
  if (!wrap) return;
  if (!currentUser) {
    wrap.innerHTML = `<button class="auth-btn-guest" onclick="authOpenModal()">
      <i class="fas fa-user"></i><span>${t('btnGuest')}</span></button>`;
  } else {
    const name    = userProfile.displayName || currentUser.displayName || currentUser.email.split('@')[0];
    const initial = name.charAt(0).toUpperCase();
    wrap.innerHTML = `
    <div class="auth-pill" id="auth-user-pill" onclick="authToggleDropdown()">
      <div class="auth-pill-av">${initial}</div>
      <span class="auth-pill-name">${t('hello')}, ${name}</span>
      <i class="fas fa-chevron-down auth-pill-chev"></i>
      <div class="auth-dropdown" id="auth-dropdown">
        <a class="auth-dd-item" href="payment.html">
          <i class="fas fa-boxes"></i> ${t('myOrders')}
        </a>
        <div class="auth-dd-sep"></div>
        <button class="auth-dd-item danger" onclick="authLogout(event)">
          <i class="fas fa-sign-out-alt"></i> ${t('logout')}
        </button>
      </div>
    </div>`;
  }
}

function renderMobile() {
  const sec = document.getElementById('mob-auth-section');
  if (!sec) return;
  if (!currentUser) {
    sec.innerHTML = `
    <span class="mob-auth-label">${t('mobSection')}</span>
    <button class="mob-auth-cta" onclick="authOpenModal()">
      <div class="mob-auth-cta-icon"><i class="fas fa-user"></i></div>
      <span>${t('mobLogin')}</span>
    </button>`;
  } else {
    const name    = userProfile.displayName || currentUser.displayName || currentUser.email.split('@')[0];
    const initial = name.charAt(0).toUpperCase();
    sec.innerHTML = `
    <span class="mob-auth-label">${t('mobAs')}</span>
    <div class="mob-auth-user">
      <div class="mob-auth-chip">
        <div class="mob-auth-av">${initial}</div>
        <div class="mob-auth-info">
          <span>${t('hello')}</span>
          <span>${name}</span>
        </div>
      </div>
      <a class="mob-auth-link" href="payment.html">
        <i class="fas fa-boxes"></i> ${t('mobOrders')}
      </a>
      <button class="mob-auth-link red" onclick="authLogout()">
        <i class="fas fa-sign-out-alt"></i> ${t('mobOut')}
      </button>
    </div>`;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function authOpenModal() {
  modalOpen = true; isRegMode = false;
  syncModalUI();
  document.getElementById('auth-modal-bg').classList.add('open');
  setTimeout(() => document.getElementById('auth-email-input')?.focus(), 230);
}
function authCloseModal() {
  modalOpen = false;
  document.getElementById('auth-modal-bg').classList.remove('open');
  document.getElementById('auth-error').style.display = 'none';
  ['auth-email-input','auth-pass-input','auth-name-input','auth-phone-input'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
}
function authToggleMode() { isRegMode = !isRegMode; syncModalUI(); document.getElementById('auth-error').style.display = 'none'; }

function syncModalUI() {
  document.getElementById('auth-m-title').textContent    = t(isRegMode ? 'regTitle'   : 'loginTitle');
  document.getElementById('auth-m-sub').textContent      = t(isRegMode ? 'regSub'     : 'loginSub');
  document.getElementById('auth-submit-btn').textContent = t(isRegMode ? 'regBtn'     : 'loginBtn');
  document.getElementById('auth-switch-text').textContent= t(isRegMode ? 'hasAcc'     : 'noAcc');
  document.getElementById('auth-switch-link').textContent= t(isRegMode ? 'toLogin'    : 'toReg');
  document.getElementById('auth-lbl-name').textContent   = t('lName');
  document.getElementById('auth-lbl-email').textContent  = t('lEmail');
  document.getElementById('auth-lbl-pass').textContent   = t('lPass');
  document.getElementById('auth-lbl-phone').textContent  = t('lPhone');
  document.getElementById('auth-name-field').style.display  = isRegMode ? 'block' : 'none';
  document.getElementById('auth-phone-field').style.display = isRegMode ? 'block' : 'none';
  document.getElementById('auth-submit-btn').disabled = false;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DROPDOWN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function authToggleDropdown() {
  document.getElementById('auth-dropdown')?.classList.toggle('open');
}
document.addEventListener('click', e => {
  const pill = document.getElementById('auth-user-pill');
  if (pill && !pill.contains(e.target)) document.getElementById('auth-dropdown')?.classList.remove('open');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTH ACTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function authSubmit() {
  if (!_auth) return;
  const email = document.getElementById('auth-email-input').value.trim();
  const pass  = document.getElementById('auth-pass-input').value;
  const name  = document.getElementById('auth-name-input').value.trim();
  const phone = document.getElementById('auth-phone-input').value.trim();
  const btn   = document.getElementById('auth-submit-btn');
  const errEl = document.getElementById('auth-error');
  if (!email || !pass) { showAuthErr(t('errGen')); return; }
  if (isRegMode && pass.length < 6) { showAuthErr(t('errWeak')); return; }
  btn.disabled = true; btn.textContent = t(isRegMode ? 'creating' : 'signing');
  errEl.style.display = 'none';
  try {
    if (isRegMode) {
      const cred = await _auth.createUserWithEmailAndPassword(email, pass);
      if (name) await cred.user.updateProfile({ displayName: name });
      if (_db) await _db.collection('users').doc(cred.user.uid).set({
        displayName: name, phone, email, createdAt: new Date().toISOString()
      }, { merge: true });
    } else {
      await _auth.signInWithEmailAndPassword(email, pass);
    }
    authCloseModal();
  } catch(e) {
    const map = {
      'auth/user-not-found':      t('errNoUser'),
      'auth/wrong-password':      t('errPass'),
      'auth/email-already-in-use':t('errInUse'),
      'auth/weak-password':       t('errWeak'),
      'auth/invalid-email':       t('errEmail'),
      'auth/invalid-credential':  t('errPass'),
    };
    showAuthErr(map[e.code] || t('errGen'));
    btn.disabled = false; btn.textContent = t(isRegMode ? 'regBtn' : 'loginBtn');
  }
}
async function authLogout(e) {
  e?.stopPropagation();
  if (_auth) await _auth.signOut();
  localStorage.removeItem('wbp_user');
}
function showAuthErr(msg) {
  const el = document.getElementById('auth-error');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTOFILL ORDER FORM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function tryAutofillForm() {
  if (!currentUser) return;
  setTimeout(() => {
    const nf = document.getElementById('customer-name');
    const ef = document.getElementById('customer-email');
    const pf = document.getElementById('customer-phone');
    if (!nf && !ef) return;
    let filled = false;
    const name = userProfile.displayName || currentUser.displayName || '';
    if (nf && !nf.value && name)               { nf.value = name;                 filled = true; }
    if (ef && !ef.value)                       { ef.value = currentUser.email;     filled = true; }
    if (pf && !pf.value && userProfile.phone)  { pf.value = userProfile.phone;    filled = true; }
    if (filled) {
      const notice = document.getElementById('auth-form-notice');
      if (notice) {
        document.getElementById('auth-form-notice-text').textContent = t('filled');
        notice.classList.add('show');
        setTimeout(() => notice.classList.remove('show'), 3500);
      }
    }
  }, 180);
}
function watchOrderForm() {
  const form = document.getElementById('order-form');
  if (!form) return;
  new MutationObserver(() => {
    if (currentUser && form.classList.contains('active')) tryAutofillForm();
  }).observe(form, { attributes: true, attributeFilter: ['class'] });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RE-RENDER ON LANGUAGE CHANGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function watchLangChange() {
  document.querySelectorAll('.language-option, .language-option-fixed').forEach(el => {
    el.addEventListener('click', () => {
      setTimeout(() => { renderAll(); if (modalOpen) syncModalUI(); }, 60);
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLOBALS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.authOpenModal      = authOpenModal;
window.authCloseModal     = authCloseModal;
window.authToggleMode     = authToggleMode;
window.authSubmit         = authSubmit;
window.authLogout         = authLogout;
window.authToggleDropdown = authToggleDropdown;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BOOT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.addEventListener('DOMContentLoaded', () => {
  injectStyles();
  buildModal();
  buildNavWrap();
  buildMobileSection();
  initAuth();
  watchOrderForm();
  watchLangChange();
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOpen) authCloseModal();
  });
});

})();

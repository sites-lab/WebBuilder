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
    rules:'Regulament', rulesTitle:'Regulament & Condiții',
    rulesSubtitle:'Te rugăm să citești cu atenție înainte de a plasa o comandă',
    editProfile:'Editează Profilul',
    editProfileTitle:'Editează Profilul',
    editProfileSub:'Actualizează informațiile tale de contact',
    epName:'Numele tău', epPhone:'Număr de telefon', epSave:'Salvează',
    epSaving:'Se salvează…', epSaved:'Profil actualizat ✓',
    epPhoneMissing:'📞 Adaugă numărul tău de telefon pentru a fi contactat mai ușor.',
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
    rules:'Rules', rulesTitle:'Terms & Rules',
    rulesSubtitle:'Please read carefully before placing an order',
    editProfile:'Edit Profile',
    editProfileTitle:'Edit Profile',
    editProfileSub:'Update your contact information',
    epName:'Your name', epPhone:'Phone number', epSave:'Save',
    epSaving:'Saving…', epSaved:'Profile updated ✓',
    epPhoneMissing:'📞 Add your phone number so we can reach you easier.',
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
    rules:'Правила', rulesTitle:'Условия и правила',
    rulesSubtitle:'Пожалуйста, прочитайте внимательно перед оформлением заказа',
    editProfile:'Редактировать профиль',
    editProfileTitle:'Редактировать профиль',
    editProfileSub:'Обновите контактную информацию',
    epName:'Ваше имя', epPhone:'Номер телефона', epSave:'Сохранить',
    epSaving:'Сохранение…', epSaved:'Профиль обновлён ✓',
    epPhoneMissing:'📞 Добавьте номер телефона, чтобы с вами было проще связаться.',
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
  // If Firebase SDK not loaded yet, retry in 200ms
  if (typeof firebase === 'undefined' || !firebase.auth) {
    setTimeout(initAuth, 200); return;
  }
  try {
    if (typeof FIREBASE_CONFIG === 'undefined' || FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') return;
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    _auth = firebase.auth();
    _db   = firebase.firestore();
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

  /* ── Guest button ── */
  .auth-btn-guest {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 22px;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white; font-weight: 700; border: none; cursor: pointer;
    font-family: inherit; white-space: nowrap; transition: all .2s;
    box-shadow: 0 2px 10px rgba(59,130,246,.35);
    font-size: clamp(0.68rem, 1.1vw, 0.85rem);
    max-width: 130px; overflow: hidden; text-overflow: ellipsis;
  }
  .auth-btn-guest:hover { opacity:.9; transform:translateY(-1px); }

  /* ── Logged-in pill ── */
  .auth-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px 4px 4px; border-radius: 22px;
    background: rgba(59,130,246,.08); border: 1.5px solid rgba(59,130,246,.25);
    cursor: pointer; transition: background .18s; position: relative;
    max-width: 200px; min-width: 0;
  }
  .auth-pill:hover { background: rgba(59,130,246,.16); }
  .auth-pill-av {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg,#3b82f6,#2563eb);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: .72rem; font-weight: 800;
    box-shadow: 0 0 0 2px rgba(59,130,246,.25);
  }
  .auth-pill-name {
    font-size: clamp(0.65rem, 1.05vw, 0.82rem);
    font-weight: 700; color: #1e293b;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    min-width: 0; flex: 1; max-width: 100px;
  }
  .auth-pill-chev { font-size: .58rem; color: #3b82f6; flex-shrink: 0; }

  /* ── Dropdown ── */
  .auth-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    background: rgba(15,23,42,.97); border-radius: 14px; min-width: 200px;
    box-shadow: 0 16px 48px rgba(0,0,0,.45), 0 0 0 1px rgba(59,130,246,.2);
    border: 1px solid rgba(59,130,246,.2); overflow: hidden;
    display: none; z-index: 2001; backdrop-filter: blur(12px);
  }
  .auth-dropdown.open { display: block; animation: authDrop .16s ease; }
  @keyframes authDrop { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
  .auth-dd-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 16px; font-size: .84rem; font-weight: 600; color: #bfdbfe;
    cursor: pointer; transition: all .15s;
    border: none; background: none; width: 100%; text-align: left;
    font-family: inherit; text-decoration: none;
  }
  .auth-dd-item:hover { background: rgba(59,130,246,.15); color: #e0f2fe; }
  .auth-dd-item.danger { color: #fca5a5; }
  .auth-dd-item.danger:hover { background: rgba(239,68,68,.12); color: #fca5a5; }
  .auth-dd-item i { width: 16px; text-align: center; color: #93c5fd; opacity: .85; }
  .auth-dd-sep { height: 1px; background: rgba(59,130,246,.15); margin: 3px 0; }

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
    background: linear-gradient(135deg,#1d4ed8,#3b82f6);
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
    background: linear-gradient(135deg,#3b82f6,#2563eb);
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

  /* ══ Edit Profile Modal — COSMIC DESIGN ══ */
  #ep-modal-bg {
    position: fixed; inset: 0;
    background: rgba(2,5,30,.72);
    backdrop-filter: blur(10px);
    z-index: 9996;
    display: flex; align-items: center; justify-content: center; padding: 16px;
    opacity: 0; pointer-events: none; transition: opacity .24s;
  }
  #ep-modal-bg.open { opacity: 1; pointer-events: all; }

  .ep-modal {
    background: linear-gradient(160deg,#050b22 0%,#0a1245 45%,#0f1e80 100%);
    border: 1px solid rgba(80,120,255,.22);
    border-radius: 24px; width: 100%; max-width: 430px;
    box-shadow: 0 0 0 1px rgba(60,100,255,.1),
                0 0 60px rgba(20,40,200,.4),
                0 30px 80px rgba(0,0,30,.7);
    overflow: hidden;
    transform: scale(.94) translateY(10px);
    transition: transform .24s cubic-bezier(.4,0,.2,1);
    position: relative;
  }
  #ep-modal-bg.open .ep-modal { transform: scale(1) translateY(0); }

  /* Stars canvas */
  #ep-stars-canvas {
    position: absolute; inset: 0;
    pointer-events: none; z-index: 0;
    border-radius: 24px;
  }
  .ep-modal > *:not(#ep-stars-canvas) { position: relative; z-index: 1; }

  /* Header */
  .ep-modal-head {
    background: linear-gradient(135deg,rgba(10,20,80,.9),rgba(40,10,110,.9));
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(80,120,255,.2);
    padding: 0 24px 20px;
    display: flex; flex-direction: column; align-items: center;
    position: relative;
  }
  .ep-modal-close {
    position: absolute; top: 13px; right: 13px;
    background: rgba(80,120,255,.15);
    border: 1px solid rgba(80,120,255,.28);
    color: #a0c0ff; width: 30px; height: 30px;
    border-radius: 50%; cursor: pointer; font-size: .76rem;
    display: flex; align-items: center; justify-content: center;
    transition: all .18s;
  }
  .ep-modal-close:hover { background: rgba(80,120,255,.32); color: #fff; }

  /* Avatar */
  .ep-av-big {
    width: 68px; height: 68px; border-radius: 50%;
    background: linear-gradient(135deg,rgba(80,120,255,.35),rgba(140,60,255,.35));
    border: 2.5px solid rgba(120,160,255,.5);
    box-shadow: 0 0 0 6px rgba(80,120,255,.12), 0 0 24px rgba(80,120,255,.35);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.7rem; font-weight: 800; color: #e0eaff;
    margin: 24px auto 11px;
    transition: box-shadow .3s;
  }
  .ep-modal-head h3 {
    font-size: 1.05rem; font-weight: 800;
    color: #c8d8ff; margin-bottom: 3px;
  }
  .ep-modal-head p {
    font-size: .77rem; color: rgba(150,180,255,.65); margin: 0;
  }

  /* Body */
  .ep-modal-body {
    padding: 20px 22px 26px;
    max-height: 70vh; overflow-y: auto;
    scrollbar-width: thin; scrollbar-color: rgba(80,120,255,.3) transparent;
  }
  .ep-modal-body::-webkit-scrollbar { width: 3px; }
  .ep-modal-body::-webkit-scrollbar-thumb { background: rgba(80,120,255,.35); border-radius: 3px; }

  /* Section */
  .ep-section { margin-bottom: 22px; }
  .ep-section:last-child { margin-bottom: 0; }
  .ep-section-title {
    font-size: .67rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: .7px; color: rgba(140,175,255,.7);
    margin-bottom: 13px; padding-bottom: 8px;
    border-bottom: 1px solid rgba(60,100,255,.18);
    display: flex; align-items: center; gap: 6px;
  }
  .ep-section-title i { color: #7aa2ff; }

  /* Fields */
  .ep-field { margin-bottom: 11px; }
  .ep-field label {
    display: block; font-size: .68rem; font-weight: 700;
    color: rgba(140,175,255,.65); text-transform: uppercase;
    letter-spacing: .5px; margin-bottom: 5px;
  }
  .ep-field input {
    width: 100%; padding: 10px 14px;
    border: 1.5px solid rgba(60,100,255,.25);
    border-radius: 10px;
    font-family: inherit; font-size: .875rem;
    color: #dce8ff;
    background: rgba(10,20,70,.6);
    backdrop-filter: blur(6px);
    outline: none; transition: border-color .18s, box-shadow .18s;
  }
  .ep-field input::placeholder { color: rgba(140,170,255,.35); }
  .ep-field input:focus {
    border-color: rgba(100,150,255,.65);
    box-shadow: 0 0 0 3px rgba(60,100,255,.15);
  }
  .ep-field input[readonly] {
    background: rgba(8,16,55,.5);
    color: rgba(140,170,255,.45);
    cursor: default;
    border-color: rgba(60,100,255,.12);
  }

  /* Save button */
  .ep-save-btn {
    width: 100%; padding: 11px;
    background: linear-gradient(135deg,#3b4eff,#8b3aff);
    color: white; border: none; border-radius: 11px;
    font-family: inherit; font-size: .9rem; font-weight: 700;
    cursor: pointer; transition: all .18s; margin-top: 4px;
    box-shadow: 0 0 18px rgba(80,80,255,.4);
  }
  .ep-save-btn:hover { opacity: .9; transform: translateY(-1px); box-shadow: 0 0 28px rgba(80,80,255,.6); }
  .ep-save-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }

  /* Password reset button */
  .ep-reset-btn {
    width: 100%; padding: 10px;
    background: rgba(60,80,255,.1);
    color: #a0c0ff;
    border: 1.5px solid rgba(80,120,255,.3);
    border-radius: 10px;
    font-family: inherit; font-size: .875rem; font-weight: 600;
    cursor: pointer; transition: all .18s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .ep-reset-btn:hover {
    background: rgba(60,80,255,.2);
    border-color: rgba(120,160,255,.6);
    color: #c8daff;
  }
  .ep-reset-btn:disabled { opacity: .4; cursor: not-allowed; }

  /* Status messages */
  .ep-msg {
    padding: 9px 13px; border-radius: 9px; font-size: .8rem;
    font-weight: 500; margin-top: 10px; display: none;
  }
  .ep-msg.ok  {
    background: rgba(16,185,129,.12);
    border: 1px solid rgba(16,185,129,.28);
    color: #6ee7b7;
  }
  .ep-msg.err {
    background: rgba(239,68,68,.1);
    border: 1px solid rgba(239,68,68,.25);
    color: #fca5a5;
  }

  /* Phone-missing banner */
  .ep-phone-banner {
    background: rgba(245,158,11,.1);
    border: 1.5px solid rgba(245,158,11,.28);
    border-radius: 9px; padding: 9px 13px; font-size: .8rem;
    color: #fcd34d; margin-bottom: 14px; font-weight: 600; display: none;
  }

  /* ── Rules Modal ── */
  #rules-modal-bg {
    position: fixed; inset: 0; background: rgba(15,23,42,.52);
    backdrop-filter: blur(6px); z-index: 9999;
    display: flex; align-items: center; justify-content: center; padding: 16px;
    opacity: 0; pointer-events: none; transition: opacity .22s;
  }
  #rules-modal-bg.open { opacity:1; pointer-events: all; }
  .rules-modal {
    background: rgba(15,23,42,.98); border-radius: 22px; width: 100%; max-width: 560px;
    max-height: 90vh; display: flex; flex-direction: column;
    box-shadow: 0 30px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(59,130,246,.2); overflow: hidden;
    transform: scale(.95) translateY(8px); transition: transform .22s ease;
    border: 1px solid rgba(59,130,246,.15);
  }
  #rules-modal-bg.open .rules-modal { transform: scale(1) translateY(0); }
  .rules-modal-head {
    background: linear-gradient(135deg,#1d4ed8,#3b82f6);
    padding: 22px 24px 16px; color: white; text-align: center; position: relative; flex-shrink:0;
  }
  .rules-modal-head h3 { font-size: 1.15rem; font-weight: 800; margin-bottom: 3px; color: white; }
  .rules-modal-head p { font-size: .75rem; opacity: .85; margin: 0; color: white; }
  .rules-modal-close {
    position: absolute; top: 12px; right: 12px;
    background: rgba(255,255,255,.18); border: none; color: white;
    width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
    font-size: .76rem; display: flex; align-items: center; justify-content: center;
  }
  .rules-modal-close:hover { background: rgba(255,255,255,.32); }
  .rules-modal-body { padding: 22px 24px; overflow-y: auto; flex:1; scrollbar-width: thin; scrollbar-color: rgba(99,102,241,.3) transparent; }
  .rules-modal-body::-webkit-scrollbar { width: 4px; }
  .rules-modal-body::-webkit-scrollbar-thumb { background: rgba(59,130,246,.3); border-radius: 4px; }
  .rules-section { margin-bottom: 20px; }
  .rules-section:last-child { margin-bottom: 0; }
  .rules-section h4 {
    font-size: .78rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: .6px; color: #93c5fd; margin-bottom: 8px;
    display: flex; align-items: center; gap: 7px;
  }
  .rules-section h4 i { font-size: .8rem; color: #93c5fd; }
  .rules-section p, .rules-section li {
    font-size: .84rem; color: #94a3b8; line-height: 1.6; margin-bottom: 5px;
  }
  .rules-section li strong { color: #e2e8f0; }
  .rules-section ul { padding-left: 18px; margin: 0; }
  .rules-highlight {
    background: rgba(59,130,246,.1);
    border: 1.5px solid rgba(59,130,246,.3);
    border-radius: 12px; padding: 14px 16px; margin-bottom: 16px;
    font-size: .85rem; color: #bfdbfe; line-height: 1.65;
  }
  .rules-highlight strong { color: #93c5fd; }
  .rules-badge-green {
    display: inline-block; background: rgba(16,185,129,.2); color: #6ee7b7;
    font-size: .72rem; font-weight: 700; padding: 2px 8px; border-radius: 20px;
    margin-left: 6px; vertical-align: middle; border: 1px solid rgba(16,185,129,.3);
  }
  .rules-badge-orange {
    display: inline-block; background: rgba(245,158,11,.15); color: #fcd34d;
    font-size: .72rem; font-weight: 700; padding: 2px 8px; border-radius: 20px;
    margin-left: 6px; vertical-align: middle; border: 1px solid rgba(245,158,11,.25);
  }
  .rules-modal-footer {
    padding: 14px 24px; border-top: 1px solid rgba(59,130,246,.15); flex-shrink:0;
    display: flex; justify-content: center; background: rgba(15,23,42,.6);
  }
  .rules-ok-btn {
    padding: 10px 32px;
    background: linear-gradient(135deg,#3b82f6,#2563eb);
    color: white; border: none; border-radius: 10px;
    font-family: inherit; font-size: .9rem; font-weight: 700;
    cursor: pointer; transition: all .18s;
    box-shadow: 0 4px 14px rgba(59,130,246,.35);
  }
  .rules-ok-btn:hover { opacity:.9; transform:translateY(-1px); }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     MOBILE MENU AUTH SECTION
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  .mob-auth-section {
    border-bottom: 1px solid rgba(59,130,246,.2);
    padding: 14px 0 14px; margin-bottom: 4px;
  }
  .mob-auth-label {
    font-size: .63rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1px; color: #94a3b8; padding: 0 20px 8px; display: block;
  }
  .mob-auth-cta {
    display: flex; align-items: center; gap: 13px;
    padding: 12px 20px; background: none; border: none;
    color: #1e293b; font-size: .95rem; font-weight: 800;
    cursor: pointer; font-family: inherit; width: 100%; text-align: left;
    transition: background .14s; border-radius: 10px;
  }
  .mob-auth-cta:hover { background: rgba(59,130,246,.08); }
  .mob-auth-cta-icon {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg,#3b82f6,#2563eb);
    display: flex; align-items: center; justify-content: center;
    font-size: .9rem; color: white;
  }
  .mob-auth-user { padding: 0 16px 6px; }
  .mob-auth-chip {
    display: flex; align-items: center; gap: 10px;
    background: #f0f7ff; border: 1px solid rgba(59,130,246,.2); border-radius: 12px;
    padding: 10px 14px; margin-bottom: 6px;
  }
  .mob-auth-av {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg,#3b82f6,#2563eb);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: .8rem; font-weight: 800;
    box-shadow: 0 0 0 2px rgba(59,130,246,.2);
  }
  .mob-auth-info { flex: 1; min-width: 0; }
  .mob-auth-info span:first-child { display: block; font-size: .62rem; color: #94a3b8; }
  .mob-auth-info span:last-child {
    display: block; font-size: .84rem; font-weight: 700; color: #1e293b;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .mob-auth-link {
    display: flex; align-items: center; gap: 11px;
    padding: 10px 20px; background: none; border: none;
    color: #374151; font-size: .84rem; font-weight: 600;
    cursor: pointer; font-family: inherit; width: 100%;
    text-align: left; transition: all .14s; text-decoration: none;
    border-radius: 10px; border-left: 3px solid transparent;
  }
  .mob-auth-link:hover { color: #1e293b; background: rgba(59,130,246,.08); border-left-color: #3b82f6; }
  .mob-auth-link.red { color: #ef4444; }
  .mob-auth-link.red:hover { color: #dc2626; background: rgba(239,68,68,.07); border-left-color: #ef4444; }
  .mob-auth-link i { width: 16px; text-align: center; font-size: .84rem; color: #3b82f6; }
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
      <button class="auth-modal-close" onclick="authCloseModal()" aria-label="Close"><i class="fas fa-times"></i></button>
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
        <input type="email" id="auth-email-input" autocomplete="email" aria-label="Email address">
      </div>
      <div class="auth-field">
        <label id="auth-lbl-pass"></label>
        <input type="password" id="auth-pass-input" placeholder="••••••••" autocomplete="current-password">
      </div>
      <div class="auth-field" id="auth-phone-field" style="display:none">
        <label id="auth-lbl-phone"></label>
        <input type="tel" id="auth-phone-input" autocomplete="tel">
      </div>
      <button class="auth-submit-btn" id="auth-submit-btn" onclick="authSubmit()" aria-label="Submit form"></button>
      <div class="auth-error" id="auth-error"></div>
      <div class="auth-switch">
        <span id="auth-switch-text"></span>
        <button onclick="authToggleMode()" id="auth-switch-link" aria-label="Toggle between sign in and create account" style="background:none;border:none;color:#3b82f6;cursor:pointer;text-decoration:underline;font-family:inherit;font-size:inherit;padding:0;"></button>
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
// RULES MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const RULES = {
  ro: {
    payment: 'Plată & Proces',
    paymentText: `
      <div class="rules-highlight">
        🔒 <strong>20% avans</strong> — La plasarea comenzii, clientul plătește <strong>20%</strong> din prețul total al site-ului. Această sumă confirmă comanda și acoperă munca inițială de design și dezvoltare.
      </div>
      <ul>
        <li>După achitarea avansului de 20%, echipa noastră începe lucrul la site-ul tău în termen de 24 de ore.</li>
        <li>Când site-ul este gata, îl prezentăm clientului pentru aprobare.</li>
        <li>Dacă site-ul <strong>ÎȚI PLACE</strong><span class="rules-badge-green">✓ Aprobat</span>: plătești restul de <strong>80%</strong>, iar site-ul este publicat online.</li>
        <li>Dacă site-ul <strong>NU ÎȚI PLACE</strong><span class="rules-badge-orange">✗ Respins</span>: avansul de 20% nu se returnează — acesta acoperă munca depusă (design, cod, timp).</li>
      </ul>`,
    delivery: 'Timp de livrare',
    deliveryText: `<ul>
        <li><strong>Basic</strong>: 1 zi lucrătoare</li>
        <li><strong>Standard</strong>: 3–4 zile lucrătoare</li>
        <li><strong>Premium</strong>: 5–7 zile lucrătoare</li>
        <li>Termenele pot varia în funcție de complexitatea proiectului și disponibilitatea informațiilor furnizate de client.</li>
      </ul>`,
    revisions: 'Revizii & Modificări',
    revisionsText: `<ul>
        <li><strong>Basic</strong>: modificări gratuite.</li>
        <li><strong>Standard</strong>: €3 per modificare.</li>
        <li><strong>Premium</strong>: €7 per modificare.</li>
        <li>O „modificare" înseamnă o schimbare de conținut (text, imagine, culoare). Schimbările structurale majore pot conta ca modificări multiple.</li>
      </ul>`,
    content: 'Conținut & Materiale',
    contentText: `<ul>
        <li>Clientul este responsabil de furnizarea textelor, imaginilor și logo-ului în timp util.</li>
        <li>Dacă nu sunt furnizate materiale, vom folosi conținut demonstrativ (placeholder) care poate fi înlocuit ulterior.</li>
        <li>Toate materialele furnizate trebuie să fie deținute sau licențiate de client.</li>
      </ul>`,
    domain: 'Domeniu & Hosting',
    domainText: `<ul>
        <li>Hosting-ul (€4/lună) este opțional și poate fi achiziționat separat.</li>
        <li>Domeniul poate fi cumpărat de client direct de la <strong>GoDaddy</strong> sau <strong>Namecheap</strong>, sau prețul va fi comunicat la comandă.</li>
        <li>Publicarea site-ului se face după achitarea integrală (100%) a sumei.</li>
      </ul>`,
    general: 'Reguli Generale',
    generalText: `<ul>
        <li>Prin plasarea unei comenzi, clientul acceptă toți termenii și condițiile prezentate.</li>
        <li>WebBuilder își rezervă dreptul de a refuza proiecte cu conținut ilegal, ofensator sau care încalcă drepturile altor persoane.</li>
        <li>Comunicarea se face prin email, WhatsApp sau prin sistemul de chat din platformă.</li>
        <li>Orice litigiu se va rezolva pe cale amiabilă.</li>
      </ul>`,
    ok: 'Am înțeles',
  },
  en: {
    payment: 'Payment & Process',
    paymentText: `
      <div class="rules-highlight">
        🔒 <strong>20% upfront deposit</strong> — When placing an order, the client pays <strong>20%</strong> of the total website price. This confirms the order and covers the initial design and development work.
      </div>
      <ul>
        <li>After the 20% deposit is paid, our team begins working on your website within 24 hours.</li>
        <li>Once the website is ready, we present it to the client for review.</li>
        <li>If you <strong>LIKE the site</strong><span class="rules-badge-green">✓ Approved</span>: you pay the remaining <strong>80%</strong> and the site goes live.</li>
        <li>If you <strong>DON'T LIKE the site</strong><span class="rules-badge-orange">✗ Declined</span>: the 20% deposit is non-refundable — it covers the work done (design, code, time).</li>
      </ul>`,
    delivery: 'Delivery Time',
    deliveryText: `<ul>
        <li><strong>Basic</strong>: 1 working day</li>
        <li><strong>Standard</strong>: 3–4 working days</li>
        <li><strong>Premium</strong>: 5–7 working days</li>
        <li>Timelines may vary depending on project complexity and how quickly the client provides content.</li>
      </ul>`,
    revisions: 'Revisions & Changes',
    revisionsText: `<ul>
        <li><strong>Basic</strong>: free changes.</li>
        <li><strong>Standard</strong>: €3 per change.</li>
        <li><strong>Premium</strong>: €7 per change.</li>
        <li>A "change" means one content update (text, image, color). Major structural changes may count as multiple changes.</li>
      </ul>`,
    content: 'Content & Materials',
    contentText: `<ul>
        <li>The client is responsible for providing texts, images, and logo in a timely manner.</li>
        <li>If no materials are provided, we will use placeholder content that can be replaced later.</li>
        <li>All materials provided must be owned or properly licensed by the client.</li>
      </ul>`,
    domain: 'Domain & Hosting',
    domainText: `<ul>
        <li>Hosting (€4/month) is optional and can be purchased separately.</li>
        <li>The domain can be bought by the client directly from <strong>GoDaddy</strong> or <strong>Namecheap</strong>, or the price will be confirmed at the time of order.</li>
        <li>The site is published only after full payment (100%) is received.</li>
      </ul>`,
    general: 'General Rules',
    generalText: `<ul>
        <li>By placing an order, the client agrees to all terms and conditions presented here.</li>
        <li>WebBuilder reserves the right to decline projects with illegal, offensive, or rights-infringing content.</li>
        <li>Communication takes place via email, WhatsApp, or the platform chat system.</li>
        <li>Any disputes will be resolved amicably.</li>
      </ul>`,
    ok: 'Got it',
  },
  ru: {
    payment: 'Оплата и процесс',
    paymentText: `
      <div class="rules-highlight">
        🔒 <strong>Предоплата 20%</strong> — При размещении заказа клиент оплачивает <strong>20%</strong> от общей стоимости сайта. Это подтверждает заказ и покрывает начальные работы по дизайну и разработке.
      </div>
      <ul>
        <li>После оплаты 20% наша команда приступает к работе над вашим сайтом в течение 24 часов.</li>
        <li>Когда сайт готов, мы показываем его клиенту для утверждения.</li>
        <li>Если сайт <strong>ПОНРАВИЛСЯ</strong><span class="rules-badge-green">✓ Принято</span>: вы оплачиваете оставшиеся <strong>80%</strong>, и сайт публикуется.</li>
        <li>Если сайт <strong>НЕ ПОНРАВИЛСЯ</strong><span class="rules-badge-orange">✗ Отклонено</span>: предоплата 20% не возвращается — она покрывает выполненную работу (дизайн, код, время).</li>
      </ul>`,
    delivery: 'Сроки доставки',
    deliveryText: `<ul>
        <li><strong>Basic</strong>: 1 рабочий день</li>
        <li><strong>Standard</strong>: 3–4 рабочих дня</li>
        <li><strong>Premium</strong>: 5–7 рабочих дней</li>
        <li>Сроки могут варьироваться в зависимости от сложности проекта и скорости предоставления материалов клиентом.</li>
      </ul>`,
    revisions: 'Правки и изменения',
    revisionsText: `<ul>
        <li><strong>Basic</strong>: бесплатные изменения.</li>
        <li><strong>Standard</strong>: €3 за изменение.</li>
        <li><strong>Premium</strong>: €7 за изменение.</li>
        <li>«Изменение» — это одно обновление контента (текст, изображение, цвет). Крупные структурные изменения могут считаться несколькими.</li>
      </ul>`,
    content: 'Контент и материалы',
    contentText: `<ul>
        <li>Клиент несёт ответственность за своевременное предоставление текстов, изображений и логотипа.</li>
        <li>Если материалы не предоставлены, мы используем демонстрационный контент, который можно заменить позже.</li>
        <li>Все предоставленные материалы должны принадлежать клиенту или быть правильно лицензированы.</li>
      </ul>`,
    domain: 'Домен и хостинг',
    domainText: `<ul>
        <li>Хостинг (€4/месяц) не обязателен и может быть приобретён отдельно.</li>
        <li>Домен клиент может купить самостоятельно на <strong>GoDaddy</strong> или <strong>Namecheap</strong>, или цена будет уточнена при оформлении заказа.</li>
        <li>Сайт публикуется только после полной оплаты (100%).</li>
      </ul>`,
    general: 'Общие правила',
    generalText: `<ul>
        <li>Размещая заказ, клиент соглашается со всеми представленными условиями.</li>
        <li>WebBuilder оставляет за собой право отказать в проектах с незаконным, оскорбительным или нарушающим права содержимым.</li>
        <li>Общение ведётся по email, WhatsApp или через систему чата платформы.</li>
        <li>Все споры решаются в досудебном порядке.</li>
      </ul>`,
    ok: 'Понятно',
  }
};

function getRulesLang() {
  const lang = localStorage.getItem('preferred-language') || 'en';
  return RULES[lang] || RULES.en;
}

function buildRulesModal() {
  if (document.getElementById('rules-modal-bg')) return;
  const bg = document.createElement('div');
  bg.id = 'rules-modal-bg';
  bg.innerHTML = `
  <div class="rules-modal">
    <div class="rules-modal-head">
      <button class="rules-modal-close" onclick="authCloseRules()" aria-label="Close rules"><i class="fas fa-times"></i></button>
      <h3 id="rules-title"></h3>
      <p id="rules-subtitle"></p>
    </div>
    <div class="rules-modal-body" id="rules-body"></div>
    <div class="rules-modal-footer">
      <button class="rules-ok-btn" onclick="authCloseRules()" id="rules-ok-btn">Got it</button>
    </div>
  </div>`;
  document.body.appendChild(bg);
  bg.addEventListener('click', e => { if (e.target === bg) authCloseRules(); });
}

function renderRulesContent() {
  const r = getRulesLang();
  document.getElementById('rules-title').textContent = r.payment ? t('rulesTitle') : 'Terms & Rules';
  document.getElementById('rules-subtitle').textContent = t('rulesSubtitle') || 'Please read carefully';
  document.getElementById('rules-ok-btn').textContent = r.ok;
  document.getElementById('rules-body').innerHTML = `
    <div class="rules-section">
      <h4><i class="fas fa-credit-card"></i> ${r.payment}</h4>
      ${r.paymentText}
    </div>
    <div class="rules-section">
      <h4><i class="fas fa-clock"></i> ${r.delivery}</h4>
      ${r.deliveryText}
    </div>
    <div class="rules-section">
      <h4><i class="fas fa-edit"></i> ${r.revisions}</h4>
      ${r.revisionsText}
    </div>
    <div class="rules-section">
      <h4><i class="fas fa-images"></i> ${r.content}</h4>
      ${r.contentText}
    </div>
    <div class="rules-section">
      <h4><i class="fas fa-globe"></i> ${r.domain}</h4>
      ${r.domainText}
    </div>
    <div class="rules-section">
      <h4><i class="fas fa-balance-scale"></i> ${r.general}</h4>
      ${r.generalText}
    </div>`;
}

function authOpenRules(e) {
  e?.stopPropagation();
  // close user dropdown if open
  document.getElementById('auth-dropdown')?.classList.remove('open');
  renderRulesContent();
  document.getElementById('rules-modal-bg').classList.add('open');
}
function authCloseRules() {
  document.getElementById('rules-modal-bg')?.classList.remove('open');
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
  // Try inserting before mobile-nav-links (most reliable anchor)
  const navLinks = document.querySelector('.mobile-nav-links');
  const menuContent = document.querySelector('.mobile-menu-content');
  if (!navLinks && !menuContent) return;
  const sec = document.createElement('div');
  sec.id = 'mob-auth-section';
  sec.className = 'mob-auth-section';
  if (navLinks) {
    navLinks.parentNode.insertBefore(sec, navLinks);
  } else {
    // fallback: prepend inside menu content
    menuContent.insertBefore(sec, menuContent.firstChild);
  }
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
      <span class="auth-pill-name">${name}</span>
      <i class="fas fa-chevron-down auth-pill-chev"></i>
      <div class="auth-dropdown" id="auth-dropdown">
        <a class="auth-dd-item" href="orders.html">
          <i class="fas fa-boxes"></i> ${t('myOrders')}
        </a>
        <button class="auth-dd-item" onclick="authOpenEditProfile(event)">
          <i class="fas fa-user-edit"></i> ${t('editProfile')}${!userProfile.phone ? ' <span style="display:inline-block;width:7px;height:7px;background:#f59e0b;border-radius:50%;margin-left:4px;vertical-align:middle;"></span>' : ''}
        </button>
        <button class="auth-dd-item" onclick="authOpenRules(event)">
          <i class="fas fa-file-alt"></i> ${t('rules')}
        </button>
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
          <span>${t('mobAs')}</span>
          <span>${name}</span>
        </div>
      </div>
      <a class="mob-auth-link" href="orders.html">
        <i class="fas fa-boxes"></i> ${t('mobOrders')}
      </a>
      <button class="mob-auth-link" onclick="authOpenEditProfile()">
        <i class="fas fa-user-edit"></i> ${t('editProfile')}${!userProfile.phone ? ' <span style="display:inline-block;width:7px;height:7px;background:#f59e0b;border-radius:50%;margin-left:4px;vertical-align:middle;"></span>' : ''}
      </button>
      <button class="mob-auth-link" onclick="authOpenRules()">
        <i class="fas fa-file-alt"></i> ${t('rules')}
      </button>
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
  // Firebase not ready yet — init and retry once
  if (!_auth) {
    initAuth();
    const btn = document.getElementById('auth-submit-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Connecting…'; }
    setTimeout(() => {
      if (btn) { btn.disabled = false; btn.textContent = t(isRegMode ? 'regBtn' : 'loginBtn'); }
      authSubmit();
    }, 600);
    return;
  }
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
// EDIT PROFILE MODAL  (full card: name, phone, email, password reset)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildEditProfileModal() {
  if (document.getElementById('ep-modal-bg')) return;
  const bg = document.createElement('div');
  bg.id = 'ep-modal-bg';
  bg.innerHTML = `
  <div class="ep-modal">
    <canvas id="ep-stars-canvas"></canvas>
    <div class="ep-modal-head">
      <button class="ep-modal-close" onclick="authCloseEditProfile()"><i class="fas fa-times"></i></button>
      <div class="ep-av-big" id="ep-av-big">?</div>
      <h3 id="ep-head-name"></h3>
      <p  id="ep-head-email"></p>
    </div>
    <div class="ep-modal-body">

      <!-- Phone-missing banner -->
      <div class="ep-phone-banner" id="ep-phone-banner"></div>

      <!-- Personal info section -->
      <div class="ep-section">
        <div class="ep-section-title"><i class="fas fa-user"></i> Personal Information</div>
        <div class="ep-field">
          <label id="ep-lbl-name"></label>
          <input type="text" id="ep-name-input" autocomplete="name">
        </div>
        <div class="ep-field">
          <label id="ep-lbl-phone"></label>
          <input type="tel" id="ep-phone-input" autocomplete="tel" placeholder="+40 7xx xxx xxx">
        </div>
        <div class="ep-field">
          <label>Email</label>
          <input type="email" id="ep-email-ro" readonly>
        </div>
        <button class="ep-save-btn" id="ep-save-btn" onclick="authSaveProfile()"></button>
        <div class="ep-msg" id="ep-save-msg"></div>
      </div>

      <!-- Password reset section -->
      <div class="ep-section">
        <div class="ep-section-title"><i class="fas fa-lock"></i> Password</div>
        <p style="font-size:.82rem;color:rgba(150,180,255,.55);margin-bottom:12px;line-height:1.55;">Send a password reset link to your email address.</p>
        <button class="ep-reset-btn" id="ep-reset-btn" onclick="authSendPasswordReset()">
          <i class="fas fa-envelope"></i> Send Password Reset Email
        </button>
        <div class="ep-msg" id="ep-reset-msg"></div>
      </div>

    </div>
  </div>`;
  document.body.appendChild(bg);
  bg.addEventListener('click', e => { if (e.target === bg) authCloseEditProfile(); });
  ['ep-name-input','ep-phone-input'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => { if (e.key === 'Enter') authSaveProfile(); });
  });
  // Init cosmic stars
  _initEpStars();
}

function _initEpStars() {
  const canvas = document.getElementById('ep-stars-canvas');
  if (!canvas) return;
  const modal = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  const stars = Array.from({length: 60}, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.3 + 0.35,
    op: Math.random(),
    d: (Math.random() - 0.5) * 0.013
  }));
  let raf;
  function resize() {
    canvas.width  = modal.offsetWidth;
    canvas.height = modal.offsetHeight;
  }
  resize();
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.op += s.d;
      if (s.op <= 0 || s.op >= 1) s.d *= -1;
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,210,255,${Math.max(0.04, Math.min(1, s.op))})`;
      ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  }
  draw();
  new ResizeObserver(resize).observe(modal);
}

function authOpenEditProfile(e) {
  e?.stopPropagation();
  document.getElementById('auth-dropdown')?.classList.remove('open');
  buildEditProfileModal();

  const name  = userProfile.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || '';
  const phone = userProfile.phone || '';
  const email = currentUser?.email || '';
  const initial = (name || '?').charAt(0).toUpperCase();

  document.getElementById('ep-av-big').textContent     = initial;
  document.getElementById('ep-head-name').textContent  = name || email;
  document.getElementById('ep-head-email').textContent = email;
  document.getElementById('ep-name-input').value       = name;
  document.getElementById('ep-phone-input').value      = phone;
  document.getElementById('ep-email-ro').value         = email;
  document.getElementById('ep-lbl-name').textContent   = t('epName');
  document.getElementById('ep-lbl-phone').textContent  = t('epPhone');
  document.getElementById('ep-save-btn').textContent   = t('epSave');
  document.getElementById('ep-save-btn').disabled      = false;
  document.getElementById('ep-save-btn').style.background = 'linear-gradient(135deg,#3b4eff,#8b3aff)';
  epShowMsg('ep-save-msg',  '', '');
  epShowMsg('ep-reset-msg', '', '');

  // Phone-missing banner
  const banner = document.getElementById('ep-phone-banner');
  if (!phone) { banner.textContent = t('epPhoneMissing'); banner.style.display = 'block'; }
  else          { banner.style.display = 'none'; }

  document.getElementById('ep-modal-bg').classList.add('open');
  setTimeout(() => document.getElementById('ep-name-input')?.focus(), 230);
}

function authCloseEditProfile() {
  document.getElementById('ep-modal-bg')?.classList.remove('open');
}

async function authSaveProfile() {
  if (!currentUser) return;
  const name  = document.getElementById('ep-name-input').value.trim();
  const phone = document.getElementById('ep-phone-input').value.trim();
  const btn   = document.getElementById('ep-save-btn');
  btn.disabled = true;
  btn.textContent = t('epSaving');
  epShowMsg('ep-save-msg', '', '');
  try {
    if (name && _auth?.currentUser) await _auth.currentUser.updateProfile({ displayName: name });
    if (_db) await _db.collection('users').doc(currentUser.uid).set({ displayName: name, phone }, { merge: true });
    userProfile.displayName = name; userProfile.phone = phone;
    const cached = JSON.parse(localStorage.getItem('wbp_user') || '{}');
    cached.displayName = name; cached.phone = phone;
    localStorage.setItem('wbp_user', JSON.stringify(cached));
    renderAll();
    // Update modal header
    const display = name || currentUser.email.split('@')[0];
    document.getElementById('ep-av-big').textContent    = display.charAt(0).toUpperCase();
    document.getElementById('ep-head-name').textContent = display;
    if (phone) { const b = document.getElementById('ep-phone-banner'); if (b) b.style.display = 'none'; }
    epShowMsg('ep-save-msg', t('epSaved'), 'ok');
    btn.textContent = t('epSave');
    btn.disabled = false;
  } catch(err) {
    epShowMsg('ep-save-msg', t('errGen'), 'err');
    btn.disabled = false;
    btn.textContent = t('epSave');
  }
}

async function authSendPasswordReset() {
  if (!_auth || !currentUser) return;
  const btn = document.getElementById('ep-reset-btn');
  btn.disabled = true;
  epShowMsg('ep-reset-msg', '', '');
  try {
    await _auth.sendPasswordResetEmail(currentUser.email);
    epShowMsg('ep-reset-msg', '\u2705 Reset email sent to ' + currentUser.email + '! Check your inbox.', 'ok');
  } catch(err) {
    epShowMsg('ep-reset-msg', '\u274c ' + (err.message || t('errGen')), 'err');
  } finally {
    btn.disabled = false;
  }
}

function epShowMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'ep-msg' + (type ? ' ' + type : '');
  el.style.display = text ? 'block' : 'none';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLOBALS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window._authRenderAll     = renderAll;   // used by dm-chat.js to sync mobile menu after chat login
window.authOpenModal      = authOpenModal;
window.authCloseModal     = authCloseModal;
window.authToggleMode     = authToggleMode;
window.authSubmit         = authSubmit;
window.authLogout         = authLogout;
window.authToggleDropdown = authToggleDropdown;
window.authOpenRules         = authOpenRules;
window.authCloseRules        = authCloseRules;
window.authOpenEditProfile   = authOpenEditProfile;
window.authCloseEditProfile  = authCloseEditProfile;
window.authSaveProfile       = authSaveProfile;
window.authSendPasswordReset = authSendPasswordReset;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BOOT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function boot() {
  injectStyles();
  buildModal();
  buildNavWrap();
  buildMobileSection();
  buildRulesModal();
  renderAll(); // Show guest button immediately — don't wait for Firebase
  initAuth();
  watchOrderForm();
  watchLangChange();
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOpen) authCloseModal();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  // DOM already ready (script loaded late or deferred)
  boot();
}

})();
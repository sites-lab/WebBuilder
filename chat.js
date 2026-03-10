/**
 * WebBuilder Pro — Floating Chat + User Login + Order Tracker
 * Include this script at the bottom of index.html before </body>
 * Requires: firebase-config.js, firebase SDKs already loaded
 */

(function() {
'use strict';

// ═══════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════
const CT = {
    ro: {
        loginTitle: 'Contul Meu',
        loginSub: 'Loghează-te pentru a urmări comanda și a chata cu noi',
        emailPlaceholder: 'Email',
        passPlaceholder: 'Parolă',
        loginBtn: 'Loghează-te',
        registerBtn: 'Creează cont',
        orText: 'sau',
        noAccount: 'Nu ai cont?',
        hasAccount: 'Ai deja cont?',
        loggingIn: 'Se conectează...',
        registering: 'Se creează...',
        chatTitle: 'WebBuilder Pro',
        chatSub: 'De obicei răspundem în câteva ore',
        orderStatus: 'Statusul Comenzii',
        noOrder: 'Nu ai nicio comandă activă',
        noOrderSub: 'Plasează o comandă și urmărește-o aici',
        messagePlaceholder: 'Scrie un mesaj...',
        sendBtn: 'Trimite',
        online: 'Online',
        tabs: { chat: 'Chat', order: 'Comanda Mea' },
        statuses: { pending: '⏳ În așteptare', accepted: '✅ Acceptat', declined: '❌ Refuzat', in_progress: '🔧 În lucru', completed: '🎉 Finalizat', paid: '💰 Plătit' },
        steps: ['Trimisă', 'În analiză', 'Acceptată', 'Finalizată'],
        logout: 'Deconectare',
        hello: 'Salut',
        noMessages: 'Niciun mesaj încă',
        noMessagesSub: 'Trimite un mesaj și îți vom răspunde în curând!',
        welcomeMsg: 'Bună! 👋 Cu ce te putem ajuta astăzi?',
        registerSuccess: 'Cont creat! Bine ai venit!',
        emailInUse: 'Acest email este deja folosit.',
        wrongPass: 'Parolă incorectă.',
        noUser: 'Nu există cont cu acest email.',
        weakPass: 'Parola trebuie să aibă cel puțin 6 caractere.',
        invalidEmail: 'Email invalid.',
        error: 'Eroare. Încearcă din nou.',
    },
    en: {
        loginTitle: 'My Account',
        loginSub: 'Sign in to track your order and chat with us',
        emailPlaceholder: 'Email',
        passPlaceholder: 'Password',
        loginBtn: 'Sign In',
        registerBtn: 'Create Account',
        orText: 'or',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        loggingIn: 'Signing in...',
        registering: 'Creating...',
        chatTitle: 'WebBuilder Pro',
        chatSub: 'We usually reply within a few hours',
        orderStatus: 'Order Status',
        noOrder: 'No active order',
        noOrderSub: 'Place an order and track it here',
        messagePlaceholder: 'Type a message...',
        sendBtn: 'Send',
        online: 'Online',
        tabs: { chat: 'Chat', order: 'My Order' },
        statuses: { pending: '⏳ Pending', accepted: '✅ Accepted', declined: '❌ Declined', in_progress: '🔧 In Progress', completed: '🎉 Completed', paid: '💰 Paid' },
        steps: ['Submitted', 'Under Review', 'Accepted', 'Completed'],
        logout: 'Sign Out',
        hello: 'Hello',
        noMessages: 'No messages yet',
        noMessagesSub: 'Send us a message and we\'ll reply soon!',
        welcomeMsg: 'Hi there! 👋 How can we help you today?',
        registerSuccess: 'Account created! Welcome!',
        emailInUse: 'This email is already in use.',
        wrongPass: 'Incorrect password.',
        noUser: 'No account found with this email.',
        weakPass: 'Password must be at least 6 characters.',
        invalidEmail: 'Invalid email address.',
        error: 'Error. Please try again.',
    },
    ru: {
        loginTitle: 'Мой Аккаунт',
        loginSub: 'Войдите, чтобы отслеживать заказ и общаться с нами',
        emailPlaceholder: 'Email',
        passPlaceholder: 'Пароль',
        loginBtn: 'Войти',
        registerBtn: 'Создать аккаунт',
        orText: 'или',
        noAccount: 'Нет аккаунта?',
        hasAccount: 'Уже есть аккаунт?',
        loggingIn: 'Вход...',
        registering: 'Создание...',
        chatTitle: 'WebBuilder Pro',
        chatSub: 'Обычно отвечаем в течение нескольких часов',
        orderStatus: 'Статус Заказа',
        noOrder: 'Нет активного заказа',
        noOrderSub: 'Разместите заказ и отслеживайте его здесь',
        messagePlaceholder: 'Напишите сообщение...',
        sendBtn: 'Отправить',
        online: 'Онлайн',
        tabs: { chat: 'Чат', order: 'Мой Заказ' },
        statuses: { pending: '⏳ Ожидание', accepted: '✅ Принят', declined: '❌ Отклонён', in_progress: '🔧 В работе', completed: '🎉 Завершён', paid: '💰 Оплачен' },
        steps: ['Отправлен', 'На рассмотрении', 'Принят', 'Завершён'],
        logout: 'Выйти',
        hello: 'Привет',
        noMessages: 'Сообщений пока нет',
        noMessagesSub: 'Напишите нам и мы скоро ответим!',
        welcomeMsg: 'Привет! 👋 Чем можем помочь?',
        registerSuccess: 'Аккаунт создан! Добро пожаловать!',
        emailInUse: 'Этот email уже используется.',
        wrongPass: 'Неверный пароль.',
        noUser: 'Аккаунт с таким email не найден.',
        weakPass: 'Пароль должен содержать не менее 6 символов.',
        invalidEmail: 'Неверный email.',
        error: 'Ошибка. Попробуйте снова.',
    }
};

function t(key) {
    const lang = localStorage.getItem('preferred-language') || 'en';
    const l = CT[lang] || CT.en;
    return key.split('.').reduce((o, k) => o?.[k], l) || key;
}

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════
let _db = null, _auth = null;
let currentUser = null;
let userOrder = null;
let orderUnsubscribe = null;
let isOpen = false;
let activeTab = 'chat';
let isRegisterMode = false;

// ═══════════════════════════════════════════
// FIREBASE INIT
// ═══════════════════════════════════════════
function initFirebase() {
    try {
        if (typeof FIREBASE_CONFIG === 'undefined' || FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') return;
        // App may already be initialized by index.html
        const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(FIREBASE_CONFIG);
        _db = firebase.firestore();
        _auth = firebase.auth();

        _auth.onAuthStateChanged(user => {
            currentUser = user;
            if (user) {
                onUserLoggedIn(user);
            } else {
                onUserLoggedOut();
            }
            updateBubble();
        });
    } catch(e) { console.warn('Chat Firebase init:', e); }
}

// ═══════════════════════════════════════════
// AUTH ACTIONS
// ═══════════════════════════════════════════
async function doLogin() {
    const email = document.getElementById('wbp-email').value.trim();
    const pass = document.getElementById('wbp-pass').value;
    const btn = document.getElementById('wbp-login-btn');
    const err = document.getElementById('wbp-auth-err');
    if (!email || !pass) { showAuthError(t('error')); return; }
    btn.disabled = true;
    btn.textContent = t('loggingIn');
    err.style.display = 'none';
    try {
        await _auth.signInWithEmailAndPassword(email, pass);
    } catch(e) {
        const msgs = { 'auth/user-not-found': t('noUser'), 'auth/wrong-password': t('wrongPass'), 'auth/invalid-email': t('invalidEmail'), 'auth/invalid-credential': t('wrongPass') };
        showAuthError(msgs[e.code] || t('error'));
        btn.disabled = false;
        btn.textContent = t('loginBtn');
    }
}

async function doRegister() {
    const email = document.getElementById('wbp-email').value.trim();
    const pass = document.getElementById('wbp-pass').value;
    const btn = document.getElementById('wbp-login-btn');
    const err = document.getElementById('wbp-auth-err');
    if (!email || !pass) { showAuthError(t('error')); return; }
    if (pass.length < 6) { showAuthError(t('weakPass')); return; }
    btn.disabled = true;
    btn.textContent = t('registering');
    err.style.display = 'none';
    try {
        await _auth.createUserWithEmailAndPassword(email, pass);
    } catch(e) {
        const msgs = { 'auth/email-already-in-use': t('emailInUse'), 'auth/weak-password': t('weakPass'), 'auth/invalid-email': t('invalidEmail') };
        showAuthError(msgs[e.code] || t('error'));
        btn.disabled = false;
        btn.textContent = t('registerBtn');
    }
}

async function doLogout() {
    if (_auth) await _auth.signOut();
}

async function doResetPassword() {
    const email = document.getElementById('wbp-email').value.trim();
    const err = document.getElementById('wbp-auth-err');
    const ok = document.getElementById('wbp-reset-ok');
    if (!email) { showAuthError(t('invalidEmail')); return; }
    if (!_auth) { showAuthError(t('error')); return; }
    err.style.display = 'none';
    if (ok) ok.style.display = 'none';
    try {
        await _auth.sendPasswordResetEmail(email);
        if (ok) ok.style.display = 'block';
    } catch(e) {
        showAuthError(t('error'));
    }
}

function showAuthError(msg) {
    const el = document.getElementById('wbp-auth-err');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
}

// ═══════════════════════════════════════════
// ON LOGIN / LOGOUT
// ═══════════════════════════════════════════
function onUserLoggedIn(user) {
    renderChatPanel();
    listenForUserOrder(user.email);
}

function onUserLoggedOut() {
    if (orderUnsubscribe) { orderUnsubscribe(); orderUnsubscribe = null; }
    userOrder = null;
    renderChatPanel();
}

function listenForUserOrder(email) {
    if (!_db || !email) return;
    if (orderUnsubscribe) orderUnsubscribe();
    orderUnsubscribe = _db.collection('orders')
        .where('customer_email', '==', email)
        .orderBy('timestamp', 'desc')
        .limit(1)
        .onSnapshot(snap => {
            userOrder = snap.empty ? null : { _id: snap.docs[0].id, ...snap.docs[0].data() };
            refreshPanelContent();
        });
}

// ═══════════════════════════════════════════
// BUILD UI
// ═══════════════════════════════════════════
function buildUI() {
    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
        #wbp-bubble {
            position: fixed; bottom: 28px; right: 28px; z-index: 9990;
            width: 60px; height: 60px; border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border: none; cursor: pointer; box-shadow: 0 8px 32px rgba(59,130,246,0.45);
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 1.4rem; transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
            animation: wbp-float 3s ease-in-out infinite;
        }
        #wbp-bubble:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(59,130,246,0.55); }
        #wbp-bubble.open { animation: none; transform: rotate(45deg) scale(1.05); }
        @keyframes wbp-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        #wbp-notif {
            position: absolute; top: -4px; right: -4px;
            width: 20px; height: 20px; background: #ef4444; border-radius: 50%;
            border: 2px solid white; display: none; align-items: center; justify-content: center;
            font-size: 0.65rem; font-weight: 800; color: white;
        }
        #wbp-notif.show { display: flex; }
        #wbp-panel {
            position: fixed; bottom: 100px; right: 28px; z-index: 9989;
            width: 370px; max-height: 600px;
            background: white; border-radius: 22px;
            box-shadow: 0 24px 80px rgba(0,0,0,0.22);
            display: flex; flex-direction: column; overflow: hidden;
            transform: scale(0.85) translateY(20px); opacity: 0;
            pointer-events: none; transform-origin: bottom right;
            transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        #wbp-panel.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
        .wbp-head {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            padding: 18px 20px; color: white; flex-shrink: 0;
        }
        .wbp-head-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .wbp-head-top h3 { font-size: 1rem; font-weight: 800; margin: 0; }
        .wbp-close { background: rgba(255,255,255,0.2); border: none; color: white; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .wbp-close:hover { background: rgba(255,255,255,0.35); }
        .wbp-head-sub { font-size: 0.78rem; opacity: 0.85; display: flex; align-items: center; gap: 6px; }
        .wbp-online-dot { width: 7px; height: 7px; background: #4ade80; border-radius: 50%; animation: wbp-pulse 2s infinite; }
        @keyframes wbp-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .wbp-user-info { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; background: rgba(255,255,255,0.15); padding: 8px 12px; border-radius: 10px; }
        .wbp-user-name { font-size: 0.82rem; font-weight: 600; }
        .wbp-logout-btn { background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 10px; border-radius: 6px; font-size: 0.72rem; cursor: pointer; font-family: inherit; transition: background 0.2s; }
        .wbp-logout-btn:hover { background: rgba(255,255,255,0.35); }
        .wbp-tabs { display: flex; background: white; border-bottom: 2px solid #f1f5f9; flex-shrink: 0; }
        .wbp-tab { flex: 1; padding: 12px; text-align: center; font-size: 0.82rem; font-weight: 600; color: #64748b; cursor: pointer; border: none; background: none; transition: all 0.2s; font-family: inherit; border-bottom: 2px solid transparent; margin-bottom: -2px; }
        .wbp-tab.active { color: #3b82f6; border-bottom-color: #3b82f6; }
        .wbp-tab:hover { color: #1e293b; background: #f8fafc; }
        .wbp-body { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
        .wbp-screen { display: none; flex-direction: column; height: 100%; }
        .wbp-screen.active { display: flex; }

        /* AUTH SCREEN */
        .wbp-auth { padding: 24px 22px; overflow-y: auto; }
        .wbp-auth h4 { font-size: 1rem; font-weight: 800; margin-bottom: 4px; color: #1e293b; }
        .wbp-auth p { font-size: 0.8rem; color: #64748b; margin-bottom: 18px; }
        .wbp-field { margin-bottom: 12px; }
        .wbp-field input { width: 100%; padding: 11px 14px; border: 2px solid #e2e8f0; border-radius: 10px; font-family: inherit; font-size: 0.875rem; color: #1e293b; outline: none; transition: border-color 0.2s; }
        .wbp-field input:focus { border-color: #3b82f6; }
        .wbp-auth-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border: none; border-radius: 10px; font-family: inherit; font-size: 0.9rem; font-weight: 700; cursor: pointer; margin-top: 4px; transition: all 0.2s; }
        .wbp-auth-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .wbp-auth-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .wbp-auth-err { background: #fee2e2; color: #7f1d1d; padding: 9px 12px; border-radius: 8px; font-size: 0.8rem; margin-top: 10px; display: none; }
        .wbp-switch { text-align: center; margin-top: 14px; font-size: 0.8rem; color: #64748b; }
        .wbp-switch a { color: #3b82f6; font-weight: 600; cursor: pointer; text-decoration: none; }
        .wbp-switch a:hover { text-decoration: underline; }
        .wbp-reset-link { text-align: center; margin-top: 8px; font-size: 0.76rem; color: #94a3b8; }
        .wbp-reset-link a { color: #3b82f6; cursor: pointer; text-decoration: underline; }
        .wbp-reset-ok { background: #ecfdf5; color: #065f46; padding: 8px 12px; border-radius: 8px; font-size: 0.78rem; margin-top: 8px; display: none; text-align: center; }

        /* CHAT SCREEN */
        .wbp-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
        .wbp-messages::-webkit-scrollbar { width: 4px; }
        .wbp-messages::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .wbp-no-msg { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #94a3b8; padding: 20px; text-align: center; }
        .wbp-no-msg i { font-size: 2rem; opacity: 0.4; }
        .wbp-no-msg p { font-size: 0.82rem; margin: 0; }
        .wbp-msg { display: flex; gap: 8px; align-items: flex-end; }
        .wbp-msg.mine { flex-direction: row-reverse; }
        .wbp-msg-av { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; color: white; flex-shrink: 0; }
        .wbp-msg.theirs .wbp-msg-av { background: linear-gradient(135deg, #3b82f6, #8b5cf6); }
        .wbp-msg.mine .wbp-msg-av { background: linear-gradient(135deg, #10b981, #059669); }
        .wbp-msg-bub { max-width: 78%; padding: 9px 13px; border-radius: 14px; font-size: 0.84rem; line-height: 1.5; }
        .wbp-msg.theirs .wbp-msg-bub { background: #f1f5f9; color: #1e293b; border-bottom-left-radius: 4px; }
        .wbp-msg.mine .wbp-msg-bub { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-bottom-right-radius: 4px; }
        .wbp-msg-time { font-size: 0.68rem; opacity: 0.55; margin-top: 3px; display: block; }
        .wbp-msg.mine .wbp-msg-time { text-align: right; }
        .wbp-input-row { display: flex; gap: 9px; padding: 12px 14px; border-top: 2px solid #f1f5f9; flex-shrink: 0; }
        .wbp-input { flex: 1; padding: 10px 14px; border: 2px solid #e2e8f0; border-radius: 10px; font-family: inherit; font-size: 0.875rem; color: #1e293b; outline: none; transition: border-color 0.2s; }
        .wbp-input:focus { border-color: #3b82f6; }
        .wbp-send { width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border: none; border-radius: 10px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; transition: all 0.2s; }
        .wbp-send:hover { opacity: 0.9; transform: scale(1.05); }
        .wbp-send:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* ORDER SCREEN */
        .wbp-order-body { flex: 1; overflow-y: auto; padding: 18px; }
        .wbp-no-order { text-align: center; padding: 30px 16px; color: #94a3b8; }
        .wbp-no-order i { font-size: 2.5rem; opacity: 0.3; display: block; margin-bottom: 10px; }
        .wbp-no-order h4 { font-size: 0.95rem; font-weight: 700; color: #64748b; margin-bottom: 6px; }
        .wbp-no-order p { font-size: 0.8rem; margin: 0; }
        .wbp-order-card { background: #f8fafc; border-radius: 14px; padding: 16px; margin-bottom: 14px; border: 1px solid #e2e8f0; }
        .wbp-order-id { font-family: monospace; font-size: 0.78rem; font-weight: 700; color: #3b82f6; background: #eff6ff; padding: 3px 8px; border-radius: 5px; display: inline-block; margin-bottom: 10px; }
        .wbp-order-row { display: flex; justify-content: space-between; font-size: 0.82rem; padding: 4px 0; }
        .wbp-order-row .wl { color: #64748b; }
        .wbp-order-row .wr { font-weight: 600; color: #1e293b; }
        .wbp-status-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 0.76rem; font-weight: 700; margin: 8px 0; }
        .wbs-pending { background: #fffbeb; color: #92400e; }
        .wbs-accepted,.wbs-paid,.wbs-completed { background: #ecfdf5; color: #065f46; }
        .wbs-declined { background: #fee2e2; color: #7f1d1d; }
        .wbs-in_progress { background: #eff6ff; color: #1e40af; }
        .wbp-tracker { margin-top: 14px; }
        .wbp-tracker-title { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 12px; }
        .wbp-steps { display: flex; align-items: center; gap: 0; }
        .wbp-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
        .wbp-step:not(:last-child)::after { content: ''; position: absolute; top: 13px; left: 50%; width: 100%; height: 2px; background: #e2e8f0; z-index: 0; }
        .wbp-step.done:not(:last-child)::after { background: #10b981; }
        .wbp-step-dot { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; z-index: 1; flex-shrink: 0; transition: all 0.3s; }
        .wbp-step.done .wbp-step-dot { background: #10b981; color: white; }
        .wbp-step.active .wbp-step-dot { background: linear-gradient(135deg,#3b82f6,#8b5cf6); color: white; box-shadow: 0 0 0 4px rgba(59,130,246,0.2); animation: wbp-pulse 2s infinite; }
        .wbp-step.waiting .wbp-step-dot { background: #f1f5f9; color: #cbd5e1; border: 2px solid #e2e8f0; }
        .wbp-step-label { font-size: 0.62rem; color: #94a3b8; margin-top: 5px; text-align: center; font-weight: 500; }
        .wbp-step.done .wbp-step-label,.wbp-step.active .wbp-step-label { color: #1e293b; font-weight: 600; }
        .wbp-done-banner { background: linear-gradient(135deg,#10b981,#059669); color: white; padding: 14px; border-radius: 12px; text-align: center; margin-top: 14px; }
        .wbp-done-banner i { font-size: 1.5rem; margin-bottom: 6px; display: block; }
        .wbp-done-banner h4 { font-size: 0.9rem; font-weight: 800; margin-bottom: 4px; }
        .wbp-done-banner p { font-size: 0.78rem; opacity: 0.9; margin: 0; }

        @media (max-width: 768px) {
            #wbp-bubble { width: 72px; height: 72px; font-size: 1.65rem; }
        }
        @media (max-width: 420px) {
            #wbp-panel { width: calc(100vw - 24px); right: 12px; bottom: 90px; }
            #wbp-bubble { right: 16px; bottom: 20px; width: 72px; height: 72px; font-size: 1.65rem; }
        }
    `;
    document.head.appendChild(style);

    // Build HTML
    const wrap = document.createElement('div');
    wrap.innerHTML = `
        <!-- Bubble -->
        <button id="wbp-bubble" onclick="wbpToggle()">
            <i class="fas fa-comment-dots" id="wbp-bubble-icon"></i>
            <div id="wbp-notif">0</div>
        </button>

        <!-- Panel -->
        <div id="wbp-panel">
            <!-- Header -->
            <div class="wbp-head">
                <div class="wbp-head-top">
                    <h3 id="wbp-head-title">WebBuilder Pro</h3>
                    <button class="wbp-close" onclick="wbpToggle()"><i class="fas fa-times"></i></button>
                </div>
                <div class="wbp-head-sub">
                    <div class="wbp-online-dot"></div>
                    <span id="wbp-head-sub">Online</span>
                </div>
                <div class="wbp-user-info" id="wbp-user-bar" style="display:none">
                    <span class="wbp-user-name" id="wbp-user-name-display"></span>
                    <button class="wbp-logout-btn" onclick="wbpLogout()">Sign Out</button>
                </div>
            </div>

            <!-- Tabs (only shown when logged in) -->
            <div class="wbp-tabs" id="wbp-tabs" style="display:none">
                <button class="wbp-tab active" id="wbp-tab-chat" onclick="wbpSetTab('chat')">
                    <i class="fas fa-comment"></i> <span id="wbp-tab-chat-label">Chat</span>
                </button>
                <button class="wbp-tab" id="wbp-tab-order" onclick="wbpSetTab('order')">
                    <i class="fas fa-box"></i> <span id="wbp-tab-order-label">My Order</span>
                </button>
            </div>

            <!-- Body -->
            <div class="wbp-body">
                <!-- AUTH SCREEN -->
                <div class="wbp-screen active" id="wbp-screen-auth">
                    <div class="wbp-auth">
                        <h4 id="wbp-auth-title">My Account</h4>
                        <p id="wbp-auth-sub">Sign in to track your order and chat with us</p>
                        <div class="wbp-field">
                            <input type="email" id="wbp-email" placeholder="Email">
                        </div>
                        <div class="wbp-field">
                            <input type="password" id="wbp-pass" placeholder="Password">
                        </div>
                        <button class="wbp-auth-btn" id="wbp-login-btn" onclick="wbpAuthAction()">Sign In</button>
                        <div class="wbp-auth-err" id="wbp-auth-err"></div>
                        <div class="wbp-reset-link"><a onclick="wbpResetPassword()">Forgot password?</a></div>
                        <div class="wbp-reset-ok" id="wbp-reset-ok">✅ Reset email sent! Check your inbox.</div>
                        <div class="wbp-switch">
                            <span id="wbp-switch-text">Don't have an account?</span>
                            <a onclick="wbpToggleRegister()" id="wbp-switch-link">Create Account</a>
                        </div>
                    </div>
                </div>

                <!-- CHAT SCREEN -->
                <div class="wbp-screen" id="wbp-screen-chat">
                    <div class="wbp-messages" id="wbp-messages">
                        <div class="wbp-no-msg" id="wbp-no-msg">
                            <i class="fas fa-comment-dots"></i>
                            <p id="wbp-no-msg-text">No messages yet</p>
                            <p style="font-size:0.75rem;opacity:0.7" id="wbp-no-msg-sub">Send us a message and we'll reply soon!</p>
                        </div>
                    </div>
                    <div class="wbp-input-row">
                        <input type="text" class="wbp-input" id="wbp-msg-input" placeholder="Type a message...">
                        <button class="wbp-send" id="wbp-send-btn" onclick="wbpSendMessage()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>

                <!-- ORDER SCREEN -->
                <div class="wbp-screen" id="wbp-screen-order">
                    <div class="wbp-order-body" id="wbp-order-body">
                        <div class="wbp-no-order">
                            <i class="fas fa-box-open"></i>
                            <h4 id="wbp-no-order-title">No active order</h4>
                            <p id="wbp-no-order-sub">Place an order and track it here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(wrap);

    // Enter key to send
    document.getElementById('wbp-msg-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') wbpSendMessage();
    });
    document.getElementById('wbp-email').addEventListener('keydown', e => {
        if (e.key === 'Enter') document.getElementById('wbp-pass').focus();
    });
    document.getElementById('wbp-pass').addEventListener('keydown', e => {
        if (e.key === 'Enter') wbpAuthAction();
    });
}

// ═══════════════════════════════════════════
// PANEL TOGGLE
// ═══════════════════════════════════════════
function wbpToggle() {
    isOpen = !isOpen;
    document.getElementById('wbp-panel').classList.toggle('open', isOpen);
    document.getElementById('wbp-bubble').classList.toggle('open', isOpen);
    document.getElementById('wbp-bubble-icon').className = isOpen ? 'fas fa-times' : 'fas fa-comment-dots';
    if (isOpen) {
        clearNotif();
        if (currentUser) {
            setTimeout(() => document.getElementById('wbp-msg-input')?.focus(), 300);
        } else {
            setTimeout(() => document.getElementById('wbp-email')?.focus(), 300);
        }
    }
}

function wbpSetTab(tab) {
    activeTab = tab;
    document.getElementById('wbp-tab-chat').classList.toggle('active', tab === 'chat');
    document.getElementById('wbp-tab-order').classList.toggle('active', tab === 'order');
    document.getElementById('wbp-screen-chat').classList.toggle('active', tab === 'chat');
    document.getElementById('wbp-screen-order').classList.toggle('active', tab === 'order');
    if (tab === 'chat') scrollMessages();
}

function wbpToggleRegister() {
    isRegisterMode = !isRegisterMode;
    updateAuthUI();
}

function updateAuthUI() {
    const lang = localStorage.getItem('preferred-language') || 'en';
    const l = CT[lang] || CT.en;
    document.getElementById('wbp-auth-title').textContent = isRegisterMode ? l.registerBtn : l.loginTitle;
    document.getElementById('wbp-auth-sub').textContent = isRegisterMode ? '' : l.loginSub;
    document.getElementById('wbp-login-btn').textContent = isRegisterMode ? l.registerBtn : l.loginBtn;
    document.getElementById('wbp-switch-text').textContent = isRegisterMode ? l.hasAccount : l.noAccount;
    document.getElementById('wbp-switch-link').textContent = isRegisterMode ? l.loginBtn : l.registerBtn;
    document.getElementById('wbp-auth-err').style.display = 'none';
    document.getElementById('wbp-login-btn').disabled = false;
}

function wbpAuthAction() {
    if (isRegisterMode) doRegister();
    else doLogin();
}

function wbpLogout() {
    doLogout();
}

// ═══════════════════════════════════════════
// RENDER PANEL
// ═══════════════════════════════════════════
function renderChatPanel() {
    const lang = localStorage.getItem('preferred-language') || 'en';
    const l = CT[lang] || CT.en;

    if (!currentUser) {
        // Show auth screen
        showScreen('auth');
        document.getElementById('wbp-tabs').style.display = 'none';
        document.getElementById('wbp-user-bar').style.display = 'none';
        document.getElementById('wbp-head-sub').textContent = l.chatSub;
        updateAuthUI();
    } else {
        // Show chat/order screens
        showScreen(activeTab === 'order' ? 'order' : 'chat');
        document.getElementById('wbp-tabs').style.display = 'flex';
        document.getElementById('wbp-user-bar').style.display = 'flex';
        document.getElementById('wbp-user-name-display').textContent = l.hello + ', ' + (currentUser.email.split('@')[0]);
        document.getElementById('wbp-logout-btn') && (document.getElementById('wbp-logout-btn').textContent = l.logout || 'Sign Out');
        document.querySelector('.wbp-logout-btn').textContent = l.logout;
        document.getElementById('wbp-tab-chat-label').textContent = l.tabs.chat;
        document.getElementById('wbp-tab-order-label').textContent = l.tabs.order;
        document.getElementById('wbp-no-msg-text').textContent = l.noMessages;
        document.getElementById('wbp-no-msg-sub').textContent = l.noMessagesSub;
        document.getElementById('wbp-msg-input').placeholder = l.messagePlaceholder;
    }
}

function showScreen(name) {
    ['auth','chat','order'].forEach(s => {
        document.getElementById('wbp-screen-' + s)?.classList.toggle('active', s === name);
    });
}

function refreshPanelContent() {
    if (!currentUser) return;
    renderMessages();
    renderOrderTab();
    updateNotif();
}

// ═══════════════════════════════════════════
// MESSAGES
// ═══════════════════════════════════════════
function renderMessages() {
    if (!userOrder) return;
    const messages = userOrder.messages || [];
    const container = document.getElementById('wbp-messages');
    const noMsg = document.getElementById('wbp-no-msg');
    const prevCount = container.querySelectorAll('.wbp-msg').length;

    // Remove old
    container.querySelectorAll('.wbp-msg').forEach(m => m.remove());

    if (messages.length === 0) {
        noMsg.style.display = 'flex';
        return;
    }
    noMsg.style.display = 'none';

    messages.forEach(m => {
        const mine = m.from === 'client';
        const time = m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : '';
        const initial = mine ? (currentUser.email.charAt(0).toUpperCase()) : 'W';
        const div = document.createElement('div');
        div.className = 'wbp-msg ' + (mine ? 'mine' : 'theirs');
        div.innerHTML = `
            <div class="wbp-msg-av">${initial}</div>
            <div>
                <div class="wbp-msg-bub">${escHtml(m.text)}<span class="wbp-msg-time">${time}</span></div>
            </div>`;
        container.appendChild(div);
    });

    // Auto scroll & notify if new messages while panel closed
    if (messages.length > prevCount && !isOpen) {
        updateNotif(messages.length - prevCount);
    }
    if (isOpen && activeTab === 'chat') scrollMessages();
}

function scrollMessages() {
    const c = document.getElementById('wbp-messages');
    if (c) setTimeout(() => { c.scrollTop = c.scrollHeight; }, 50);
}

async function wbpSendMessage() {
    if (!currentUser || !userOrder) return;
    const input = document.getElementById('wbp-msg-input');
    const text = input.value.trim();
    if (!text) return;

    const btn = document.getElementById('wbp-send-btn');
    btn.disabled = true;
    input.value = '';

    const message = {
        from: 'client',
        text,
        timestamp: new Date().toISOString(),
        author: currentUser.email.split('@')[0]
    };

    try {
        if (_db && userOrder._id) {
            const msgs = [...(userOrder.messages || []), message];
            await _db.collection('orders').doc(userOrder._id).update({ messages: msgs });
        }
    } catch(e) { console.error('Send message error:', e); }
    finally { btn.disabled = false; input.focus(); }
}

// ═══════════════════════════════════════════
// ORDER TAB
// ═══════════════════════════════════════════
function renderOrderTab() {
    const body = document.getElementById('wbp-order-body');
    const lang = localStorage.getItem('preferred-language') || 'en';
    const l = CT[lang] || CT.en;

    if (!userOrder) {
        body.innerHTML = `
            <div class="wbp-no-order">
                <i class="fas fa-box-open"></i>
                <h4>${l.noOrder}</h4>
                <p>${l.noOrderSub}</p>
            </div>`;
        return;
    }

    const o = userOrder;
    const status = o.status || 'pending';
    const statusLabel = l.statuses[status] || status;
    const badgeCls = 'wbs-' + status;

    const pkgNames = { basic:'Basic Website', standard:'Standard Website', premium:'Premium Website', ecommerce:'E-Commerce' };
    const pkgName = pkgNames[o.service_type] || o.service_type || '—';

    // Step states
    const stepMap = {
        pending:     ['done','active','waiting','waiting'],
        paid:        ['done','active','waiting','waiting'],
        accepted:    ['done','done','active','waiting'],
        in_progress: ['done','done','active','waiting'],
        completed:   ['done','done','done','done'],
        declined:    ['done','waiting','waiting','waiting'],
    };
    const steps = stepMap[status] || stepMap.pending;
    const stepIcons = ['fa-paper-plane','fa-search','fa-handshake','fa-flag-checkered'];
    const stepLabels = l.steps;

    const stepsHtml = steps.map((cls, i) => `
        <div class="wbp-step ${cls}">
            <div class="wbp-step-dot"><i class="fas ${cls==='done' ? 'fa-check' : stepIcons[i]}"></i></div>
            <div class="wbp-step-label">${stepLabels[i]}</div>
        </div>`).join('');

    const isDone = status === 'completed';

    body.innerHTML = `
        <div class="wbp-order-card">
            <div class="wbp-order-id">${o.order_id || '—'}</div>
            <div class="wbp-order-row"><span class="wl">Package</span><span class="wr">${pkgName}</span></div>
            <div class="wbp-order-row"><span class="wl">Total</span><span class="wr">€${o.total_price || o.package_price || '0'}</span></div>
            <div><span class="wbp-status-badge ${badgeCls}">${statusLabel}</span></div>
        </div>
        <div class="wbp-tracker">
            <div class="wbp-tracker-title">${l.orderStatus}</div>
            <div class="wbp-steps">${stepsHtml}</div>
        </div>
        ${isDone ? `
        <div class="wbp-done-banner">
            <i class="fas fa-check-circle"></i>
            <h4>🎉 ${stepLabels[3]}!</h4>
            <p>Your website is ready. Thank you for choosing us!</p>
        </div>` : ''}
    `;
}

// ═══════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════
let notifCount = 0;
function updateNotif(add = 0) {
    if (!userOrder) return;
    const adminMsgs = (userOrder.messages || []).filter(m => m.from === 'admin').length;
    const el = document.getElementById('wbp-notif');
    if (add > 0 && !isOpen) {
        notifCount += add;
        el.textContent = notifCount;
        el.classList.add('show');
    }
}
function clearNotif() {
    notifCount = 0;
    const el = document.getElementById('wbp-notif');
    if (el) el.classList.remove('show');
}
function updateBubble() { /* bubble always visible */ }

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ═══════════════════════════════════════════
// EXPOSE GLOBALS
// ═══════════════════════════════════════════
window.wbpToggle = wbpToggle;
window.wbpSetTab = wbpSetTab;
window.wbpToggleRegister = wbpToggleRegister;
window.wbpAuthAction = wbpAuthAction;
window.wbpLogout = wbpLogout;
window.wbpSendMessage = wbpSendMessage;
window.wbpResetPassword = doResetPassword;

// ═══════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    buildUI();
    initFirebase();
});

})();

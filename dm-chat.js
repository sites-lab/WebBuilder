/**
 * WebBuilder — Direct Message Chat (dm-chat.js)
 * ✓ Uses user.uid as chatId (matches Firestore rule)
 * ✓ Register form: Name (required) + Phone (optional) + Email + Password
 * ✓ Syncs with auth.js on login/logout → mobile menu re-renders
 * ✓ "Service not available" fix — retries if Firebase not ready
 */
(function () {
'use strict';

let _db = null, _auth = null;
let _dmUser = null, _dmChatId = null, _dmUnsub = null;
let _dmReg = false;        // true = register mode
let _panelOpen = false, _dmNotifCount = 0;

// ── Firebase init ──────────────────────────────────────────────────────
function dmFirebase() {
  try {
    if (typeof FIREBASE_CONFIG === 'undefined' || FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') return;
    const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(FIREBASE_CONFIG);
    _db   = firebase.firestore();
    _auth = firebase.auth();
    _auth.onAuthStateChanged(u => {
      _dmUser = u;
      if (u) { dmOnLogin(u); }
      else   { dmOnLogout(); }
    });
  } catch(e) { console.warn('DM firebase:', e); }
}

// ── Login / Logout ─────────────────────────────────────────────────────
function dmOnLogin(u) {
  _dmChatId = u.uid;  // UID as chatId — matches Firestore rule
  // Show chat screen
  const authScreen = document.getElementById('wbp-msg-screen-auth');
  const chatScreen = document.getElementById('wbp-msg-screen-chat');
  if (authScreen) authScreen.style.display = 'none';
  if (chatScreen) chatScreen.style.display = 'flex';
  // Start Firestore listener
  if (_dmUnsub) _dmUnsub();
  if (_db) {
    _dmUnsub = _db.collection('chats').doc(_dmChatId)
      .onSnapshot(snap => {
        const data   = snap.exists ? snap.data() : {};
        dmRenderMessages(data.messages || []);
        const msgs   = data.messages || [];
        const unread = msgs.filter(m => m.from === 'admin' && !m.readByUser).length;
        if (unread > 0 && !_panelOpen) dmSetBadge(unread);
        if (_panelOpen && unread > 0) {
          const updated = msgs.map(m => m.from === 'admin' ? { ...m, readByUser: true } : m);
          _db.collection('chats').doc(_dmChatId).set(
            { messages: updated, email: u.email, lastUpdated: new Date().toISOString() },
            { merge: true }
          );
        }
      });
  }
  // Notify auth.js so mobile hamburger menu re-renders
  _syncAuthJs();
  setTimeout(() => document.getElementById('wbp-msg-txt')?.focus(), 200);
}

function dmOnLogout() {
  if (_dmUnsub) { _dmUnsub(); _dmUnsub = null; }
  _dmChatId = null;
  const authScreen = document.getElementById('wbp-msg-screen-auth');
  const chatScreen = document.getElementById('wbp-msg-screen-chat');
  if (authScreen) authScreen.style.display = '';
  if (chatScreen) chatScreen.style.display = 'none';
}

/**
 * Tell auth.js to re-render nav + mobile menu.
 * auth.js's onAuthStateChanged fires asynchronously after login.
 * We poll until auth.js has picked up the new user (currentUser set via wbp_user).
 */
function _syncAuthJs() {
  // Immediately try, then retry a few times to catch the async auth state update
  let attempts = 0;
  const trySync = () => {
    if (window._authRenderAll) window._authRenderAll();
    attempts++;
    if (attempts < 6) setTimeout(trySync, 300);
  };
  setTimeout(trySync, 100);
}

// ── Render messages ────────────────────────────────────────────────────
function dmRenderMessages(msgs) {
  const container = document.getElementById('wbp-msg-messages');
  const noMsg     = document.getElementById('wbp-msg-no');
  if (!container) return;
  Array.from(container.querySelectorAll('.wbp-direct-msg')).forEach(el => el.remove());
  if (!msgs || msgs.length === 0) { if (noMsg) noMsg.style.display = 'flex'; return; }
  if (noMsg) noMsg.style.display = 'none';
  msgs.forEach(m => {
    const mine    = m.from === 'client' || m.from === 'user';
    const time    = m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const initial = mine ? (_dmUser?.email?.charAt(0) || 'U').toUpperCase() : 'W';
    const div     = document.createElement('div');
    div.className = 'wbp-direct-msg ' + (mine ? 'mine' : 'theirs');
    div.innerHTML = `<div class="wbp-direct-av">${dmEsc(initial)}</div><div><div class="wbp-direct-bub"><div class="wbp-direct-bub-inner"><span class="wbp-direct-text">${dmEsc(m.text)}</span><span class="wbp-direct-time">${time}</span></div></div></div>`;
    container.appendChild(div);
  });
  container.scrollTop = container.scrollHeight;
}

// ── Send message ───────────────────────────────────────────────────────
async function wbpMsgSend() {
  if (!_dmUser || !_dmChatId || !_db) return;
  const input = document.getElementById('wbp-msg-txt');
  const text  = input.value.trim();
  if (!text) return;
  const btn = document.getElementById('wbp-msg-send-btn');
  btn.disabled = true; input.value = '';
  const msg = { from: 'client', text, timestamp: new Date().toISOString(), author: _dmUser.email.split('@')[0] };
  try {
    const ref = _db.collection('chats').doc(_dmChatId);
    // arrayUnion is atomic — never overwrites concurrent messages
    await ref.set({
      messages:       firebase.firestore.FieldValue.arrayUnion(msg),
      email:          _dmUser.email,
      uid:            _dmUser.uid,
      lastMessage:    text,
      lastUpdated:    new Date().toISOString(),
      hasUnreadAdmin: true
    }, { merge: true });
  } catch(e) { console.error('Send DM:', e); }
  finally { btn.disabled = false; input.focus(); }
}

// ── Auth screen HTML (injected into wbp-msg-screen-auth) ──────────────
function dmBuildAuthScreen() {
  const screen = document.getElementById('wbp-msg-screen-auth');
  if (!screen || screen.dataset.built) return;
  screen.dataset.built = '1';
  screen.innerHTML = `
    <div class="wbp-msg-auth">
      <h5 id="wbp-msg-auth-title">Say hello 👋</h5>
      <p id="wbp-msg-auth-sub">Sign in to chat with us</p>

      <div id="wbp-msg-name-wrap" style="display:none">
        <input type="text" id="wbp-msg-name"  placeholder="Your name *" style="margin-bottom:8px;width:100%;padding:9px 12px;border:2px solid #e2e8f0;border-radius:8px;font-family:Inter,sans-serif;font-size:0.82rem;color:#1e293b;outline:none;transition:border-color 0.2s;" />
      </div>

      <input type="email"    id="wbp-msg-email" placeholder="Email *"    style="margin-bottom:8px;width:100%;padding:9px 12px;border:2px solid #e2e8f0;border-radius:8px;font-family:Inter,sans-serif;font-size:0.82rem;color:#1e293b;outline:none;transition:border-color 0.2s;" />
      <input type="password" id="wbp-msg-pass"  placeholder="Password *" style="margin-bottom:8px;width:100%;padding:9px 12px;border:2px solid #e2e8f0;border-radius:8px;font-family:Inter,sans-serif;font-size:0.82rem;color:#1e293b;outline:none;transition:border-color 0.2s;" />

      <div id="wbp-msg-phone-wrap" style="display:none">
        <input type="tel" id="wbp-msg-phone" placeholder="Phone (optional)" style="margin-bottom:8px;width:100%;padding:9px 12px;border:2px solid #e2e8f0;border-radius:8px;font-family:Inter,sans-serif;font-size:0.82rem;color:#1e293b;outline:none;transition:border-color 0.2s;" />
      </div>

      <button onclick="wbpMsgAuth()" id="wbp-msg-auth-btn" style="width:100%;padding:10px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:white;border:none;border-radius:8px;font-family:Inter,sans-serif;font-size:0.85rem;font-weight:700;cursor:pointer;transition:all 0.2s;">Sign In</button>

      <div id="wbp-msg-auth-err" style="color:#7f1d1d;font-size:0.75rem;margin-top:6px;font-family:Inter,sans-serif;display:none;"></div>

      <div style="text-align:center;margin-top:8px;font-size:0.72rem;color:#64748b;font-family:Inter,sans-serif;">
        <button onclick="wbpMsgResetPwd()" style="background:none;border:none;color:#3b82f6;cursor:pointer;text-decoration:underline;font-family:inherit;font-size:inherit;">Forgot password?</button>
      </div>
      <div id="wbp-msg-reset-ok" style="color:#065f46;background:#ecfdf5;padding:8px 10px;border-radius:7px;font-size:0.75rem;font-family:Inter,sans-serif;margin-top:6px;display:none;text-align:center;">✅ Reset email sent! Check your inbox.</div>

      <div style="text-align:center;margin-top:10px;font-size:0.75rem;color:#64748b;font-family:Inter,sans-serif;">
        <span id="wbp-msg-switch-txt">Don't have an account?</span>
        <button onclick="wbpMsgToggleReg()" id="wbp-msg-switch-link" style="background:none;border:none;color:#3b82f6;cursor:pointer;text-decoration:underline;font-family:inherit;font-size:inherit;padding:0 0 0 4px;">Create one</button>
      </div>
    </div>`;

  // Key listeners
  document.getElementById('wbp-msg-email')?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('wbp-msg-pass')?.focus(); });
  document.getElementById('wbp-msg-pass')?.addEventListener('keydown',  e => { if (e.key === 'Enter') wbpMsgAuth(); });
  document.getElementById('wbp-msg-name')?.addEventListener('keydown',  e => { if (e.key === 'Enter') document.getElementById('wbp-msg-email')?.focus(); });
  document.getElementById('wbp-msg-phone')?.addEventListener('keydown', e => { if (e.key === 'Enter') wbpMsgAuth(); });
}

// ── Auth actions ───────────────────────────────────────────────────────
async function wbpMsgAuth() {
  const email = document.getElementById('wbp-msg-email')?.value.trim();
  const pass  = document.getElementById('wbp-msg-pass')?.value;
  const name  = document.getElementById('wbp-msg-name')?.value.trim();
  const phone = document.getElementById('wbp-msg-phone')?.value.trim();
  const btn   = document.getElementById('wbp-msg-auth-btn');
  if (!email || !pass) { dmShowErr('Please fill in all required fields.'); return; }
  if (_dmReg && !name) { dmShowErr('Please enter your name.'); return; }
  // Firebase not ready yet — retry
  if (!_auth) {
    dmFirebase();
    if (btn) { btn.disabled = true; btn.textContent = 'Connecting…'; }
    setTimeout(wbpMsgAuth, 1000);
    return;
  }
  if (btn) { btn.disabled = true; btn.textContent = _dmReg ? 'Creating…' : 'Signing in…'; }
  const errEl = document.getElementById('wbp-msg-auth-err');
  if (errEl) errEl.style.display = 'none';
  const resetOk = document.getElementById('wbp-msg-reset-ok');
  if (resetOk) resetOk.style.display = 'none';
  try {
    if (_dmReg) {
      const cred = await _auth.createUserWithEmailAndPassword(email, pass);
      // Update display name
      if (name) await cred.user.updateProfile({ displayName: name });
      // Save to Firestore users collection (same as auth.js does)
      if (_db) {
        await _db.collection('users').doc(cred.user.uid).set({
          displayName: name || email.split('@')[0],
          phone:       phone || '',
          email:       email,
          createdAt:   new Date().toISOString()
        }, { merge: true });
      }
    } else {
      await _auth.signInWithEmailAndPassword(email, pass);
    }
    // onAuthStateChanged fires dmOnLogin which handles UI switch
  } catch(e) {
    const msgs = {
      'auth/user-not-found':       'No account with this email.',
      'auth/wrong-password':       'Incorrect password.',
      'auth/invalid-credential':   'Wrong email or password.',
      'auth/email-already-in-use': 'Email already registered.',
      'auth/weak-password':        'Password must be 6+ characters.',
      'auth/invalid-email':        'Invalid email.',
      'auth/too-many-requests':    'Too many attempts. Try again later.',
    };
    dmShowErr(msgs[e.code] || 'Error. Please try again.');
    if (btn) { btn.disabled = false; btn.textContent = _dmReg ? 'Create Account' : 'Sign In'; }
  }
}

async function wbpMsgResetPwd() {
  const email = document.getElementById('wbp-msg-email')?.value.trim();
  const ok    = document.getElementById('wbp-msg-reset-ok');
  if (!email) { dmShowErr('Enter your email first.'); return; }
  if (!_auth) { dmShowErr('Service not ready. Refresh the page.'); return; }
  const err = document.getElementById('wbp-msg-auth-err');
  if (err) err.style.display = 'none';
  try {
    await _auth.sendPasswordResetEmail(email);
    if (ok) ok.style.display = 'block';
  } catch(e) {
    dmShowErr('Could not send reset email. Check the address.');
  }
}

function wbpMsgToggleReg() {
  _dmReg = !_dmReg;
  _updateAuthScreenUI();
  const err = document.getElementById('wbp-msg-auth-err');
  const ok  = document.getElementById('wbp-msg-reset-ok');
  if (err) err.style.display = 'none';
  if (ok)  ok.style.display  = 'none';
  const btn = document.getElementById('wbp-msg-auth-btn');
  if (btn) btn.disabled = false;
}

function _updateAuthScreenUI() {
  const nameWrap  = document.getElementById('wbp-msg-name-wrap');
  const phoneWrap = document.getElementById('wbp-msg-phone-wrap');
  const title     = document.getElementById('wbp-msg-auth-title');
  const sub       = document.getElementById('wbp-msg-auth-sub');
  const btn       = document.getElementById('wbp-msg-auth-btn');
  const swTxt     = document.getElementById('wbp-msg-switch-txt');
  const swLink    = document.getElementById('wbp-msg-switch-link');
  if (nameWrap)  nameWrap.style.display  = _dmReg ? 'block' : 'none';
  if (phoneWrap) phoneWrap.style.display = _dmReg ? 'block' : 'none';
  if (title)  title.textContent  = _dmReg ? 'Create account' : 'Say hello 👋';
  if (sub)    sub.textContent    = _dmReg ? 'Register to chat with us' : 'Sign in to chat with us';
  if (btn)    btn.textContent    = _dmReg ? 'Create Account' : 'Sign In';
  if (swTxt)  swTxt.textContent  = _dmReg ? 'Already have an account?' : "Don't have an account?";
  if (swLink) swLink.textContent = _dmReg ? 'Sign In' : 'Create one';
}

// ── Badge ──────────────────────────────────────────────────────────────
function dmSetBadge(n) {
  _dmNotifCount = n;
  const badge = document.getElementById('dm-notif-badge');
  if (badge) {
    badge.textContent   = n > 0 ? String(n) : '';
    badge.style.display = n > 0 ? 'flex' : 'none';
  }
}

// ── Panel open / close ─────────────────────────────────────────────────
function wbpMsgDirectOpen() {
  const panel = document.getElementById('wbp-msg-panel');
  if (!panel) return;
  if (panel.classList.contains('open')) {
    wbpMsgClose();
  } else {
    _panelOpen = true;
    panel.classList.add('open');
    dmSetBadge(0);
    if (_dmUser) {
      dmOnLogin(_dmUser);
      setTimeout(() => document.getElementById('wbp-msg-txt')?.focus(), 300);
    } else {
      _updateAuthScreenUI();
      setTimeout(() => {
        const firstInput = _dmReg
          ? document.getElementById('wbp-msg-name')
          : document.getElementById('wbp-msg-email');
        firstInput?.focus();
      }, 300);
    }
  }
}

function wbpMsgClose() {
  _panelOpen = false;
  document.getElementById('wbp-msg-panel')?.classList.remove('open');
}

function wbpMsgTogglePanel(e) {
  if (e) e.stopPropagation();
  const panel = document.getElementById('wbp-msg-panel');
  _panelOpen  = !panel.classList.contains('open');
  panel.classList.toggle('open', _panelOpen);
  window._panelOpen = _panelOpen;
  if (_panelOpen) {
    dmSetBadge(0);
    if (_dmUser) {
      dmOnLogin(_dmUser);
      setTimeout(() => document.getElementById('wbp-msg-txt')?.focus(), 300);
    } else {
      _updateAuthScreenUI();
      setTimeout(() => document.getElementById('wbp-msg-email')?.focus(), 300);
    }
  }
}

// ── Helpers ────────────────────────────────────────────────────────────
function dmShowErr(msg) {
  const el = document.getElementById('wbp-msg-auth-err');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function dmEsc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Expose globals ─────────────────────────────────────────────────────
window.wbpMsgTogglePanel = wbpMsgTogglePanel;
window.wbpMsgClose       = wbpMsgClose;
window.wbpMsgAuth        = wbpMsgAuth;
window.wbpMsgResetPwd    = wbpMsgResetPwd;
window.wbpMsgToggleReg   = wbpMsgToggleReg;
window.wbpMsgSend        = wbpMsgSend;
window.wbpMsgDirectOpen  = wbpMsgDirectOpen;
window._dmOnLogin        = dmOnLogin;
Object.defineProperty(window, '_dmUser', { get: () => _dmUser });

// ── Boot ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Build auth screen HTML inside the panel (replaces old inline HTML)
  dmBuildAuthScreen();
  // Message send on Enter
  document.getElementById('wbp-msg-txt')?.addEventListener('keydown', e => { if (e.key === 'Enter') wbpMsgSend(); });
  dmFirebase();
});

})();

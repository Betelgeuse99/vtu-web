// Auth storage helper — supports "Remember Me".
//  remember=true  -> localStorage (persists across browser restarts)
//  remember=false -> sessionStorage (cleared when tab/browser closes)

function readStore() {
  // Prefer sessionStorage when a session was stored there (Remember Me off).
  if (sessionStorage.getItem('vtu_session')) return sessionStorage;
  return localStorage;
}

export function getSession() {
  try { return JSON.parse(readStore().getItem('vtu_session') || 'null'); } catch { return null; }
}

export function setSession(session, remember) {
  const store = remember ? localStorage : sessionStorage;
  store.setItem('vtu_session', JSON.stringify(session));
}

export function getUser() {
  try { return JSON.parse(readStore().getItem('vtu_user') || 'null'); } catch { return null; }
}

export function setUser(user, remember) {
  const store = remember ? localStorage : sessionStorage;
  store.setItem('vtu_user', JSON.stringify(user));
}

export function getWallet() {
  try { return JSON.parse(readStore().getItem('vtu_wallet') || 'null'); } catch { return null; }
}

export function setWallet(wallet, remember) {
  const store = remember ? localStorage : sessionStorage;
  store.setItem('vtu_wallet', JSON.stringify(wallet));
}

export function clearAuth() {
  localStorage.removeItem('vtu_session');
  localStorage.removeItem('vtu_user');
  localStorage.removeItem('vtu_wallet');
  sessionStorage.removeItem('vtu_session');
  sessionStorage.removeItem('vtu_user');
  sessionStorage.removeItem('vtu_wallet');
}

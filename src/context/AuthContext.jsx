import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import API from '../services/api';
import { fetchWalletBalance } from '../services/supabase';
import { getSession, setSession, getUser, setUser, getWallet, setWallet, clearAuth } from '../utils/storage';

const AuthContext = createContext(null);

// 10-minute inactivity auto-logout (same as the Android app).
const IDLE_TIMEOUT = 10 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => getUser());
  const [wallet, setWalletState] = useState(() => getWallet() || { balance: 0 });
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  const fetchBalance = useCallback(async (silent = false) => {
    if (!user?.id) return;
    try {
      const balance = await fetchWalletBalance(user.id);
      if (balance === null) return;
      const next = Number(balance);
      // Only touch state/storage when the value actually changed. Writing a
      // fresh object every poll forced a full context re-render of every
      // screen every 10 seconds (visible as flicker on the Transactions page,
      // which does not even show the balance).
      setWalletState((prev) => {
        if (Number(prev?.balance) === next) return prev;
        const wb = { balance: next };
        setWallet(wb, true);
        return wb;
      });
    } catch (err) {
      if (!silent) console.error('Failed to fetch balance', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBalance(false);
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(() => {
        // Skip network churn while the tab is hidden (mobile browsers suspend
        // JS anyway; this avoids useless requests the moment a tab is visible).
        if (document.visibilityState !== 'hidden') fetchBalance(true);
      }, 10000);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
    setLoading(false);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [user, fetchBalance]);

  const login = (userData, sessionData, remember = true) => {
    setSession(sessionData, remember);
    setUser(userData, remember);
    setUserState(userData);
    if (sessionData?.wallet?.balance !== undefined) {
      const wb = { balance: sessionData.wallet.balance };
      setWalletState(wb);
      setWallet(wb, remember);
    }
    if (userData?.id && sessionData?.access_token) {
      setTimeout(async () => {
        try {
          const balance = await fetchWalletBalance(userData.id);
          if (balance !== null) {
            const wb = { balance };
            setWalletState(wb);
            setWallet(wb, remember);
          }
        } catch {}
      }, 500);
    }
  };

  const logout = () => {
    clearAuth();
    if (pollRef.current) clearInterval(pollRef.current);
    setUserState(null);
    setWalletState({ balance: 0 });
  };

  // 10-minute inactivity auto-logout (same as the Android app). Any pointer /
  // key / scroll / touch activity marks the moment of last activity; a periodic
  // check logs out once the gap passes 10 minutes. We deliberately DO NOT rely
  // on a single reset-on-activity setTimeout: browsers throttle/pause timers in
  // background or sleeping tabs, and the first tap on return used to re-arm a
  // fresh 10-minute timer BEFORE the overdue timeout fired — so a tab left for
  // days never logged out. Checking elapsed time on an interval plus on
  // visibility/focus regain makes it fire reliably the moment you return.
  const logoutRef = useRef(logout);
  logoutRef.current = logout;
  useEffect(() => {
    if (!user?.id) return;
    let lastActivity = Date.now();
    const bump = () => { lastActivity = Date.now(); };
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    const check = () => {
      if (Date.now() - lastActivity > IDLE_TIMEOUT) logoutRef.current();
    };
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    const onVisible = () => { if (document.visibilityState === 'visible') check(); };
    const onFocus = () => check();
    const interval = setInterval(check, 30 * 1000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onFocus);
    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onFocus);
    };
  }, [user?.id]);

  const refreshUser = (userData) => {
    const remember = Boolean(getSession());
    setUser(userData, remember);
    setUserState(userData);
  };

  return (
    <AuthContext.Provider value={{ user, wallet, login, logout, loading, fetchBalance, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

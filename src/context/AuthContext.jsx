import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import API from '../services/api';
import { fetchWalletBalance } from '../services/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vtu_user')) || null; } catch { return null; }
  });
  const [wallet, setWallet] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('vtu_wallet'));
      return saved || { balance: 0 };
    } catch { return { balance: 0 }; }
  });
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  const fetchBalance = useCallback(async (silent = false) => {
    if (!user?.id) return;
    try {
      const balance = await fetchWalletBalance(user.id);
      if (balance !== null) {
        const wb = { balance };
        setWallet(wb);
        localStorage.setItem('vtu_wallet', JSON.stringify(wb));
      }
    } catch (err) {
      if (!silent) console.error('Failed to fetch balance', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBalance(false);
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(() => fetchBalance(true), 10000);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
    setLoading(false);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [user, fetchBalance]);

  const login = (userData, sessionData) => {
    localStorage.setItem('vtu_session', JSON.stringify(sessionData));
    localStorage.setItem('vtu_user', JSON.stringify(userData));
    setUser(userData);
    if (sessionData?.wallet?.balance !== undefined) {
      const wb = { balance: sessionData.wallet.balance };
      setWallet(wb);
      localStorage.setItem('vtu_wallet', JSON.stringify(wb));
    }
    if (userData?.id && sessionData?.access_token) {
      setTimeout(async () => {
        try {
          const balance = await fetchWalletBalance(userData.id);
          if (balance !== null) {
            const wb = { balance };
            setWallet(wb);
            localStorage.setItem('vtu_wallet', JSON.stringify(wb));
          }
        } catch {}
      }, 500);
    }
  };

  const logout = () => {
    localStorage.removeItem('vtu_session');
    localStorage.removeItem('vtu_user');
    localStorage.removeItem('vtu_wallet');
    if (pollRef.current) clearInterval(pollRef.current);
    setUser(null);
    setWallet({ balance: 0 });
  };

  const refreshUser = (userData) => {
    localStorage.setItem('vtu_user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, wallet, login, logout, loading, fetchBalance, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

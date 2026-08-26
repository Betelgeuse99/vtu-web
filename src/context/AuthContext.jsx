import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import API from '../services/api';
import { fetchWalletBalance } from '../services/supabase';
import { getSession, setSession, getUser, setUser, getWallet, setWallet, clearAuth } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => getUser());
  const [wallet, setWalletState] = useState(() => getWallet() || { balance: 0 });
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  const fetchBalance = useCallback(async (silent = false) => {
    if (!user?.id) return;
    try {
      const balance = await fetchWalletBalance(user.id);
      if (balance !== null) {
        const wb = { balance };
        setWalletState(wb);
        setWallet(wb, true);
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

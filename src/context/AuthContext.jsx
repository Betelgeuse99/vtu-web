import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vtu_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [wallet, setWallet] = useState({ balance: 0 });
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    if (!user?.id) return;
    try {
      const session = JSON.parse(localStorage.getItem('vtu_session') || 'null');
      if (!session?.access_token) return;
      const res = await API.get('/api/v2/wallet/balance');
      if (res.data?.balance !== undefined) {
        setWallet({ balance: res.data.balance });
      }
    } catch (err) {
      console.error('Failed to fetch balance', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
    setLoading(false);
  }, [user, fetchBalance]);

  const login = (userData, sessionData) => {
    localStorage.setItem('vtu_session', JSON.stringify(sessionData));
    localStorage.setItem('vtu_user', JSON.stringify(userData));
    setUser(userData);
    if (sessionData?.wallet) {
      setWallet(sessionData.wallet);
    }
  };

  const logout = () => {
    localStorage.removeItem('vtu_session');
    localStorage.removeItem('vtu_user');
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

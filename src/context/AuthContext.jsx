import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vtu_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      const res = await API.get('/wallet/balance');
      if (res.data?.balance !== undefined) {
        setWalletBalance(res.data.balance);
      }
    } catch (err) {
      console.error('Failed to fetch wallet balance', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
    setLoading(false);
  }, [user]);

  const login = (userData, token) => {
    localStorage.setItem('vtu_token', token);
    localStorage.setItem('vtu_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('vtu_token');
    localStorage.removeItem('vtu_user');
    setUser(null);
    setWalletBalance(0);
  };

  return (
    <AuthContext.Provider value={{ user, walletBalance, fetchBalance, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

const SUPABASE_URL = 'https://lraryzkamshicildghdv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyYXJ5emthbXNoa2lsZGdoZHZIiJ9-placeholder';

async function fetchBalanceFromSupabase(userId, accessToken) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/wallets?user_id=eq.${userId}&select=balance`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (data && data[0]?.balance !== undefined) {
      return data[0].balance;
    }
  } catch (err) {
    console.error('Supabase wallet fetch failed', err);
  }
  return null;
}

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
    const session = JSON.parse(localStorage.getItem('vtu_session') || 'null');
    const token = session?.access_token;
    if (!token) return;

    // Try Supabase first (real-time wallet), then backend
    let balance = await fetchBalanceFromSupabase(user.id, token);
    if (balance === null) {
      try {
        const res = await API.get('/wallet/balance');
        if (res.data?.balance !== undefined) balance = res.data.balance;
      } catch {
        if (!silent) console.error('Backend wallet fetch failed');
      }
    }
    if (balance !== null) {
      const wb = { balance };
      setWallet(wb);
      localStorage.setItem('vtu_wallet', JSON.stringify(wb));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBalance(false);
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(() => fetchBalance(true), 12000);
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
    // Fetch live balance from Supabase immediately after login
    setTimeout(() => {
      const sess = JSON.parse(localStorage.getItem('vtu_session') || 'null');
      if (sess?.access_token && userData?.id) {
        fetchBalanceFromSupabase(userData.id, sess.access_token).then((b) => {
          if (b !== null) {
            const wb = { balance: b };
            setWallet(wb);
            localStorage.setItem('vtu_wallet', JSON.stringify(wb));
          }
        });
      }
    }, 500);
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

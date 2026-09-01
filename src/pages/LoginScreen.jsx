import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', { email: email.trim().toLowerCase(), password });
      if (res.data.success) {
        login(res.data.user, { ...res.data.session, wallet: res.data.wallet }, remember);
        navigate('/dashboard');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="h-[100dvh] bg-white dark:bg-[#0A192F] flex flex-col overflow-hidden">
      <div className="px-4 py-2 flex items-center gap-3 shrink-0">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5 text-[#0A192F] dark:text-white" /></button>
        <h1 className="text-base font-bold text-[#0A192F] dark:text-white">Login</h1>
      </div>
      <div className="flex-1 px-6 pb-6 flex flex-col justify-center">
        <h2 className="text-[22px] font-bold text-[#0A192F] dark:text-white mb-1">Welcome Back!</h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-5">Kindly login to access your account</p>

        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-[#1E293B] dark:text-white focus:outline-none focus:border-[#0A192F]"
            />
          </div>
          <div className="relative">
            <label className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 block">Password</label>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-[#1E293B] dark:text-white focus:outline-none focus:border-[#0A192F] pr-10"
            />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[34px] text-gray-400">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="w-4 h-4 accent-[#0A192F] rounded"
            />
            <span className="text-xs text-gray-600 dark:text-slate-300">Remember Me</span>
          </label>
          <button onClick={() => navigate('/forgot-password')} className="text-xs font-semibold text-[#0A192F] dark:text-[#D4AF37]">
            Forgot password?
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full py-3.5 mt-5 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          ) : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-5">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="font-bold text-[#0A192F] dark:text-[#D4AF37]">Register</button>
        </p>
      </div>
    </div>
  );
}

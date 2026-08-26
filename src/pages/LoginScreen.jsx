import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Fingerprint } from 'lucide-react';
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
    <div className="min-h-screen bg-white">
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-6 h-6 text-[#0A192F]" /></button>
        <h1 className="text-lg font-bold text-[#0A192F]">Login</h1>
      </div>
      <div className="px-6 pt-4">
        <h2 className="text-[24px] font-bold text-[#0A192F] mb-1">Welcome Back!</h2>
        <p className="text-gray-500 text-sm mb-6">Kindly login to access your account</p>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]"
            />
          </div>
          <div className="relative">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Password</label>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F] pr-10"
            />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] text-gray-400">
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
            <span className="text-xs text-gray-600">Remember Me</span>
          </label>
          <button onClick={() => navigate('/forgot-password')} className="text-xs font-semibold text-[#0A192F]">
            Forgot password?
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full py-4 mt-6 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          ) : 'Login'}
        </button>

        <div className="flex justify-center mt-4">
          <button className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center">
            <Fingerprint className="w-8 h-8 text-[#0A192F]" />
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="font-bold text-[#0A192F]">Register</button>
        </p>
      </div>
    </div>
  );
}

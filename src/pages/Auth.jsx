import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const { login } = useAuth();
  const [step, setStep] = useState('welcome');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) return;
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/register', { name, email, phone, password });
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) return;
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/verify-otp', { phone, otp });
      login(res.data.user, res.data.token);
      setStep('welcome');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!phone || !password) return;
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', { phone, password });
      login(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A192F] text-slate-100 px-6 flex flex-col justify-center">
      {step === 'welcome' && (
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#D4AF37] flex items-center justify-center">
            <span className="text-[#0A192F] font-extrabold text-2xl">DH</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-2">DreamHatcher VTU</h1>
          <p className="text-sm text-slate-400 mb-8">Buy airtime, data, pay bills and more</p>
          <button onClick={() => setStep('login')} className="w-full py-3.5 bg-[#D4AF37] text-[#0A192F] rounded-xl text-sm font-bold mb-3 hover:bg-[#c9a230] transition">
            Login
          </button>
          <button onClick={() => setStep('register')} className="w-full py-3.5 bg-[#1E293B] text-white rounded-xl text-sm font-bold border border-slate-700 hover:border-[#D4AF37] transition">
            Create Account
          </button>
        </div>
      )}

      {step === 'login' && (
        <div>
          <button onClick={() => { setStep('welcome'); setError(''); }} className="flex items-center gap-1 text-xs text-[#D4AF37] mb-6 font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h2 className="text-xl font-extrabold text-white mb-1">Welcome Back</h2>
          <p className="text-xs text-slate-400 mb-5">Login to your account</p>

          {error && <p className="text-xs text-rose-400 mb-3">{error}</p>}

          <div className="space-y-3">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]" />
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] pr-10" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button onClick={handleLogin} disabled={loading || !phone || !password} className="w-full py-3.5 bg-[#D4AF37] text-[#0A192F] rounded-xl text-sm font-bold disabled:opacity-50 mt-5 hover:bg-[#c9a230] transition">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      )}

      {step === 'register' && (
        <div>
          <button onClick={() => { setStep('welcome'); setError(''); }} className="flex items-center gap-1 text-xs text-[#D4AF37] mb-6 font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h2 className="text-xl font-extrabold text-white mb-1">Create Account</h2>
          <p className="text-xs text-slate-400 mb-5">Fill in your details to get started</p>

          {error && <p className="text-xs text-rose-400 mb-3">{error}</p>}

          <div className="space-y-3">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]" />
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]" />
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] pr-10" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button onClick={handleRegister} disabled={loading || !name || !email || !phone || !password} className="w-full py-3.5 bg-[#D4AF37] text-[#0A192F] rounded-xl text-sm font-bold disabled:opacity-50 mt-5 hover:bg-[#c9a230] transition">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </div>
      )}

      {step === 'otp' && (
        <div>
          <button onClick={() => { setStep('register'); setError(''); }} className="flex items-center gap-1 text-xs text-[#D4AF37] mb-6 font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-extrabold text-white mb-1 text-center">Verify OTP</h2>
          <p className="text-xs text-slate-400 mb-5 text-center">Enter the code sent to {phone}</p>

          {error && <p className="text-xs text-rose-400 mb-3 text-center">{error}</p>}

          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter OTP" maxLength={6} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3.5 text-center text-lg tracking-[0.5em] font-bold text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]" />
          <button onClick={handleVerifyOtp} disabled={loading || !otp || otp.length < 4} className="w-full py-3.5 bg-[#D4AF37] text-[#0A192F] rounded-xl text-sm font-bold disabled:opacity-50 mt-5 hover:bg-[#c9a230] transition">
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      )}
    </div>
  );
}

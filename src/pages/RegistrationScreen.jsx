import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import API from '../services/api';

export default function RegistrationScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !agreed) return;
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/send-otp', { email: email.trim().toLowerCase() });
      navigate(`/otp-verify?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-6 h-6 text-[#0A192F]" /></button>
        <h1 className="text-lg font-bold text-[#0A192F]">Create Account</h1>
      </div>
      <div className="px-6 pt-4">
        <h2 className="text-[26px] font-extrabold text-[#0A192F] mb-1">Join Dreamhatcher!</h2>
        <p className="text-gray-500 text-sm mb-6">Settle all your bills in one place</p>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08012345678" maxLength={11} className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
          </div>
          <div className="relative">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Create Password</label>
            <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F] pr-10" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] text-gray-400">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2 mt-4 cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="w-4 h-4 mt-0.5 accent-[#0A192F] rounded" />
          <span className="text-xs text-gray-500">I agree to the Terms & Conditions and Privacy Policy</span>
        </label>

        <button
          onClick={handleRegister}
          disabled={loading || !name || !email || !phone || !password || !agreed}
          className="w-full py-4 mt-6 bg-[#0A192F] text-[#D4AF37] rounded-xl text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          ) : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="font-bold text-[#0A192F]">Login</button>
        </p>
      </div>
    </div>
  );
}

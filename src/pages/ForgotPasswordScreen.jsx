import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import API from '../services/api';

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/send-otp', { email: email.trim().toLowerCase() });
      setSent(true);
      setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-6 h-6 text-[#0A192F]" /></button>
        <h1 className="text-lg font-bold text-[#0A192F]">Forgot Password</h1>
      </div>
      <div className="px-6 pt-6 text-center">
        <h2 className="text-[24px] font-extrabold text-[#0A192F] mb-2">Reset Password</h2>
        <p className="text-gray-500 text-sm mb-8">Enter your email to receive a password reset code.</p>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
        {sent && <p className="text-emerald-600 text-xs mb-3">Code sent! Redirecting...</p>}

        <div className="relative mb-6">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={loading || !email}
          className="w-full py-4 bg-[#0A192F] text-[#D4AF37] rounded-xl text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          ) : 'Send Reset Code'}
        </button>
      </div>
    </div>
  );
}

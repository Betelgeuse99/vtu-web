import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import API from '../services/api';

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!otp || !password || password !== confirmPw) return;
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/reset-password', { email, otp, password });
      if (res.data.success) {
        navigate('/login');
      } else {
        setError(res.data.message || 'Reset failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-6 h-6 text-[#0A192F]" /></button>
        <h1 className="text-lg font-bold text-[#0A192F]">Reset Password</h1>
      </div>
      <div className="px-6 pt-6 text-center">
        <h2 className="text-[24px] font-extrabold text-[#0A192F] mb-2">Set New Password</h2>
        <p className="text-gray-500 text-sm mb-8">Enter the code sent to your email and your new password.</p>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block text-left">6-Digit Code</label>
            <input type="text" inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter OTP" className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F] text-center tracking-widest text-lg font-bold" />
          </div>
          <div className="relative">
            <label className="text-xs font-medium text-gray-600 mb-1 block text-left">New Password</label>
            <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F] pr-10" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] text-gray-400">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
          </div>
          <div className="relative">
            <label className="text-xs font-medium text-gray-600 mb-1 block text-left">Confirm Password</label>
            <input type={showPw ? 'text' : 'password'} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Confirm password" className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F] pr-10" />
          </div>
        </div>

        {password && confirmPw && password !== confirmPw && (
          <p className="text-red-500 text-xs mt-2 text-left">Passwords do not match</p>
        )}

        <button
          onClick={handleReset}
          disabled={loading || !otp || !password || !confirmPw || password !== confirmPw}
          className="w-full py-4 mt-6 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          ) : 'Save & Login'}
        </button>
      </div>
    </div>
  );
}

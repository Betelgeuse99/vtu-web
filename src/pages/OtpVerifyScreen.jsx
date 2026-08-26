import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OtpVerifyScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const email = searchParams.get('email') || '';
  const fullName = searchParams.get('name') || '';
  const phoneNumber = searchParams.get('phone') || '';
  const password = searchParams.get('password') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpValue) => {
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/verify-otp', {
        email, otp: otpValue || otp.join(''), full_name: fullName, phone_number: phoneNumber, password
      });
      if (res.data.success) {
        login(res.data.user, { access_token: '', refresh_token: '', user: res.data.user });
        navigate('/dashboard');
      } else {
        setError(res.data.message || 'Verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-6 h-6 text-[#0A192F]" /></button>
        <h1 className="text-lg font-bold text-[#0A192F]">Verify Account</h1>
      </div>
      <div className="px-6 pt-6 text-center">
        <h2 className="text-[26px] font-extrabold text-[#0A192F] mb-2">Verify Your Email</h2>
        <p className="text-gray-500 text-sm mb-8 leading-[20px]">
          Enter the code sent to:<br />{email}
        </p>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <div className="flex gap-3 justify-center mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-12 h-12 rounded-[10px] text-center text-2xl font-extrabold focus:outline-none border-2 ${
                digit ? 'border-[#0A192F] bg-white text-[#0A192F]' : 'border-gray-300 bg-[#F9FAFB] text-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => handleVerify()}
          disabled={loading || otp.join('').length < 6}
          className="w-full py-[14px] bg-[#0A192F] text-[#D4AF37] rounded-[14px] text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          ) : 'Verify & Continue'}
        </button>

        <button onClick={() => API.post('/auth/send-otp', { email })} className="mt-4 text-sm font-bold text-[#0A192F]">
          Didn't receive code? Resend
        </button>
      </div>
    </div>
  );
}

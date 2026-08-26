import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import API from '../services/api';

export default function CacRegistrationScreen() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [regType, setRegType] = useState('business_name');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!name1 || !email) return;
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/cac/register', { businessName: name1, regType, applicantEmail: email });
      if (res.data.success) setSuccess(true);
      else setError(res.data.message || 'Registration failed');
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F4F6F9]">
        <TopBar title="CAC Registration" onBack={() => setSuccess(false)} />
        <div className="px-6 pt-10 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
          <h2 className="text-xl font-bold text-[#0A192F] mb-1">Registration Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">You will receive an email with updates.</p>
          <button onClick={() => { setSuccess(false); setName1(''); setEmail(''); }} className="w-full py-4 bg-[#0A192F] text-[#D4AF37] rounded-xl font-bold">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <TopBar title="CAC Registration" onBack />
      <div className="px-5 pt-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Business Name Choice 1</label>
          <input type="text" value={name1} onChange={(e) => setName1(e.target.value)} placeholder="First choice" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Business Name Choice 2</label>
          <input type="text" value={name2} onChange={(e) => setName2(e.target.value)} placeholder="Second choice" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
        </div>
        <div className="flex gap-3">
          {['business_name', 'company'].map((t) => (
            <button key={t} onClick={() => setRegType(t)} className={`flex-1 py-2.5 rounded-full border text-sm font-bold transition-all ${regType === t ? 'bg-[#0A192F] text-[#D4AF37] border-[#0A192F]' : 'bg-white border-gray-300 text-gray-500'}`}>
              {t === 'business_name' ? 'Business Name' : 'Company Ltd'}
            </button>
          ))}
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Applicant Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
        </div>
        <div className="bg-[#EFF6FF] rounded-xl p-4">
          <p className="text-sm text-gray-600">Total Cost</p>
          <p className="text-lg font-bold text-[#1D4ED8]">₦{regType === 'business_name' ? '10,000' : '50,000'}</p>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button onClick={handleSubmit} disabled={loading || !name1 || !email} className="w-full py-4 bg-[#0A192F] text-[#D4AF37] rounded-xl text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center">
          {loading ? <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /> : 'Submit Registration'}
        </button>
      </div>
    </div>
  );
}

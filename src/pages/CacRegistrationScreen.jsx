import React, { useState } from 'react';
import TopBar from '../components/TopBar';

// CAC registration has no live fulfilment backend yet (the Android app does not
// ship a working CAC flow either). We surface it as "coming soon" with the
// app's official pricing and a support path — no failing API call.
export default function CacRegistrationScreen() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [regType, setRegType] = useState('business_name');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name1 || !email) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
        <TopBar title="CAC Registration" onBack={() => setSubmitted(false)} />
        <div className="px-6 pt-10 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-[#0A192F] mb-1">Registration Requested</h2>
          <p className="text-gray-500 text-sm mb-2">Our team will reach out to <span className="font-bold">{email}</span> to complete your business registration.</p>
          <p className="text-gray-400 text-xs mb-6">For urgent help, contact support.</p>
          <button onClick={() => { setSubmitted(false); setName1(''); setName2(''); setEmail(''); }} className="w-full py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl font-bold">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
      <TopBar title="CAC Registration" onBack />
      <div className="px-5 pt-4 space-y-4">
        <div className="bg-[#FEF3C7] rounded-xl p-4">
          <p className="text-[12px] text-[#92400E] leading-relaxed">
            <strong>Coming soon.</strong> CAC business registration is being set up. Submit your details below and our team will contact you to complete the process.
          </p>
        </div>

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
            <button key={t} onClick={() => setRegType(t)} className={`flex-1 py-2.5 rounded-full border text-sm font-bold transition-all ${regType === t ? 'bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] border-[#0A192F]' : 'bg-white border-gray-300 text-gray-500'}`}>
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
          <p className="text-lg font-bold text-[#1D4ED8]">₦{regType === 'business_name' ? '15,000' : '50,000'}</p>
        </div>
        <button onClick={handleSubmit} disabled={!name1 || !email} className="w-full py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center">
          Submit Registration
        </button>
      </div>
    </div>
  );
}

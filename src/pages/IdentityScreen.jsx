import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import TopBar from '../components/TopBar';
import API from '../services/api';

export default function IdentityScreen() {
  const [idType, setIdType] = useState('nin');
  const [nin, setNin] = useState('');
  const [bvn, setBvn] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const type = idType === 'nin' ? 'NIN' : 'BVN';
      const payload = type === 'NIN'
        ? { type, nin }
        : { type, bvn, name: fullName, dateOfBirth: dob, mobileNo: phone };
      const res = await API.post('/monnify-verify', payload);
      if (res.data?.requestSuccessful === true) setResult(res.data);
      else setError(res.data?.responseMessage || 'Verification failed');
    } catch (err) { setError(err.response?.data?.responseMessage || 'Verification failed'); }
    setLoading(false);
  };

  const fullNameFromResult = () => {
    const d = result?.data || {};
    return d.fullName || [d.firstName, d.middleName, d.lastName].filter(Boolean).join(' ').trim();
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
      <TopBar title="Identity Verification" onBack />
      <div className="px-5 pt-4 space-y-5">
        <p className="text-gray-500 text-sm">Verify your identity for enhanced account features.</p>

        <div className="flex gap-3">
          {['nin', 'bvn'].map((t) => (
            <button key={t} onClick={() => { setIdType(t); setResult(null); setError(''); }} className={`flex-1 py-2.5 rounded-full border text-sm font-bold transition-all ${idType === t ? 'bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] border-[#0A192F]' : 'bg-white border-gray-300 text-gray-500'}`}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {idType === 'nin' ? (
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">NIN (11 digits)</label>
            <input type="text" value={nin} onChange={(e) => setNin(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="Enter your NIN" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">BVN (11 digits)</label>
              <input type="text" value={bvn} onChange={(e) => setBvn(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="Enter your BVN" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="As on your BVN" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Date of Birth</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Mobile Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="08012345678" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
            </div>
          </div>
        )}

        {result && (
          <div className="bg-[#ECFDF5] rounded-xl p-4 border border-[#10B981]/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-[#059669]" />
              <p className="text-sm font-bold text-[#065F46]">Verification Result</p>
            </div>
            <div className="space-y-1 text-sm">
              <p>Name: <span className="font-bold">{fullNameFromResult() || 'Verified'}</span></p>
              {result.data?.phoneNumber && <p>Phone: <span className="font-bold">{result.data.phoneNumber}</span></p>}
              {result.data?.gender && <p>Gender: <span className="font-bold">{result.data.gender}</span></p>}
              {result.data?.dateOfBirth && <p>DOB: <span className="font-bold">{result.data.dateOfBirth}</span></p>}
              {idType === 'nin' && (
                <p>NIN Match: <span className="font-bold">{result.data?.match === true ? 'Matched' : 'Confirmed'}</span></p>
              )}
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <p className="text-gray-400 text-[11px]">Verification fee may apply.</p>

        <button onClick={handleVerify} disabled={loading || (idType === 'nin' ? nin.length < 11 : bvn.length < 11 || !fullName || !dob || phone.length < 11)} className="w-full py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center">
          {loading ? <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /> : 'Verify Identity'}
        </button>
      </div>
    </div>
  );
}

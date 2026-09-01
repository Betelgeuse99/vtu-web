import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import TopBar from '../components/TopBar';
import NetworkSelector from '../components/NetworkSelector';
import { formatCurrency } from '../utils/helpers';

const PAYOUT_RATES = { mtn: 80, airtel: 80, glo: 80, '9mobile': 80 };

export default function AirtimeToCashScreen() {
  const [network, setNetwork] = useState(null);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isMismatch = network && phone.length >= 4 && !['0803','0806','0816','0903','0906','0703','0706'].includes(phone.slice(0,4)) && network.slug === 'mtn';

  const payout = network && amount ? Math.floor(Number(amount) * (PAYOUT_RATES[network.slug] || 80) / 100) : 0;

  const handleSubmit = () => {
    if (!network || !phone || !amount) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
        <TopBar title="Airtime to Cash" onBack={() => setSubmitted(false)} />
        <div className="px-6 pt-10 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-[#0A192F] mb-1">Transfer Request Noted</h2>
          <p className="text-gray-500 text-sm mb-2">{formatCurrency(amount)} airtime from {phone} will be credited to your wallet after confirmation.</p>
          <p className="text-gray-400 text-xs mb-6">If your wallet isn't credited within 30 minutes, contact support.</p>
          <button onClick={() => { setSubmitted(false); setAmount(''); setPhone(''); }} className="w-full py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl font-bold">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
      <TopBar title="Airtime to Cash" onBack />
      <div className="px-5 pt-4 space-y-5">
        <div>
          <p className="text-[#0A192F] font-bold text-sm mb-3">1. Select Network</p>
          <NetworkSelector selected={network} onSelect={setNetwork} height="h-[64px]" />
        </div>

        <div>
          <p className="text-[#0A192F] font-bold text-sm mb-3">2. Your Details</p>
          <div className="space-y-3">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="Phone Number" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
            {isMismatch && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0" />
                <span className="text-[12px] text-[#B45309]">This number may not belong to {network?.name}</span>
              </div>
            )}
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (₦100 - ₦5,000)" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
            <p className="text-gray-400 text-[11px]">Daily limit: ₦5,000</p>
          </div>
        </div>

        {network && amount && Number(amount) >= 100 && (
          <div className="bg-[#F3F4F6] rounded-xl p-4">
            <p className="text-sm text-gray-600">You Send: <span className="font-bold">{formatCurrency(amount)}</span></p>
            <p className="text-sm text-gray-600">You Receive ({PAYOUT_RATES[network.slug]}%): <span className="font-bold text-[#D4AF37]">{formatCurrency(payout)}</span></p>
          </div>
        )}

        <div className="bg-[#FEF3C7] rounded-xl p-4">
          <p className="text-[12px] text-[#92400E] leading-relaxed">
            <strong>How it works:</strong><br />
            1. Transfer the exact airtime amount to the number provided<br />
            2. Your wallet will be credited within minutes<br />
            3. Contact support if not credited after 30 minutes
          </p>
        </div>

        <button onClick={handleSubmit} disabled={!network || !phone || !amount || Number(amount) < 100} className="w-full py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center">
          I Have Transferred Airtime
        </button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import TopBar from '../components/TopBar';
import NetworkSelector from '../components/NetworkSelector';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';

const PHONE_PREFIXES = {
  mtn: ['0803', '0806', '0816', '0903', '0906', '0703', '0706'],
  airtel: ['0802', '0808', '0812', '0708', '0902', '0908'],
  glo: ['0805', '0807', '0815', '0905', '0705'],
  '9mobile': ['0809', '0817', '0909', '0817'],
};

export default function AirtimeScreen() {
  const { wallet, fetchBalance } = useAuth();
  const navigate = useNavigate();
  const [network, setNetwork] = useState(null);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [pending, setPending] = useState(null);

  const isMismatch = network && phone.length >= 4 && !PHONE_PREFIXES[network.slug]?.includes(phone.slice(0, 4));
  const minAmt = network?.slug === 'mtn' ? 25 : 50;
  const insufficient = wallet.balance < Number(amount);
  const canBuy = network && phone.length === 11 && Number(amount) >= minAmt && !insufficient && !loading;

  const handleBuy = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/vtu/airtime/purchase', {
        network: network.slug, phone_number: phone, amount: Number(amount)
      });
      if (res.data.success) {
        if (res.data.status === 'pending') {
          // Order accepted but delivery pending — never claim success yet.
          setPending({ amount, reference: res.data.reference, message: res.data.message });
        } else {
          setSuccess({ amount, reference: res.data.reference });
        }
        // Update balance from API response immediately
        if (res.data.balance !== undefined) {
          const wb = { balance: res.data.balance };
          localStorage.setItem('vtu_wallet', JSON.stringify(wb));
        }
        fetchBalance(true);
      } else {
        setError(res.data.message || 'Purchase failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
    }
    setLoading(false);
  };

  if (success) {
    // Auto-return to dashboard after a successful purchase
    setTimeout(() => navigate('/dashboard'), 2500);
    return (
      <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
        <TopBar title="Airtime Top-up" onBack={() => setSuccess(null)} />
        <div className="px-6 pt-10 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-xl font-bold text-[#0A192F] dark:text-white mb-1">Airtime Purchase Successful!</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-2">{formatCurrency(success.amount)} airtime sent to {phone}</p>
          <p className="text-gray-400 text-xs">Ref: {success.reference}</p>
          <p className="text-[11px] text-emerald-600 mt-3 font-medium">Returning to dashboard...</p>
          <button onClick={() => navigate('/dashboard')} className="w-full py-4 mt-8 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl font-bold">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  if (pending) {
    // Auto-return to dashboard after a pending (in-progress) purchase
    setTimeout(() => navigate('/dashboard'), 2500);
    return (
      <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
        <TopBar title="Airtime Top-up" onBack={() => setPending(null)} />
        <div className="px-6 pt-10 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-[#0A192F] dark:text-white mb-1">Airtime Being Processed</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-2">{formatCurrency(pending.amount)} airtime to {phone} is on its way.</p>
          <p className="text-gray-400 text-xs">Ref: {pending.reference}</p>
          <p className="text-[11px] text-amber-600 mt-3 font-medium">Returning to dashboard...</p>
          <button onClick={() => navigate('/dashboard')} className="w-full py-4 mt-8 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl font-bold">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
      <TopBar title="Airtime Top-up" onBack />
      <div className="px-5 pt-4 space-y-5">
        <div>
          <p className="text-[#0A192F] dark:text-white font-bold text-sm mb-3">Select Network</p>
          <NetworkSelector selected={network} onSelect={setNetwork} />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 block">Phone Number</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="08012345678" className="w-full bg-white dark:bg-[#1E293B] dark:text-white border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
        </div>

        {isMismatch && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-2.5">
            <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0" />
            <span className="text-[12px] text-[#B45309]">This number may not belong to {network?.name?.toUpperCase()}. Please double-check.</span>
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 block">Amount (₦)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Min ${network?.slug === 'mtn' ? '₦25' : '₦50'}`} className="w-full bg-white dark:bg-[#1E293B] dark:text-white border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          {amount && insufficient && (
            <p className="text-red-500 text-xs mt-1">Insufficient wallet balance. Available: {formatCurrency(wallet.balance)}</p>
          )}
        </div>

        <button onClick={handleBuy} disabled={!canBuy} className="w-full py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center">
          {loading ? <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /> : 'Buy Airtime'}
        </button>
      </div>
    </div>
  );
}

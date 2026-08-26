import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import TopBar from '../components/TopBar';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';

const PROVIDERS = [
  { id: 'gotv', name: 'GOtv', color: '#006B3F' },
  { id: 'dstv', name: 'DStv', color: '#003B73' },
  { id: 'startimes', name: 'StarTimes', color: '#E30613' },
  { id: 'showmax', name: 'Showmax', color: '#000000' },
];

export default function CableScreen() {
  const { wallet, fetchBalance } = useAuth();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [cardNo, setCardNo] = useState('');
  const [verifyData, setVerifyData] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (provider) {
      API.get(`/api/v2/vtu/cable/plans?cable_name=${provider.id}`)
        .then((res) => setPlans(Array.isArray(res.data.data) ? res.data.data : []))
        .catch(() => setPlans([]));
    }
  }, [provider]);

  const handleVerify = async () => {
    if (!cardNo || !provider) return;
    setVerifying(true);
    try {
      const res = await API.post('/api/v2/vtu/cable/verify', { cable_name: provider.id, card_no: cardNo });
      if (res.data.success) setVerifyData(res.data.data);
      else setError(res.data.message || 'Verification failed');
    } catch (err) { setError(err.response?.data?.message || 'Verification failed'); }
    setVerifying(false);
  };

  const planPrice = selectedPlan ? Number(selectedPlan.amount ?? selectedPlan.plan_amount ?? 0) : 0;
  const balance = Number(wallet.balance) || 0;

  const handleBuy = async () => {
    if (!selectedPlan || !cardNo || !phone) return;
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/api/v2/vtu/cable/purchase', {
        cable_type: provider.id, card_no: cardNo, phone_number: phone, amount: planPrice, Customer: verifyData?.customerName || ''
      });
      if (res.data.success) { setSuccess(selectedPlan); if (res.data.balance !== undefined) { localStorage.setItem('vtu_wallet', JSON.stringify({ balance: res.data.balance })); } fetchBalance(true); }
      else setError(res.data.message || 'Purchase failed');
    } catch (err) { setError(err.response?.data?.message || 'Purchase failed'); }
    setLoading(false);
  };

  if (success) {
    // Auto-return to dashboard after a successful purchase
    setTimeout(() => navigate('/dashboard'), 2500);
    return (
      <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
        <TopBar title="Cable TV" onBack={() => setSuccess(null)} />
        <div className="px-6 pt-10 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
          <h2 className="text-xl font-bold text-[#0A192F] mb-1">Cable Subscription Successful!</h2>
          <p className="text-gray-500 text-sm">{success.product_name} — {formatCurrency(success.amount)}</p>
          <p className="text-[11px] text-emerald-600 mt-3 font-medium">Returning to dashboard...</p>
          <button onClick={() => navigate('/dashboard')} className="w-full py-4 mt-8 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl font-bold">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
      <TopBar title="Cable TV" onBack />
      <div className="px-5 pt-4 space-y-5">
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-[12px] font-black text-gray-600 tracking-[0.5px] mb-3 uppercase">Select Provider</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {PROVIDERS.map((p) => (
              <button key={p.id} onClick={() => { setProvider(p); setVerifyData(null); setSelectedPlan(null); }} className={`min-w-[90px] h-[90px] rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all shrink-0 ${provider?.id === p.id ? 'border-[#D4AF37]' : 'border-gray-200'}`}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs text-white" style={{ backgroundColor: p.color }}>{p.name.slice(0, 2)}</div>
                <span className="text-[11px] font-bold">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {provider && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-[12px] font-black text-gray-600 tracking-[0.5px] mb-3 uppercase">Smart Card / IUC Number</p>
            <div className="flex gap-2">
              <input type="text" value={cardNo} onChange={(e) => setCardNo(e.target.value)} placeholder="Enter card number" className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0A192F]" />
              <button onClick={handleVerify} disabled={verifying || !cardNo} className="px-4 py-2 border border-[#0A192F] rounded-xl text-[#0A192F] text-xs font-bold disabled:opacity-50">{verifying ? '...' : 'Verify'}</button>
            </div>
          </div>
        )}

        {verifyData && (
          <div className="bg-[#ECFDF5] rounded-xl p-4 border border-[#10B981]/20">
            <p className="text-[12px] font-black text-[#065F46] mb-2">Verification Successful</p>
            <p className="text-sm text-[#0A192F]">Name: <span className="font-bold">{verifyData.customerName}</span></p>
            <p className="text-sm text-[#0A192F]">Current Plan: <span className="font-bold">{verifyData.currentBouquet}</span></p>
          </div>
        )}

        {verifyData && plans.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Select Plan</label>
            <select value={selectedPlan?.id || ''} onChange={(e) => setSelectedPlan(plans.find(p => p.id === e.target.value))} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0A192F] bg-white">
              <option value="">Choose a plan</option>
              {plans.map((p) => <option key={p.id} value={p.id}>{p.product_name} — {formatCurrency(p.amount)}</option>)}
            </select>
          </div>
        )}

        {selectedPlan && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="08012345678" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            {planPrice > 0 && balance < planPrice && (
              <p className="text-red-500 text-[11px]">Insufficient balance — please fund your wallet first.</p>
            )}
            <button onClick={handleBuy} disabled={loading || !phone || planPrice <= 0 || balance < planPrice} className="w-full py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl text-[16px] font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center">
              {loading ? <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /> : 'PAY SUBSCRIPTION'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

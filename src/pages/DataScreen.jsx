import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import TopBar from '../components/TopBar';
import NetworkSelector from '../components/NetworkSelector';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';

export default function DataScreen() {
  const { wallet, fetchBalance } = useAuth();
  const navigate = useNavigate();
  const [network, setNetwork] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [pending, setPending] = useState(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    if (network) {
      setLoadingPlans(true);
      setSelectedPlan(null);
      API.get(`/vtu/data/plans?network=${network.id}`)
        .then((res) => setPlans(res.data.data || []))
        .catch(() => setPlans([]))
        .finally(() => setLoadingPlans(false));
    }
  }, [network]);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setExpanded(false);
    // Scroll straight to the phone number input section
    setTimeout(() => {
      summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const planPrice = selectedPlan ? Number(selectedPlan.amount ?? selectedPlan.plan_amount ?? selectedPlan.retail_price ?? 0) : 0;
  const balance = Number(wallet.balance) || 0;
  const canBuy = network && selectedPlan && phone.length === 11 && planPrice > 0 && balance >= planPrice;
  const insufficient = selectedPlan && balance < planPrice;

  const handleBuy = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/vtu/data/purchase', {
        network: network.slug, plan: selectedPlan.plan_id || selectedPlan.id, phone_number: phone, amount: planPrice
      });
      if (res.data.success) {
        if (res.data.status === 'pending') {
          setPending({ plan: selectedPlan, reference: res.data.reference, message: res.data.message });
        } else {
          setSuccess({ plan: selectedPlan, reference: res.data.reference });
        }
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
        <TopBar title="Data Bundles" onBack={() => setSuccess(null)} />
        <div className="px-6 pt-10 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-xl font-bold text-[#0A192F] dark:text-white mb-1">Data Purchase Successful!</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-2">{success.plan.size} sent to {phone}</p>
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
        <TopBar title="Data Bundles" onBack={() => setPending(null)} />
        <div className="px-6 pt-10 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-[#0A192F] dark:text-white mb-1">Data Being Processed</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-2">{pending.plan.size} to {phone} is being delivered.</p>
          <p className="text-gray-400 text-xs">Ref: {pending.reference}</p>
          <p className="text-[11px] text-amber-600 mt-3 font-medium">Returning to dashboard...</p>
          <button onClick={() => navigate('/dashboard')} className="w-full py-4 mt-8 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl font-bold">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
      <TopBar title="Data Bundles" onBack />
      <div className="px-5 pt-4 space-y-5">
        {/* Network Provider */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
          <p className="text-[12px] font-black text-gray-600 dark:text-slate-400 tracking-[0.5px] mb-3 uppercase">Select Network Provider</p>
          <NetworkSelector selected={network} onSelect={setNetwork} height="h-[90px]" />
        </div>

        {/* Plans */}
        {network && (
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
            <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-4">
              <p className="text-[12px] font-black text-gray-600 dark:text-slate-400 tracking-[0.5px] uppercase">Select Data Plan</p>
              {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expanded && (
              <div className="px-4 pb-4">
                {loadingPlans ? (
                  <div className="flex items-center justify-center py-6 gap-2">
                    <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-500 dark:text-slate-400 text-sm">Loading plans...</span>
                  </div>
                ) : plans.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">No plans available for {network.name}</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto">
                    {plans.map((plan) => (
                      <button
                        key={plan.id || plan.plan_id}
                        onClick={() => handleSelectPlan(plan)}
                        className={`rounded-xl p-3 text-left border-2 transition-all ${selectedPlan?.id === plan.id ? 'border-[#D4AF37]' : 'border-gray-200 dark:border-slate-700'}`}
                      >
                        <p className="text-[18px] font-bold text-[#0A192F] dark:text-white">{plan.size || plan.volume}</p>
                        <p className="text-[15px] font-bold text-[#D4AF37]">{formatCurrency(Number(plan.amount ?? plan.plan_amount ?? plan.retail_price ?? 0))}</p>
                        <p className="text-[11px] font-bold text-[#0A192F] dark:text-white">{plan.validity}</p>
                        <span className="inline-block mt-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-xl bg-[#FEF3C7] text-[#D4AF37]">{plan.plantype || plan.plan_type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Summary & Purchase */}
        {selectedPlan && (
          <>
            <div ref={summaryRef} className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-gray-100 dark:border-slate-700 scroll-mt-16">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center font-bold text-xs" style={{ backgroundColor: network.color, color: network.textColor }}>{network.name}</div>
                <div className="flex-1">
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Network</p>
                  <p className="text-sm font-bold text-[#D4AF37]">{network.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center"><Check className="w-5 h-5 text-[#D4AF37]" /></div>
                <div className="flex-1">
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Data Plan</p>
                  <p className="text-sm font-bold text-[#D4AF37]">{selectedPlan.size || selectedPlan.volume} — {formatCurrency(planPrice)}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 block">Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="08012345678" className="w-full border-2 border-[#D4AF37] rounded-xl px-4 py-3 text-sm focus:outline-none" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-gray-500 dark:text-slate-400 text-[13px] font-bold">Available Balance</span>
                <span className={`text-[15px] font-bold ${balance < planPrice ? 'text-red-500' : 'text-[#D4AF37]'}`}>{formatCurrency(balance)}</span>
              </div>
              {insufficient && (
                <p className="text-red-500 text-[11px] mt-1">Insufficient balance — please fund your wallet first.</p>
              )}
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button onClick={handleBuy} disabled={!canBuy} className="w-full py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl text-[16px] font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center">
              {loading ? <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /> : 'BUY DATA'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

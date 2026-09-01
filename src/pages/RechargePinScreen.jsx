import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import NetworkSelector from '../components/NetworkSelector';
import API from '../services/api';
import { formatCurrency } from '../utils/helpers';

export default function RechargePinScreen() {
  const [network, setNetwork] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cardName, setCardName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pins, setPins] = useState(null);

  useEffect(() => {
    if (network) {
      API.get(`/vtu/recharge-pin/plans?network=${network.slug}`)
        .then((res) => setPlans(res.data.data || []))
        .catch(() => setPlans([]));
    }
  }, [network]);

  const handleBuy = async () => {
    if (!network || !selectedPlan) return;
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/vtu/recharge-pin/purchase', {
        network: network.slug, plan: selectedPlan.id, quantity, name_on_card: cardName || undefined
      });
      if (res.data.success) {
        if (res.data.status === 'pending') setError('Your recharge PINs are being processed. They will deliver shortly.');
        else setPins(res.data.data);
      }
      else setError(res.data.message || 'Purchase failed');
    } catch (err) { setError(err.response?.data?.message || 'Purchase failed'); }
    setLoading(false);
  };

  if (pins) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
        <TopBar title="Recharge Card PINs" onBack={() => setPins(null)} />
        <div className="px-6 pt-6">
          <h2 className="text-xl font-bold text-[#0A192F] mb-4">Your PINs</h2>
          <div className="bg-[#F3F4F6] rounded-xl p-4 space-y-2 mb-6">
            <pre className="text-sm font-bold text-[#0A192F] whitespace-pre-wrap">{JSON.stringify(pins, null, 2)}</pre>
          </div>
          <button onClick={() => { setPins(null); setSelectedPlan(null); }} className="w-full py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl font-bold">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
      <TopBar title="Recharge Card PINs" onBack />
      <div className="px-5 pt-4 space-y-5">
        <div>
          <p className="text-[#0A192F] font-bold text-sm mb-3">Select Network</p>
          <NetworkSelector selected={network} onSelect={(n) => { setNetwork(n); setSelectedPlan(null); }} />
        </div>

        {network && plans.length > 0 && (
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Select Denomination</label>
            <select value={selectedPlan?.id || ''} onChange={(e) => setSelectedPlan(plans.find(p => String(p.id) === e.target.value))} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]">
              <option value="">Choose denomination</option>
              {plans.map((p) => <option key={p.id} value={p.id}>{p.size || formatCurrency(p.amount)} — {formatCurrency(p.regular_price || p.plan_amount || p.amount)}</option>)}
            </select>
          </div>
        )}

        {selectedPlan && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Quantity (1-5)</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(Math.min(10, Math.max(1, Number(e.target.value))))} min={1} max={10} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Name on Card (optional)</label>
              <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="e.g. Dreamhatcher-VTU" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
            </div>
            <p className="text-lg font-bold text-[#0A192F]">Total: {formatCurrency((selectedPlan.regular_price || selectedPlan.amount || 0) * quantity)}</p>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button onClick={handleBuy} disabled={loading} className="w-full py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center">
              {loading ? <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /> : 'Generate PINs'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

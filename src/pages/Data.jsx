import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Wifi, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const networks = [
  { id: 'mtn', name: 'MTN', color: '#FFCC00', textColor: '#0A192F' },
  { id: 'airtel', name: 'Airtel', color: '#E50914', textColor: '#FFFFFF' },
  { id: 'glo', name: 'Glo', color: '#28A745', textColor: '#FFFFFF' },
  { id: '9mobile', name: '9Mobile', color: '#006837', textColor: '#FFFFFF' },
];

const plans = {
  mtn: [
    { id: 1, name: '500MB', validity: '30 days', price: 150 },
    { id: 2, name: '1GB', validity: '30 days', price: 280 },
    { id: 3, name: '2GB', validity: '30 days', price: 500 },
    { id: 4, name: '5GB', validity: '30 days', price: 1200 },
  ],
  airtel: [
    { id: 5, name: '500MB', validity: '30 days', price: 150 },
    { id: 6, name: '1GB', validity: '30 days', price: 300 },
    { id: 7, name: '2GB', validity: '30 days', price: 550 },
    { id: 8, name: '5GB', validity: '30 days', price: 1250 },
  ],
  glo: [
    { id: 9, name: '500MB', validity: '30 days', price: 130 },
    { id: 10, name: '1GB', validity: '30 days', price: 250 },
    { id: 11, name: '2GB', validity: '30 days', price: 450 },
    { id: 12, name: '5GB', validity: '30 days', price: 1100 },
  ],
  '9mobile': [
    { id: 13, name: '500MB', validity: '30 days', price: 140 },
    { id: 14, name: '1GB', validity: '30 days', price: 270 },
    { id: 15, name: '2GB', validity: '30 days', price: 480 },
    { id: 16, name: '5GB', validity: '30 days', price: 1150 },
  ],
};

export default function Data() {
  const { walletBalance, fetchBalance } = useAuth();
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [expandedNetwork, setExpandedNetwork] = useState(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleExpand = (id) => {
    setExpandedNetwork(expandedNetwork === id ? null : id);
    setSelectedNetwork(id);
  };

  const handleBuy = async (plan) => {
    if (!phone || phone.length < 11) return;
    setLoading(true);
    try {
      await API.post('/data/buy', { network: selectedNetwork, phone, planId: plan.id });
      fetchBalance();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A192F] text-slate-100 px-4 pt-6 pb-24">
      <h1 className="text-xl font-bold text-white mb-1">Buy Data</h1>
      <p className="text-xs text-slate-400 mb-4">Select a network and choose a plan</p>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-300 font-medium">Data purchased successfully!</span>
        </div>
      )}

      {/* Phone Number */}
      <div className="mb-4">
        <label className="text-xs text-slate-400 mb-1 block">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="08012345678"
          className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
          maxLength={11}
        />
      </div>

      {/* Network Providers */}
      <div className="space-y-3">
        {networks.map((net) => {
          const netPlans = plans[net.id];
          const isExpanded = expandedNetwork === net.id;
          const isSelected = selectedNetwork === net.id;
          return (
            <div key={net.id} className={`rounded-2xl border transition-all ${isSelected ? 'border-[#D4AF37]' : 'border-slate-700'} overflow-hidden`}>
              <button
                onClick={() => toggleExpand(net.id)}
                className="w-full flex items-center justify-between p-4 bg-[#1E293B]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm" style={{ backgroundColor: net.color, color: net.textColor }}>
                    {net.name}
                  </div>
                  <span className="text-sm font-semibold text-white">{net.name} Data</span>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              {isExpanded && (
                <div className="p-3 space-y-2 bg-[#0F172A]">
                  {netPlans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl border border-slate-700">
                      <div>
                        <p className="text-sm font-bold text-white">{plan.name}</p>
                        <p className="text-[11px] text-slate-400">{plan.validity}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold text-[#D4AF37]">₦{plan.price.toLocaleString()}</span>
                        <button
                          onClick={() => handleBuy(plan)}
                          disabled={loading || !phone || phone.length < 11}
                          className="px-3 py-1.5 bg-[#D4AF37] text-[#0A192F] rounded-lg text-xs font-bold disabled:opacity-50 hover:bg-[#c9a230] transition"
                        >
                          {loading ? '...' : 'Buy'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

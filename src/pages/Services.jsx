import React, { useState } from 'react';
import { Tv, Zap, GraduationCap, ArrowRightLeft, Hash, ChevronRight, CheckCircle2 } from 'lucide-react';
import API from '../services/api';

const services = [
  { id: 'cable', label: 'Cable TV', icon: Tv, color: 'bg-amber-500', description: 'Subscribe cable TV packages' },
  { id: 'electricity', label: 'Electricity', icon: Zap, color: 'bg-purple-500', description: 'Pay electricity bills' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: 'bg-sky-500', description: 'Buy scratch cards & PINs' },
  { id: 'airtime2cash', label: 'Airtime to Cash', icon: ArrowRightLeft, color: 'bg-teal-500', description: 'Convert airtime to cash' },
  { id: 'recharge', label: 'Recharge PIN', icon: Hash, color: 'bg-rose-500', description: 'Generate recharge PINs' },
];

const cableProviders = [
  { id: 'dstv', name: 'DStv', plans: [{ name: 'Dstv Compact', price: 6800, days: 30 }, { name: 'Dstv Premium', price: 18500, days: 30 }] },
  { id: 'gotv', name: 'GOtv', plans: [{ name: 'GOtv Lite', price: 1800, days: 30 }, { name: 'GOtv Max', price: 4200, days: 30 }] },
  { id: 'startimes', name: 'Startimes', plans: [{ name: 'Start Basic', price: 2200, days: 30 }, { name: 'Start Classic', price: 3500, days: 30 }] },
];

export default function Services() {
  const [activeService, setActiveService] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [smartcard, setSmartcard] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCableSubscribe = async (plan) => {
    if (!smartcard || smartcard.length < 8) return;
    setLoading(true);
    try {
      await API.post('/services/cable', { provider: selectedProvider.id, smartcard, plan: plan.name });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleElectricity = async () => {
    if (!meterNumber || !amount) return;
    setLoading(true);
    try {
      await API.post('/services/electricity', { meterNumber, amount: Number(amount) });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A192F] text-slate-100 px-4 pt-6 pb-24">
      <h1 className="text-xl font-bold text-white mb-1">Services</h1>
      <p className="text-xs text-slate-400 mb-4">Choose a service category</p>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-300 font-medium">Transaction successful!</span>
        </div>
      )}

      {!activeService ? (
        <div className="space-y-3">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <button
                key={svc.id}
                onClick={() => { setActiveService(svc.id); setSelectedProvider(null); }}
                className="w-full flex items-center gap-3 p-4 bg-[#1E293B] rounded-xl border border-slate-700 hover:border-[#D4AF37] transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${svc.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-bold text-white">{svc.label}</p>
                  <p className="text-[11px] text-slate-400">{svc.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </button>
            );
          })}
        </div>
      ) : activeService === 'cable' ? (
        <div>
          <button onClick={() => { setActiveService(null); setSelectedProvider(null); }} className="text-xs text-[#D4AF37] mb-3 font-semibold">&larr; Back to Services</button>
          {!selectedProvider ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Select Provider</h3>
              {cableProviders.map((prov) => (
                <button key={prov.id} onClick={() => setSelectedProvider(prov)} className="w-full p-4 bg-[#1E293B] rounded-xl border border-slate-700 hover:border-[#D4AF37] transition text-left">
                  <p className="text-sm font-bold text-white">{prov.name}</p>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">{selectedProvider.name} Subscription</h3>
              <input type="text" value={smartcard} onChange={(e) => setSmartcard(e.target.value)} placeholder="Smartcard / IUC Number" className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] mb-4" />
              <div className="space-y-2">
                {selectedProvider.plans.map((plan) => (
                  <div key={plan.name} className="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl border border-slate-700">
                    <div>
                      <p className="text-sm font-bold text-white">{plan.name}</p>
                      <p className="text-[11px] text-slate-400">{plan.days} days</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-[#D4AF37]">₦{plan.price.toLocaleString()}</span>
                      <button onClick={() => handleCableSubscribe(plan)} disabled={loading || !smartcard || smartcard.length < 8} className="px-3 py-1.5 bg-[#D4AF37] text-[#0A192F] rounded-lg text-xs font-bold disabled:opacity-50">
                        {loading ? '...' : 'Subscribe'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : activeService === 'electricity' ? (
        <div>
          <button onClick={() => setActiveService(null)} className="text-xs text-[#D4AF37] mb-3 font-semibold">&larr; Back to Services</button>
          <h3 className="text-sm font-semibold text-white mb-2">Pay Electricity</h3>
          <input type="text" value={meterNumber} onChange={(e) => setMeterNumber(e.target.value)} placeholder="Meter Number" className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] mb-3" />
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (₦)" className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] mb-4" />
          <button onClick={handleElectricity} disabled={loading || !meterNumber || !amount} className="w-full py-3.5 bg-[#D4AF37] text-[#0A192F] rounded-xl text-sm font-bold disabled:opacity-50">
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      ) : (
        <div>
          <button onClick={() => setActiveService(null)} className="text-xs text-[#D4AF37] mb-3 font-semibold">&larr; Back to Services</button>
          <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700 text-center">
            <p className="text-sm text-slate-300">{services.find(s => s.id === activeService)?.label} service is coming soon.</p>
          </div>
        </div>
      )}
    </div>
  );
}

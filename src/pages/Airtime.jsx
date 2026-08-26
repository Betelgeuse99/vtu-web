import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const networks = [
  { id: 'mtn', name: 'MTN', color: '#FFCC00', textColor: '#0A192F' },
  { id: 'airtel', name: 'Airtel', color: '#E50914', textColor: '#FFFFFF' },
  { id: 'glo', name: 'Glo', color: '#28A745', textColor: '#FFFFFF' },
  { id: '9mobile', name: '9Mobile', color: '#006837', textColor: '#FFFFFF' },
];

const amounts = [100, 200, 500, 1000, 2000, 5000];

export default function Airtime() {
  const { walletBalance, fetchBalance } = useAuth();
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const phonePrefixes = {
    mtn: ['0803', '0806', '0816', '0903', '0906', '0703', '0706'],
    airtel: ['0802', '0808', '0812', '0708', '0902', '0908'],
    glo: ['0805', '0807', '0815', '0905', '0705'],
    '9mobile': ['0809', '0817', '0909', '0817'],
  };

  const isCorrectPrefix = () => {
    if (!selectedNetwork || !phone || phone.length < 4) return true;
    const prefix = phone.substring(0, 4);
    return phonePrefixes[selectedNetwork]?.includes(prefix);
  };

  const handleBuy = async () => {
    if (!selectedNetwork || !phone || !amount || phone.length < 11) return;
    setLoading(true);
    try {
      await API.post('/airtime/buy', { network: selectedNetwork, phone, amount: Number(amount) });
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
      <h1 className="text-xl font-bold text-white mb-1">Buy Airtime</h1>
      <p className="text-xs text-slate-400 mb-4">Select network, enter phone number and amount</p>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-300 font-medium">Airtime purchased successfully!</span>
        </div>
      )}

      {/* Network Selection */}
      <div className="mb-4">
        <label className="text-xs text-slate-400 mb-2 block">Network</label>
        <div className="grid grid-cols-4 gap-2">
          {networks.map((net) => (
            <button
              key={net.id}
              onClick={() => setSelectedNetwork(net.id)}
              className={`p-3 rounded-xl border text-center transition-all ${selectedNetwork === net.id ? 'border-[#D4AF37] bg-[#1E293B]' : 'border-slate-700 bg-[#1E293B]'}`}
            >
              <div className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center font-bold text-xs mb-1" style={{ backgroundColor: net.color, color: net.textColor }}>
                {net.name}
              </div>
              <span className="text-[10px] text-slate-300">{net.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Phone Number */}
      <div className="mb-3">
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

      {!isCorrectPrefix() && (
        <div className="flex items-center gap-2 p-2 bg-amber-500/20 border border-amber-500/40 rounded-xl mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px] text-amber-300">This number may not belong to {selectedNetwork?.toUpperCase()}. Please double-check.</span>
        </div>
      )}

      {/* Amount Input */}
      <div className="mb-3">
        <label className="text-xs text-slate-400 mb-1 block">Amount (₦)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
        />
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {amounts.map((amt) => (
          <button
            key={amt}
            onClick={() => setAmount(String(amt))}
            className={`py-2 rounded-xl border text-xs font-bold transition-all ${amount === String(amt) ? 'bg-[#D4AF37] text-[#0A192F] border-[#D4AF37]' : 'bg-[#1E293B] text-slate-300 border-slate-700 hover:border-[#D4AF37]'}`}
          >
            ₦{amt.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Buy Button */}
      <button
        onClick={handleBuy}
        disabled={loading || !selectedNetwork || !phone || phone.length < 11 || !amount}
        className="w-full py-3.5 bg-[#D4AF37] text-[#0A192F] rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-[#c9a230] transition-all active:scale-[0.98]"
      >
        {loading ? 'Processing...' : 'Buy Airtime'}
      </button>
    </div>
  );
}

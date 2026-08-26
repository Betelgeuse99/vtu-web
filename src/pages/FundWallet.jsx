import React, { useState } from 'react';
import { CreditCard, Building2, Smartphone, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

const paymentMethods = [
  { id: 'card', label: 'Card Payment', icon: CreditCard, description: 'Pay with debit/credit card' },
  { id: 'bank', label: 'Bank Transfer', icon: Building2, description: 'Transfer to your wallet account' },
  { id: 'ussd', label: 'USSD', icon: Smartphone, description: 'Pay via USSD code' },
];

export default function FundWallet() {
  const { walletBalance, fetchBalance } = useAuth();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const MIN_FUND = 100;

  const handleFund = async () => {
    const val = Number(amount);
    if (!val || val < MIN_FUND) return;
    setLoading(true);
    try {
      await API.post('/wallet/fund', { amount: val, method: selectedMethod });
      fetchBalance();
      setSuccess(true);
      setAmount('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const isInvalid = !amount || Number(amount) < MIN_FUND;

  return (
    <div className="min-h-screen bg-[#0A192F] text-slate-100 px-4 pt-6 pb-24">
      <h1 className="text-xl font-bold text-white mb-1">Fund Wallet</h1>
      <p className="text-xs text-slate-400 mb-4">Add money to your wallet</p>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-300 font-medium">Wallet funded successfully!</span>
        </div>
      )}

      {/* Current Balance */}
      <div className="bg-[#1E293B] rounded-2xl p-4 border border-slate-700 mb-5">
        <span className="text-xs text-slate-400">Current Balance</span>
        <p className="text-2xl font-extrabold text-[#D4AF37] mt-1">₦{walletBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
      </div>

      {/* Amount Input */}
      <div className="mb-3">
        <label className="text-xs text-slate-400 mb-1 block">Amount to Fund (₦)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Minimum ₦${MIN_FUND}`}
          className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3.5 text-lg font-bold text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
        />
        {amount && Number(amount) < MIN_FUND && (
          <p className="text-[11px] text-rose-400 mt-1">Minimum funding amount is ₦{MIN_FUND}</p>
        )}
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {quickAmounts.map((amt) => (
          <button
            key={amt}
            onClick={() => setAmount(String(amt))}
            className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${amount === String(amt) ? 'bg-[#D4AF37] text-[#0A192F] border-[#D4AF37]' : 'bg-[#1E293B] text-slate-300 border-slate-700 hover:border-[#D4AF37]'}`}
          >
            ₦{amt.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <label className="text-xs text-slate-400 mb-2 block">Payment Method</label>
        <div className="space-y-2">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${selectedMethod === method.id ? 'border-[#D4AF37] bg-[#1E293B]' : 'border-slate-700 bg-[#1E293B]'}`}
              >
                <Icon className="w-5 h-5 text-[#D4AF37]" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{method.label}</p>
                  <p className="text-[11px] text-slate-400">{method.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fund Button */}
      <button
        onClick={handleFund}
        disabled={loading || isInvalid}
        className="w-full py-3.5 bg-[#D4AF37] text-[#0A192F] rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-[#c9a230] transition-all active:scale-[0.98]"
      >
        {loading ? 'Processing...' : `Fund ₦${amount ? Number(amount).toLocaleString() : '0'}`}
      </button>
    </div>
  );
}

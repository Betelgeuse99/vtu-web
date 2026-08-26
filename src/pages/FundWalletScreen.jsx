import React, { useState } from 'react';
import { CreditCard, HelpCircle } from 'lucide-react';
import TopBar from '../components/TopBar';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';

export default function FundWalletScreen() {
  const { wallet } = useAuth();
  const [amount, setAmount] = useState('');

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <TopBar title="Fund Wallet" onBack />
      <div className="px-5 pt-4 space-y-5">
        <div>
          <h2 className="text-[20px] font-bold text-[#0A192F] mb-4">Fund Wallet</h2>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Enter Amount (Min ₦100)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="₦0.00" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
        </div>

        <button disabled={!amount || Number(amount) < 100} className="w-full py-4 bg-[#0A192F] text-[#D4AF37] rounded-xl text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
          <CreditCard className="w-5 h-5 text-[#D4AF37]" />
          Proceed to Payment
        </button>
        <p className="text-gray-500 text-xs text-center">A processing fee applies to card payments.</p>

        <div className="bg-[#F0F9FF] rounded-xl p-4 flex gap-3">
          <HelpCircle className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
          <div className="text-[12px] text-[#0369A1] leading-relaxed">
            <p className="font-bold mb-1">How to Fund</p>
            <p>1. Click "Proceed to Payment" above</p>
            <p>2. Choose Card, Bank Transfer, or USSD</p>
            <p>3. Complete payment — wallet updates instantly</p>
            <p className="mt-1">Your current balance: <span className="font-bold">{formatCurrency(wallet.balance)}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

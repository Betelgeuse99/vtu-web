import React, { useState, useEffect, useCallback } from 'react';
import TopBar from '../components/TopBar';
import StatusBadge from '../components/StatusBadge';
import API from '../services/api';
import { formatCurrency } from '../utils/helpers';
import { Phone, Globe, Zap, Tv, Receipt, RefreshCw } from 'lucide-react';

const ICON_MAP = {
  airtime: { icon: Phone, bg: '#DCFCE7' },
  data: { icon: Globe, bg: '#DCFCE7' },
  cable: { icon: Tv, bg: '#DCFCE7' },
  electricity: { icon: Zap, bg: '#DCFCE7' },
  funding: { icon: Receipt, bg: '#DCFCE7' },
  exam_pin: { icon: Receipt, bg: '#DCFCE7' },
  recharge_pin: { icon: Receipt, bg: '#DCFCE7' },
};

export default function TransactionsScreen() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchTxns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/transactions');
      setTxns(res.data.data || res.data.transactions || []);
    } catch {
      try {
        const res2 = await API.get('/api/v2/transactions');
        setTxns(res2.data.data || res2.data.transactions || []);
      } catch {
        setTxns([]);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTxns(); }, [fetchTxns]);

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <TopBar title="Transaction History" onBack />
      <div className="px-4 pt-2">
        <div className="flex justify-end mb-2">
          <button onClick={fetchTxns} className="p-2 text-gray-400"><RefreshCw className="w-4 h-4" /></button>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /></div>
        ) : txns.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Receipt className="w-12 h-12 mx-auto mb-3" />
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs mt-1">Transactions will appear here after your first purchase</p>
          </div>
        ) : (
          <div className="space-y-2">
            {txns.map((tx) => {
              const iconInfo = ICON_MAP[tx.service_type] || ICON_MAP.funding;
              const Icon = iconInfo.icon;
              return (
                <button key={tx.id} onClick={() => setSelected(tx)} className="w-full flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 active:bg-gray-50">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: tx.status === 'successful' ? '#DCFCE7' : tx.status === 'failed' ? '#FEE2E2' : '#FEF3C7' }}>
                    <Icon className="w-5 h-5 text-[#0A192F]" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-[15px] font-bold text-[#0A192F] truncate">{tx.title || tx.service_type}</p>
                    <p className="text-xs text-gray-400">{tx.created_at ? new Date(tx.created_at).toLocaleDateString() : ''}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[15px] font-bold text-[#0A192F]">-{formatCurrency(tx.amount)}</p>
                    <StatusBadge status={tx.status} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md bg-[#F8FAFC] rounded-t-2xl p-6 pb-8 max-h-[80vh] overflow-y-auto">
            <h3 className="text-[18px] font-bold text-[#0A192F] mb-4">Transaction Details</h3>
            <div className="bg-white rounded-2xl p-4 mb-3">
              <p className="text-[15px] font-bold text-[#0A192F]">{selected.title}</p>
              <p className="text-[28px] font-bold text-[#0A192F]">{formatCurrency(selected.amount)}</p>
              <StatusBadge status={selected.status} />
            </div>
            <div className="bg-white rounded-2xl p-4 space-y-2 text-sm">
              <p className="font-bold text-gray-500 text-[14px] mb-2">Transaction Details</p>
              <div className="flex justify-between gap-2"><span className="text-gray-500 shrink-0">Recipient</span><span className="font-medium text-right truncate">{selected.recipient}</span></div>
              <div className="flex justify-between gap-2"><span className="text-gray-500 shrink-0">Type</span><span className="font-medium">{selected.service_type}</span></div>
              {selected.reference && <div className="flex justify-between gap-2"><span className="text-gray-500 shrink-0">Reference</span><span className="font-medium text-xs text-right truncate">{selected.reference}</span></div>}
              <div className="flex justify-between gap-2"><span className="text-gray-500 shrink-0">Date</span><span className="font-medium text-right">{selected.created_at ? new Date(selected.created_at).toLocaleString() : ''}</span></div>
            </div>
            <button onClick={() => setSelected(null)} className="w-full py-4 mt-4 bg-[#0A192F] text-[#D4AF37] rounded-xl font-bold">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

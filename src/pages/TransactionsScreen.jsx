import React, { useState, useEffect, useCallback, useRef } from 'react';
import TopBar from '../components/TopBar';
import StatusBadge from '../components/StatusBadge';
import { fetchTransactions, fetchSuccessfulPayments, reconcileFunding } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
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

// User-facing "Purchase Result" — ONLY the useful deliverable fields
// (electricity token, cable bouquet, PINs, etc.). Raw/internal provider
// response is reserved for the admin dashboard.
const RESULT_LABELS = {
  token: 'Token',
  token_no: 'Token',
  tokens: 'Token',
  units: 'Units',
  meter_no: 'Meter No.',
  meternumber: 'Meter No.',
  customer_name: 'Customer',
  smartcard_no: 'Smartcard / IUC',
  iuc: 'Smartcard / IUC',
  iuc_number: 'Smartcard / IUC',
  card_no: 'Smartcard / IUC',
  bouquet: 'Bouquet',
  current_bouquet: 'Bouquet',
  plan_name: 'Plan',
  product_name: 'Plan',
  network: 'Network',
  pin: 'PIN',
  pins: 'PIN',
  serial: 'Serial',
};
const RESULT_KEYS = new Set(Object.keys(RESULT_LABELS));

function collectResultEntries(node, out, depth = 0) {
  if (!node || depth > 4) return;
  if (Array.isArray(node)) {
    for (const item of node) collectResultEntries(item, out, depth + 1);
    return;
  }
  if (typeof node !== 'object') return;
  for (const [k, v] of Object.entries(node)) {
    const key = String(k).toLowerCase().trim();
    if (RESULT_KEYS.has(key)) {
      if (Array.isArray(v)) {
        for (const item of v) {
          if (item !== null && (typeof item === 'object')) collectResultEntries(item, out, depth + 1);
          else pushResultEntry(out, key, item);
        }
      } else if (v !== null && typeof v === 'object') {
        collectResultEntries(v, out, depth + 1);
      } else {
        pushResultEntry(out, key, v);
      }
    } else if (v !== null && typeof v === 'object') {
      collectResultEntries(v, out, depth + 1);
    }
  }
}

function pushResultEntry(out, key, value) {
  if (value === null || value === undefined) return;
  const label = RESULT_LABELS[key];
  const text = String(value).trim();
  if (!label || !text || text === 'null') return;
  if (!out.some((e) => e.label === label && e.value === text)) out.push({ label, value: text });
}

function PurchaseResultCard({ data }) {
  const entries = [];
  collectResultEntries(data, entries);
  if (entries.length === 0) return null;
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-3">
      <p className="font-bold text-gray-500 dark:text-slate-400 text-[14px] mb-2">Purchase Result</p>
      <div className="space-y-2">
        {entries.map((e, i) => (
          <div key={i} className="flex justify-between gap-2">
            <span className="text-gray-500 dark:text-slate-400 shrink-0 text-xs">{e.label}</span>
            <span className="font-bold text-[#0A192F] dark:text-white text-right text-sm break-all">{e.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TransactionsScreen() {
  const { user } = useAuth();
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [fetchError, setFetchError] = useState(false);

  const hasLoadedRef = useRef(false);

  const fetchTxns = useCallback(async () => {
    if (!user?.id) return;
    // Only show the full-screen spinner on the very first load. Refreshing
    // (manual pull) must never blank out the list the user is reading.
    if (!hasLoadedRef.current) setLoading(true);
    try {
      // Self-heal missing funding rows first (same as the app)
      await reconcileFunding(user.id);
      const [remote, payments] = await Promise.all([
        fetchTransactions(user.id),
        fetchSuccessfulPayments(user.id),
      ]);

      // Self-heal: build funding rows from successful payments not in history
      const remoteRefs = new Set(remote.map(t => t.reference).filter(Boolean));
      const healed = payments
        .filter(p => !remoteRefs.has(p.reference))
        .map(p => ({
          id: p.reference,
          user_id: user.id,
          title: 'Wallet Funding',
          service_type: 'funding',
          amount: Number(p.amount),
          recipient: 'Squad',
          status: 'successful',
          reference: p.reference,
          provider: null,
          created_at: p.created_at,
        }));

      const merged = [...remote, ...healed].sort((a, b) => {
        const t1 = new Date(a.created_at || 0).getTime();
        const t2 = new Date(b.created_at || 0).getTime();
        return t2 - t1;
      });
      setTxns(merged);
      setFetchError(false);
    } catch (err) {
      console.error('Failed to load transactions', err);
      setFetchError(true);
    }
    hasLoadedRef.current = true;
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTxns();
    // No auto-reload/polling here. The list only refreshes when the user
    // taps the refresh icon or re-opens the screen — no disappearing rows,
    // no pointless network churn every few seconds.
  }, [fetchTxns]);

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
      <TopBar title="Transaction History" onBack />
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-red-400">{fetchError ? 'Could not load transactions. Tap refresh to retry.' : ''}</span>
          <button onClick={fetchTxns} aria-label="Refresh transactions" className="p-2 text-gray-400"><RefreshCw className="w-4 h-4" /></button>
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
              const status = typeof tx.status === 'string' ? tx.status.toLowerCase() : 'pending';
              return (
                <button key={tx.id} onClick={() => setSelected(tx)} className="w-full flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 active:bg-gray-50">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: status === 'successful' ? '#DCFCE7' : status === 'failed' ? '#FEE2E2' : '#FEF3C7' }}>
                    <Icon className="w-5 h-5 text-[#0A192F]" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-[15px] font-bold text-[#0A192F] truncate">{tx.title || tx.service_type}</p>
                    <p className="text-xs text-gray-400">{tx.created_at ? new Date(tx.created_at).toLocaleString() : ''}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[15px] font-bold text-[#0A192F]">-{formatCurrency(tx.amount)}</p>
                    <StatusBadge status={status} />
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
          <div className="relative w-full max-w-md bg-[#F8FAFC] dark:bg-[#0F172A] rounded-t-2xl p-6 pb-8 max-h-[80vh] overflow-y-auto">
            <h3 className="text-[18px] font-bold text-[#0A192F] dark:text-white mb-4">Transaction Details</h3>
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-3">
              <p className="text-[15px] font-bold text-[#0A192F] dark:text-white">{selected.title}</p>
              <p className="text-[28px] font-bold text-[#0A192F] dark:text-white">{formatCurrency(selected.amount)}</p>
              <StatusBadge status={selected.status} />
            </div>
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 space-y-2 text-sm mb-3">
              <p className="font-bold text-gray-500 dark:text-slate-400 text-[14px] mb-2">Transaction Details</p>
              <div className="flex justify-between gap-2"><span className="text-gray-500 dark:text-slate-400 shrink-0">Recipient</span><span className="font-medium text-right truncate">{selected.recipient}</span></div>
              <div className="flex justify-between gap-2"><span className="text-gray-500 dark:text-slate-400 shrink-0">Type</span><span className="font-medium">{selected.service_type}</span></div>
              {selected.reference && <div className="flex justify-between gap-2"><span className="text-gray-500 dark:text-slate-400 shrink-0">Reference</span><span className="font-medium text-xs text-right truncate">{selected.reference}</span></div>}
              <div className="flex justify-between gap-2"><span className="text-gray-500 dark:text-slate-400 shrink-0">Date</span><span className="font-medium text-right">{selected.created_at ? new Date(selected.created_at).toLocaleString() : ''}</span></div>
            </div>
            <PurchaseResultCard data={selected.api_response} />
            <button onClick={() => setSelected(null)} className="w-full py-4 mt-1 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl font-bold">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

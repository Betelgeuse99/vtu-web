// Supabase PostgREST helpers — mirrors how the Android app reads/writes
// wallets, transactions, and payments directly against Supabase.

import { getSession } from '../utils/storage';

const SUPABASE_URL = 'https://lraryzkamshicildghdv.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyYXJ5emthbXNoaWNpbGRnaGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MjQ4NDgsImV4cCI6MjEwMTEwMDg0OH0.243GADB6pgndKWrmWOco2AOK7vjzR7VAMdLu57QXkeQ';

export const SQUAD_PUBLIC_KEY = 'pk_1762a528f4a1405270b3c052d081015253e9023a';
export const SQUAD_SCRIPT_URL = 'https://checkout.squadco.com/widget/squad.min.js';

function authHeaders() {
  const session = getSession();
  return {
    'Authorization': `Bearer ${session?.access_token || ''}`,
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  };
}

async function supabaseGet(table, query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`Supabase ${table} fetch failed: ${res.status}`);
  return res.json();
}

async function supabaseInsert(table, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Prefer': 'return=representation' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Supabase ${table} insert failed: ${res.status}`);
  return res.json();
}

/** Fetch the user's wallet balance. Returns number or null. */
export async function fetchWalletBalance(userId) {
  try {
    const data = await supabaseGet('wallets', `user_id=eq.${userId}&select=balance`);
    if (Array.isArray(data) && data[0]?.balance !== undefined) return Number(data[0].balance);
  } catch (e) { console.error('fetchWalletBalance error', e); }
  return null;
}

/** Fetch the user's transaction history (newest first), like the app. */
export async function fetchTransactions(userId) {
  try {
    const data = await supabaseGet('transactions', `user_id=eq.${userId}&order=created_at.desc,id.desc&limit=200`);
    return Array.isArray(data) ? data : [];
  } catch (e) { console.error('fetchTransactions error', e); return []; }
}

/** Fetch successful payments (used to self-heal wallet funding rows). */
export async function fetchSuccessfulPayments(userId) {
  try {
    const data = await supabaseGet('payments', `user_id=eq.${userId}&status=eq.success&order=created_at.desc,id.desc&limit=100`);
    return Array.isArray(data) ? data : [];
  } catch (e) { console.error('fetchSuccessfulPayments error', e); return []; }
}

/** Insert a pending payment row BEFORE opening the Squad checkout. */
export async function insertPendingPayment(userId, reference, amount) {
  return supabaseInsert('payments', { user_id: userId, reference, amount: Number(amount), status: 'pending' });
}

/** Check whether a payment was confirmed by the webhook. */
export async function checkPaymentStatus(reference) {
  try {
    const data = await supabaseGet('payments', `reference=eq.${reference}&select=status`);
    return Array.isArray(data) && data[0]?.status === 'success';
  } catch (e) { console.error('checkPaymentStatus error', e); return false; }
}

/** Self-heal: persist missing wallet-funding rows into transactions. */
export async function reconcileFunding(userId) {
  const [txns, payments] = await Promise.all([fetchTransactions(userId), fetchSuccessfulPayments(userId)]);
  const remoteRefs = new Set(txns.map(t => t.reference).filter(Boolean));
  const missing = payments.filter(p => !remoteRefs.has(p.reference));
  for (const p of missing) {
    try {
      await supabaseInsert('transactions', {
        user_id: userId,
        title: 'Wallet Funding',
        service_type: 'funding',
        amount: Number(p.amount),
        recipient: 'Squad',
        status: 'successful',
        reference: p.reference,
        provider: null,
        created_at: p.created_at || null,
      });
    } catch (e) { /* unique index guards duplicates */ }
  }
  return missing.length;
}

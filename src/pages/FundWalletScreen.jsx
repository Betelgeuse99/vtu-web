import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, HelpCircle, X } from 'lucide-react';
import TopBar from '../components/TopBar';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';
import { getSession } from '../utils/storage';
import { insertPendingPayment, checkPaymentStatus, SQUAD_PUBLIC_KEY, SQUAD_SCRIPT_URL } from '../services/supabase';

const MIN_FUNDING_AMOUNT = 100;

export default function FundWalletScreen() {
  const { user, fetchBalance } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [savingPayment, setSavingPayment] = useState(false);
  const [phase, setPhase] = useState('form'); // form | checkout | verifying | confirmed | unconfirmed
  const [reference, setReference] = useState('');
  const checkoutAmountRef = useRef(0);
  // Synchronous guard against double-clicks / duplicate submissions.
  const proceedGuardRef = useRef(false);
  const refCounterRef = useRef(0);

  const email = user?.email || '';

  const hasSession = () => Boolean(getSession()?.access_token);

  const generateReference = () => {
    // Counter + timestamp + random => collision-proof across rapid clicks.
    refCounterRef.current += 1;
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `VTU-${Date.now()}-${refCounterRef.current}-${rand}`;
  };

  const handleProceed = async () => {
    if (savingPayment || proceedGuardRef.current) return;
    const amt = Number(amount);
    if (isNaN(amt) || amt < MIN_FUNDING_AMOUNT) return;
    if (!user?.id || !email) return;
    if (!hasSession()) { alert('Please log in to make a payment.'); return; }

    proceedGuardRef.current = true;
    const ref = generateReference();
    checkoutAmountRef.current = amt;
    setReference(ref);
    setSavingPayment(true);
    try {
      // Insert pending payment BEFORE opening checkout so the webhook can match it.
      await insertPendingPayment(user.id, ref, amt);
      setPhase('checkout');
    } catch (err) {
      console.error('Payment save failed', err);
      alert('Could not start payment. Please try again.');
    } finally {
      setSavingPayment(false);
      proceedGuardRef.current = false;
    }
  };

  const handlePaymentSubmitted = () => {
    setPhase('verifying');
  };

  const handlePaymentClosed = () => {
    if (phase === 'checkout') {
      setPhase('form');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <TopBar title="Fund Wallet" onBack={() => setPhase('form')} />

      {phase === 'form' && (
        <div className="px-5 pt-4 space-y-5">
          <h2 className="text-[20px] font-bold text-[#0A192F]">Fund Wallet</h2>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Enter Amount (Min ₦{MIN_FUNDING_AMOUNT})</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₦</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white border border-gray-300 rounded-xl pl-8 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]"
              />
            </div>
            {amount && Number(amount) < MIN_FUNDING_AMOUNT && (
              <p className="text-[11px] text-red-500 mt-1">Minimum funding is ₦{MIN_FUNDING_AMOUNT}</p>
            )}
          </div>

          <button
            onClick={handleProceed}
            disabled={savingPayment || !amount || Number(amount) < MIN_FUNDING_AMOUNT || !user?.id}
            className="w-full py-4 bg-[#0A192F] text-[#D4AF37] rounded-xl text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            {savingPayment ? (
              <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                Proceed to Payment
              </>
            )}
          </button>
          <p className="text-gray-500 text-xs text-center">A processing fee applies to card payments.</p>

          <div className="bg-[#F0F9FF] rounded-xl p-4 flex gap-3">
            <HelpCircle className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#0369A1] leading-relaxed">
              Instant wallet funding via card, bank transfer or USSD — your wallet is credited automatically once the payment is confirmed.
            </p>
          </div>
        </div>
      )}

      {phase === 'checkout' && (
        <SquadCheckout
          publicKey={SQUAD_PUBLIC_KEY}
          email={email}
          amount={checkoutAmountRef.current}
          reference={reference}
          onPaymentSubmitted={handlePaymentSubmitted}
          onClose={handlePaymentClosed}
        />
      )}

      {(phase === 'verifying' || phase === 'confirmed' || phase === 'unconfirmed') && (
        <PaymentStatus
          phase={phase}
          amount={checkoutAmountRef.current}
          reference={reference}
          onConfirmed={() => {
            fetchBalance(true);
            // Auto-return to dashboard once funding is confirmed.
            setTimeout(() => navigate('/dashboard'), 2000);
          }}
          onDone={() => {
            if (phase === 'confirmed') navigate('/dashboard');
            else setPhase('form');
          }}
          onVerify={async (ref, attempt) => {
            if (await checkPaymentStatus(ref)) return 'confirmed';
            return attempt >= 20 ? 'unconfirmed' : 'verifying';
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// SQUAD CHECKOUT (web widget)
// ============================================================
function SquadCheckout({ publicKey, email, amount, reference, onPaymentSubmitted, onClose }) {
  const [status, setStatus] = useState('loading'); // loading | error | open
  const calledRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let widget = null;

    const openWidget = () => {
      if (cancelled || typeof window.Squad === 'undefined') return;
      try {
        widget = new window.Squad({
          key: publicKey,
          email: email,
          amount: Math.round(amount * 100), // kobo
          currency_code: 'NGN',
          transaction_ref: reference,
          payment_channels: ['card', 'bank', 'ussd', 'transfer'],
          onLoad: () => setStatus('open'),
          onClose: () => { if (!cancelled) onClose(); },
          onSuccess: (data) => {
            if (!cancelled && !calledRef.current) {
              calledRef.current = true;
              onPaymentSubmitted();
            }
          },
          onError: (err) => { if (!cancelled) setStatus('error'); },
        });
        if (widget && typeof widget.setup === 'function') widget.setup();
        if (widget && typeof widget.open === 'function') widget.open();
      } catch (err) {
        console.error('Squad init error', err);
        if (!cancelled) setStatus('error');
      }
    };

    const loadScript = () => {
      if (window.Squad) return openWidget();
      const script = document.createElement('script');
      script.src = SQUAD_SCRIPT_URL;
      script.onload = openWidget;
      script.onerror = () => setStatus('error');
      document.body.appendChild(script);
    };

    loadScript();
    return () => {
      cancelled = true;
      try { if (widget && typeof widget.close === 'function') widget.close(); } catch {}
    };
  }, [publicKey, email, amount, reference, onClose, onPaymentSubmitted]);

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <button onClick={() => onClose()} className="absolute top-4 right-4 p-2 z-10 text-gray-500 bg-white rounded-full shadow">
        <X className="w-6 h-6" />
      </button>
      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#eab308] rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-gray-600">Connecting to Secure Payment Gateway...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <h3 className="text-lg font-bold text-red-500 mb-2">Checkout Error</h3>
          <p className="text-sm text-gray-600 mb-4">Unable to load the payment gateway. Please check your connection and retry.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-[#1e293b] text-white rounded-lg text-sm font-bold mr-2">Retry</button>
          <button onClick={() => onClose()} className="px-6 py-2.5 bg-[#64748b] text-white rounded-lg text-sm font-bold">Go Back</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PAYMENT STATUS
// ============================================================
function PaymentStatus({ phase, amount, reference, onConfirmed, onDone, onVerify }) {
  const [localPhase, setLocalPhase] = useState(phase);

  useEffect(() => {
    setLocalPhase(phase);
    if (phase === 'verifying') {
      let attempts = 0;
      const iv = setInterval(async () => {
        attempts += 1;
        const result = await onVerify(reference, attempts);
        if (result === 'confirmed') {
          clearInterval(iv);
          setLocalPhase('confirmed');
          onConfirmed();
        } else if (result === 'unconfirmed') {
          clearInterval(iv);
          setLocalPhase('unconfirmed');
        }
      }, 5000);
      return () => clearInterval(iv);
    }
  }, [phase, reference, onVerify, onConfirmed]);

  return (
    <div className="px-6 pt-10 flex flex-col items-center text-center">
      {localPhase === 'verifying' && (
        <>
          <div className="w-10 h-10 border-3 border-[#0A192F] border-t-transparent rounded-full animate-spin mb-4" style={{ borderWidth: 3 }} />
          <h2 className="text-lg font-bold text-[#0A192F] mb-2">Verifying your payment…</h2>
          <p className="text-sm text-gray-500">Keep this screen open — your wallet updates automatically once the payment is confirmed.</p>
        </>
      )}
      {localPhase === 'confirmed' && (
        <>
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-lg font-bold text-[#0A192F] mb-2">Payment confirmed!</h2>
          <p className="text-sm text-gray-500">Your wallet has been funded with {formatCurrency(amount)}.</p>
        </>
      )}
      {localPhase === 'unconfirmed' && (
        <>
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-[#D97706]" />
          </div>
          <h2 className="text-lg font-bold text-[#0A192F] mb-2">Payment received — verifying</h2>
          <p className="text-sm text-gray-500">If you completed the transfer, your wallet will be credited automatically once it's confirmed. You can close this and check back shortly.</p>
        </>
      )}
      <button onClick={onDone} className="w-full py-4 mt-8 bg-[#0A192F] text-[#D4AF37] rounded-xl font-bold">
        Done
      </button>
    </div>
  );
}

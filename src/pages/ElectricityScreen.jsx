import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Zap } from 'lucide-react';
import TopBar from '../components/TopBar';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';

// Best-effort extraction from the provider response (Bigisub / Alrahuz both
// nest the receipt fields inside `data`).
const pick = (obj, ...keys) => {
  if (!obj || typeof obj !== 'object') return null;
  for (const k of keys) {
    const v = obj[k];
    if (v !== undefined && v !== null && v !== '') return String(v);
  }
  return null;
};

// The full Nigerian DisCo set (matches the Android app's ALL_DISCOS). The live
// /electricity/providers endpoint currently omits Benin, Aba and Yola, so we
// merge them in (deduped by code) to keep web and app identical.
const KNOWN_DISCOS = [
  { name: 'Ikeja Electric (IKEDC)', code: 'ikeja-electric' },
  { name: 'Eko Electric (EKEDC)', code: 'eko-electric' },
  { name: 'Kano Electric (KEDCO)', code: 'kano-electric' },
  { name: 'Port Harcourt Electric (PHED)', code: 'portharcourt-electric' },
  { name: 'Jos Electric (JED)', code: 'jos-electric' },
  { name: 'Ibadan Electric (IBEDC)', code: 'ibadan-electric' },
  { name: 'Kaduna Electric (KAEDCO)', code: 'kaduna-electric' },
  { name: 'Abuja Electric (AEDC)', code: 'abuja-electric' },
  { name: 'Enugu Electric (EEDC)', code: 'enugu-electric' },
  { name: 'Benin Electric (BEDC)', code: 'benin-electric' },
  { name: 'Aba Power (ABP)', code: 'aba-power' },
  { name: 'Yola Electric (YEDC)', code: 'yola-electric' },
];

export default function ElectricityScreen() {
  const { wallet, fetchBalance } = useAuth();
  const navigate = useNavigate();
  const [discos, setDiscos] = useState([]);
  const [selectedDisco, setSelectedDisco] = useState(null);
  const [showDiscoList, setShowDiscoList] = useState(false);
  const [meterType, setMeterType] = useState('prepaid');
  const [meterNo, setMeterNo] = useState('');
  const [verifyData, setVerifyData] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    API.get('/vtu/bills/electricity/providers')
      .then((res) => {
        const apiList = Array.isArray(res.data?.data) ? res.data.data : [];
        const knownCodes = new Set(apiList.map((d) => d.code).filter(Boolean));
        setDiscos([...apiList, ...KNOWN_DISCOS.filter((d) => !knownCodes.has(d.code))]);
      })
      .catch(() => setDiscos(KNOWN_DISCOS));
  }, []);

  const handleVerify = async () => {
    if (!selectedDisco || !meterNo) return;
    setVerifying(true);
    try {
      const res = await API.post('/vtu/bills/electricity/verify', { company: selectedDisco.code, meter_no: meterNo, meter_type: meterType });
      if (res.data.success) setVerifyData(res.data.data);
      else setError(res.data.message || 'Verification failed');
    } catch (err) { setError(err.response?.data?.message || 'Verification failed'); }
    setVerifying(false);
  };

  const handlePay = async () => {
    if (!verifyData || !amount || !phone) return;
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/vtu/bills/electricity/pay', {
        company: selectedDisco.code, meter_no: meterNo, meter_type: meterType, phone_number: phone, amount: Number(amount), Customer_name: verifyData.customerName
      });
      if (res.data.success) {
        if (res.data.status === 'pending') setError('Your electricity payment is being processed. It will deliver shortly.');
        else setReceipt(res.data);
        if (res.data.balance !== undefined) { localStorage.setItem('vtu_wallet', JSON.stringify({ balance: res.data.balance })); }
        fetchBalance(true);
      } else {
        setError(res.data.message || 'Payment failed');
      }
    } catch (err) { setError(err.response?.data?.message || 'Payment failed'); }
    setLoading(false);
  };

  const downloadPdf = async () => {
    if (!receipt) return;
    const { jsPDF } = await import('jspdf');
    const d = receipt.data || {};
    const provider = selectedDisco?.name || 'Electricity';
    const pdf = new jsPDF();
    const row = (y, label, value) => {
      pdf.setFontSize(10);
      pdf.setTextColor(110);
      pdf.text(label, 20, y);
      pdf.setTextColor(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(String(value ?? '—'), 80, y);
      pdf.setFont('helvetica', 'normal');
    };

    pdf.setFillColor(10, 25, 47);
    pdf.rect(0, 0, 210, 26, 'F');
    pdf.setTextColor(212, 175, 55);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Dreamhatcher VTU', 105, 11, { align: 'center' });
    pdf.setTextColor(255);
    pdf.setFontSize(10);
    pdf.text('Electricity Purchase Receipt', 105, 20, { align: 'center' });

    let y = 42;
    pdf.setTextColor(20);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(provider, 20, y); y += 10;
    pdf.setFont('helvetica', 'normal');
    row(y, 'Transaction ID', pick(d, 'id', 'transaction_id', 'transactionId', 'orderId') || receipt.reference); y += 8;
    row(y, 'Reference', receipt.reference); y += 8;
    row(y, 'Phone Number', phone); y += 8;
    row(y, 'Electricity Provider', provider); y += 8;
    row(y, 'Meter Number', meterNo); y += 8;
    row(y, 'Customer Name', pick(d, 'customer_name', 'name') || verifyData?.customerName); y += 8;
    row(y, 'Meter Type', meterType); y += 8;
    const units = pick(d, 'units', 'Units', 'unit');
    if (units) { row(y, 'Units', `${units} kWh`); y += 8; }
    row(y, 'Amount', formatCurrency(amount)); y += 8;
    row(y, 'Date & Time', new Date().toLocaleString()); y += 12;

    pdf.setFontSize(11);
    pdf.setTextColor(110);
    pdf.text('Electricity Token', 20, y); y += 9;
    pdf.setTextColor(10, 25, 47);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(receipt.token || '—', 20, y); y += 10;
    pdf.setFontSize(9);
    pdf.setTextColor(146, 64, 14);
    pdf.text('Enter this token on your prepaid meter', 20, y); y += 10;
    pdf.setFont('helvetica', 'normal');
    const netRes = pick(d, 'response_message', 'message', 'api_response') || `Token: ${receipt.token} | ${provider} - ${meterType.toUpperCase()} | TRANSACTION SUCCESSFUL`;
    row(y, 'Network Response', netRes);

    pdf.setFontSize(8);
    pdf.setTextColor(130);
    pdf.text('Generated by Dreamhatcher — vtu.dreamhatcher.ink', 105, 288, { align: 'center' });
    pdf.save('dreamhatcher-electricity-receipt.pdf');
  };

  if (receipt) {
    const d = receipt.data || {};
    const provider = selectedDisco?.name || 'Electricity';
    const units = pick(d, 'units', 'Units', 'unit');
    const netRes = pick(d, 'response_message', 'message', 'api_response') || `Token: ${receipt.token} | ${provider} - ${meterType.toUpperCase()} | TRANSACTION SUCCESSFUL`;
    return (
      <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
        <TopBar title="Electricity Bill" onBack={() => setReceipt(null)} />
        <div className="px-5 pt-4 pb-8">
          <div className="bg-[#ECFDF5] rounded-xl p-4 border border-[#10B981]/20 mb-4">
            <p className="text-sm font-bold text-[#065F46]">Payment Successful</p>
          </div>
          <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-gray-100 dark:border-slate-700 space-y-1.5 text-sm">
            <p className="flex justify-between gap-3"><span className="text-gray-500 shrink-0">Service</span><span className="font-bold text-right">{provider}</span></p>
            <p className="flex justify-between gap-3"><span className="text-gray-500 shrink-0">Transaction ID</span><span className="font-bold text-right break-all">{pick(d, 'id', 'transaction_id', 'transactionId', 'orderId') || receipt.reference}</span></p>
            <p className="flex justify-between gap-3"><span className="text-gray-500 shrink-0">Reference</span><span className="font-bold text-right break-all">{receipt.reference}</span></p>
            <p className="flex justify-between gap-3"><span className="text-gray-500 shrink-0">Phone Number</span><span className="font-bold text-right">{phone}</span></p>
            <p className="flex justify-between gap-3"><span className="text-gray-500 shrink-0">Electricity Provider</span><span className="font-bold text-right">{provider}</span></p>
            <p className="flex justify-between gap-3"><span className="text-gray-500 shrink-0">Meter Number</span><span className="font-bold text-right">{meterNo}</span></p>
            <p className="flex justify-between gap-3"><span className="text-gray-500 shrink-0">Customer Name</span><span className="font-bold text-right">{pick(d, 'customer_name', 'name') || verifyData?.customerName || '—'}</span></p>
            <p className="flex justify-between gap-3"><span className="text-gray-500 shrink-0">Meter Type</span><span className="font-bold text-right">{meterType}</span></p>
            {units && <p className="flex justify-between gap-3"><span className="text-gray-500 shrink-0">Units</span><span className="font-bold text-right">{units} kWh</span></p>}
            <p className="flex justify-between gap-3"><span className="text-gray-500 shrink-0">Amount</span><span className="font-bold text-right">{formatCurrency(amount)}</span></p>
            <p className="flex justify-between gap-3"><span className="text-gray-500 shrink-0">Date & Time</span><span className="font-bold text-right">{new Date().toLocaleString()}</span></p>
          </div>

          <div className="bg-[#F3F4F6] dark:bg-slate-800 rounded-xl p-4 mt-4">
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">Electricity Token</p>
            <p className="text-[22px] font-extrabold text-[#0A192F] dark:text-white tracking-[2px] text-center">{receipt.token}</p>
            <p className="text-[11px] text-[#92400E] dark:text-amber-300 text-center mt-2">Enter this token on your prepaid meter</p>
          </div>

          <p className="text-[11px] text-gray-400 mt-3 break-words">Network Response: {netRes}</p>

          <button onClick={downloadPdf} className="mt-4 w-full py-3.5 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl text-sm font-bold flex items-center justify-center gap-1 active:scale-[0.98] transition-transform">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button onClick={() => navigate('/dashboard')} className="mt-2 w-full py-3.5 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl text-sm font-bold">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
      <TopBar title="Electricity Bill" onBack />
      <div className="px-5 pt-4 space-y-5">
        {/* Disco Selector */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
          <p className="text-[12px] font-black text-gray-600 dark:text-slate-400 tracking-[0.5px] mb-3 uppercase">Select Disco</p>
          <button onClick={() => setShowDiscoList(!showDiscoList)} className="w-full border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between text-[#0A192F] dark:text-slate-100">
            <span>{selectedDisco?.name || 'Choose provider'}</span>
            <span className="text-gray-400">▼</span>
          </button>
          {showDiscoList && (
            <div className="mt-2 border border-gray-200 dark:border-slate-700 rounded-xl max-h-60 overflow-y-auto dark:bg-[#1E293B]">
              {discos.map((d) => (
                <button key={d.code} onClick={() => { setSelectedDisco(d); setShowDiscoList(false); }} className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-slate-700/40 border-b border-gray-100 dark:border-slate-700 last:border-0 font-medium text-[#0A192F] dark:text-slate-100">{d.name}</button>
              ))}
            </div>
          )}
        </div>

        {/* Meter Type */}
        <div className="flex gap-3">
          {['prepaid', 'postpaid'].map((type) => (
            <button key={type} onClick={() => setMeterType(type)} className={`flex-1 py-3 rounded-full border text-sm font-medium flex items-center justify-center gap-2 transition-all ${meterType === type ? 'bg-[#0A192F] text-white border-[#0A192F] dark:bg-[#D4AF37] dark:text-[#0A192F] dark:border-[#D4AF37]' : 'bg-white dark:bg-[#1E293B] border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-300'}`}>
              <Zap className={`w-4 h-4 ${meterType === type ? 'text-[#D4AF37]' : ''}`} />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Meter Number */}
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 block">Meter Number</label>
          <input type="text" value={meterNo} onChange={(e) => setMeterNo(e.target.value)} placeholder="Enter meter number" className="w-full bg-white dark:bg-[#1E293B] dark:text-white border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
        </div>

        {selectedDisco && meterNo && (
          <button onClick={handleVerify} disabled={verifying} className="text-[#0A192F] text-sm font-bold underline">{verifying ? 'Verifying...' : 'Verify Meter'}</button>
        )}

        {verifyData && (
          <div className="bg-[#ECFDF5] rounded-xl p-4 border border-[#10B981]/20">
            <p className="text-[12px] font-black text-[#065F46] mb-2">Confirm Meter Details</p>
            <div className="space-y-1 text-sm">
              <p>Biller: <span className="font-bold">{selectedDisco.name}</span></p>
              <p>Name: <span className="font-bold">{verifyData.customerName}</span></p>
              <p>Address: <span className="font-bold">{verifyData.customerAddress}</span></p>
            </div>
          </div>
        )}

        {verifyData && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 block">Amount (₦)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Min ₦500" className="w-full bg-white dark:bg-[#1E293B] dark:text-white border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 block">Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="08012345678" className="w-full bg-white dark:bg-[#1E293B] dark:text-white border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            {amount && Number(amount) >= 500 && wallet.balance < Number(amount) && (
              <p className="text-red-500 text-[11px]">Insufficient balance — please fund your wallet first.</p>
            )}
            <button onClick={handlePay} disabled={loading || !amount || !phone || Number(amount) < 500 || wallet.balance < Number(amount)} className="w-full py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl text-[16px] font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center">
              {loading ? <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /> : 'PAY ELECTRICITY BILL'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

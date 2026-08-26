import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import TopBar from '../components/TopBar';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';

export default function ElectricityScreen() {
  const { wallet, fetchBalance } = useAuth();
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
  const [token, setToken] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    API.get('/api/v2/bills/electricity/providers')
      .then((res) => setDiscos(res.data.data || []))
      .catch(() => {});
  }, []);

  const handleVerify = async () => {
    if (!selectedDisco || !meterNo) return;
    setVerifying(true);
    try {
      const res = await API.post('/api/v2/bills/electricity/verify', { company: selectedDisco.code, meter_no: meterNo, meter_type: meterType });
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
      const res = await API.post('/api/v2/bills/electricity/pay', {
        company: selectedDisco.code, meter_no: meterNo, meter_type: meterType, phone_number: phone, amount: Number(amount), Customer_name: verifyData.customerName
      });
      if (res.data.success) {
        if (res.data.token) setToken(res.data.token);
        setSuccess(true);
        fetchBalance();
      } else {
        setError(res.data.message || 'Payment failed');
      }
    } catch (err) { setError(err.response?.data?.message || 'Payment failed'); }
    setLoading(false);
  };

  if (token) {
    return (
      <div className="min-h-screen bg-[#F4F6F9]">
        <TopBar title="Electricity Bill" onBack={() => setToken(null)} />
        <div className="px-6 pt-10 text-center">
          <h2 className="text-xl font-bold text-[#0A192F] mb-4">Payment Successful!</h2>
          <div className="bg-[#F3F4F6] rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Electricity Token</p>
            <p className="text-[22px] font-extrabold text-[#0A192F] tracking-[2px]">{token}</p>
          </div>
          <button onClick={() => { setToken(null); setSuccess(false); setMeterNo(''); setAmount(''); setVerifyData(null); }} className="w-full py-4 bg-[#0A192F] text-[#D4AF37] rounded-xl font-bold">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <TopBar title="Electricity Bill" onBack />
      <div className="px-5 pt-4 space-y-5">
        {/* Disco Selector */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-[12px] font-black text-gray-600 tracking-[0.5px] mb-3 uppercase">Select Disco</p>
          <button onClick={() => setShowDiscoList(!showDiscoList)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between">
            <span>{selectedDisco?.name || 'Choose provider'}</span>
            <span className="text-gray-400">▼</span>
          </button>
          {showDiscoList && (
            <div className="mt-2 border border-gray-200 rounded-xl max-h-60 overflow-y-auto">
              {discos.map((d) => (
                <button key={d.code} onClick={() => { setSelectedDisco(d); setShowDiscoList(false); }} className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 font-medium">{d.name}</button>
              ))}
            </div>
          )}
        </div>

        {/* Meter Type */}
        <div className="flex gap-3">
          {['prepaid', 'postpaid'].map((type) => (
            <button key={type} onClick={() => setMeterType(type)} className={`flex-1 py-3 rounded-full border text-sm font-medium flex items-center justify-center gap-2 transition-all ${meterType === type ? 'bg-[#0A192F] text-white border-[#0A192F]' : 'bg-white border-gray-300 text-gray-500'}`}>
              <Zap className={`w-4 h-4 ${meterType === type ? 'text-[#D4AF37]' : ''}`} />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Meter Number */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Meter Number</label>
          <input type="text" value={meterNo} onChange={(e) => setMeterNo(e.target.value)} placeholder="Enter meter number" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
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
              <label className="text-xs font-medium text-gray-600 mb-1 block">Amount (₦)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Min ₦500" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="08012345678" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]" />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button onClick={handlePay} disabled={loading || !amount || !phone || Number(amount) < 500} className="w-full py-4 bg-[#0A192F] text-[#D4AF37] rounded-xl text-[16px] font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center">
              {loading ? <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /> : 'PAY ELECTRICITY BILL'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

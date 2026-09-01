import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import API from '../services/api';
import { formatCurrency } from '../utils/helpers';

export default function EducationScreen() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pins, setPins] = useState(null);

  useEffect(() => {
    API.get('/vtu/bills/result-checker/prices')
      .then((res) => setExams(res.data.data || []))
      .catch(() => {});
  }, []);

  const handleBuy = async () => {
    if (!selectedExam) return;
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/vtu/bills/result-checker/purchase', {
        exam: selectedExam.code || selectedExam.id, quantity
      });
      if (res.data.success) {
        if (res.data.status === 'pending') setError('Your exam PINs are being processed. They will deliver shortly.');
        else setPins(res.data.pins || []);
      }
      else setError(res.data.message || 'Purchase failed');
    } catch (err) { setError(err.response?.data?.message || 'Purchase failed'); }
    setLoading(false);
  };

  if (pins) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
        <TopBar title="Exam Result PINs" onBack={() => setPins(null)} />
        <div className="px-6 pt-6">
          <h2 className="text-xl font-bold text-[#0A192F] dark:text-white mb-4">Your PINs</h2>
          <div className="bg-[#F3F4F6] rounded-xl p-4 space-y-2 mb-6">
            {pins.map((pin, i) => (
              <p key={i} className="text-base font-bold text-[#0A192F] dark:text-white">{typeof pin === 'string' ? pin : pin.pin || JSON.stringify(pin)}</p>
            ))}
          </div>
          <button onClick={() => { setPins(null); setSelectedExam(null); }} className="w-full py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl font-bold">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F]">
      <TopBar title="Exam Result PINs" onBack />
      <div className="px-5 pt-4 space-y-5">
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 block">Select Exam Type</label>
          <select value={selectedExam?.code || ''} onChange={(e) => setSelectedExam(exams.find(x => x.code === e.target.value))} className="w-full bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0A192F]">
            <option value="">Choose exam</option>
            {exams.map((e) => <option key={e.code} value={e.code}>{e.exam || e.name} — {formatCurrency(e.amount)}</option>)}
          </select>
        </div>

        {selectedExam && (
          <>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-2">Select Quantity</p>
              <div className="flex gap-3">
                {[1, 2, 5].map((q) => (
                  <button key={q} onClick={() => setQuantity(q)} className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${quantity === q ? 'bg-[#0A192F] text-white border-[#0A192F]' : 'bg-white dark:bg-[#1E293B] border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400'}`}>
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#F0F9FF] rounded-xl p-4">
              <p className="text-sm font-bold text-[#0A192F] dark:text-white mb-1">Order Summary</p>
              <p className="text-sm text-gray-600 dark:text-slate-400">{selectedExam.exam || selectedExam.name} x{quantity}</p>
              <p className="text-sm font-bold text-[#0A192F] dark:text-white">{formatCurrency((selectedExam.amount || 0) * quantity)}</p>
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button onClick={handleBuy} disabled={loading} className="w-full py-4 bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] rounded-xl text-base font-bold disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center">
              {loading ? <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /> : 'Buy PINs'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

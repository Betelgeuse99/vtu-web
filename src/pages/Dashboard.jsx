import React, { useState } from 'react';
import { Eye, EyeOff, Plus, Wifi, Smartphone, Tv, Zap, Bell, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const balance = 12500.0;

  const quickActions = [
    { label: 'Buy Data', icon: Wifi, path: '/data', color: 'bg-sky-500 text-white' },
    { label: 'Buy Airtime', icon: Smartphone, path: '/airtime', color: 'bg-emerald-500 text-white' },
    { label: 'Cable TV', icon: Tv, path: '/cable', color: 'bg-amber-500 text-white' },
    { label: 'Electricity', icon: Zap, path: '/electricity', color: 'bg-purple-500 text-white' },
  ];

  const recentTransactions = [
    { id: 1, title: 'MTN 1GB SME Data', recipient: '08031234567', amount: 280, date: 'Today, 2:15 PM', status: 'Success' },
    { id: 2, title: 'Airtel Airtime Top-Up', recipient: '09012345678', amount: 1000, date: 'Yesterday, 8:40 PM', status: 'Success' },
    { id: 3, title: 'Wallet Top-Up', recipient: 'Bank Transfer', amount: 5000, date: '24 Aug, 10:10 AM', status: 'Success' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-900">
      {/* Top Bar */}
      <header className="flex justify-between items-center px-4 pt-4 pb-2">
        <div>
          <p className="text-xs font-medium text-slate-500">Welcome back,</p>
          <h1 className="text-lg font-bold text-slate-800">User Account</h1>
        </div>
        <button className="p-2 bg-white rounded-full border border-slate-200 shadow-sm text-slate-600 hover:bg-slate-100">
          <Bell className="w-5 h-5" />
        </button>
      </header>

      <main className="px-4 space-y-5 mt-2">
        {/* Wallet Balance Card (Material 3 Surface) */}
        <section className="bg-gradient-to-br from-sky-600 to-sky-700 text-white p-5 rounded-3xl shadow-lg shadow-sky-600/20">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-sky-100 uppercase tracking-wider">Wallet Balance</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-sky-200 hover:text-white transition-colors"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight">
              {showBalance ? `₦${balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : '₦ ••••••'}
            </h2>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-sky-700 rounded-full text-xs font-semibold shadow hover:bg-sky-50 transition-all active:scale-95">
              <Plus className="w-3.5 h-3.5" />
              <span>Fund</span>
            </button>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Services</h3>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.path}
                  className="flex flex-col items-center group text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-transform group-active:scale-90 ${action.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 mt-1.5">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent Transactions List */}
        <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Recent Transactions</h3>
            <Link to="/history" className="text-xs text-sky-600 font-semibold hover:underline">See All</Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="py-2.5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{tx.title}</p>
                    <p className="text-[11px] text-slate-500">{tx.recipient} • {tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900">-₦{tx.amount.toLocaleString()}</span>
                  <p className="text-[10px] text-emerald-600 font-medium">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

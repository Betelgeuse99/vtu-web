import React, { useState } from 'react';
import { Eye, EyeOff, Plus, Wifi, Phone, Tv, Zap, CreditCard, ArrowRight, X, Menu, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, walletBalance } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const services = [
    { label: 'Buy Data', icon: Wifi, path: '/data', color: 'bg-sky-500' },
    { label: 'Buy Airtime', icon: Phone, path: '/airtime', color: 'bg-emerald-500' },
    { label: 'Cable TV', icon: Tv, path: '/services', color: 'bg-amber-500' },
    { label: 'Electricity', icon: Zap, path: '/services', color: 'bg-purple-500' },
    { label: 'Fund Wallet', icon: CreditCard, path: '/fund', color: 'bg-rose-500' },
    { label: 'Airtime to Cash', icon: ArrowRight, path: '/services', color: 'bg-teal-500' },
  ];

  const recentTransactions = [
    { id: 1, title: 'MTN 1GB SME Data', recipient: '08031234567', amount: 280, date: 'Today, 2:15 PM', status: 'Success' },
    { id: 2, title: 'Airtel Airtime Top-Up', recipient: '09012345678', amount: 1000, date: 'Yesterday, 8:40 PM', status: 'Success' },
    { id: 3, title: 'Wallet Top-Up', recipient: 'Bank Transfer', amount: 5000, date: '24 Aug, 10:10 AM', status: 'Success' },
  ];

  return (
    <div className="min-h-screen bg-[#0A192F] text-slate-100">
      {/* Header */}
      <header className="flex justify-between items-center px-4 pt-4 pb-3">
        <button onClick={() => setDrawerOpen(true)} className="p-2 text-slate-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-base font-bold text-white">DreamHatcher VTU</h1>
        <button onClick={() => setPanelOpen(true)} className="p-2 bg-[#1E293B] rounded-full border border-slate-700">
          <User className="w-5 h-5 text-[#D4AF37]" />
        </button>
      </header>

      {/* Wallet Balance Card */}
      <section className="mx-4 mt-3 bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-5 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Wallet Balance</span>
          <button onClick={() => setShowBalance(!showBalance)} className="text-slate-400 hover:text-[#D4AF37] transition-colors">
            {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            {showBalance ? `₦${walletBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : '₦ ••••••'}
          </h2>
          <Link to="/fund" className="flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] text-[#0A192F] rounded-full text-xs font-bold shadow hover:bg-[#c9a230] transition-all active:scale-95">
            <Plus className="w-3.5 h-3.5" />
            <span>Fund</span>
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-4 mt-6">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Services</h3>
        <div className="grid grid-cols-3 gap-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.label} to={service.path} className="flex flex-col items-center gap-2 p-3 bg-[#1E293B] rounded-xl border border-slate-700 hover:border-[#D4AF37] transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] font-medium text-slate-300 text-center">{service.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="mx-4 mt-6 mb-4 bg-[#1E293B] rounded-2xl p-4 border border-slate-700">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
          <Link to="/account" className="text-xs text-[#D4AF37] font-semibold hover:underline">See All</Link>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="py-2.5 flex justify-between items-center border-b border-slate-700 last:border-0">
              <div>
                <p className="text-xs font-bold text-white">{tx.title}</p>
                <p className="text-[11px] text-slate-400">{tx.recipient} • {tx.date}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-white">-₦{tx.amount.toLocaleString()}</span>
                <p className="text-[10px] text-emerald-400 font-medium">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* User Panel Modal */}
      {panelOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
          <div className="w-full max-w-md bg-[#1E293B] rounded-t-2xl p-6 border-t border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Profile</h3>
              <button onClick={() => setPanelOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0A192F] font-bold text-xl">
                {user?.name?.[0] || 'U'}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-400">{user?.email || 'user@email.com'}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Link to="/account" onClick={() => setPanelOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700 transition">
                <User className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-sm text-slate-200">My Account</span>
              </Link>
              <button onClick={() => { setPanelOpen(false); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700 transition w-full text-left">
                <LogOut className="w-5 h-5 text-rose-400" />
                <span className="text-sm text-rose-400">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex">
          <div className="w-72 bg-[#0A192F] border-r border-slate-700 p-5 h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Menu</h3>
              <button onClick={() => setDrawerOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-2">
              <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1E293B] transition text-sm text-slate-200">Home</Link>
              <Link to="/data" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1E293B] transition text-sm text-slate-200">Buy Data</Link>
              <Link to="/airtime" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1E293B] transition text-sm text-slate-200">Buy Airtime</Link>
              <Link to="/fund" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1E293B] transition text-sm text-slate-200">Fund Wallet</Link>
              <Link to="/services" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1E293B] transition text-sm text-slate-200">Services</Link>
              <Link to="/account" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1E293B] transition text-sm text-slate-200">Account</Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setDrawerOpen(false)} />
        </div>
      )}
    </div>
  );
}

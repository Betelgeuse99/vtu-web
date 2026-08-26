import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Eye, EyeOff, Plus, RefreshCw, Phone, Globe, Tv, Lightbulb, GraduationCap, Ticket, ArrowLeftRight, ShieldCheck, Gift, X, Wallet, Receipt, HelpCircle, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/helpers';

const VTU_SERVICES = [
  { title: 'Airtime Top-up', icon: Phone, bg: '#EFF6FF', route: '/airtime' },
  { title: 'Data Bundles', icon: Globe, bg: '#ECFDF5', route: '/data' },
  { title: 'Cable TV', icon: Tv, bg: '#FFFBEB', route: '/cable' },
  { title: 'Recharge PINs', icon: Ticket, bg: '#FEF3C7', route: '/recharge-pins' },
  { title: 'Electricity Bills', icon: Lightbulb, bg: '#FEF2F2', route: '/electricity' },
  { title: 'Education PINs', icon: GraduationCap, bg: '#E0F2FE', route: '/education' },
];

const FIN_SERVICES = [
  { title: 'Airtime2Cash', icon: ArrowLeftRight, bg: '#FEF3C7', route: '/airtime2cash' },
  { title: 'NIN/BVN Verify', icon: ShieldCheck, bg: '#F3E8FF', route: '/identity' },
  { title: 'Rewards', icon: Gift, bg: '#F0FDF4', route: '/rewards' },
];

const MORE_ITEMS = [
  { label: 'Buy Phone Airtime', icon: Phone, route: '/airtime' },
  { label: 'Buy Internet Data', icon: Globe, route: '/data' },
  { label: 'Pay Electricity Bills', icon: Lightbulb, route: '/electricity' },
  { label: 'Pay Cable TV', icon: Tv, route: '/cable' },
  { label: 'Education Payments', icon: GraduationCap, route: '/education' },
  { label: 'Fund Wallet', icon: Wallet, route: '/fund-wallet' },
  { label: 'Transaction Log', icon: Receipt, route: '/transactions' },
];

const DRAWER_ITEMS = [
  { label: 'Airtime', route: '/airtime', icon: Phone },
  { label: 'Data', route: '/data', icon: Globe },
  { label: 'Cable TV', route: '/cable', icon: Tv },
  { label: 'Electricity Bills', route: '/electricity', icon: Lightbulb },
  { label: 'Education / Exam PINs', route: '/education', icon: GraduationCap },
  null,
  { label: 'My Wallet', route: '/fund-wallet', icon: Wallet },
  { label: 'Transactions', route: '/transactions', icon: Receipt },
  { label: 'Profile', route: '/account', icon: User },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const { user, wallet, fetchBalance, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const [showBalance, setShowBalance] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { fetchBalance(true); }, []);

  const initials = (user?.full_name || user?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F] pb-20">
      {/* Top App Bar */}
      <div className="bg-white dark:bg-[#0A192F] px-4 py-3 flex items-center justify-between sticky top-0 z-30 border-b border-gray-100 dark:border-slate-800">
        <button onClick={() => setDrawerOpen(true)} className="p-1"><Menu className="w-6 h-6 text-[#0A192F] dark:text-white" /></button>
        <h1 className="text-base font-bold text-[#0A192F] dark:text-white">Dreamhatcher VTU</h1>
        <button
          onClick={toggle}
          aria-label="Toggle dark mode"
          className="w-9 h-9 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0A192F] font-bold text-sm"
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="px-4 pt-4">
        {/* Wallet Card */}
        <div className="bg-[#1E293B] rounded-2xl p-4 mb-4" style={{ height: 130 }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm">Wallet Balance</span>
                <button onClick={() => setShowBalance(!showBalance)} className="text-gray-400">
                  {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#4ADE80] text-[28px] font-bold">
                  {showBalance ? formatCurrency(wallet.balance) : '****'}
                </span>
                <button onClick={fetchBalance} className="text-white"><RefreshCw className="w-5 h-5" /></button>
              </div>
            </div>
            <button onClick={() => navigate('/fund-wallet')} className="bg-[#D4AF37] text-[#0A192F] px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Fund
            </button>
          </div>
        </div>

        {/* Rewards Card */}
        <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 mb-5 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <Gift className="w-8 h-8 text-[#D4AF37]" />
            <div className="flex-1">
              <p className="text-gray-500 dark:text-slate-400 text-xs">Cashback</p>
              <p className="font-bold text-sm text-[#0A192F] dark:text-white">₦0</p>
            </div>
            <div className="w-px h-[30px] bg-gray-200 dark:bg-slate-700" />
            <div className="flex-1 text-center">
              <p className="text-gray-500 dark:text-slate-400 text-xs">Points</p>
              <p className="font-bold text-sm text-[#0A192F] dark:text-white">0</p>
            </div>
            <button className="bg-[#0A192F] dark:bg-[#D4AF37] text-[#D4AF37] dark:text-[#0A192F] px-3 py-1.5 rounded-2xl text-[11px] font-bold">Earn Now</button>
          </div>
        </div>

        {/* VTU & Bill Payments */}
        <p className="text-gray-500 dark:text-slate-400 text-[13px] font-bold mb-3 tracking-wide">VTU & BILL PAYMENTS</p>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {VTU_SERVICES.map((svc) => {
            const Icon = svc.icon;
            return (
              <button key={svc.title} onClick={() => navigate(svc.route)} className="rounded-xl border-2 border-gray-300 flex flex-col items-center justify-center gap-2 py-4" style={{ backgroundColor: svc.bg, height: 105 }}>
                <Icon className="w-7 h-7 text-[#0A192F]" />
                <span className="text-[11px] font-bold text-[#0A192F] text-center leading-tight px-1">{svc.title}</span>
              </button>
            );
          })}
        </div>

        {/* Financial & Identity */}
        <p className="text-gray-500 text-[13px] font-bold mb-3 tracking-wide">FINANCIAL & IDENTITY</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {FIN_SERVICES.map((svc) => {
            const Icon = svc.icon;
            return (
              <button key={svc.title} onClick={() => navigate(svc.route)} className="rounded-xl border-2 border-gray-300 flex flex-col items-center justify-center gap-2 py-4" style={{ backgroundColor: svc.bg, height: 105 }}>
                <Icon className="w-7 h-7 text-[#0A192F]" />
                <span className="text-[11px] font-bold text-[#0A192F] text-center leading-tight px-1">{svc.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-[280px] bg-[#0A192F] h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0A192F] font-bold text-lg">{initials}</div>
                <div>
                  <p className="text-white font-bold text-lg">{user?.full_name || user?.name || 'User'}</p>
                  <p className="text-gray-400 text-[11px]">Version 1.1</p>
                </div>
              </div>
            </div>
            <div className="px-3 space-y-0.5">
              {DRAWER_ITEMS.map((item, i) =>
                item === null ? (
                  <div key={i} className="border-t border-gray-700 my-2" />
                ) : (
                  <button key={i} onClick={() => { navigate(item.route); setDrawerOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 text-left text-sm text-gray-200">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                )
              )}
              <div className="border-t border-gray-700 my-2" />
              <button onClick={() => { logout(); navigate('/welcome'); setDrawerOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 text-left text-sm text-red-400">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
            <p className="text-gray-500 text-xs text-center mt-6 pb-4">Version 1.1</p>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setDrawerOpen(false)} />
        </div>
      )}
    </div>
  );
}

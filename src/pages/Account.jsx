import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Bell, Moon, LogOut, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { id: 'transactions', label: 'Transaction History', icon: CheckCircle2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

const toggleItems = [
  { id: 'darkMode', label: 'Dark Mode', icon: Moon, defaultOn: true },
  { id: 'notifications', label: 'Push Notifications', icon: Bell, defaultOn: true },
];

export default function Account() {
  const { user, logout } = useAuth();
  const [toggles, setToggles] = useState({
    darkMode: true,
    notifications: true,
  });

  const handleToggle = (id) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#0A192F] text-slate-100 px-4 pt-6 pb-24">
      <h1 className="text-xl font-bold text-white mb-4">My Account</h1>

      {/* Profile Header */}
      <div className="bg-[#1E293B] rounded-2xl p-5 border border-slate-700 mb-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0A192F] font-bold text-2xl shrink-0">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email || 'user@email.com'}</p>
          </div>
        </div>
      </div>

      {/* Identity Info */}
      <div className="bg-[#1E293B] rounded-2xl p-4 border border-slate-700 mb-5">
        <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Personal Info</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-[#D4AF37]" />
            <div>
              <p className="text-[11px] text-slate-500">Full Name</p>
              <p className="text-sm text-white">{user?.name || 'User Account'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-[#D4AF37]" />
            <div>
              <p className="text-[11px] text-slate-500">Email</p>
              <p className="text-sm text-white">{user?.email || 'user@email.com'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-[#D4AF37]" />
            <div>
              <p className="text-[11px] text-slate-500">Phone</p>
              <p className="text-sm text-white">{user?.phone || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="bg-[#1E293B] rounded-2xl p-4 border border-slate-700 mb-5">
        <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Preferences</h3>
        <div className="space-y-3">
          {toggleItems.map((item) => {
            const Icon = item.icon;
            const isOn = toggles[item.id];
            return (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm text-white">{item.label}</span>
                </div>
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${isOn ? 'bg-[#D4AF37]' : 'bg-slate-600'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform ${isOn ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-[#1E293B] rounded-2xl p-2 border border-slate-700 mb-5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/50 transition text-left">
              <Icon className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm text-white flex-1">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-rose-500/50 text-rose-400 hover:bg-rose-500/10 transition"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-semibold">Logout</span>
      </button>
    </div>
  );
}

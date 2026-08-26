import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import { User, Mail, Phone, Lock, LogOut, ChevronRight } from 'lucide-react';

export default function MyAccountScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const initials = (user?.full_name || user?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <TopBar title="My Account" />
      <div className="px-5 pt-4">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-[100px] h-[100px] rounded-full bg-[#1E293B] flex items-center justify-center text-white text-[40px] font-bold mb-3">{initials}</div>
          <p className="text-[20px] font-extrabold text-[#0A192F]">{user?.full_name || user?.name || 'User'}</p>
        </div>

        {/* Account Status */}
        <div className="bg-[#DCFCE7] rounded-xl p-3 flex items-center justify-between mb-5">
          <span className="text-sm font-bold text-[#166534]">Account Status</span>
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#22C55E] text-white">ACTIVE</span>
        </div>

        {/* Identity Card */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[#0A192F]" />
              <div>
                <p className="text-[11px] text-gray-500">Account Name</p>
                <p className="text-sm font-medium text-[#0A192F]">{user?.full_name || user?.name || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#0A192F]" />
              <div>
                <p className="text-[11px] text-gray-500">Email</p>
                <p className="text-sm font-medium text-[#0A192F]">{user?.email || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#0A192F]" />
              <div>
                <p className="text-[11px] text-gray-500">Phone Number</p>
                <p className="text-sm font-medium text-[#0A192F]">{user?.phone_number || user?.phone || '—'}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-3 pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#0A192F]">Hide Wallet Balance</span>
              <button className="w-11 h-6 rounded-full bg-[#22C55E] relative"><div className="w-5 h-5 rounded-full bg-white shadow absolute top-0.5 right-0.5" /></button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#0A192F]">Biometric Login</span>
              <button className="w-11 h-6 rounded-full bg-gray-300 relative"><div className="w-5 h-5 rounded-full bg-white shadow absolute top-0.5 left-0.5" /></button>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-white rounded-2xl mb-4 shadow-sm">
          <button className="w-full flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#0A192F]" />
              <span className="text-sm text-[#0A192F]">Forgot Password</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          <button onClick={() => { logout(); navigate('/welcome'); }} className="w-full flex items-center gap-3 px-4 py-3.5">
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-500 font-medium">Logout</span>
          </button>
        </div>

        <p className="text-gray-400 text-xs text-center pb-6">App Version 1.1</p>
      </div>
    </div>
  );
}

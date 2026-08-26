import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Wallet, HelpCircle, User, MoreHorizontal } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', path: '/dashboard', icon: Home },
  { label: 'Wallet', path: '/fund-wallet', icon: Wallet },
  { label: 'Support', path: '/support', icon: HelpCircle },
  { label: 'Account', path: '/account', icon: User },
];

export default function BottomNav({ onMore }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 sm:max-w-md sm:mx-auto bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 px-1">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive ? 'text-[#0A192F]' : 'text-gray-400'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-medium">{label}</span>
          </NavLink>
        ))}
        <button onClick={onMore} className="flex flex-col items-center justify-center flex-1 py-1 text-gray-400">
          <MoreHorizontal className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-medium">More</span>
        </button>
      </div>
    </nav>
  );
}

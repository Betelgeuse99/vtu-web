import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Wifi, Phone, Grid, User } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Data', path: '/data', icon: Wifi },
    { label: 'Airtime', path: '/airtime', icon: Phone },
    { label: 'Services', path: '/services', icon: Grid },
    { label: 'Account', path: '/account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0A192F]/95 backdrop-blur-md border-t border-slate-800 z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full py-1 text-xs font-medium transition-all ${
                isActive
                  ? 'text-[#D4AF37] scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-1" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

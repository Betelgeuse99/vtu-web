import React from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ title, onBack, menu, right }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
      {onBack && (
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6 text-[#0A192F]" />
        </button>
      )}
      {menu && (
        <button onClick={menu} className="p-1">
          <Menu className="w-6 h-6 text-[#0A192F]" />
        </button>
      )}
      <h1 className="text-lg font-bold text-[#0A192F] flex-1">{title}</h1>
      {right}
    </div>
  );
}

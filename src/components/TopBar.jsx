import React from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ title, onBack, menu, right }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-[#0A192F] px-4 py-3 flex items-center gap-3 sticky top-0 z-30 border-b border-gray-100 dark:border-slate-800">
      {onBack && (
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6 text-[#0A192F] dark:text-white" />
        </button>
      )}
      {menu && (
        <button onClick={menu} className="p-1">
          <Menu className="w-6 h-6 text-[#0A192F] dark:text-white" />
        </button>
      )}
      <h1 className="text-lg font-bold text-[#0A192F] dark:text-white flex-1">{title}</h1>
      {right}
    </div>
  );
}

import React from 'react';

const NETWORKS = [
  { id: 1, slug: 'mtn', name: 'MTN', color: '#FFCC00', textColor: '#0A192F' },
  { id: 2, slug: 'airtel', name: 'AIRTEL', color: '#E50914', textColor: '#FFF' },
  { id: 3, slug: 'glo', name: 'GLO', color: '#28A745', textColor: '#FFF' },
  { id: 4, slug: '9mobile', name: '9MOBILE', color: '#006837', textColor: '#FFF' },
];

export default function NetworkSelector({ selected, onSelect, height = 'h-[60px]' }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {NETWORKS.map((net) => (
        <button
          key={net.id}
          onClick={() => onSelect(net)}
          className={`${height} rounded-xl flex flex-col items-center justify-center border-2 transition-all ${
            selected?.id === net.id
              ? 'border-[#D4AF37] bg-white shadow-md'
              : 'border-gray-200 bg-white'
          }`}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs mb-0.5"
            style={{ backgroundColor: net.color, color: net.textColor }}
          >
            {net.name}
          </div>
          {height !== 'h-[60px]' && (
            <span className={`text-[11px] font-bold ${selected?.id === net.id ? 'text-[#D4AF37]' : 'text-gray-500'}`}>{net.name}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export { NETWORKS };

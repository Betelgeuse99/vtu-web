import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import { Globe, MessageCircle, Rocket, Phone, ChevronRight } from 'lucide-react';

const ITEMS = [
  { title: 'Visit Our Website', subtitle: 'Read our blog and updates', icon: Globe, action: () => window.open('https://dreamhatcher.blogspot.com', '_blank') },
  { title: 'Chat on WhatsApp', subtitle: 'Quick support via WhatsApp', icon: MessageCircle, action: () => window.open('https://wa.me/2347037412314', '_blank') },
  { title: 'Live Chat Support', subtitle: 'Chat with our support team', icon: Rocket, soon: true },
  { title: 'Phone Support', subtitle: 'Call us for assistance', icon: Phone, action: () => window.open('tel:+2347037412314') },
];

export default function SupportScreen() {
  const [showSoon, setShowSoon] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <TopBar title="Help & Support" />
      <div className="px-5 pt-4 space-y-3">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.title} onClick={() => item.soon ? setShowSoon(true) : item.action?.()} className="w-full bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100 active:bg-gray-50">
              <div className="w-12 h-12 rounded-lg bg-[#0A192F]/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#0A192F]" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[16px] font-bold text-[#0A192F]">{item.title}</p>
                  {item.soon && <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-xl bg-[#FEF3C7] text-[#92400E]">SOON</span>}
                </div>
                <p className="text-[13px] text-gray-500">{item.subtitle}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
            </button>
          );
        })}
      </div>

      {showSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 mx-6 text-center">
            <Rocket className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#0A192F] mb-1">Coming Soon!</h3>
            <p className="text-sm text-gray-500 mb-4">This feature is under development.</p>
            <button onClick={() => setShowSoon(false)} className="px-6 py-2.5 bg-[#0A192F] text-[#D4AF37] rounded-xl text-sm font-bold">OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

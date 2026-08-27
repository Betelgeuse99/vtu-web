import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dhtLogo from '../assets/dhtlogo.png';

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setTimeout(() => setOpacity(1), 100);
    localStorage.setItem('vtu_onboarded', 'true');
  }, []);

  return (
    <div className="h-screen h-[100dvh] overflow-hidden bg-[#0A192F] flex flex-col items-center justify-between p-6">
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <div
          className={`w-[150px] h-[150px] mb-8 transition-all duration-1000 ${opacity ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'}`}
        >
          <img src={dhtLogo} alt="Dreamhatcher" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-[#D4AF37] text-[28px] font-bold mb-3 text-center">Fast & Secure</h1>
        <p className="text-white/80 text-base text-center px-6 leading-relaxed">
          Buy airtime, data, pay bills, and manage your finances — all in one place.
        </p>
      </div>
      <button
        onClick={() => navigate('/welcome')}
        className="w-full py-4 bg-[#D4AF37] text-[#0A192F] rounded-xl text-lg font-bold mb-2 active:scale-[0.98] transition-transform"
      >
        Get Started
      </button>
    </div>
  );
}

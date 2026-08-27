import React from 'react';
import { useNavigate } from 'react-router-dom';
import dhtLogo from '../assets/dhtlogo.png';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="h-screen h-[100dvh] overflow-hidden bg-[#0A192F] flex flex-col items-center justify-between p-6">
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <div className="w-[120px] h-[120px] mb-6">
          <img src={dhtLogo} alt="Dreamhatcher" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-[#D4AF37] text-[32px] font-extrabold mb-3">Dreamhatcher</h1>
        <p className="text-white/85 text-[15px] text-center px-6 leading-[22px]">
          Buy airtime, data, pay bills and more with the most reliable VTU platform in Nigeria.
        </p>
      </div>
      <div className="w-full space-y-3">
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 bg-[#D4AF37] text-[#0A192F] rounded-xl text-base font-bold active:scale-[0.98] transition-transform"
        >
          Login to Account
        </button>
        <button
          onClick={() => navigate('/register')}
          className="w-full py-4 border-2 border-white text-white rounded-xl text-base font-bold active:scale-[0.98] transition-transform"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

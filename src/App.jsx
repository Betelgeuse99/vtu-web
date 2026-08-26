import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import BottomNav from './components/BottomNav';

import Home from './pages/Home';
import Data from './pages/Data';
import Airtime from './pages/Airtime';
import FundWallet from './pages/FundWallet';
import Services from './pages/Services';
import Account from './pages/Account';
import Auth from './pages/Auth';

function App() {
  return (
    <AuthProvider>
      <div className="max-w-md mx-auto min-h-screen bg-[#0A192F] text-slate-100 relative flex flex-col shadow-2xl overflow-x-hidden">
        <main className="flex-1 pb-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/data" element={<Data />} />
            <Route path="/airtime" element={<Airtime />} />
            <Route path="/fund" element={<FundWallet />} />
            <Route path="/services" element={<Services />} />
            <Route path="/account" element={<Account />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative flex flex-col shadow-xl">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/airtime" element={<Dashboard />} />
            <Route path="/data" element={<Dashboard />} />
            <Route path="/history" element={<Dashboard />} />
            <Route path="/profile" element={<Dashboard />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </AuthProvider>
  );
}

export default App;

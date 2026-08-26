import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import BottomNav from './components/BottomNav';
import { Phone, Globe, Tv, Lightbulb, GraduationCap, Wallet, Receipt, X } from 'lucide-react';

// Auth Screens
import OnboardingScreen from './pages/OnboardingScreen';
import WelcomeScreen from './pages/WelcomeScreen';
import LoginScreen from './pages/LoginScreen';
import RegistrationScreen from './pages/RegistrationScreen';
import OtpVerifyScreen from './pages/OtpVerifyScreen';
import ForgotPasswordScreen from './pages/ForgotPasswordScreen';
import ResetPasswordScreen from './pages/ResetPasswordScreen';

// App Screens
import HomeScreen from './pages/HomeScreen';
import AirtimeScreen from './pages/AirtimeScreen';
import DataScreen from './pages/DataScreen';
import CableScreen from './pages/CableScreen';
import ElectricityScreen from './pages/ElectricityScreen';
import EducationScreen from './pages/EducationScreen';
import FundWalletScreen from './pages/FundWalletScreen';
import RechargePinScreen from './pages/RechargePinScreen';
import AirtimeToCashScreen from './pages/AirtimeToCashScreen';
import IdentityScreen from './pages/IdentityScreen';
import TransactionsScreen from './pages/TransactionsScreen';
import MyAccountScreen from './pages/MyAccountScreen';
import SupportScreen from './pages/SupportScreen';
import RewardsScreen from './pages/RewardsScreen';
import CacRegistrationScreen from './pages/CacRegistrationScreen';

const MORE_ITEMS = [
  { label: 'Buy Phone Airtime', icon: Phone, route: '/airtime' },
  { label: 'Buy Internet Data', icon: Globe, route: '/data' },
  { label: 'Pay Electricity Bills', icon: Lightbulb, route: '/electricity' },
  { label: 'Pay Cable TV', icon: Tv, route: '/cable' },
  { label: 'Education Payments / Exam PINs', icon: GraduationCap, route: '/education' },
  { label: 'Fund Wallet', icon: Wallet, route: '/fund-wallet' },
  { label: 'Transaction Log', icon: Receipt, route: '/transactions' },
];

const AUTH_ROUTES = ['/onboarding', '/welcome', '/login', '/register', '/otp-verify', '/forgot-password', '/reset-password'];

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F4F6F9]"><div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /></div>;
  return user ? children : <Navigate to="/welcome" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" /> : children;
}

function AppShell() {
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const showNav = user && !AUTH_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0A192F] relative flex flex-col mx-auto w-full max-w-[100vw] sm:max-w-md sm:shadow-2xl overflow-x-clip">
      <div className={`flex-1 ${showNav ? 'pb-20' : ''}`}>
        <Routes>
          <Route path="/onboarding" element={<PublicRoute><OnboardingScreen /></PublicRoute>} />
          <Route path="/welcome" element={<PublicRoute><WelcomeScreen /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegistrationScreen /></PublicRoute>} />
          <Route path="/otp-verify" element={<PublicRoute><OtpVerifyScreen /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordScreen /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPasswordScreen /></PublicRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
          <Route path="/airtime" element={<ProtectedRoute><AirtimeScreen /></ProtectedRoute>} />
          <Route path="/data" element={<ProtectedRoute><DataScreen /></ProtectedRoute>} />
          <Route path="/cable" element={<ProtectedRoute><CableScreen /></ProtectedRoute>} />
          <Route path="/electricity" element={<ProtectedRoute><ElectricityScreen /></ProtectedRoute>} />
          <Route path="/education" element={<ProtectedRoute><EducationScreen /></ProtectedRoute>} />
          <Route path="/fund-wallet" element={<ProtectedRoute><FundWalletScreen /></ProtectedRoute>} />
          <Route path="/recharge-pins" element={<ProtectedRoute><RechargePinScreen /></ProtectedRoute>} />
          <Route path="/airtime2cash" element={<ProtectedRoute><AirtimeToCashScreen /></ProtectedRoute>} />
          <Route path="/identity" element={<ProtectedRoute><IdentityScreen /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><TransactionsScreen /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><MyAccountScreen /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><SupportScreen /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute><RewardsScreen /></ProtectedRoute>} />
          <Route path="/cac-register" element={<ProtectedRoute><CacRegistrationScreen /></ProtectedRoute>} />

          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {showNav && <BottomNav onMore={() => setMoreOpen(true)} />}

      {/* More Bottom Sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMoreOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-[#1E293B] rounded-t-2xl p-4 pb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-[#0A192F] dark:text-white">More Services</h3>
              <button onClick={() => setMoreOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-1">
              {MORE_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.label} onClick={() => { navigate(item.route); setMoreOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/40 text-left">
                    <Icon className="w-5 h-5 text-[#0A192F] dark:text-[#D4AF37]" />
                    <span className="text-sm font-medium text-[#0A192F] dark:text-slate-100">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RootRedirect() {
  const { user, loading } = useAuth();
  const onboarded = localStorage.getItem('vtu_onboarded');
  if (loading) return null;
  if (!onboarded) return <Navigate to="/onboarding" />;
  return user ? <Navigate to="/dashboard" /> : <Navigate to="/welcome" />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

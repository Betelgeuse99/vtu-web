import React from 'react';
import TopBar from '../components/TopBar';

export default function RewardsScreen() {
  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <TopBar title="Rewards" onBack />
      <div className="flex items-center justify-center pt-20">
        <p className="text-lg font-bold text-[#0A192F]">Coming Soon!</p>
      </div>
    </div>
  );
}

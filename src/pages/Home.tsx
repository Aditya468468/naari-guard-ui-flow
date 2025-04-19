
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import SafetyRing from '../components/home/SafetyRing';
import SafetyMap from '../components/SafetyMap'; // Fixed import path
import QuickActions from '../components/home/QuickActions';
import AIBubble from '../components/assistant/AIBubble';
import { ShieldCheck } from 'lucide-react';

const Home: React.FC = () => {
  // For demo purposes, we'll use a fixed safety score
  const safetyScore = 85;

  return (
    <MobileLayout>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient">NaariGuard AI</h1>
            <p className="text-sm text-gray-400">Your personal safety companion</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-naari-purple to-naari-teal flex items-center justify-center shadow-glow-purple">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <SafetyRing score={safetyScore} />
        
        <SafetyMap />
        
        <QuickActions />
        
        <div className="glass-card rounded-xl p-4 mt-6">
          <h2 className="text-lg font-medium text-white mb-3">Safety Tips</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-naari-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-naari-purple text-lg">1</span>
              </div>
              <div>
                <p className="text-sm text-gray-300">Stay in well-lit areas when walking at night</p>
                <p className="text-xs text-gray-500">Based on your current location</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-naari-teal/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-naari-teal text-lg">2</span>
              </div>
              <div>
                <p className="text-sm text-gray-300">Share your route with a trusted contact</p>
                <p className="text-xs text-gray-500">Use the Trust Circle feature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AIBubble />
    </MobileLayout>
  );
};

export default Home;

import React, { useState } from 'react';
import { Phone, Volume2, Shield } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const DecoyVoiceAI: React.FC = () => {
  const { toast } = useToast();
  const [activeDecoy, setActiveDecoy] = useState<'none' | 'call' | 'warning'>('none');

  const startFakeCall = () => {
    setActiveDecoy('call');
    toast({
      title: "Fake Call Initiated",
      description: "Incoming call from 'Dad' is now showing on screen",
    });
  };

  const playWarning = () => {
    setActiveDecoy('warning');
    toast({
      title: "AI Warning Activated",
      description: "Playing tracking warning message",
      variant: "destructive",
    });
    
    // Simulate warning duration
    setTimeout(() => setActiveDecoy('none'), 5000);
  };

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-naari-purple" />
        <h2 className="text-white font-medium">AI Decoy System</h2>
      </div>
      
      <p className="text-sm text-gray-400 mb-4">
        Activate decoy features to deter potential threats
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={startFakeCall}
          className={`glass-card p-4 rounded-xl flex flex-col items-center gap-3 transition-all hover:bg-white/10 ${
            activeDecoy === 'call' ? 'border-2 border-naari-teal shadow-glow-purple' : 'border border-white/10'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-naari-teal/20 flex items-center justify-center">
            <Phone className="w-6 h-6 text-naari-teal" />
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-medium">Fake Call</p>
            <p className="text-xs text-gray-400 mt-1">Incoming from "Dad"</p>
          </div>
        </button>
        
        <button
          onClick={playWarning}
          className={`glass-card p-4 rounded-xl flex flex-col items-center gap-3 transition-all hover:bg-white/10 ${
            activeDecoy === 'warning' ? 'border-2 border-red-500 shadow-glow-red animate-pulse' : 'border border-white/10'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <Volume2 className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-medium">AI Warning</p>
            <p className="text-xs text-gray-400 mt-1">Tracking alert</p>
          </div>
        </button>
      </div>
      
      {activeDecoy === 'call' && (
        <div className="mt-4 p-3 bg-naari-teal/10 rounded-lg border border-naari-teal/20">
          <p className="text-xs text-naari-teal">📞 Incoming call from "Dad"...</p>
        </div>
      )}
      
      {activeDecoy === 'warning' && (
        <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20 animate-pulse">
          <p className="text-xs text-red-400">🔊 "This device is tracking your location. Help is on the way."</p>
        </div>
      )}
    </div>
  );
};

export default DecoyVoiceAI;

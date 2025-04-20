import React, { useState, useEffect } from 'react';
import { AlertTriangle, PhoneCall, Share, Clock, Shield } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'react-router-dom';

const SOSTrigger: React.FC = () => {
  const { toast } = useToast();
  const [sosActive, setSosActive] = useState(false);
  const [timer, setTimer] = useState(5);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromKeywordDetection && !sosActive) {
      activateSOS();
    }
  }, [location.state]);

  const activateSOS = () => {
    setSosActive(true);
    
    toast({
      title: "SOS Mode Activated",
      description: "Emergency services and trusted contacts will be notified in 5 seconds.",
      variant: "destructive",
      duration: 5000,
    });
    
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          sendEmergencyAlerts();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const cancelSOS = () => {
    setSosActive(false);
    setTimer(5);
    
    toast({
      title: "SOS Cancelled",
      description: "Emergency mode has been deactivated.",
      duration: 3000,
    });
  };
  
  const sendEmergencyAlerts = () => {
    console.log("Emergency alerts sent to trusted contacts and services");
    
    toast({
      title: "Emergency Alert Sent",
      description: "Your location has been shared with emergency services and trusted contacts.",
      variant: "destructive",
    });
  };
  
  return (
    <div className="p-4 flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gradient">Emergency SOS</h1>
        <p className="text-sm text-gray-400">
          One-tap alert to your trusted contacts and emergency services
        </p>
      </div>
      
      <div className={`glass-card rounded-xl p-8 flex flex-col items-center mb-6 ${
        sosActive ? 'border-2 border-red-500 shadow-glow-red' : ''
      }`}>
        {!sosActive ? (
          <>
            <div 
              className="w-32 h-32 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center mb-6 cursor-pointer hover:bg-red-500/30 transition-colors"
              onClick={activateSOS}
            >
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
            <p className="text-white text-lg font-medium mb-2">Press for Emergency</p>
            <p className="text-gray-400 text-sm text-center">
              Alerts will be sent to emergency services and your trusted circle
            </p>
          </>
        ) : (
          <>
            <div className="w-32 h-32 rounded-full bg-red-500 flex items-center justify-center mb-6 relative">
              <div className="text-3xl text-white font-bold">{timer}</div>
              <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping"></div>
            </div>
            <p className="text-red-400 text-lg font-medium mb-4">Emergency Alert Countdown</p>
            <button 
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition-colors"
              onClick={cancelSOS}
            >
              Cancel SOS
            </button>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="glass-card rounded-xl p-4 flex flex-col items-center">
          <PhoneCall className="w-8 h-8 text-naari-purple mb-2" />
          <p className="text-white text-sm font-medium">Emergency Call</p>
          <p className="text-gray-400 text-xs mt-1 text-center">Direct call to emergency services</p>
        </div>
        
        <div className="glass-card rounded-xl p-4 flex flex-col items-center">
          <Share className="w-8 h-8 text-naari-teal mb-2" />
          <p className="text-white text-sm font-medium">Share Location</p>
          <p className="text-gray-400 text-xs mt-1 text-center">Send your exact coordinates</p>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-naari-purple" />
          <h3 className="text-white font-medium">What happens when SOS is triggered</h3>
        </div>
        
        <ul className="space-y-2">
          <li className="text-sm text-gray-300 flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-naari-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-naari-purple text-xs">1</span>
            </div>
            <span>Your exact location is shared with your emergency contacts</span>
          </li>
          
          <li className="text-sm text-gray-300 flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-naari-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-naari-purple text-xs">2</span>
            </div>
            <span>Audio recording automatically begins to capture surroundings</span>
          </li>
          
          <li className="text-sm text-gray-300 flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-naari-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-naari-purple text-xs">3</span>
            </div>
            <span>Local emergency services are notified if enabled</span>
          </li>
        </ul>
      </div>
      
      <div className="glass-card rounded-xl p-4 flex items-center gap-3">
        <Shield className="w-6 h-6 text-naari-safe" />
        <div>
          <h3 className="text-white text-sm font-medium">Safety Check-In</h3>
          <p className="text-xs text-gray-400">Set a timer for automatic check-in with contacts</p>
        </div>
      </div>
    </div>
  );
};

export default SOSTrigger;


import React, { useState } from 'react';
import { AlertTriangle, Shield, X } from 'lucide-react';

const SOSTrigger: React.FC = () => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (emergencyActive) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [emergencyActive]);
  
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="h-full">
      {emergencyActive ? (
        <div className="flex flex-col h-full bg-black animate-fade-in">
          <div className="bg-naari-danger p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-white animate-pulse-soft" />
              <span className="text-white font-medium">Emergency Active</span>
            </div>
            <button 
              className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"
              onClick={() => setEmergencyActive(false)}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          
          <div className="flex-1 p-4 space-y-6">
            <div className="glass-card rounded-xl p-4 border border-naari-danger/50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white text-sm">Recording</span>
                <span className="text-naari-danger animate-pulse-soft flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-naari-danger"></span>
                  <span className="text-xs">{formatTime(seconds)}</span>
                </span>
              </div>
              
              <div className="space-y-1 text-xs text-gray-400">
                <p>• Silent recording mode active</p>
                <p>• Capturing audio & location data</p>
                <p>• Auto-encrypted and stored securely</p>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-4">
              <div className="text-center mb-3">
                <span className="text-white text-sm">Emergency Status</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Location Sharing</span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Trust Circle Alert</span>
                  <span className="text-xs bg-naari-purple/20 text-naari-purple px-2 py-0.5 rounded-full">3 notified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Evidence Collection</span>
                  <span className="text-xs bg-naari-teal/20 text-naari-teal px-2 py-0.5 rounded-full">Running</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-naari-danger/80 text-white py-3 rounded-lg shadow-glow-danger">
                Call Emergency
              </button>
              <button 
                className="flex-1 bg-white/10 text-white py-3 rounded-lg"
                onClick={() => setEmergencyActive(false)}
              >
                End Silent Mode
              </button>
            </div>
          </div>
          
          <div className="p-3 bg-black/30 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500">
              Disguised as "Calculator" app on your home screen
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 flex flex-col h-full">
          <h1 className="text-2xl font-bold text-gradient mb-6">SOS Setup</h1>
          
          <div className="glass-card rounded-xl p-4 mb-6">
            <h2 className="text-lg font-medium text-white mb-3">Emergency Trigger</h2>
            <p className="text-sm text-gray-400 mb-4">
              Set up your emergency trigger for instant access to help when needed.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Secret Code</label>
                <input
                  type="text"
                  placeholder="e.g., 9999"
                  className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                />
                <p className="text-xs text-gray-500">
                  Enter this in the calculator app to trigger emergency mode
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Emergency Contacts</label>
                <div className="bg-white/5 rounded-md p-3">
                  <p className="text-xs text-gray-400">
                    Configure in Trust Circle page
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <button
              className="w-full bg-gradient-to-r from-naari-purple to-naari-teal text-white py-3 rounded-lg font-medium shadow-glow-purple"
              onClick={() => setEmergencyActive(true)}
            >
              Test Emergency Mode
            </button>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Private & secure</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOSTrigger;

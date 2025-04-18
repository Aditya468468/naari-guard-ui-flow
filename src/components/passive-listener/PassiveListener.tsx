
import React, { useState } from 'react';
import { Ear, Mic, Shield, Volume2 } from 'lucide-react';

const PassiveListener: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [detectionLevel, setDetectionLevel] = useState(0);
  
  // Simulate detection level changes
  React.useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setDetectionLevel(Math.random() * 100);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isListening]);

  return (
    <div className="p-4 flex flex-col h-full">
      <h1 className="text-2xl font-bold text-gradient mb-2">Passive Listener</h1>
      <p className="text-sm text-gray-400 mb-6">
        AI-powered audio monitoring for your protection
      </p>
      
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="text-naari-purple w-5 h-5" />
            <span className="text-white font-medium">Audio Detection</span>
          </div>
          <div className="relative">
            <div 
              className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${
                isListening ? 'bg-naari-purple' : 'bg-gray-700'
              }`}
              onClick={() => setIsListening(!isListening)}
            >
              <div 
                className={`w-4 h-4 rounded-full bg-white transition-all ${
                  isListening ? 'ml-6' : 'ml-0'
                }`} 
              />
            </div>
          </div>
        </div>
        
        <div className={`transition-all duration-500 ${isListening ? 'opacity-100' : 'opacity-50'}`}>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                detectionLevel > 75 ? 'bg-naari-danger' :
                detectionLevel > 40 ? 'bg-yellow-500' :
                'bg-naari-safe'
              }`}
              style={{ width: `${detectionLevel}%` }}
            />
          </div>
          <div className="mt-3 text-center">
            <span className={`text-sm font-medium ${
              detectionLevel > 75 ? 'text-naari-danger' :
              detectionLevel > 40 ? 'text-yellow-500' :
              'text-naari-safe'
            }`}>
              {
                detectionLevel > 75 ? 'Potential threat detected' :
                detectionLevel > 40 ? 'Monitoring ambient sounds' :
                'Environment seems safe'
              }
            </span>
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Ear className="text-naari-teal w-5 h-5" />
          <span className="text-white font-medium">Detected Keywords</span>
        </div>
        
        <div className="space-y-2">
          {isListening ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Context Analysis</span>
                <span className="text-xs bg-naari-purple/20 text-naari-purple px-2 py-1 rounded">Active</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['help', 'stop', 'emergency', 'threat', 'danger'].map((keyword) => (
                  <span key={keyword} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 text-sm py-2">
              Enable listening to activate detection
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <button 
          className={`w-20 h-20 rounded-full ${
            isListening 
              ? 'bg-gradient-to-r from-naari-purple to-naari-teal animate-pulse-soft shadow-glow-purple' 
              : 'bg-gray-800'
          } flex items-center justify-center transition-all`}
          onClick={() => setIsListening(!isListening)}
        >
          <Mic className={`w-10 h-10 ${isListening ? 'text-white' : 'text-gray-400'}`} />
        </button>
        <p className="text-sm text-gray-400 mt-3">
          {isListening ? 'Listening actively' : 'Click to start listening'}
        </p>
      </div>
      
      <div className="bg-white/5 rounded-xl p-3 mt-4">
        <div className="flex items-center gap-2">
          <Shield className="text-naari-purple w-5 h-5" />
          <div>
            <p className="text-xs text-white font-medium">Privacy Guaranteed</p>
            <p className="text-xs text-gray-500">All processing done on-device</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassiveListener;

import React, { useState } from 'react';
import { Heart, Activity, Moon, Droplet } from 'lucide-react';

const HealthSafetyToggle: React.FC = () => {
  const [healthMode, setHealthMode] = useState(false);
  const [fatigue, setFatigue] = useState(false);
  const [periodTracking, setPeriodTracking] = useState(false);
  const [heartRate, setHeartRate] = useState(72);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <h2 className="text-white font-medium">Smart Health Mode</h2>
        <div className="relative">
          <div 
            className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${
              healthMode ? 'bg-naari-purple' : 'bg-gray-700'
            }`}
            onClick={() => setHealthMode(!healthMode)}
          >
            <div 
              className={`w-4 h-4 rounded-full bg-white transition-all ${
                healthMode ? 'ml-6' : 'ml-0'
              }`} 
            />
          </div>
        </div>
      </div>
      
      {healthMode && (
        <div className="divide-y divide-white/10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-naari-purple/20 flex items-center justify-center">
                <Moon className="w-4 h-4 text-naari-purple" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">Low Energy Mode</h3>
                <p className="text-xs text-gray-500">Adjust routes for fatigue</p>
              </div>
            </div>
            <div className="relative">
              <div 
                className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${
                  fatigue ? 'bg-naari-purple' : 'bg-gray-700'
                }`}
                onClick={() => setFatigue(!fatigue)}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-all ${
                    fatigue ? 'ml-6' : 'ml-0'
                  }`} 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <Droplet className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">Period Tracking</h3>
                <p className="text-xs text-gray-500">Enhanced safety recommendations</p>
              </div>
            </div>
            <div className="relative">
              <div 
                className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${
                  periodTracking ? 'bg-red-500' : 'bg-gray-700'
                }`}
                onClick={() => setPeriodTracking(!periodTracking)}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-all ${
                    periodTracking ? 'ml-6' : 'ml-0'
                  }`} 
                />
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-naari-teal/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-naari-teal" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">Heart Rate Monitor</h3>
                <p className="text-xs text-gray-500">Connect smartwatch</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-white text-sm">{heartRate} BPM</span>
              <span className="text-xs text-gray-500 ml-auto">Normal</span>
            </div>
          </div>
        </div>
      )}
      
      {healthMode && (fatigue || periodTracking) && (
        <div className="p-3 bg-naari-purple/10 border-t border-naari-purple/20">
          <p className="text-xs text-naari-purple flex items-center gap-2">
            <Heart className="w-3 h-3" />
            Safety routes adjusted for your health
          </p>
        </div>
      )}
    </div>
  );
};

export default HealthSafetyToggle;

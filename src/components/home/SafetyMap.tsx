
import React from 'react';
import { Map, Navigation } from 'lucide-react';

const SafetyMap: React.FC = () => {
  return (
    <div className="relative mt-4 rounded-xl overflow-hidden glass-card">
      <div className="h-48 bg-naari-dark/80 p-4 flex flex-col relative">
        {/* For future implementation with real maps */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Map className="w-10 h-10 mb-2 opacity-70" />
            <p className="text-sm text-gray-500">Interactive map with safety zones</p>
            <p className="text-xs text-gray-600 mt-1">Will load safety data soon</p>
          </div>
        </div>
        
        {/* Route suggestion button */}
        <button 
          className="absolute bottom-4 right-4 bg-naari-purple/80 text-white px-4 py-2 rounded-md flex items-center gap-2 glow-effect"
        >
          <Navigation className="w-4 h-4" />
          <span className="text-sm">Safe route</span>
        </button>
      </div>
    </div>
  );
};

export default SafetyMap;

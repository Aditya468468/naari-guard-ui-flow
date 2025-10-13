import React, { useState } from 'react';
import { Radio, Users, Shield, MapPin } from 'lucide-react';

interface NearbyHelper {
  id: string;
  distance: number;
  status: 'reachable' | 'unreachable';
}

const CommunityMesh: React.FC = () => {
  const [meshActive, setMeshActive] = useState(true);
  const [nearbyHelpers] = useState<NearbyHelper[]>([
    { id: '1', distance: 0.3, status: 'reachable' },
    { id: '2', distance: 0.5, status: 'reachable' },
    { id: '3', distance: 1.2, status: 'unreachable' }
  ]);

  const reachableCount = nearbyHelpers.filter(h => h.status === 'reachable').length;

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="text-naari-teal w-5 h-5" />
            <span className="text-white font-medium">Offline SOS Network</span>
          </div>
          <div className="relative">
            <div 
              className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${
                meshActive ? 'bg-naari-teal' : 'bg-gray-700'
              }`}
              onClick={() => setMeshActive(!meshActive)}
            >
              <div 
                className={`w-4 h-4 rounded-full bg-white transition-all ${
                  meshActive ? 'ml-6' : 'ml-0'
                }`} 
              />
            </div>
          </div>
        </div>
        
        {meshActive && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-naari-teal/10 rounded-lg border border-naari-teal/20">
              <span className="text-sm text-white">SOS reachable through</span>
              <span className="text-naari-teal font-medium">{reachableCount} nearby users</span>
            </div>
            
            <p className="text-xs text-gray-400">
              Emergency alerts can be sent even without internet connection
            </p>
          </div>
        )}
      </div>

      {meshActive && (
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-naari-purple" />
            <h3 className="text-white font-medium text-sm">Nearby Helpers</h3>
          </div>
          
          <div className="space-y-2">
            {nearbyHelpers.map((helper) => (
              <div 
                key={helper.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  helper.status === 'reachable' 
                    ? 'bg-naari-safe/10 border border-naari-safe/20' 
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    helper.status === 'reachable' 
                      ? 'bg-naari-safe/20 shadow-glow-purple' 
                      : 'bg-gray-700'
                  }`}>
                    <Shield className={`w-4 h-4 ${
                      helper.status === 'reachable' ? 'text-naari-safe' : 'text-gray-500'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm text-white">Helper #{helper.id}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {helper.distance} km away
                    </p>
                  </div>
                </div>
                
                <div className={`w-2 h-2 rounded-full ${
                  helper.status === 'reachable' 
                    ? 'bg-naari-safe animate-pulse' 
                    : 'bg-gray-600'
                }`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityMesh;

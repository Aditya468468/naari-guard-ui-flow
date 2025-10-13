import React, { useState } from 'react';
import { Bluetooth, Watch, Radio, Zap, CheckCircle, Circle, Activity } from 'lucide-react';

type DeviceStatus = 'connected' | 'disconnected' | 'connecting';

interface WearableDevice {
  id: string;
  name: string;
  type: string;
  status: DeviceStatus;
  battery?: number;
}

const WearableIntegration: React.FC = () => {
  const [devices, setDevices] = useState<WearableDevice[]>([
    { id: '1', name: 'Smart Ring', type: 'ring', status: 'connected', battery: 78 },
    { id: '2', name: 'Fitness Band', type: 'band', status: 'disconnected' },
    { id: '3', name: 'Smart Pendant', type: 'pendant', status: 'disconnected' }
  ]);
  
  const [doubleTapSOS, setDoubleTapSOS] = useState(true);
  const [pulseDetection, setPulseDetection] = useState(true);

  const getStatusColor = (status: DeviceStatus) => {
    switch (status) {
      case 'connected': return 'text-naari-safe';
      case 'connecting': return 'text-yellow-400';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-3 border-b border-white/10 bg-white/5 flex items-center gap-2">
        <Bluetooth className="w-4 h-4 text-naari-teal" />
        <h2 className="text-white font-medium">Connected Devices</h2>
      </div>
      
      <div className="divide-y divide-white/10">
        {devices.map((device) => (
          <div key={device.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-naari-teal/20 flex items-center justify-center">
                  <Watch className="w-4 h-4 text-naari-teal" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">{device.name}</h3>
                  <p className="text-xs text-gray-500 capitalize">{device.type}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {device.status === 'connected' ? (
                  <CheckCircle className={`w-4 h-4 ${getStatusColor(device.status)}`} />
                ) : (
                  <Circle className={`w-4 h-4 ${getStatusColor(device.status)}`} />
                )}
                <span className={`text-xs ${getStatusColor(device.status)}`}>
                  {device.status}
                </span>
              </div>
            </div>
            
            {device.status === 'connected' && device.battery && (
              <div className="flex items-center gap-2 mt-2">
                <Zap className="w-3 h-3 text-yellow-400" />
                <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-naari-safe transition-all"
                    style={{ width: `${device.battery}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{device.battery}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-white/10 bg-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-naari-purple" />
            <span className="text-sm text-white">Double Tap = SOS</span>
          </div>
          <div className="relative">
            <div 
              className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${
                doubleTapSOS ? 'bg-naari-purple' : 'bg-gray-700'
              }`}
              onClick={() => setDoubleTapSOS(!doubleTapSOS)}
            >
              <div 
                className={`w-4 h-4 rounded-full bg-white transition-all ${
                  doubleTapSOS ? 'ml-6' : 'ml-0'
                }`} 
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-naari-teal" />
            <span className="text-sm text-white">Pulse Spike Detection</span>
          </div>
          <div className="relative">
            <div 
              className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${
                pulseDetection ? 'bg-naari-teal' : 'bg-gray-700'
              }`}
              onClick={() => setPulseDetection(!pulseDetection)}
            >
              <div 
                className={`w-4 h-4 rounded-full bg-white transition-all ${
                  pulseDetection ? 'ml-6' : 'ml-0'
                }`} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WearableIntegration;

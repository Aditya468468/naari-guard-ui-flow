
import React from 'react';
import { Clock, MapPin, Navigation, Shield, Star } from 'lucide-react';

const RoutePlanner: React.FC = () => {
  // Sample route options - will be integrated with real mapping services
  const routes = [
    { 
      id: 1, 
      name: 'Safest Route', 
      distance: '1.8 km', 
      time: '25 min', 
      safetyScore: 92,
      highlight: true,
    },
    { 
      id: 2, 
      name: 'Fastest Route', 
      distance: '1.2 km', 
      time: '15 min', 
      safetyScore: 65,
      highlight: false,
    },
    { 
      id: 3, 
      name: 'Alternative', 
      distance: '2.1 km', 
      time: '28 min', 
      safetyScore: 87,
      highlight: false,
    },
  ];
  
  // Function to determine safety level color
  const getSafetyColor = (score: number) => {
    if (score >= 80) return 'text-naari-safe bg-naari-safe/20';
    if (score >= 50) return 'text-yellow-400 bg-yellow-400/20';
    return 'text-naari-danger bg-naari-danger/20';
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <h1 className="text-2xl font-bold text-gradient mb-2">Route Planner</h1>
      <p className="text-sm text-gray-400 mb-6">
        Find the safest path to your destination
      </p>
      
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-naari-purple/20 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-naari-purple" />
          </div>
          <input
            type="text"
            placeholder="Current location"
            className="flex-1 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white text-sm"
            defaultValue="My Current Location"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-naari-teal/20 flex items-center justify-center flex-shrink-0">
            <Navigation className="w-4 h-4 text-naari-teal" />
          </div>
          <input
            type="text"
            placeholder="Destination"
            className="flex-1 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white text-sm"
          />
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {routes.map((route) => (
          <div 
            key={route.id} 
            className={`glass-card rounded-xl p-4 ${
              route.highlight 
                ? 'border border-naari-purple shadow-glow-purple' 
                : ''
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  route.highlight 
                    ? 'bg-gradient-to-r from-naari-purple to-naari-teal text-white'
                    : 'bg-white/10 text-gray-300'
                }`}>
                  {route.highlight ? <Shield className="w-4 h-4" /> : <Navigation className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-white font-medium">{route.name}</h3>
                  <p className="text-xs text-gray-400">{route.distance}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className={`text-xs px-2 py-0.5 rounded-full ${getSafetyColor(route.safetyScore)}`}>
                  {route.safetyScore}/100
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-300">{route.time}</span>
                </div>
              </div>
            </div>
            
            <div className="h-24 bg-naari-dark/50 rounded-lg flex items-center justify-center mb-3">
              <div className="text-center text-gray-500">
                <Navigation className="w-6 h-6 mx-auto mb-1 opacity-50" />
                <span className="text-xs">Route map preview</span>
              </div>
            </div>
            
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">
                  {route.safetyScore >= 80 
                    ? 'Well-lit streets' 
                    : route.safetyScore >= 50 
                      ? 'Mixed safety areas' 
                      : 'Use with caution'}
                </span>
              </div>
              
              <button className={`text-xs px-3 py-1 rounded-md ${
                route.highlight 
                  ? 'bg-naari-purple text-white' 
                  : 'bg-white/10 text-gray-300'
              }`}>
                {route.highlight ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-white font-medium mb-3">Community Safety Notes</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Star className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-300">Main street well-lit until midnight</p>
              <p className="text-xs text-gray-500">Reported by 8 community members</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Star className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-300">Avoid side alley near coffee shop</p>
              <p className="text-xs text-gray-500">Reported by 12 community members</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;

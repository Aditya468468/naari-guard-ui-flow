import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Navigation, Shield, Star, Locate } from 'lucide-react';
import RouteMapComponent from './RouteMapComponent';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const RoutePlanner: React.FC = () => {
  const [source, setSource] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [sourceInput, setSourceInput] = useState('');
  const [destInput, setDestInput] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<number>(1);
  
  // Get current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setSource(coords);
          setSourceInput('My Current Location');
        },
        () => {
          // Fallback to Bangalore coordinates
          setSource([12.9716, 77.5946]);
          setSourceInput('My Current Location');
        }
      );
    } else {
      setSource([12.9716, 77.5946]);
      setSourceInput('My Current Location');
    }
  }, []);

  // Mock destination locations (for demo)
  const mockDestinations = {
    'MG Road': [12.9750, 77.6070] as [number, number],
    'Indiranagar': [12.9784, 77.6408] as [number, number],
    'Koramangala': [12.9352, 77.6245] as [number, number],
    'Whitefield': [12.9698, 77.7500] as [number, number],
  };

  // Generate mock routes between source and destination
  const generateRoutes = () => {
    if (!source || !destination) return [];

    const latDiff = destination[0] - source[0];
    const lngDiff = destination[1] - source[1];

    // Route 1: Safest (slightly longer, curved path)
    const route1: [number, number][] = [
      source,
      [source[0] + latDiff * 0.3, source[1] + lngDiff * 0.2],
      [source[0] + latDiff * 0.5, source[1] + lngDiff * 0.5],
      [source[0] + latDiff * 0.7, source[1] + lngDiff * 0.8],
      destination,
    ];

    // Route 2: Fastest (more direct)
    const route2: [number, number][] = [
      source,
      [source[0] + latDiff * 0.4, source[1] + lngDiff * 0.4],
      [source[0] + latDiff * 0.7, source[1] + lngDiff * 0.7],
      destination,
    ];

    // Route 3: Alternative (different curve)
    const route3: [number, number][] = [
      source,
      [source[0] + latDiff * 0.2, source[1] + lngDiff * 0.4],
      [source[0] + latDiff * 0.6, source[1] + lngDiff * 0.6],
      [source[0] + latDiff * 0.8, source[1] + lngDiff * 0.7],
      destination,
    ];

    return [
      { id: 1, coordinates: route1, color: '#9b87f5', weight: 4, highlight: selectedRouteId === 1 },
      { id: 2, coordinates: route2, color: '#F97316', weight: 4, highlight: selectedRouteId === 2 },
      { id: 3, coordinates: route3, color: '#0EA5E9', weight: 4, highlight: selectedRouteId === 3 },
    ];
  };

  const handleSetDestination = () => {
    // Check if input matches a mock destination
    const matchedDest = Object.entries(mockDestinations).find(([name]) => 
      name.toLowerCase() === destInput.toLowerCase()
    );
    
    if (matchedDest) {
      setDestination(matchedDest[1]);
    } else if (source) {
      // If no match, set a random nearby destination
      const randomOffset = 0.02;
      setDestination([
        source[0] + (Math.random() - 0.5) * randomOffset,
        source[1] + (Math.random() - 0.5) * randomOffset,
      ]);
    }
  };

  const routes = generateRoutes();
  
  // Sample route options data
  const routesData = [
    { 
      id: 1, 
      name: 'Safest Route', 
      distance: '1.8 km', 
      time: '25 min', 
      safetyScore: 92,
      highlight: selectedRouteId === 1,
    },
    { 
      id: 2, 
      name: 'Fastest Route', 
      distance: '1.2 km', 
      time: '15 min', 
      safetyScore: 65,
      highlight: selectedRouteId === 2,
    },
    { 
      id: 3, 
      name: 'Alternative', 
      distance: '2.1 km', 
      time: '28 min', 
      safetyScore: 87,
      highlight: selectedRouteId === 3,
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
          <Input
            type="text"
            placeholder="Current location"
            className="flex-1 bg-white/10 border border-white/20 text-white"
            value={sourceInput}
            onChange={(e) => setSourceInput(e.target.value)}
            disabled
          />
          <Button
            size="sm"
            variant="ghost"
            className="text-naari-teal hover:bg-naari-teal/20"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  setSource([position.coords.latitude, position.coords.longitude]);
                  setSourceInput('My Current Location');
                });
              }
            }}
          >
            <Locate className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-naari-teal/20 flex items-center justify-center flex-shrink-0">
            <Navigation className="w-4 h-4 text-naari-teal" />
          </div>
          <Input
            type="text"
            placeholder="Enter destination (e.g., MG Road, Indiranagar)"
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-gray-400"
            value={destInput}
            onChange={(e) => setDestInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSetDestination()}
          />
          <Button
            size="sm"
            className="bg-naari-purple hover:bg-naari-purple/80 text-white"
            onClick={handleSetDestination}
          >
            Go
          </Button>
        </div>

        <div className="text-xs text-gray-400 mb-2">
          Try: MG Road, Indiranagar, Koramangala, Whitefield
        </div>

        {/* Map Component */}
        {source && (
          <RouteMapComponent 
            source={source}
            destination={destination}
            routes={routes}
            selectedRouteId={selectedRouteId}
          />
        )}
      </div>
      
      <div className="space-y-4 mb-6">
        {routesData.map((route) => (
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
              
              <button 
                className={`text-xs px-3 py-1 rounded-md ${
                  route.highlight 
                    ? 'bg-naari-purple text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
                onClick={() => setSelectedRouteId(route.id)}
              >
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

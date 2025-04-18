
import React, { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Navigation, Map as MapIcon, AlertTriangle } from 'lucide-react';

interface MapSettings {
  style: string;
  center: [number, number];
  zoom: number;
}

interface SafeSpot {
  id: string;
  name: string;
  location: [number, number];
  type: 'police' | 'hospital' | 'safe-zone';
}

const SafetyMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapSettings, setMapSettings] = useState<MapSettings>({
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-73.935242, 40.730610],
    zoom: 13
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [safeSpots, setSafeSpots] = useState<SafeSpot[]>([]);
  const [isWalkWithMeActive, setIsWalkWithMeActive] = useState(false);

  // Mock safe spots data (in real app, this would come from an API or database)
  const mockSafeSpots: SafeSpot[] = [
    {
      id: '1',
      name: 'Central Police Station',
      location: [-73.932242, 40.735610],
      type: 'police'
    },
    {
      id: '2',
      name: 'City Hospital',
      location: [-73.940242, 40.728610],
      type: 'hospital'
    },
    {
      id: '3',
      name: 'Community Center',
      location: [-73.937242, 40.732610],
      type: 'safe-zone'
    }
  ];

  useEffect(() => {
    // Fetch map settings from Supabase
    const fetchMapSettings = async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_key, setting_value');

      if (data) {
        const settings = data.reduce((acc, item) => {
          switch (item.setting_key) {
            case 'map_style':
              acc.style = item.setting_value;
              break;
            case 'default_center':
              acc.center = JSON.parse(item.setting_value);
              break;
            case 'default_zoom':
              acc.zoom = parseFloat(item.setting_value);
              break;
          }
          return acc;
        }, {...mapSettings});

        setMapSettings(settings);
      }
    };

    fetchMapSettings();
    // For demo purposes, we're using mock data
    setSafeSpots(mockSafeSpots);
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Dynamically import mapbox-gl to prevent SSR issues
    import('mapbox-gl').then(mapboxgl => {
      try {
        // Need to access the default export for the mapboxgl object
        const mapboxglDefault = mapboxgl.default;
        // Replace with your actual Mapbox token
        mapboxglDefault.accessToken = 'pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbHg2YmgxMmUwM2YzMnFwcDdsMGh2Y3FmIn0.QoP4vZRRQHlk_r8OKQZfVw';

        const map = new mapboxglDefault.Map({
          container: mapContainer.current,
          style: mapSettings.style,
          center: mapSettings.center,
          zoom: mapSettings.zoom,
          failIfMajorPerformanceCaveat: false // Allow software rendering
        });

        // Add navigation controls
        map.addControl(new mapboxglDefault.NavigationControl());

        map.on('load', () => {
          setMapLoaded(true);
          
          // Add safe spots to map when it's loaded
          if (safeSpots.length > 0) {
            safeSpots.forEach(spot => {
              // Create a marker element
              const el = document.createElement('div');
              el.className = 'safe-spot-marker';
              
              // Style based on type
              let color = '#4ade80'; // default green for safe-zone
              if (spot.type === 'police') color = '#3b82f6';
              if (spot.type === 'hospital') color = '#ef4444';
              
              el.style.width = '15px';
              el.style.height = '15px';
              el.style.borderRadius = '50%';
              el.style.backgroundColor = color;
              el.style.border = '2px solid white';
              el.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
              
              // Add tooltip
              el.title = spot.name;
              
              // Add marker to map
              new mapboxglDefault.Marker(el)
                .setLngLat(spot.location)
                .addTo(map);
            });
          }
        });

        map.on('error', (e) => {
          console.error('Mapbox error:', e);
          setMapError(true);
        });

        return () => {
          map.remove();
        };
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
      }
    }).catch(error => {
      console.error('Error loading mapbox-gl:', error);
      setMapError(true);
    });
  }, [mapSettings, safeSpots]);

  const toggleWalkWithMe = () => {
    setIsWalkWithMeActive(!isWalkWithMeActive);
    
    // Show toast notification using the global toast from hooks/use-toast
    // In a real app, you would import useToast and use it here
    if (!isWalkWithMeActive) {
      console.log("Walk With Me activated - monitoring for safe spots");
      // Here you'd implement actual geolocation monitoring
    } else {
      console.log("Walk With Me deactivated");
    }
  };

  return (
    <div className="relative mt-4 rounded-xl overflow-hidden glass-card">
      <div ref={mapContainer} className="h-48 w-full flex items-center justify-center">
        {mapError && (
          <div className="text-center p-4 flex flex-col items-center">
            <AlertTriangle className="w-10 h-10 text-amber-400 mb-2" />
            <p className="text-gray-300">Map visualization unavailable</p>
            <p className="text-xs text-gray-500 mt-1">Interactive map could not be loaded</p>
          </div>
        )}

        {!mapLoaded && !mapError && (
          <div className="flex items-center justify-center">
            <MapIcon className="w-8 h-8 text-gray-500 animate-pulse" />
          </div>
        )}
      </div>
      
      <button 
        className={`absolute bottom-4 right-4 ${
          isWalkWithMeActive 
            ? 'bg-naari-teal text-white' 
            : 'bg-naari-purple/80 text-white'
        } px-4 py-2 rounded-md flex items-center gap-2 ${
          isWalkWithMeActive ? 'animate-pulse' : 'glow-effect'
        }`}
        onClick={toggleWalkWithMe}
      >
        <Navigation className="w-4 h-4" />
        <span className="text-sm">{isWalkWithMeActive ? 'Monitoring Route' : 'Safe route'}</span>
      </button>
      
      {isWalkWithMeActive && (
        <div className="absolute bottom-4 left-4 bg-naari-dark/90 border border-naari-teal/50 rounded-md p-2">
          <p className="text-xs text-naari-teal">3 safe spots nearby</p>
        </div>
      )}
    </div>
  );
};

export default SafetyMap;

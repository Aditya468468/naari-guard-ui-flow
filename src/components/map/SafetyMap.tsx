
import React, { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Navigation, Map as MapIcon, AlertTriangle } from 'lucide-react';

interface MapSettings {
  style: string;
  center: [number, number];
  zoom: number;
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
  }, [mapSettings]);

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
        className="absolute bottom-4 right-4 bg-naari-purple/80 text-white px-4 py-2 rounded-md flex items-center gap-2 glow-effect"
      >
        <Navigation className="w-4 h-4" />
        <span className="text-sm">Safe route</span>
      </button>
    </div>
  );
};

export default SafetyMap;

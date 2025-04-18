
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from 'lucide-react';

interface MapSettings {
  style: string;
  center: [number, number];
  zoom: number;
}

const SafetyMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapSettings, setMapSettings] = useState<MapSettings>({
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-73.935242, 40.730610],
    zoom: 13
  });

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
        }, mapSettings);

        setMapSettings(settings);
      }
    };

    fetchMapSettings();
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Replace with your actual Mapbox token
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbHg2YmgxMmUwM2YzMnFwcDdsMGh2Y3FmIn0.QoP4vZRRQHlk_r8OKQZfVw';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapSettings.style,
      center: mapSettings.center,
      zoom: mapSettings.zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      map.current?.remove();
    };
  }, [mapSettings]);

  return (
    <div className="relative mt-4 rounded-xl overflow-hidden glass-card">
      <div ref={mapContainer} className="h-48 w-full" />
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

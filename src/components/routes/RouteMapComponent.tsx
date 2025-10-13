import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Custom icons for start and end points
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Route {
  id: number;
  coordinates: [number, number][];
  color: string;
  weight: number;
  highlight: boolean;
}

interface RouteMapComponentProps {
  source: [number, number] | null;
  destination: [number, number] | null;
  routes: Route[];
  selectedRouteId: number | null;
}

const FitBounds = ({ source, destination }: { source: [number, number] | null; destination: [number, number] | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (source && destination) {
      const bounds = L.latLngBounds([source, destination]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (source) {
      map.setView(source, 13);
    }
  }, [map, source, destination]);
  
  return null;
};

const RouteMapComponent: React.FC<RouteMapComponentProps> = ({ source, destination, routes, selectedRouteId }) => {
  const center: [number, number] = source || [12.9716, 77.5946];

  if (!source) {
    return <div className="text-gray-400 text-sm">Loading map...</div>;
  }

  return (
    <MapContainer
      style={{
        height: '300px',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <FitBounds source={source} destination={destination} />
      
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Draw route polylines */}
      {routes.map((route) => (
        <Polyline
          key={route.id}
          positions={route.coordinates}
          pathOptions={{
            color: route.color,
            weight: selectedRouteId === route.id ? route.weight + 2 : route.weight,
            opacity: selectedRouteId === route.id ? 1 : 0.6,
          }}
        />
      ))}
      
      {/* Source marker */}
      <Marker position={source}>
        <Popup>Start Point 🟢</Popup>
      </Marker>
      
      {/* Destination marker */}
      {destination && (
        <Marker position={destination}>
          <Popup>Destination 🔴</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default RouteMapComponent;

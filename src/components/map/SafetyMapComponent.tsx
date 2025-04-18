import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useEffect } from 'react';

// Fix for default Leaflet marker icon issue (important for Vite/React projects)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const SafetyMapComponent: React.FC = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Get the user's current location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          setPosition([location.coords.latitude, location.coords.longitude]);
        },
        () => {
          console.error('Unable to retrieve location');
          // Fallback to a default location if geolocation fails
          setPosition([12.9716, 77.5946]); // Default to Bangalore if geolocation fails
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      setPosition([12.9716, 77.5946]); // Default to Bangalore if geolocation is not supported
    }
  }, []);

  if (!position) {
    return <div>Loading map...</div>; // Show loading state until position is available
  }

  return (
    <MapContainer
      center={position} // Use live location if available
      zoom={13}
      style={{ height: '500px', width: '100%' }} // Make the map smaller
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>You are here 🚨</Popup>
      </Marker>
    </MapContainer>
  );
};

export default SafetyMapComponent;


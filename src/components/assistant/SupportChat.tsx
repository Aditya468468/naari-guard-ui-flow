import React, { useState, useEffect } from 'react';
import { Heart, Scale, Phone, FileText, MessageCircle, MapPin, Clock, Volume2, Sparkles, Shield, Building2, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const SetViewOnPosition = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [map, position]);
  
  return null;
};

type SupportType = 'emotional' | 'legal' | 'safety';

const SupportChat: React.FC = () => {
  const [activeSupport, setActiveSupport] = useState<SupportType>('emotional');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [playingAudio, setPlayingAudio] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setUserLocation([12.9716, 77.5946]); // Default to Bangalore
        }
      );
    }
  }, []);

  const affirmations = [
    "You are brave, you are strong, you are loved.",
    "This too shall pass. You're not alone.",
    "Your feelings are valid. Take your time.",
    "You have the power to overcome this.",
    "You are worthy of safety and peace."
  ];

  const breathingExercises = [
    { name: "4-7-8 Breathing", duration: "1 min", steps: "Inhale 4s, Hold 7s, Exhale 8s" },
    { name: "Box Breathing", duration: "2 min", steps: "Inhale 4s, Hold 4s, Exhale 4s, Hold 4s" },
    { name: "Calming Breath", duration: "30s", steps: "Deep inhale through nose, slow exhale through mouth" }
  ];

  const mentalHealthContacts = [
    { name: "NIMHANS Helpline", number: "080-46110007", hours: "24/7", type: "Mental Health" },
    { name: "Vandrevala Foundation", number: "1860-2662-345", hours: "24/7", type: "Crisis Support" },
    { name: "iCall Helpline", number: "9152987821", hours: "Mon-Sat 8AM-10PM", type: "Counseling" },
    { name: "Snehi India", number: "91-22-27546669", hours: "24/7", type: "Emotional Support" }
  ];

  const legalContacts = [
    { name: 'Police Emergency', number: '100', available: '24/7', icon: '🚨' },
    { name: 'Women Helpline', number: '1091', available: '24/7', icon: '👩' },
    { name: 'National Commission for Women', number: '7827-170-170', available: '24/7', icon: '⚖️' },
    { name: 'Cyber Crime Helpline', number: '1930', available: '24/7', icon: '💻' },
    { name: 'Child Helpline', number: '1098', available: '24/7', icon: '👶' }
  ];

  const legalResources = [
    { 
      title: "Know Your Rights", 
      items: [
        "Right to file FIR at any police station (regardless of jurisdiction)",
        "Right to free legal aid if unable to afford",
        "Right to privacy and dignity during investigation",
        "Right to track your case status online"
      ]
    },
    {
      title: "Evidence Collection",
      items: [
        "Take screenshots of messages/threats",
        "Record dates, times, and locations",
        "Preserve physical evidence without tampering",
        "Get medical examination if needed (within 72 hours)"
      ]
    },
    {
      title: "Online FIR Filing",
      items: [
        "Visit your state police website",
        "Look for 'e-FIR' or 'Online Complaint' section",
        "Fill details accurately with supporting documents",
        "Save acknowledgment number for tracking"
      ]
    }
  ];

  const safetyLocations = userLocation ? [
    { 
      name: "City Hospital", 
      type: "hospital", 
      position: [userLocation[0] + 0.01, userLocation[1] + 0.01] as [number, number],
      distance: "1.2 km",
      safety: 9,
      available: "24/7"
    },
    { 
      name: "Police Station", 
      type: "police", 
      position: [userLocation[0] - 0.01, userLocation[1] + 0.015] as [number, number],
      distance: "0.8 km",
      safety: 10,
      available: "24/7"
    },
    { 
      name: "Safe Zone Cafe", 
      type: "cafe", 
      position: [userLocation[0] + 0.015, userLocation[1] - 0.01] as [number, number],
      distance: "1.5 km",
      safety: 8,
      available: "6AM-12AM"
    },
    { 
      name: "24/7 Pharmacy", 
      type: "pharmacy", 
      position: [userLocation[0] - 0.008, userLocation[1] - 0.012] as [number, number],
      distance: "0.5 km",
      safety: 8,
      available: "24/7"
    }
  ] : [];

  const getMarkerIcon = (type: string) => {
    const colors: { [key: string]: string } = {
      hospital: '#ef4444',
      police: '#3b82f6',
      cafe: '#10b981',
      pharmacy: '#f59e0b'
    };
    
    return L.divIcon({
      html: `<div style="background-color: ${colors[type]}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: '',
      iconSize: [24, 24]
    });
  };

  const playCalmingAudio = () => {
    setPlayingAudio(true);
    // Simulating audio playback
    setTimeout(() => setPlayingAudio(false), 30000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveSupport('emotional')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeSupport === 'emotional'
              ? 'bg-gradient-to-r from-naari-purple to-naari-teal text-white shadow-glow-purple'
              : 'glass-card text-gray-400'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span className="text-xs font-medium">Support</span>
        </button>
        
        <button
          onClick={() => setActiveSupport('legal')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeSupport === 'legal'
              ? 'bg-gradient-to-r from-naari-purple to-naari-teal text-white shadow-glow-purple'
              : 'glass-card text-gray-400'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span className="text-xs font-medium">Legal</span>
        </button>

        <button
          onClick={() => setActiveSupport('safety')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeSupport === 'safety'
              ? 'bg-gradient-to-r from-naari-purple to-naari-teal text-white shadow-glow-purple'
              : 'glass-card text-gray-400'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span className="text-xs font-medium">Safety</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {activeSupport === 'emotional' && (
          <>
            {/* Calming Audio Card */}
            <div className="glass-card rounded-xl p-4 bg-gradient-to-br from-naari-purple/20 to-naari-teal/20 border border-naari-purple/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-naari-purple" />
                  <h3 className="text-white font-medium">Feeling Anxious?</h3>
                </div>
                <Sparkles className="w-4 h-4 text-naari-teal" />
              </div>
              <p className="text-sm text-gray-300 mb-3">Tap here for a 30-second calming audio</p>
              <button 
                onClick={playCalmingAudio}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  playingAudio 
                    ? 'bg-naari-teal/30 text-naari-teal border border-naari-teal' 
                    : 'bg-gradient-to-r from-naari-purple to-naari-teal text-white hover:shadow-glow-purple'
                }`}
              >
                {playingAudio ? '🎵 Playing...' : '🎧 Play Calming Audio'}
              </button>
            </div>

            {/* Affirmations */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-naari-purple" />
                <h3 className="text-white font-medium">Affirmations</h3>
              </div>
              <div className="space-y-2">
                {affirmations.map((affirmation, idx) => (
                  <div 
                    key={idx}
                    className="glass-card p-3 rounded-lg bg-naari-purple/10 border border-naari-purple/20 hover:border-naari-purple/40 transition-all"
                  >
                    <p className="text-sm text-gray-300 italic">"{affirmation}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Breathing Exercises */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-naari-teal" />
                <h3 className="text-white font-medium">Breathing Exercises</h3>
              </div>
              <div className="space-y-2">
                {breathingExercises.map((exercise, idx) => (
                  <div key={idx} className="glass-card p-3 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white text-sm font-medium">{exercise.name}</p>
                      <div className="flex items-center gap-1 text-naari-teal text-xs">
                        <Clock className="w-3 h-3" />
                        {exercise.duration}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">{exercise.steps}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mental Health Helplines */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-5 h-5 text-naari-purple" />
                <h3 className="text-white font-medium">Mental Health Helplines</h3>
              </div>
              <div className="space-y-2">
                {mentalHealthContacts.map((contact, idx) => (
                  <a
                    key={idx}
                    href={`tel:${contact.number}`}
                    className="glass-card p-3 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{contact.name}</p>
                      <p className="text-naari-teal text-sm font-mono">{contact.number}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">{contact.type}</span>
                        <span className="text-xs text-naari-teal">• {contact.hours}</span>
                      </div>
                    </div>
                    <Phone className="w-4 h-4 text-naari-teal" />
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {activeSupport === 'legal' && (
          <>
            {/* Emergency Contacts */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="text-white font-medium">Emergency Contacts</h3>
              </div>
              <div className="space-y-2">
                {legalContacts.map((contact, idx) => (
                  <a
                    key={idx}
                    href={`tel:${contact.number}`}
                    className="glass-card p-3 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{contact.icon}</span>
                      <div>
                        <p className="text-white text-sm font-medium">{contact.name}</p>
                        <p className="text-naari-teal text-sm font-mono">{contact.number}</p>
                        <span className="text-xs text-gray-400">{contact.available}</span>
                      </div>
                    </div>
                    <Phone className="w-4 h-4 text-naari-teal group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>

            {/* Legal Resources */}
            {legalResources.map((resource, idx) => (
              <div key={idx} className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-naari-purple" />
                  <h3 className="text-white font-medium">{resource.title}</h3>
                </div>
                <div className="space-y-2">
                  {resource.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-naari-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-naari-purple text-xs">{itemIdx + 1}</span>
                      </div>
                      <p className="text-sm text-gray-300 flex-1">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {activeSupport === 'safety' && (
          <>
            {/* Map */}
            {userLocation && (
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-naari-purple" />
                  <h3 className="text-white font-medium">Nearby Safe Locations</h3>
                </div>
                <div className="rounded-lg overflow-hidden h-64 mb-3">
                  <MapContainer
                    style={{ height: '100%', width: '100%' }}
                    whenReady={() => console.log("Map ready")}
                  >
                    <SetViewOnPosition position={userLocation} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={userLocation}>
                      <Popup>Your Location 📍</Popup>
                    </Marker>
                    {safetyLocations.map((location, idx) => (
                      <Marker 
                        key={idx} 
                        position={location.position}
                      >
                        <Popup>
                          <div className="text-sm">
                            <p className="font-semibold">{location.name}</p>
                            <p className="text-xs text-gray-600">{location.distance} away</p>
                            <p className="text-xs text-green-600">{location.available}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>
            )}

            {/* Location List */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-naari-teal" />
                <h3 className="text-white font-medium">Safe Places</h3>
              </div>
              <div className="space-y-2">
                {safetyLocations.map((location, idx) => (
                  <div key={idx} className="glass-card p-3 rounded-lg hover:bg-white/5 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white text-sm font-medium">{location.name}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            location.safety >= 9 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            Safety: {location.safety}/10
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {location.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {location.available}
                          </span>
                        </div>
                      </div>
                      <span className="text-xl">
                        {location.type === 'hospital' && '🏥'}
                        {location.type === 'police' && '👮'}
                        {location.type === 'cafe' && '☕'}
                        {location.type === 'pharmacy' && '💊'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SupportChat;

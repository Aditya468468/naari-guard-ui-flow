
import React, { useState } from 'react';
import { X, Bus, Moon, MapPin, Compass } from 'lucide-react';

type LocationType = 'public-transport' | 'walking-alone' | 'new-city' | 'night-travel';

interface SafetyTip {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface SafetyTipsModalProps {
  onClose: () => void;
}

const SafetyTipsModal: React.FC<SafetyTipsModalProps> = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState<LocationType>('walking-alone');
  
  const locationTypes = [
    { id: 'public-transport', label: 'Public Transport', icon: Bus },
    { id: 'walking-alone', label: 'Walking Alone', icon: MapPin },
    { id: 'new-city', label: 'New City', icon: Compass },
    { id: 'night-travel', label: 'Night Travel', icon: Moon },
  ];
  
  const safetyTips: Record<LocationType, SafetyTip[]> = {
    'public-transport': [
      { 
        title: 'Stay Alert',
        description: 'Keep your belongings close and be aware of your surroundings at all times.',
        icon: Compass
      },
      {
        title: 'Share Your Location',
        description: 'Let a trusted contact know your route and expected arrival time.',
        icon: MapPin
      },
      {
        title: 'Avoid Empty Cars',
        description: 'When possible, sit near the driver or in cars with other passengers.',
        icon: Bus
      }
    ],
    'walking-alone': [
      {
        title: 'Well-lit Areas',
        description: 'Stick to well-lit, busy streets and avoid shortcuts through isolated areas.',
        icon: MapPin
      },
      {
        title: 'Walk Confidently',
        description: 'Keep your head up and walk with purpose. Appear confident and aware.',
        icon: Compass
      },
      {
        title: 'Keep Hands Free',
        description: 'Avoid having your hands full with packages or being distracted by your phone.',
        icon: MapPin
      }
    ],
    'new-city': [
      {
        title: 'Research Beforehand',
        description: 'Learn about safe and unsafe areas before visiting a new city.',
        icon: Compass
      },
      {
        title: 'Local Emergency Numbers',
        description: 'Save local emergency services numbers in your phone.',
        icon: MapPin
      },
      {
        title: 'Trust Your Instincts',
        description: 'If a situation feels unsafe, trust your intuition and leave immediately.',
        icon: Compass
      }
    ],
    'night-travel': [
      {
        title: 'Tell Someone Your Plans',
        description: 'Share your location and estimated return time with a trusted person.',
        icon: Moon
      },
      {
        title: 'Use Verified Services',
        description: 'Choose verified taxi services or ride-sharing apps with good reviews.',
        icon: Bus
      },
      {
        title: 'Stay in Populated Areas',
        description: 'Avoid isolated places and stay in well-lit, busy areas.',
        icon: MapPin
      }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-40 animate-fade-in flex items-center justify-center p-4">
      <div className="bg-naari-dark/95 rounded-2xl border border-white/10 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h2 className="text-xl font-semibold text-white">Safety Tips</h2>
          <button 
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            onClick={onClose}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 border-b border-white/10">
          {locationTypes.map((type) => (
            <button
              key={type.id}
              className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                selectedType === type.id 
                  ? 'bg-naari-purple/20 border border-naari-purple/50' 
                  : 'bg-white/5 hover:bg-white/10'
              } transition-all`}
              onClick={() => setSelectedType(type.id as LocationType)}
            >
              <type.icon className={`w-5 h-5 mb-1 ${
                selectedType === type.id ? 'text-naari-purple' : 'text-gray-400'
              }`} />
              <span className={`text-xs ${
                selectedType === type.id ? 'text-white' : 'text-gray-400'
              }`}>{type.label}</span>
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {safetyTips[selectedType].map((tip, index) => (
            <div key={index} className="glass-card rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-naari-purple/20 flex-shrink-0 flex items-center justify-center">
                  <tip.icon className="w-5 h-5 text-naari-purple" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{tip.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SafetyTipsModal;

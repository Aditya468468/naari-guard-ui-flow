import React, { useState } from 'react';
import { Calculator, FileText, Cloud, Smartphone } from 'lucide-react';

type DisguiseMode = 'calculator' | 'notes' | 'weather' | 'none';

const InvisibleModeSelector: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<DisguiseMode>('calculator');

  const modes = [
    { id: 'calculator' as DisguiseMode, name: 'Calculator', icon: Calculator, color: 'naari-purple' },
    { id: 'notes' as DisguiseMode, name: 'Notes', icon: FileText, color: 'naari-teal' },
    { id: 'weather' as DisguiseMode, name: 'Weather', icon: Cloud, color: 'yellow-400' },
  ];

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-3 border-b border-white/10 bg-white/5 flex items-center gap-2">
        <Smartphone className="w-4 h-4 text-naari-purple" />
        <h2 className="text-white font-medium">Invisible Mode</h2>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-400 mb-4">Choose a disguise for your safety app</p>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`glass-card p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  isSelected ? `border-2 border-${mode.color} shadow-glow-purple` : 'border border-white/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-full bg-${mode.color}/20 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${mode.color}`} />
                </div>
                <span className="text-xs text-white text-center">{mode.name}</span>
              </button>
            );
          })}
        </div>
        
        <div className="glass-card p-3 rounded-lg bg-white/5 border border-naari-purple/30">
          <p className="text-xs text-gray-400 flex items-center gap-2">
            <Smartphone className="w-3 h-3 text-naari-purple" />
            <span>Tip: Shake phone gently to switch disguise</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvisibleModeSelector;

import React, { useState } from 'react';
import { Heart, Scale, Phone, FileText, MessageCircle } from 'lucide-react';

type SupportType = 'emotional' | 'legal';

const SupportChat: React.FC = () => {
  const [activeSupport, setActiveSupport] = useState<SupportType>('emotional');

  const emotionalPrompts = [
    "I'm here with you. You're safe now.",
    "Let's take a deep breath together.",
    "You're stronger than you know.",
    "Focus on your breathing. In... and out..."
  ];

  const legalContacts = [
    { name: 'Police Emergency', number: '100', available: true },
    { name: 'Women Helpline', number: '1091', available: true },
    { name: 'Cyber Crime', number: '1930', available: true }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveSupport('emotional')}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeSupport === 'emotional'
              ? 'bg-gradient-to-r from-naari-purple to-naari-teal text-white shadow-glow-purple'
              : 'glass-card text-gray-400'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span className="text-sm font-medium">Emotional Support</span>
        </button>
        
        <button
          onClick={() => setActiveSupport('legal')}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeSupport === 'legal'
              ? 'bg-gradient-to-r from-naari-purple to-naari-teal text-white shadow-glow-purple'
              : 'glass-card text-gray-400'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span className="text-sm font-medium">Legal Help</span>
        </button>
      </div>

      {activeSupport === 'emotional' ? (
        <div className="space-y-4 flex-1">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-naari-purple" />
              <h3 className="text-white font-medium">Calming Messages</h3>
            </div>
            
            <div className="space-y-3">
              {emotionalPrompts.map((prompt, idx) => (
                <div 
                  key={idx}
                  className="glass-card p-3 rounded-lg bg-naari-purple/10 border border-naari-purple/20"
                >
                  <p className="text-sm text-gray-300">{prompt}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-5 h-5 text-naari-teal" />
              <h3 className="text-white font-medium">Breathing Exercise</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-naari-purple to-naari-teal flex items-center justify-center mb-3 animate-pulse-soft">
                <div className="w-20 h-20 rounded-full bg-naari-dark flex items-center justify-center">
                  <span className="text-white text-sm">Breathe</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center">
                Inhale for 4 seconds, hold for 4, exhale for 4
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 flex-1">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-5 h-5 text-naari-purple" />
              <h3 className="text-white font-medium">Emergency Contacts</h3>
            </div>
            
            <div className="space-y-2">
              {legalContacts.map((contact, idx) => (
                <div 
                  key={idx}
                  className="glass-card p-3 rounded-lg flex items-center justify-between hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-white text-sm font-medium">{contact.name}</p>
                    <p className="text-naari-teal text-sm">{contact.number}</p>
                  </div>
                  <Phone className="w-4 h-4 text-naari-teal" />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-naari-teal" />
              <h3 className="text-white font-medium">File FIR (Quick Guide)</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-naari-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-naari-purple text-xs">1</span>
                </div>
                <p className="text-sm text-gray-300">Visit nearest police station or file online</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-naari-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-naari-purple text-xs">2</span>
                </div>
                <p className="text-sm text-gray-300">Provide incident details with evidence</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-naari-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-naari-purple text-xs">3</span>
                </div>
                <p className="text-sm text-gray-300">Get FIR copy and reference number</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportChat;

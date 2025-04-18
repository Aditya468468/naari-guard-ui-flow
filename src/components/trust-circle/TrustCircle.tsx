
import React, { useState } from 'react';
import { Bell, Check, ChevronRight, MoreHorizontal, Phone, Share, Shield, UserPlus } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  relationship: string;
  isEmergencyContact: boolean;
  isSharing: boolean;
}

const TrustCircle: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: 'Mom', relationship: 'Family', isEmergencyContact: true, isSharing: true },
    { id: 2, name: 'Sarah', relationship: 'Friend', isEmergencyContact: true, isSharing: false },
    { id: 3, name: 'John', relationship: 'Friend', isEmergencyContact: false, isSharing: true },
  ]);
  const [isPrivateMode, setIsPrivateMode] = useState(true);
  
  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Trust Circle</h1>
          <p className="text-sm text-gray-400">Your personal safety network</p>
        </div>
        <button className="bg-naari-purple/20 text-naari-purple text-sm px-3 py-1 rounded-full flex items-center gap-1">
          <UserPlus className="w-3 h-3" />
          <span>Add</span>
        </button>
      </div>
      
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="text-naari-purple w-5 h-5" />
            <span className="text-white font-medium">Privacy Mode</span>
          </div>
          <div className="relative">
            <div 
              className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${
                isPrivateMode ? 'bg-naari-purple' : 'bg-gray-700'
              }`}
              onClick={() => setIsPrivateMode(!isPrivateMode)}
            >
              <div 
                className={`w-4 h-4 rounded-full bg-white transition-all ${
                  isPrivateMode ? 'ml-6' : 'ml-0'
                }`} 
              />
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-400">
          {isPrivateMode 
            ? 'Location sharing only during emergencies' 
            : 'Real-time location sharing with trust circle'}
        </p>
      </div>
      
      <div className="flex-1 space-y-4 mb-6">
        {contacts.map((contact) => (
          <div key={contact.id} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-naari-purple to-naari-teal flex items-center justify-center text-white font-medium">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-medium">{contact.name}</h3>
                  <p className="text-xs text-gray-400">{contact.relationship}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {contact.isEmergencyContact && (
                  <div className="w-8 h-8 rounded-full bg-naari-purple/20 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-naari-purple" />
                  </div>
                )}
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button className="flex flex-col items-center justify-center bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                <Phone className="w-4 h-4 text-naari-teal mb-1" />
                <span className="text-xs text-gray-300">Call</span>
              </button>
              
              <button className="flex flex-col items-center justify-center bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                <Bell className="w-4 h-4 text-naari-purple mb-1" />
                <span className="text-xs text-gray-300">Alert</span>
              </button>
              
              <button className="flex flex-col items-center justify-center bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                <Share className="w-4 h-4 text-gray-300 mb-1" />
                <span className="text-xs text-gray-300">Share</span>
              </button>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {contact.isSharing 
                  ? 'Location sharing active' 
                  : 'Not currently sharing location'}
              </span>
              {contact.isSharing && (
                <span className="flex items-center gap-1 text-xs text-naari-safe">
                  <Check className="w-3 h-3" />
                  <span>Connected</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass-card rounded-xl p-4 flex items-center justify-between cursor-pointer">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-naari-purple" />
          <div>
            <h3 className="text-white text-sm font-medium">Safety Services</h3>
            <p className="text-xs text-gray-500">Connect emergency services</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

export default TrustCircle;

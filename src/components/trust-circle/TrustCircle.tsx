
import React, { useState } from 'react';
import { Bell, Check, ChevronRight, MoreHorizontal, Phone, Share, Shield, UserPlus, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: number;
  name: string;
  relationship: string;
  isEmergencyContact: boolean;
  isSharing: boolean;
  isAlerted?: boolean;
}

const TrustCircle: React.FC = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: 'Mom', relationship: 'Family', isEmergencyContact: true, isSharing: true, isAlerted: false },
    { id: 2, name: 'Sarah', relationship: 'Friend', isEmergencyContact: true, isSharing: false, isAlerted: false },
    { id: 3, name: 'John', relationship: 'Friend', isEmergencyContact: false, isSharing: true, isAlerted: false },
  ]);
  const [isPrivateMode, setIsPrivateMode] = useState(true);
  const [isAlertMode, setIsAlertMode] = useState(false);
  
  const toggleAlertMode = () => {
    const newState = !isAlertMode;
    setIsAlertMode(newState);
    
    if (newState) {
      // Send alerts to emergency contacts
      const updatedContacts = contacts.map(contact => {
        if (contact.isEmergencyContact) {
          return { ...contact, isAlerted: true };
        }
        return contact;
      });
      setContacts(updatedContacts);
      
      toast({
        title: "Alert Mode Activated",
        description: "Your emergency contacts have been notified of your situation.",
        variant: "destructive",
        duration: 5000,
      });
    } else {
      // Cancel alerts
      const updatedContacts = contacts.map(contact => {
        return { ...contact, isAlerted: false };
      });
      setContacts(updatedContacts);
      
      toast({
        title: "Alert Mode Deactivated",
        description: "Your contacts have been notified that you are safe.",
        duration: 3000,
      });
    }
  };
  
  const sendAlert = (contactId: number) => {
    const updatedContacts = contacts.map(contact => {
      if (contact.id === contactId) {
        return { ...contact, isAlerted: !contact.isAlerted };
      }
      return contact;
    });
    setContacts(updatedContacts);
    
    const contact = contacts.find(c => c.id === contactId);
    
    if (contact) {
      if (!contact.isAlerted) {
        toast({
          title: `Alert Sent to ${contact.name}`,
          description: `${contact.name} has been notified of your situation.`,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: `Alert Cancelled for ${contact.name}`,
          description: `${contact.name} has been notified that you are safe.`,
          duration: 3000,
        });
      }
    }
  };
  
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
      
      {/* Alert Mode Button */}
      <button 
        className={`mb-6 w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
          isAlertMode 
            ? 'bg-red-500/20 border border-red-500/50 text-white animate-pulse' 
            : 'glass-card text-white'
        }`}
        onClick={toggleAlertMode}
      >
        <AlertTriangle className={`w-5 h-5 ${isAlertMode ? 'text-red-400' : 'text-naari-purple'}`} />
        <span className="font-medium">{isAlertMode ? 'Cancel Alert Mode' : 'Activate Alert Mode'}</span>
      </button>
      
      <div className="flex-1 space-y-4 mb-6">
        {contacts.map((contact) => (
          <div key={contact.id} className={`glass-card rounded-xl p-4 ${
            contact.isAlerted ? 'border border-red-500/50 shadow-glow-red' : ''
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${
                  contact.isAlerted 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' 
                    : 'bg-gradient-to-r from-naari-purple to-naari-teal'
                } flex items-center justify-center text-white font-medium`}>
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-medium">{contact.name}</h3>
                  <p className="text-xs text-gray-400">{contact.relationship}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {contact.isEmergencyContact && (
                  <div className={`w-8 h-8 rounded-full ${
                    contact.isAlerted 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-naari-purple/20 text-naari-purple'
                  } flex items-center justify-center`}>
                    <Bell className="w-4 h-4" />
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
              
              <button 
                className={`flex flex-col items-center justify-center ${
                  contact.isAlerted 
                    ? 'bg-red-500/20 text-red-300' 
                    : 'bg-white/5 text-gray-300'
                } rounded-lg p-2 hover:bg-white/10 transition-colors`}
                onClick={() => sendAlert(contact.id)}
              >
                <Bell className="w-4 h-4 mb-1" />
                <span className="text-xs">{contact.isAlerted ? 'Cancel' : 'Alert'}</span>
              </button>
              
              <button className="flex flex-col items-center justify-center bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                <Share className="w-4 h-4 text-gray-300 mb-1" />
                <span className="text-xs text-gray-300">Share</span>
              </button>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              {contact.isAlerted ? (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Alert sent {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              ) : (
                <span className="text-xs text-gray-400">
                  {contact.isSharing 
                    ? 'Location sharing active' 
                    : 'Not currently sharing location'}
                </span>
              )}
              
              {contact.isSharing && !contact.isAlerted && (
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

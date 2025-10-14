
import React, { useState } from 'react';
import { Bell, Check, ChevronRight, MoreHorizontal, Phone, Share, Shield, UserPlus, AlertTriangle, Trash } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useTrustCircle, TrustCircleContact } from '@/hooks/useTrustCircle';
import AddContactModal from './AddContactModal';
import CommunityMesh from './CommunityMesh';

const TrustCircle: React.FC = () => {
  const { toast } = useToast();
  const { contacts = [], isLoading, addContact, updateContact, deleteContact } = useTrustCircle();
  const [isPrivateMode, setIsPrivateMode] = useState(true);
  const [isAlertMode, setIsAlertMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const toggleAlertMode = () => {
    const newState = !isAlertMode;
    setIsAlertMode(newState);
    
    if (newState) {
      // Update emergency contacts' alert status
      contacts.forEach(contact => {
        if (contact.is_emergency_contact) {
          updateContact.mutate({
            ...contact,
            is_alerted: true
          });
        }
      });
      
      toast({
        title: "Alert Mode Activated",
        description: "Your emergency contacts have been notified of your situation.",
        variant: "destructive",
        duration: 5000,
      });
    } else {
      // Cancel alerts for all contacts
      contacts.forEach(contact => {
        updateContact.mutate({
          ...contact,
          is_alerted: false
        });
      });
      
      toast({
        title: "Alert Mode Deactivated",
        description: "Your contacts have been notified that you are safe.",
        duration: 3000,
      });
    }
  };
  
  const sendAlert = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    updateContact.mutate({
      ...contact,
      is_alerted: !contact.is_alerted
    });
    
    if (!contact.is_alerted) {
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
  };

  const handleAddContact = (contact: Omit<TrustCircleContact, 'id'>) => {
    addContact.mutate(contact);
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-naari-purple"></div>
      </div>
    );
  }
  
  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Trust Circle</h1>
          <p className="text-sm text-gray-400">Your personal safety network</p>
        </div>
        <button 
          className="bg-naari-purple/20 text-naari-purple text-sm px-3 py-1 rounded-full flex items-center gap-1"
          onClick={() => setShowAddModal(true)}
        >
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
            contact.is_alerted ? 'border border-red-500/50 shadow-glow-red' : ''
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${
                  contact.is_alerted 
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
                {contact.is_emergency_contact && (
                  <div className={`w-8 h-8 rounded-full ${
                    contact.is_alerted 
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
            
            <div className="grid grid-cols-4 gap-2">
              <button className="flex flex-col items-center justify-center bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                <Phone className="w-4 h-4 text-naari-teal mb-1" />
                <span className="text-xs text-gray-300">Call</span>
              </button>
              
              <button 
                className={`flex flex-col items-center justify-center ${
                  contact.is_alerted 
                    ? 'bg-red-500/20 text-red-300' 
                    : 'bg-white/5 text-gray-300'
                } rounded-lg p-2 hover:bg-white/10 transition-colors`}
                onClick={() => sendAlert(contact.id)}
              >
                <Bell className="w-4 h-4 mb-1" />
                <span className="text-xs">{contact.is_alerted ? 'Cancel' : 'Alert'}</span>
              </button>
              
              <button className="flex flex-col items-center justify-center bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                <Share className="w-4 h-4 text-gray-300 mb-1" />
                <span className="text-xs text-gray-300">Share</span>
              </button>
              
              <button 
                className="flex flex-col items-center justify-center bg-red-500/10 rounded-lg p-2 hover:bg-red-500/20 transition-colors"
                onClick={() => {
                  if (window.confirm(`Delete ${contact.name} from your trust circle?`)) {
                    deleteContact.mutate(contact.id);
                  }
                }}
              >
                <Trash className="w-4 h-4 text-red-400 mb-1" />
                <span className="text-xs text-red-400">Delete</span>
              </button>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              {contact.is_alerted ? (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Alert sent {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              ) : (
                <span className="text-xs text-gray-400">
                  {contact.is_sharing 
                    ? 'Location sharing active' 
                    : 'Not currently sharing location'}
                </span>
              )}
              
              {contact.is_sharing && !contact.is_alerted && (
                <span className="flex items-center gap-1 text-xs text-naari-safe">
                  <Check className="w-3 h-3" />
                  <span>Connected</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <CommunityMesh />
      
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

      {showAddModal && (
        <AddContactModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddContact}
        />
      )}
    </div>
  );
};

export default TrustCircle;

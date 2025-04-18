
import React, { useState } from 'react';
import { Bell, ChevronRight, Download, Key, Lock, Mic, Shield, Smartphone, Volume2 } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    offlineMode: false,
    aiListening: true,
    videoBackup: true,
    emergencyKeyword: 'help me now',
    notifications: true,
  });
  
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <h1 className="text-2xl font-bold text-gradient mb-2">Settings</h1>
      <p className="text-sm text-gray-400 mb-6">
        Customize your safety experience
      </p>
      
      <div className="space-y-6">
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-3 border-b border-white/10 bg-white/5">
            <h2 className="text-white font-medium">Privacy & Security</h2>
          </div>
          
          <div className="divide-y divide-white/10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-naari-purple/20 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-naari-purple" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">Offline Mode</h3>
                  <p className="text-xs text-gray-500">Only use device capabilities</p>
                </div>
              </div>
              <div className="relative">
                <div 
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${
                    settings.offlineMode ? 'bg-naari-purple' : 'bg-gray-700'
                  }`}
                  onClick={() => toggleSetting('offlineMode')}
                >
                  <div 
                    className={`w-4 h-4 rounded-full bg-white transition-all ${
                      settings.offlineMode ? 'ml-6' : 'ml-0'
                    }`} 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-naari-teal/20 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-naari-teal" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">Authentication</h3>
                  <p className="text-xs text-gray-500">Use biometrics for security</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-3 border-b border-white/10 bg-white/5">
            <h2 className="text-white font-medium">AI & Monitoring</h2>
          </div>
          
          <div className="divide-y divide-white/10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-naari-purple/20 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-naari-purple" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">AI Listening</h3>
                  <p className="text-xs text-gray-500">Monitor for dangerous situations</p>
                </div>
              </div>
              <div className="relative">
                <div 
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${
                    settings.aiListening ? 'bg-naari-purple' : 'bg-gray-700'
                  }`}
                  onClick={() => toggleSetting('aiListening')}
                >
                  <div 
                    className={`w-4 h-4 rounded-full bg-white transition-all ${
                      settings.aiListening ? 'ml-6' : 'ml-0'
                    }`} 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-naari-teal/20 flex items-center justify-center">
                  <Download className="w-4 h-4 text-naari-teal" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">Video Auto Backup</h3>
                  <p className="text-xs text-gray-500">Secure emergency recordings</p>
                </div>
              </div>
              <div className="relative">
                <div 
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${
                    settings.videoBackup ? 'bg-naari-teal' : 'bg-gray-700'
                  }`}
                  onClick={() => toggleSetting('videoBackup')}
                >
                  <div 
                    className={`w-4 h-4 rounded-full bg-white transition-all ${
                      settings.videoBackup ? 'ml-6' : 'ml-0'
                    }`} 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-naari-purple/20 flex items-center justify-center">
                  <Key className="w-4 h-4 text-naari-purple" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">Emergency Keyword</h3>
                  <p className="text-xs text-gray-500">"{settings.emergencyKeyword}"</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-3 border-b border-white/10 bg-white/5">
            <h2 className="text-white font-medium">Notifications</h2>
          </div>
          
          <div className="divide-y divide-white/10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-naari-purple/20 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-naari-purple" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">Safety Alerts</h3>
                  <p className="text-xs text-gray-500">Get notified of nearby incidents</p>
                </div>
              </div>
              <div className="relative">
                <div 
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${
                    settings.notifications ? 'bg-naari-purple' : 'bg-gray-700'
                  }`}
                  onClick={() => toggleSetting('notifications')}
                >
                  <div 
                    className={`w-4 h-4 rounded-full bg-white transition-all ${
                      settings.notifications ? 'ml-6' : 'ml-0'
                    }`} 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-naari-teal/20 flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-naari-teal" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">Sound Settings</h3>
                  <p className="text-xs text-gray-500">Customize alert sounds</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-naari-purple/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-naari-purple" />
            </div>
            <div>
              <h3 className="text-white text-sm font-medium">About NaariGuard AI</h3>
              <p className="text-xs text-gray-500">Version 1.0.0</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Designed with care for your protection and peace of mind
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;

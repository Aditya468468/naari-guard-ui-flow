
import React, { useState } from 'react';
import { Bell, MessageSquare, Shield, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import SafetyTipsModal from './SafetyTipsModal';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSafetyTips, setShowSafetyTips] = useState(false);
  const [activeFeatures, setActiveFeatures] = useState({
    walkWithMe: false,
    alertCircle: false,
    recording: false
  });

  const handleWalkWithMe = () => {
    const newState = !activeFeatures.walkWithMe;
    setActiveFeatures({...activeFeatures, walkWithMe: newState});
    
    if (newState) {
      toast({
        title: "Walk With Me Activated",
        description: "We'll monitor your route and alert you about nearby safe spots.",
        duration: 5000,
      });
      // Navigate to route planner for more options
      navigate('/route-planner');
    } else {
      toast({
        title: "Walk With Me Deactivated",
        description: "Route monitoring has been turned off.",
        duration: 3000,
      });
    }
  };

  const handleAlertCircle = () => {
    const newState = !activeFeatures.alertCircle;
    setActiveFeatures({...activeFeatures, alertCircle: newState});
    
    if (newState) {
      toast({
        title: "Alert Circle Activated",
        description: "Your trusted contacts will be notified if anything seems off.",
        duration: 5000,
      });
      // Navigate to trust circle
      navigate('/trust-circle');
    } else {
      toast({
        title: "Alert Circle Deactivated",
        description: "Your contacts will no longer receive alerts.",
        duration: 3000,
      });
    }
  };

  const handleRecord = () => {
    const newState = !activeFeatures.recording;
    setActiveFeatures({...activeFeatures, recording: newState});
    
    if (newState) {
      toast({
        title: "Recording Started",
        description: "Audio recording has been initiated in the background.",
        duration: 5000,
      });
      // Navigate to passive listener
      navigate('/passive-listener');
    } else {
      toast({
        title: "Recording Stopped",
        description: "Recording has been saved securely.",
        duration: 3000,
      });
    }
  };

  const actions = [
    { 
      icon: Shield, 
      label: 'Walk With Me', 
      color: activeFeatures.walkWithMe ? 'from-naari-purple to-naari-teal' : 'from-naari-purple to-naari-purple-dark',
      bgColor: activeFeatures.walkWithMe ? 'bg-naari-purple/20' : 'bg-naari-purple/10',
      onClick: handleWalkWithMe,
      active: activeFeatures.walkWithMe
    },
    { 
      icon: Bell, 
      label: 'Alert Circle', 
      color: activeFeatures.alertCircle ? 'from-red-500 to-amber-500' : 'from-naari-teal to-naari-teal-dark',
      bgColor: activeFeatures.alertCircle ? 'bg-red-500/20' : 'bg-naari-teal/10',
      onClick: handleAlertCircle,
      active: activeFeatures.alertCircle
    },
    { 
      icon: Video, 
      label: 'Record', 
      color: activeFeatures.recording ? 'from-red-600 to-red-400' : 'from-red-500 to-red-600',
      bgColor: activeFeatures.recording ? 'bg-red-500/20' : 'bg-red-500/10',
      onClick: handleRecord,
      active: activeFeatures.recording
    },
    { 
      icon: MessageSquare, 
      label: 'Safety Tips', 
      color: 'from-amber-400 to-amber-500',
      bgColor: 'bg-amber-400/10',
      onClick: () => setShowSafetyTips(true),
      active: false
    },
  ];

  return (
    <>
      <div className="grid grid-cols-4 gap-2 mt-4">
        {actions.map((action, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${action.bgColor} hover:opacity-90 transition-all cursor-pointer`}
            onClick={action.onClick}
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center shadow-md mb-1 ${action.active ? 'animate-pulse' : 'glow-effect'}`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-gray-300 text-center">{action.label}</span>
            {action.active && <span className="text-[10px] text-naari-teal mt-1">Active</span>}
          </div>
        ))}
      </div>
      
      {showSafetyTips && <SafetyTipsModal onClose={() => setShowSafetyTips(false)} />}
    </>
  );
};

export default QuickActions;


import React from 'react';
import { Bell, MessageSquare, Shield, Video } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    { 
      icon: Shield, 
      label: 'Walk With Me', 
      color: 'from-naari-purple to-naari-purple-dark',
      bgColor: 'bg-naari-purple/10'
    },
    { 
      icon: Bell, 
      label: 'Alert Circle', 
      color: 'from-naari-teal to-naari-teal-dark',
      bgColor: 'bg-naari-teal/10'
    },
    { 
      icon: Video, 
      label: 'Record', 
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10'
    },
    { 
      icon: MessageSquare, 
      label: 'Safety Tips', 
      color: 'from-amber-400 to-amber-500',
      bgColor: 'bg-amber-400/10'
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      {actions.map((action, index) => (
        <div 
          key={index} 
          className={`flex flex-col items-center justify-center p-2 rounded-lg ${action.bgColor} hover:opacity-90 transition-all cursor-pointer`}
        >
          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center shadow-md mb-1 glow-effect`}>
            <action.icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs text-gray-300 text-center">{action.label}</span>
        </div>
      ))}
    </div>
  );
};

export default QuickActions;

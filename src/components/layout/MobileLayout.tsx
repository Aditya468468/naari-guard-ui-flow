
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calculator, Home, MessageCircle, Mic, Settings, Users } from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Users, path: '/trust-circle', label: 'Trust Circle' },
    { icon: Calculator, path: '/calculator', label: 'Calculator', covert: true },
    { icon: Mic, path: '/passive-listener', label: 'Recorder', covert: true },
    { icon: Settings, path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-naari-dark relative">
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      
      {/* ChatBot */}
      <div 
        className="absolute bottom-20 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-naari-purple to-naari-teal flex items-center justify-center shadow-glow-purple cursor-pointer z-10 animate-pulse-soft"
        onClick={() => navigate('/assistant')}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </div>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-naari-dark border-t border-white/10 flex items-center justify-around px-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`flex flex-col items-center justify-center p-1 ${
              currentPath === item.path 
                ? 'text-naari-purple' 
                : 'text-gray-400'
            } ${item.covert ? 'opacity-70' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <item.icon className={`w-5 h-5 ${currentPath === item.path ? 'animate-pulse-soft' : ''}`} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MobileLayout;

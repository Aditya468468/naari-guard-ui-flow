
import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import AIBubble from '../components/assistant/AIBubble';
import SupportChat from '../components/assistant/SupportChat';
import { MessageCircle, HeartHandshake } from 'lucide-react';

const Assistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'support'>('chat');

  return (
    <MobileLayout>
      <div className="p-4 flex flex-col h-full">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-naari-purple to-naari-teal text-white shadow-glow-purple'
                : 'glass-card text-gray-400'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">AI Chat</span>
          </button>
          
          <button
            onClick={() => setActiveTab('support')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'support'
                ? 'bg-gradient-to-r from-naari-purple to-naari-teal text-white shadow-glow-purple'
                : 'glass-card text-gray-400'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span className="text-sm font-medium">Support</span>
          </button>
        </div>
        
        {activeTab === 'chat' ? <AIBubble /> : <SupportChat />}
      </div>
    </MobileLayout>
  );
};

export default Assistant;

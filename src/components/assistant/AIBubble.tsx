
import React, { useState } from 'react';
import { Bot, Send, X } from 'lucide-react';

const AIBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I\'m your NaariGuard AI assistant. How can I help you stay safe today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages([...messages, { role: 'user', content: input }]);
    
    // Simulate AI response (will connect to real AI later)
    setTimeout(() => {
      let response = '';
      
      if (input.toLowerCase().includes('walk with me')) {
        response = 'I\'ll walk with you. I\'m monitoring your location and will check in every few minutes. Stay safe!';
      } else if (input.toLowerCase().includes('danger') || input.toLowerCase().includes('scared')) {
        response = 'I detect you might be in danger. Would you like me to alert your Trust Circle or call emergency services?';
      } else {
        response = 'I\'m here to help. Try commands like "walk with me", "call my friend", or ask me for safety tips in your area.';
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
    
    setInput('');
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 bg-black/80 z-40 animate-fade-in flex flex-col">
          <div className="bg-naari-dark/95 rounded-t-xl border-t border-x border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-naari-purple to-naari-teal flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium">NaariGuard AI</h3>
                <p className="text-xs text-gray-400">Always here for you</p>
              </div>
            </div>
            <button 
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user' 
                      ? 'bg-naari-purple/80 text-white' 
                      : 'glass-card text-gray-200'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-white/10 bg-naari-dark/95">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-naari-purple"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                className="w-10 h-10 rounded-full bg-gradient-to-r from-naari-purple to-naari-teal flex items-center justify-center glow-effect"
                onClick={handleSend}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AIBubble;

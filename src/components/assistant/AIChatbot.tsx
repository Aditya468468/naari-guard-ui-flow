import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Hi! I'm your AI safety companion powered by advanced AI. I can help you with:\n\n🛡️ Safety advice and guidance\n💬 Emotional support\n🚨 Emergency mode activation\n\nJust say 'activate emergency mode' if you need immediate help. How can I assist you?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending message to AI chatbot:', messageText);
      
      const { data, error } = await supabase.functions.invoke('ai-chatbot', {
        body: { message: messageText }
      });

      console.log('AI chatbot response:', data, error);

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data || !data.response) {
        throw new Error('Invalid response from AI');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Remove the user message on error
      setMessages(prev => prev.slice(0, -1));
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="glass-card rounded-xl p-4 mb-4 bg-gradient-to-r from-naari-purple/10 to-naari-teal/10 border border-naari-purple/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-naari-purple to-naari-teal flex items-center justify-center shadow-glow-purple">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-naari-dark animate-pulse"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">AI Safety Companion</h3>
            <p className="text-xs text-naari-teal flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Online • Powered by AI
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 glass-card rounded-xl">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-naari-purple to-naari-teal text-white shadow-glow-purple'
                  : 'glass-card border border-white/10 text-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{msg.content}</p>
              <p className="text-xs opacity-60 mt-2 flex items-center gap-1">
                {msg.role === 'assistant' && '🤖 '}
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="glass-card rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-naari-teal animate-spin" />
                <span className="text-xs text-gray-400">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 glass-card rounded-xl mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything or say 'emergency mode'..."
            className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-3 text-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-naari-purple focus:ring-2 focus:ring-naari-purple/50 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-naari-purple to-naari-teal hover:shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full px-6 py-3 transition-all glow-effect"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">Powered by Advanced AI • Secure & Private</p>
      </div>
    </div>
  );
};

export default AIChatbot;

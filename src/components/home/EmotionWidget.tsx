import React, { useState, useEffect } from 'react';
import { Heart, Brain, AlertTriangle } from 'lucide-react';

type EmotionState = 'calm' | 'stressed' | 'panic';

const EmotionWidget: React.FC = () => {
  const [emotion, setEmotion] = useState<EmotionState>('calm');
  const [stressLevel, setStressLevel] = useState(0);

  useEffect(() => {
    // Simulate emotion detection (in real app, this would come from AI analysis)
    const interval = setInterval(() => {
      const randomStress = Math.random() * 100;
      setStressLevel(randomStress);
      
      if (randomStress > 70) setEmotion('panic');
      else if (randomStress > 40) setEmotion('stressed');
      else setEmotion('calm');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getEmotionConfig = () => {
    switch (emotion) {
      case 'panic':
        return {
          emoji: '😨',
          text: 'High stress detected',
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30'
        };
      case 'stressed':
        return {
          emoji: '😟',
          text: 'Feeling stressed',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30'
        };
      default:
        return {
          emoji: '🙂',
          text: 'Feeling calm',
          color: 'text-naari-safe',
          bgColor: 'bg-naari-safe/10',
          borderColor: 'border-naari-safe/30'
        };
    }
  };

  const config = getEmotionConfig();

  return (
    <div className={`glass-card rounded-xl p-4 border ${config.borderColor} ${config.bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Brain className={`w-4 h-4 ${config.color}`} />
          <span className="text-sm font-medium text-white">Emotional State</span>
        </div>
        <span className="text-2xl">{config.emoji}</span>
      </div>
      
      <p className={`text-sm ${config.color} mb-2`}>{config.text}</p>
      
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${
            emotion === 'panic' ? 'bg-red-500' : 
            emotion === 'stressed' ? 'bg-yellow-500' : 
            'bg-naari-safe'
          }`}
          style={{ width: `${stressLevel}%` }}
        />
      </div>
      
      {emotion === 'panic' && (
        <div className="mt-3 flex items-center gap-2 text-xs text-red-300 animate-pulse">
          <AlertTriangle className="w-3 h-3" />
          <span>AI Companion standing by</span>
        </div>
      )}
    </div>
  );
};

export default EmotionWidget;

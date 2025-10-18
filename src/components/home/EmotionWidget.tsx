import React, { useState, useEffect, useRef } from 'react';
import { Brain, AlertTriangle, Camera, CameraOff } from 'lucide-react';
import { pipeline } from '@huggingface/transformers';

type EmotionState = 'calm' | 'stressed' | 'panic';

const EmotionWidget: React.FC = () => {
  const [emotion, setEmotion] = useState<EmotionState>('calm');
  const [stressLevel, setStressLevel] = useState(0);
  const [cameraOn, setCameraOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const classifierRef = useRef<any>(null);

  const startCamera = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraOn(true);
      }
      
      // Load the emotion detection model
      if (!classifierRef.current) {
        classifierRef.current = await pipeline(
          'image-classification',
          'Xenova/vit-base-patch16-224-in21k-finetuned-emotions'
        );
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Camera access denied. Please allow camera permissions.');
      setIsLoading(false);
      setCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  };

  const analyzeEmotion = async () => {
    if (!videoRef.current || !canvasRef.current || !classifierRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    try {
      const imageData = canvas.toDataURL('image/jpeg');
      const result = await classifierRef.current(imageData);
      
      if (result && result.length > 0) {
        const topEmotion = result[0];
        const confidence = topEmotion.score * 100;
        
        // Map detected emotions to our states
        const label = topEmotion.label.toLowerCase();
        if (label.includes('angry') || label.includes('fear') || label.includes('sad')) {
          setEmotion('panic');
          setStressLevel(Math.min(70 + confidence * 0.3, 100));
        } else if (label.includes('neutral') || label.includes('surprise')) {
          setEmotion('stressed');
          setStressLevel(40 + confidence * 0.3);
        } else {
          setEmotion('calm');
          setStressLevel(Math.max(confidence * 0.4, 10));
        }
      }
    } catch (err) {
      console.error('Emotion analysis error:', err);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (cameraOn) {
      interval = setInterval(analyzeEmotion, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cameraOn]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
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
        <button
          onClick={cameraOn ? stopCamera : startCamera}
          disabled={isLoading}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          {cameraOn ? (
            <Camera className="w-4 h-4 text-naari-safe" />
          ) : (
            <CameraOff className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>

      {!cameraOn && !error && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-400 mb-3">Turn on camera for emotion detection</p>
          <button
            onClick={startCamera}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-naari-purple to-naari-teal text-white text-sm font-medium hover:shadow-glow-purple transition-all disabled:opacity-50"
          >
            {isLoading ? 'Loading AI...' : 'Enable Camera'}
          </button>
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {cameraOn && (
        <>
          <div className="relative mb-3 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-32 object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <p className={`text-sm ${config.color} mb-2 flex items-center gap-2`}>
            <span className="text-2xl">{config.emoji}</span>
            {config.text}
          </p>
          
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
        </>
      )}
    </div>
  );
};

export default EmotionWidget;

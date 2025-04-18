
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Shield, Clock, File, Save, Trash, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const PassiveListener: React.FC = () => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);
  const [recordings, setRecordings] = useState<Array<{id: number, duration: string, date: string, status: 'saved' | 'processing'}>>(
    [
      {id: 1, duration: '2:34', date: '2 hours ago', status: 'saved'},
      {id: 2, duration: '1:15', date: 'Yesterday', status: 'saved'},
    ]
  );
  
  // Simulated emergency keywords
  const emergencyKeywords = ['help', 'emergency', 'stop', 'danger'];
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isListening) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        
        // Simulate keyword detection randomly
        if (Math.random() > 0.95) {
          const randomKeyword = emergencyKeywords[Math.floor(Math.random() * emergencyKeywords.length)];
          if (!detectedKeywords.includes(randomKeyword)) {
            setDetectedKeywords(prev => [...prev, randomKeyword]);
            
            toast({
              title: "Emergency Keyword Detected",
              description: `The word "${randomKeyword}" was detected in your audio.`,
              variant: "destructive",
              duration: 5000,
            });
          }
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening, detectedKeywords]);
  
  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      setDetectedKeywords([]);
      setRecordingTime(0);
      
      toast({
        title: "Recording Started",
        description: "Listening for emergency keywords in the background.",
        duration: 3000,
      });
    } else {
      setIsListening(false);
      
      // Simulate saving the recording
      setIsProcessing(true);
      setTimeout(() => {
        const hours = Math.floor(recordingTime / 3600);
        const minutes = Math.floor((recordingTime % 3600) / 60);
        const seconds = recordingTime % 60;
        
        const formattedTime = hours > 0 
          ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` 
          : `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const newRecording = {
          id: recordings.length + 1,
          duration: formattedTime,
          date: 'Just now',
          status: 'saved' as const
        };
        
        setRecordings([newRecording, ...recordings]);
        setIsProcessing(false);
        
        toast({
          title: "Recording Saved",
          description: `${formattedTime} of audio has been safely stored.`,
          duration: 3000,
        });
      }, 2000);
    }
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return hours > 0 
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` 
      : `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="p-4 flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gradient">Audio Recorder</h1>
        <p className="text-sm text-gray-400">
          Automatically detects emergency keywords in your surroundings
        </p>
      </div>
      
      <div className={`glass-card rounded-xl p-6 mb-6 flex flex-col items-center ${
        isListening ? 'border border-red-500/30 shadow-glow-red' : ''
      }`}>
        <div 
          className={`w-24 h-24 rounded-full ${
            isListening 
              ? 'bg-red-500/20 border-2 border-red-500' 
              : 'bg-naari-purple/20 border-2 border-naari-purple'
          } flex items-center justify-center mb-4 relative`}
          onClick={toggleListening}
        >
          {isListening ? (
            <>
              <MicOff className="w-10 h-10 text-red-500" />
              <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75"></div>
            </>
          ) : (
            <Mic className="w-10 h-10 text-naari-purple" />
          )}
        </div>
        
        {isListening ? (
          <div className="text-center">
            <p className="text-lg font-medium text-white">Recording in Progress</p>
            <p className="text-2xl font-bold text-gradient mt-2">{formatTime(recordingTime)}</p>
          </div>
        ) : (
          <button 
            className="bg-naari-purple/80 text-white px-6 py-3 rounded-full flex items-center gap-2 glow-effect"
            onClick={toggleListening}
          >
            <Mic className="w-5 h-5" />
            <span>Start Recording</span>
          </button>
        )}
      </div>
      
      {/* Keyword Detection */}
      {isListening && detectedKeywords.length > 0 && (
        <div className="glass-card rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-red-400" />
            <h3 className="text-white font-medium">Keywords Detected</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {detectedKeywords.map((keyword, index) => (
              <span 
                key={index} 
                className="bg-red-500/20 text-red-400 text-xs px-3 py-1 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Features */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="glass-card rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Volume2 className="w-4 h-4 text-naari-purple" />
            <span className="text-sm text-white">Keyword Detection</span>
          </div>
          <p className="text-xs text-gray-400">Listens for emergency words</p>
        </div>
        
        <div className="glass-card rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-naari-teal" />
            <span className="text-sm text-white">Secure Storage</span>
          </div>
          <p className="text-xs text-gray-400">End-to-end encrypted files</p>
        </div>
      </div>
      
      {/* Recordings */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium">Recent Recordings</h3>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>Auto-delete after 7 days</span>
          </div>
        </div>
        
        {isProcessing && (
          <div className="glass-card rounded-xl p-3 mb-3 border border-naari-purple/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <File className="w-5 h-5 text-naari-purple" />
                <div>
                  <p className="text-white text-sm">Processing recording...</p>
                  <div className="w-32 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-naari-purple animate-pulse-w"></div>
                  </div>
                </div>
              </div>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}
        
        {recordings.map((recording) => (
          <div key={recording.id} className="glass-card rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <File className="w-5 h-5 text-naari-teal" />
                <div>
                  <p className="text-white text-sm">Recording {recording.id}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{recording.duration}</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span className="text-xs text-gray-400">{recording.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Save className="w-4 h-4 text-naari-teal" />
                </button>
                <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Trash className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassiveListener;

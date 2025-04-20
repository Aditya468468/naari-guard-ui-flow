import React from 'react';
import { Mic, MicOff, Volume2, Shield, File, Save, Trash, Info, Play, Pause } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import useAudioRecorder from '@/hooks/useAudioRecorder';

const PassiveListener: React.FC = () => {
  const { toast } = useToast();
  
  // Expanded emergency keywords to detect
  const emergencyKeywords = [
    'help', 'emergency', 'stop', 'danger', 
    'save me', 'please help', 'assistance', 'sos', 
    'need help', 'call police', 'call 911', 'help me'
  ];
  
  const {
    isRecording,
    recordingTime,
    detectedKeywords,
    recordings,
    status,
    startRecording,
    stopRecording,
    playRecording,
    stopPlayback,
    deleteRecording,
    formatTime,
    currentAudio
  } = useAudioRecorder(emergencyKeywords);
  
  const toggleListening = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };
  
  return (
    <div className="p-4 flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gradient">Audio Recorder</h1>
        <p className="text-sm text-gray-400">
          Automatically detects emergency keywords in your surroundings using Hugging Face AI
        </p>
      </div>
      
      {/* Recording control */}
      <div className={`glass-card rounded-xl p-6 mb-6 flex flex-col items-center ${
        isRecording ? 'border border-red-500/30 shadow-glow-red' : ''
      }`}>
        <div 
          className={`w-24 h-24 rounded-full ${
            isRecording 
              ? 'bg-red-500/20 border-2 border-red-500' 
              : 'bg-naari-purple/20 border-2 border-naari-purple'
          } flex items-center justify-center mb-4 relative cursor-pointer`}
          onClick={toggleListening}
        >
          {isRecording ? (
            <>
              <MicOff className="w-10 h-10 text-red-500" />
              <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75"></div>
            </>
          ) : (
            <Mic className="w-10 h-10 text-naari-purple" />
          )}
        </div>
        
        {isRecording ? (
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
      {isRecording && detectedKeywords.length > 0 && (
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
        
        {status === 'processing' && (
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
            </div>
          </div>
        )}
        
        {recordings.length === 0 && status !== 'processing' && (
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-gray-400">No recordings yet</p>
          </div>
        )}
        
        {recordings.map((recording) => (
          <div key={recording.id} className="glass-card rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <File className="w-5 h-5 text-naari-teal" />
                <div>
                  <p className="text-white text-sm">Recording {typeof recording.id === 'number' ? recording.id : recording.id.substring(0, 8)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{recording.duration}</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span className="text-xs text-gray-400">{recording.date}</span>
                  </div>
                  {recording.detectedKeywords && recording.detectedKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {recording.detectedKeywords.map((keyword, idx) => (
                        <span 
                          key={idx} 
                          className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {recording.audioUrl && (
                  <button 
                    className="w-8 h-8 rounded-full bg-naari-teal/20 flex items-center justify-center"
                    onClick={() => currentAudio?.src === recording.audioUrl 
                      ? stopPlayback() 
                      : playRecording(recording.audioUrl)}
                  >
                    {currentAudio?.src === recording.audioUrl ? (
                      <Pause className="w-4 h-4 text-naari-teal" />
                    ) : (
                      <Play className="w-4 h-4 text-naari-teal" />
                    )}
                  </button>
                )}
                <button 
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
                  onClick={() => deleteRecording(recording.id)}
                >
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

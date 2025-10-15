import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export type RecordingStatus = 'idle' | 'recording' | 'processing' | 'saved' | 'error';

export interface Recording {
  id: number | string;
  duration: string;
  date: string;
  status: 'saved' | 'processing';
  detectedKeywords?: string[];
  audioUrl?: string;
}

export const useAudioRecorder = (emergencyKeywords: string[] = []) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const intervalRef = useRef<number | null>(null);

  // Fetch previously saved recordings
  useEffect(() => {
    if (user) {
      fetchRecordings();
    }
  }, [user]);

  const fetchRecordings = async () => {
    try {
      console.log("Fetching recordings for user:", user?.id);
      const { data, error } = await supabase
        .from('audio_recordings')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) {
        console.error("Error fetching recordings:", error);
        throw error;
      }

      console.log("Fetched recordings:", data);

      if (data) {
        const recordingsWithUrls = await Promise.all(data.map(async item => {
          let audioUrl = null;
          if (item.file_path) {
            console.log("Getting signed URL for:", item.file_path);
            const { data: urlData, error: urlError } = await supabase
              .storage
              .from('audio_recordings')
              .createSignedUrl(item.file_path, 60 * 60); // 1 hour expiry
              
            if (urlError) {
              console.error("Error creating signed URL:", urlError);
            } else {
              console.log("Got signed URL:", urlData?.signedUrl);
              audioUrl = urlData?.signedUrl || null;
            }
          }
          
          return {
            id: item.id,
            duration: item.duration,
            date: formatDate(item.date),
            status: item.status as 'saved' | 'processing',
            detectedKeywords: item.detected_keywords,
            audioUrl
          };
        }));
        
        console.log("Recordings with URLs:", recordingsWithUrls);
        setRecordings(recordingsWithUrls);
      }
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast({
        title: "Error fetching recordings",
        description: "Could not load your saved recordings.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const startRecording = async () => {
    try {
      console.log("Starting recording...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Check if browser supports the MediaRecorder API with the desired format
      const mimeType = 'audio/webm';
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000
      });
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        console.log("Data available chunk size:", e.data.size);
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        if (chunksRef.current.length === 0) {
          console.error("No audio chunks recorded");
          setStatus('error');
          toast({
            title: "Recording Error",
            description: "No audio data was captured. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        const blob = new Blob(chunksRef.current, { type: mimeType });
        console.log("Recording stopped, blob size:", blob.size);
        setAudioBlob(blob);
        await processRecording(blob);
      };
      
      // Request data every second to ensure we're getting chunks
      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      setDetectedKeywords([]);
      setStatus('recording');
      
      // Start timer
      intervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording Started",
        description: "Listening for emergency keywords in the background.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      setStatus('error');
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log("Stopping recording...");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus('processing');
      
      // Stop timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processRecording = async (blob: Blob) => {
    try {
      console.log("🎙️ === PROCESSING RECORDING ===");
      console.log("📊 Audio blob size:", blob.size);
      console.log("📝 Keywords to check:", emergencyKeywords?.length || 0);
      
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to convert audio to base64"));
          }
        };
        reader.onerror = () => reject(reader.error);
      });
      reader.readAsDataURL(blob);
      const base64Data = await base64Promise;
      
      console.log("✅ Converted to base64");

      // Call edge function for transcription and keyword detection
      console.log('🚀 Calling process-audio edge function...');
      
      const { data: processData, error: processError } = await supabase.functions.invoke(
        'process-audio',
        {
          body: { 
            audioBlob: base64Data, 
            emergencyKeywords: emergencyKeywords || []
          },
        }
      );

      if (processError) {
        console.error("❌ Process error:", processError);
        throw processError;
      }
      
      console.log('==========================================');
      console.log("✅ RESPONSE FROM EDGE FUNCTION:");
      console.log('📝 Transcription:', processData?.transcription);
      console.log('🚨 Detected keywords:', processData?.detectedKeywords);
      console.log('🚦 Safety level:', processData?.safetyLevel);
      console.log('==========================================');
      
      // IMMEDIATE ALERT if keywords detected
      if (processData.detectedKeywords && processData.detectedKeywords.length > 0) {
        setDetectedKeywords(processData.detectedKeywords);
        
        console.log(`🚨🚨🚨 EMERGENCY ALERT! ${processData.detectedKeywords.length} keywords detected!`);
        
        // Show immediate alert
        toast({
          title: "🚨 EMERGENCY KEYWORDS DETECTED!",
          description: `Found: ${processData.detectedKeywords.join(', ')}`,
          variant: "destructive",
          duration: 15000,
        });

        // Send emergency notifications
        if (processData.safetyLevel === 'HIGH_ALERT') {
          try {
            console.log("🚨 SENDING EMERGENCY NOTIFICATIONS...");
            const { error: notifyError } = await supabase.functions.invoke(
              'send-emergency-notifications',
              {
                body: {
                  alertType: 'AUDIO_KEYWORD_DETECTION',
                  detectedKeywords: processData.detectedKeywords,
                  transcription: processData.transcription,
                  severity: 'HIGH',
                  timestamp: new Date().toISOString()
                }
              }
            );

            if (notifyError) {
              console.error("❌ Notification error:", notifyError);
            } else {
              console.log("✅ Emergency notifications sent!");
              toast({
                title: "✅ Trust Circle Notified",
                description: "Emergency contacts have been alerted!",
                duration: 8000,
              });
            }
          } catch (notifyError) {
            console.error("❌ Failed to send notifications:", notifyError);
          }
        }
      } else {
        console.log("✅ No emergency keywords detected");
      }

      // Save to database (optional, non-blocking)
      if (user) {
        try {
          const minutes = Math.floor(recordingTime / 60);
          const seconds = recordingTime % 60;
          const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          const fileName = `${user.id}/${Date.now()}.webm`;
          
          console.log("💾 Saving to database...");
          
          const { error: uploadError } = await supabase.storage
            .from('audio_recordings')
            .upload(fileName, blob);
            
          if (uploadError) {
            console.warn("⚠️ Upload skipped:", uploadError.message);
          } else {
            const { error: dbError } = await supabase
              .from('audio_recordings')
              .insert({
                user_id: user.id,
                duration: formattedTime,
                file_path: fileName,
                detected_keywords: processData.detectedKeywords || [],
              });
              
            if (!dbError) {
              await fetchRecordings();
              toast({
                title: "Recording Saved",
                description: `${formattedTime} of audio stored.`,
                duration: 2000,
              });
            }
          }
        } catch (saveError) {
          console.warn("⚠️ Save skipped:", saveError);
        }
      }
      
      setStatus(processData.detectedKeywords?.length > 0 ? 'saved' : 'idle');
      
    } catch (error) {
      console.error('❌ Processing error:', error);
      setStatus('error');
      toast({
        title: "Processing Error",
        description: "Failed to analyze audio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const playRecording = (audioUrl: string) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = "";
    }
    
    console.log("Playing audio URL:", audioUrl);
    const audio = new Audio(audioUrl);
    audio.onended = () => {
      setCurrentAudio(null);
    };
    
    setCurrentAudio(audio);
    audio.play().catch(err => {
      console.error("Error playing audio:", err);
      toast({
        title: "Playback Error",
        description: "Could not play this recording.",
        variant: "destructive",
      });
    });
  };

  const stopPlayback = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = "";
      setCurrentAudio(null);
    }
  };

  const deleteRecording = async (id: string | number) => {
    try {
      const idString = id.toString();
      console.log("Deleting recording with ID:", idString);
      
      // Get file path first
      const { data: recordingData, error: fetchError } = await supabase
        .from('audio_recordings')
        .select('file_path')
        .eq('id', idString)
        .single();
        
      if (fetchError) {
        console.error("Fetch error:", fetchError);
        throw fetchError;
      }
      
      // Delete from storage if file_path exists
      if (recordingData && (recordingData as any).file_path) {
        console.log("Deleting from storage:", (recordingData as any).file_path);
        const { error: storageError } = await supabase.storage
          .from('audio_recordings')
          .remove([(recordingData as any).file_path]);
          
        if (storageError) {
          console.error("Storage delete error:", storageError);
          throw storageError;
        }
      }
      
      // Delete from database
      console.log("Deleting from database:", idString);
      const { error: deleteError } = await supabase
        .from('audio_recordings')
        .delete()
        .eq('id', idString);
        
      if (deleteError) {
        console.error("Database delete error:", deleteError);
        throw deleteError;
      }
      
      console.log("Delete successful");
      
      // Update state
      setRecordings(prev => prev.filter(r => r.id.toString() !== idString));
      
      toast({
        title: "Recording Deleted",
        description: "The recording has been removed.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting recording:', error);
      toast({
        title: "Delete Error",
        description: "Failed to delete recording.",
        variant: "destructive",
      });
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

  // Clean up
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
      }
    };
  }, []);

  return {
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
  };
};

export default useAudioRecorder;

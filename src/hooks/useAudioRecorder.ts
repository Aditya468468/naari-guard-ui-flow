
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
      const { data, error } = await supabase
        .from('audio_recordings')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (data) {
        setRecordings(data.map(item => ({
          id: item.id,
          duration: item.duration,
          date: formatDate(item.date),
          status: item.status as 'saved' | 'processing',
          detectedKeywords: item.detected_keywords
        })));
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        await processRecording(blob);
      };
      
      mediaRecorderRef.current.start();
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
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save recordings.",
        variant: "destructive",
      });
      setStatus('error');
      return;
    }
    
    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          }
        };
      });
      reader.readAsDataURL(blob);
      const base64Data = await base64Promise;

      // Process audio with edge function
      const { data: processData, error: processError } = await supabase.functions.invoke(
        'process-audio',
        {
          body: { audioBlob: base64Data, emergencyKeywords },
        }
      );

      if (processError) throw processError;
      
      // If keywords were detected
      if (processData.detectedKeywords && processData.detectedKeywords.length > 0) {
        setDetectedKeywords(processData.detectedKeywords);
        
        // Notify about detected keywords
        for (const keyword of processData.detectedKeywords) {
          toast({
            title: "Emergency Keyword Detected",
            description: `The word "${keyword}" was detected in your audio.`,
            variant: "destructive",
            duration: 5000,
          });
        }
      }

      // Format recording duration
      const hours = Math.floor(recordingTime / 3600);
      const minutes = Math.floor((recordingTime % 3600) / 60);
      const seconds = recordingTime % 60;
      
      const formattedTime = hours > 0 
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` 
        : `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      // Save audio to Storage
      const fileName = `${user.id}/${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from('audio_recordings')
        .upload(fileName, blob);
        
      if (uploadError) throw uploadError;
      
      // Save record to database
      const { data: recordingData, error: dbError } = await supabase
        .from('audio_recordings')
        .insert({
          user_id: user.id,
          duration: formattedTime,
          file_path: fileName,
          detected_keywords: processData.detectedKeywords || [],
        })
        .select()
        .single();
        
      if (dbError) throw dbError;

      // Refresh recordings
      await fetchRecordings();
      
      setStatus('saved');
      
      toast({
        title: "Recording Saved",
        description: `${formattedTime} of audio has been safely stored.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error processing recording:', error);
      setStatus('error');
      toast({
        title: "Processing Error",
        description: "Failed to process and save recording.",
        variant: "destructive",
      });
    }
  };

  const deleteRecording = async (id: string | number) => {
    try {
      // Get file path first
      const { data: recordingData, error: fetchError } = await supabase
        .from('audio_recordings')
        .select('file_path')
        .eq('id', id.toString()) // Convert id to string here
        .single();
        
      if (fetchError) throw fetchError;
      
      // Delete from storage if file_path exists
      if (recordingData?.file_path) {
        const { error: storageError } = await supabase.storage
          .from('audio_recordings')
          .remove([recordingData.file_path]);
          
        if (storageError) throw storageError;
      }
      
      // Delete from database
      const { error: deleteError } = await supabase
        .from('audio_recordings')
        .delete()
        .eq('id', id.toString()); // Convert id to string here
        
      if (deleteError) throw deleteError;
      
      // Update state
      setRecordings(prev => prev.filter(r => r.id !== id));
      
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
    deleteRecording,
    formatTime
  };
};

export default useAudioRecorder;

-- Create trust_circle_contacts table
CREATE TABLE public.trust_circle_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  relationship TEXT,
  is_emergency_contact BOOLEAN NOT NULL DEFAULT false,
  is_sharing BOOLEAN NOT NULL DEFAULT false,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audio_recordings table
CREATE TABLE public.audio_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  duration TEXT NOT NULL,
  file_path TEXT NOT NULL,
  detected_keywords TEXT[] DEFAULT '{}',
  date TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
  status TEXT NOT NULL DEFAULT 'saved',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.trust_circle_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_recordings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for trust_circle_contacts
CREATE POLICY "Users can view their own contacts" 
ON public.trust_circle_contacts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contacts" 
ON public.trust_circle_contacts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts" 
ON public.trust_circle_contacts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts" 
ON public.trust_circle_contacts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for audio_recordings
CREATE POLICY "Users can view their own recordings" 
ON public.audio_recordings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recordings" 
ON public.audio_recordings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recordings" 
ON public.audio_recordings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recordings" 
ON public.audio_recordings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_trust_circle_contacts_updated_at
  BEFORE UPDATE ON public.trust_circle_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_audio_recordings_updated_at
  BEFORE UPDATE ON public.audio_recordings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for audio recordings
INSERT INTO storage.buckets (id, name, public) 
VALUES ('audio_recordings', 'audio_recordings', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for audio recordings
CREATE POLICY "Users can upload their own recordings" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'audio_recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own recordings" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'audio_recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own recordings" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'audio_recordings' AND auth.uid()::text = (storage.foldername(name))[1]);
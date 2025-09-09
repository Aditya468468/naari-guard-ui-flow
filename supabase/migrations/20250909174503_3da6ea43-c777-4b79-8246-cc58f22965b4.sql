-- Create tables needed by the app with proper RLS and triggers
-- Utility function to maintain updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 1) Trust Circle Contacts
CREATE TABLE IF NOT EXISTS public.trust_circle_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  relationship TEXT,
  is_emergency_contact BOOLEAN NOT NULL DEFAULT false,
  is_sharing BOOLEAN NOT NULL DEFAULT false,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trust_circle_contacts ENABLE ROW LEVEL SECURITY;

-- Policies for Trust Circle Contacts
DROP POLICY IF EXISTS "Users can view their own trust circle contacts" ON public.trust_circle_contacts;
CREATE POLICY "Users can view their own trust circle contacts"
ON public.trust_circle_contacts
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own trust circle contacts" ON public.trust_circle_contacts;
CREATE POLICY "Users can insert their own trust circle contacts"
ON public.trust_circle_contacts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own trust circle contacts" ON public.trust_circle_contacts;
CREATE POLICY "Users can update their own trust circle contacts"
ON public.trust_circle_contacts
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own trust circle contacts" ON public.trust_circle_contacts;
CREATE POLICY "Users can delete their own trust circle contacts"
ON public.trust_circle_contacts
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trg_trust_circle_contacts_updated_at ON public.trust_circle_contacts;
CREATE TRIGGER trg_trust_circle_contacts_updated_at
BEFORE UPDATE ON public.trust_circle_contacts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_trust_circle_contacts_user_id ON public.trust_circle_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_trust_circle_contacts_priority ON public.trust_circle_contacts(priority);

-- 2) Audio Recordings (table)
CREATE TABLE IF NOT EXISTS public.audio_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  duration TEXT NOT NULL,
  file_path TEXT NOT NULL,
  detected_keywords TEXT[] NOT NULL DEFAULT '{}',
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'saved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audio_recordings ENABLE ROW LEVEL SECURITY;

-- Policies for Audio Recordings (table)
DROP POLICY IF EXISTS "Users can view their own audio recordings" ON public.audio_recordings;
CREATE POLICY "Users can view their own audio recordings"
ON public.audio_recordings
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own audio recordings" ON public.audio_recordings;
CREATE POLICY "Users can insert their own audio recordings"
ON public.audio_recordings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own audio recordings" ON public.audio_recordings;
CREATE POLICY "Users can update their own audio recordings"
ON public.audio_recordings
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own audio recordings" ON public.audio_recordings;
CREATE POLICY "Users can delete their own audio recordings"
ON public.audio_recordings
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trg_audio_recordings_updated_at ON public.audio_recordings;
CREATE TRIGGER trg_audio_recordings_updated_at
BEFORE UPDATE ON public.audio_recordings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_audio_recordings_user_id ON public.audio_recordings(user_id);
CREATE INDEX IF NOT EXISTS idx_audio_recordings_date ON public.audio_recordings(date DESC);

-- 3) Cab Rides
CREATE TABLE IF NOT EXISTS public.cab_rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  driver_name TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  cab_company TEXT NOT NULL,
  source_location TEXT NOT NULL,
  destination_location TEXT NOT NULL,
  auto_fetched BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cab_rides ENABLE ROW LEVEL SECURITY;

-- Policies for Cab Rides
DROP POLICY IF EXISTS "Users can view their own cab rides" ON public.cab_rides;
CREATE POLICY "Users can view their own cab rides"
ON public.cab_rides
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own cab rides" ON public.cab_rides;
CREATE POLICY "Users can insert their own cab rides"
ON public.cab_rides
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own cab rides" ON public.cab_rides;
CREATE POLICY "Users can update their own cab rides"
ON public.cab_rides
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own cab rides" ON public.cab_rides;
CREATE POLICY "Users can delete their own cab rides"
ON public.cab_rides
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trg_cab_rides_updated_at ON public.cab_rides;
CREATE TRIGGER trg_cab_rides_updated_at
BEFORE UPDATE ON public.cab_rides
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_cab_rides_user_id ON public.cab_rides(user_id);
CREATE INDEX IF NOT EXISTS idx_cab_rides_is_active ON public.cab_rides(is_active);

-- 4) Storage bucket for audio recordings and security policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio_recordings', 'audio_recordings', false)
ON CONFLICT (id) DO NOTHING;

-- Allow users to view their own audio files
DROP POLICY IF EXISTS "Users can view their own audio files" ON storage.objects;
CREATE POLICY "Users can view their own audio files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'audio_recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to upload their own audio files
DROP POLICY IF EXISTS "Users can upload their own audio files" ON storage.objects;
CREATE POLICY "Users can upload their own audio files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'audio_recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own audio files
DROP POLICY IF EXISTS "Users can update their own audio files" ON storage.objects;
CREATE POLICY "Users can update their own audio files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'audio_recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own audio files
DROP POLICY IF EXISTS "Users can delete their own audio files" ON storage.objects;
CREATE POLICY "Users can delete their own audio files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'audio_recordings' AND auth.uid()::text = (storage.foldername(name))[1]);


-- Create audio_recordings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.audio_recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    file_path TEXT,
    duration TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL DEFAULT now(),
    detected_keywords TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'saved',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_audio_recordings_user_id ON public.audio_recordings(user_id);

-- Comment on table
COMMENT ON TABLE public.audio_recordings IS 'Stores audio recordings made by users with emergency keyword detection';

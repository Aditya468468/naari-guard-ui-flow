
-- Add Row Level Security to audio_recordings table
ALTER TABLE IF EXISTS public.audio_recordings ENABLE ROW LEVEL SECURITY;

-- Check and create policies if they don't exist
DO $$
BEGIN
    -- Policy for users to select their own recordings
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'audio_recordings' AND policyname = 'Users can view their own recordings'
    ) THEN
        CREATE POLICY "Users can view their own recordings" 
        ON public.audio_recordings 
        FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    -- Policy for users to insert their own recordings
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'audio_recordings' AND policyname = 'Users can insert their own recordings'
    ) THEN
        CREATE POLICY "Users can insert their own recordings" 
        ON public.audio_recordings 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Policy for users to update their own recordings
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'audio_recordings' AND policyname = 'Users can update their own recordings'
    ) THEN
        CREATE POLICY "Users can update their own recordings" 
        ON public.audio_recordings 
        FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;

    -- Policy for users to delete their own recordings
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'audio_recordings' AND policyname = 'Users can delete their own recordings'
    ) THEN
        CREATE POLICY "Users can delete their own recordings" 
        ON public.audio_recordings 
        FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END
$$;

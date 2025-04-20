
-- Create audio_recordings bucket if it doesn't exist
BEGIN;
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'audio_recordings'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('audio_recordings', 'audio_recordings', true);
        
        -- Add policy to allow authenticated users to upload to this bucket
        INSERT INTO storage.policies (name, definition, bucket_id)
        VALUES (
            'Allow authenticated users to upload',
            'storage.auth.uid() IS NOT NULL',
            'audio_recordings'
        );
    END IF;
END $$;
COMMIT;

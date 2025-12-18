-- Add share_token column to study_sessions for sharing
ALTER TABLE public.study_sessions 
ADD COLUMN share_token TEXT UNIQUE;

-- Create an index for faster lookups by share_token
CREATE INDEX idx_study_sessions_share_token ON public.study_sessions(share_token);

-- Allow public access to shared sessions (anyone with the share_token can view)
CREATE POLICY "Anyone can view shared sessions via token" 
ON public.study_sessions 
FOR SELECT 
USING (share_token IS NOT NULL);
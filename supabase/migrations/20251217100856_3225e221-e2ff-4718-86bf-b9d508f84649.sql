-- Create storage bucket for study note files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'study-files',
  'study-files',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- RLS policy for authenticated users to upload their own files
CREATE POLICY "Users can upload their own study files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'study-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policy for users to view their own files
CREATE POLICY "Users can view their own study files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'study-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policy for users to delete their own files
CREATE POLICY "Users can delete their own study files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'study-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
/*
  # Create ads storage bucket and policies

  1. New Storage Bucket
    - Creates 'ads' bucket for storing advertisement media
  
  2. Security
    - Enables public read access to ad media
    - Allows authenticated users to upload files
    - Restricts file types to images and videos
*/

-- Create the ads bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('ads', 'ads', true);

-- Policy to allow public read access to files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'ads');

-- Policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ads' 
  AND (storage.extension(name) = ANY (ARRAY['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov']))
);

-- Policy to allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid() = owner);
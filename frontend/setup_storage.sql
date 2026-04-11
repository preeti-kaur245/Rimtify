-- Run this in your Supabase SQL Editor to instantly fix File Uploads!

-- 1. Create the `materials` storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('materials', 'materials', false, null, null)
ON CONFLICT (id) DO UPDATE SET file_size_limit = null, allowed_mime_types = null;

-- 2. Drop existing restrictive policies on Storage Objects to prevent overlap
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow auth select" ON storage.objects;
DROP POLICY IF EXISTS "Allow auth update" ON storage.objects;
DROP POLICY IF EXISTS "Allow auth delete" ON storage.objects;

-- 3. Create Row Level Security (RLS) policies for the storage to allow ANY file size/format
-- Allow authenticated teachers to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'materials');

-- Allow authenticated teachers to download files
CREATE POLICY "Allow auth select" ON storage.objects
FOR SELECT TO authenticated 
USING (bucket_id = 'materials');

-- Allow authenticated teachers to rename/update files
CREATE POLICY "Allow auth update" ON storage.objects
FOR UPDATE TO authenticated 
USING (bucket_id = 'materials');

-- Allow authenticated teachers to delete their files
CREATE POLICY "Allow auth delete" ON storage.objects
FOR DELETE TO authenticated 
USING (bucket_id = 'materials');

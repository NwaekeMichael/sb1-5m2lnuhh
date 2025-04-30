/*
  # Cleanup Project Resources

  This migration safely removes all project resources in the correct order:
  1. Remove storage objects first
  2. Remove storage bucket and policies
  3. Drop application tables
  4. Remove triggers and functions
*/

-- First remove all objects from the avatars bucket
DELETE FROM storage.objects WHERE bucket_id = 'avatars';

-- Remove storage policies
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for avatars" ON storage.objects;

-- Now we can safely remove the bucket
DELETE FROM storage.buckets WHERE id = 'avatars';

-- Drop tables (in reverse order to handle dependencies)
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS user_metrics;

-- Drop trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop function
DROP FUNCTION IF EXISTS public.handle_user_signup();
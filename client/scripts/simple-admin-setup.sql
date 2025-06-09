-- Create admin user directly with confirmed email and proper password
-- This script should be run in the Supabase SQL Editor

-- Check if the admin user exists first
SELECT * FROM auth.users 
WHERE email = 'super.admin@gmail.com';

-- Insert the user if not exists
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  role
)
SELECT 
  'super.admin@gmail.com',
  crypt('SuperAdmin@2025', gen_salt('bf')),
  NOW(),
  '{"role": "admin_super", "full_name": "Super Admin"}',
  'authenticated'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'super.admin@gmail.com'
);

-- Get the user ID to use in profile
SELECT id, email FROM auth.users
WHERE email = 'super.admin@gmail.com';

-- Create/update the user profile
WITH user_id AS (
  SELECT id FROM auth.users WHERE email = 'super.admin@gmail.com'
)
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
)
SELECT 
  id,
  'super.admin@gmail.com',
  'Super Admin',
  'admin_super',
  NOW(),
  NOW()
FROM user_id
ON CONFLICT (id) 
DO UPDATE SET
  role = 'admin_super',
  full_name = 'Super Admin',
  updated_at = NOW();

-- Verify the profile was created
SELECT * FROM user_profiles
WHERE email = 'super.admin@gmail.com';

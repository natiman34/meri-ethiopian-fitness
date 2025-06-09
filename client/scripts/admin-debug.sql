-- Admin user debugging script
-- Run this in Supabase SQL Editor to check admin user status and RLS policies

-- Check if admin user exists and is correctly configured
SELECT id, email, role, 
       email_confirmed_at IS NOT NULL as is_email_confirmed,
       raw_user_meta_data->>'role' as metadata_role,
       is_disabled
FROM auth.users 
WHERE email = 'super.admin@gmail.com';

-- Check user profile
SELECT id, email, role, created_at
FROM user_profiles
WHERE email = 'super.admin@gmail.com';

-- Check user authentication enabled status
SELECT id, email, raw_user_meta_data, is_disabled 
FROM auth.users
WHERE email = 'super.admin@gmail.com';

-- Check RLS policies on profiles table
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'user_profiles';

-- Create simpler test admin with plaintext password (temporary for testing)
-- This alternative approach might work if there's an issue with the password hashing
INSERT INTO auth.users (
    instance_id, 
    id, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    raw_app_meta_data, 
    raw_user_meta_data, 
    role
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'admin.test@example.com',
    -- Using a simpler password hashing approach
    crypt('Password123!', gen_salt('bf', 10)),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"admin_super"}',
    'authenticated'
)
ON CONFLICT (email) DO NOTHING
RETURNING id, email, role, email_confirmed_at;

-- Add profile for the test admin
INSERT INTO user_profiles (
    id, 
    email, 
    full_name, 
    role
)
SELECT id, email, 'Test Admin', 'admin_super'
FROM auth.users
WHERE email = 'admin.test@example.com'
ON CONFLICT (email) DO NOTHING;

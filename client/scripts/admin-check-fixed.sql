-- Fixed admin user debugging script without is_disabled column
-- Run this in Supabase SQL Editor to check admin user status

-- Check if admin user exists and is correctly configured
SELECT id, email, role, 
       email_confirmed_at IS NOT NULL as is_email_confirmed,
       raw_user_meta_data->>'role' as metadata_role
FROM auth.users 
WHERE email = 'super.admin@gmail.com';

-- Check user profile
SELECT id, email, role, created_at
FROM user_profiles
WHERE email = 'super.admin@gmail.com';

-- Check RLS policies on profiles table
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'user_profiles';

-- Let's try a completely fresh approach with a new admin user
DO $$
DECLARE
    v_user_id uuid;
BEGIN
    -- Create a completely new test admin user
    INSERT INTO auth.users (
        instance_id, 
        id, 
        email, 
        encrypted_password, 
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at, 
        raw_app_meta_data, 
        raw_user_meta_data,
        created_at,
        updated_at,
        role
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'simple.admin@example.com',
        -- Use a very simple password for testing
        crypt('Simple123!', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"role":"admin_super"}',
        now(),
        now(),
        'authenticated'
    )
    ON CONFLICT (email) DO UPDATE SET
        encrypted_password = crypt('Simple123!', gen_salt('bf')),
        email_confirmed_at = now(),
        raw_user_meta_data = '{"role":"admin_super"}'
    RETURNING id INTO v_user_id;
    
    -- Create or update profile for the test admin
    INSERT INTO user_profiles (
        id, 
        email, 
        full_name, 
        role
    )
    VALUES (
        v_user_id, 
        'simple.admin@example.com', 
        'Simple Admin', 
        'admin_super'
    )
    ON CONFLICT (email) DO UPDATE SET
        role = 'admin_super',
        full_name = 'Simple Admin';
        
    RAISE NOTICE 'Created/updated test admin with ID: %', v_user_id;
END $$;

-- Verify the new admin user was created properly
SELECT id, email, role, email_confirmed_at, raw_user_meta_data
FROM auth.users 
WHERE email = 'simple.admin@example.com';

-- Verify profile was created
SELECT * FROM user_profiles
WHERE email = 'simple.admin@example.com';

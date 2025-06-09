-- Complete admin user setup script (copy and run this in the Supabase SQL Editor)
-- This script handles everything: user creation, email confirmation, and profile setup

-- 1. First, check if user exists
DO $$
DECLARE
    v_count int;
    v_user_id uuid;
    v_now timestamp := now();
BEGIN
    -- Check if user exists
    SELECT COUNT(*) INTO v_count FROM auth.users WHERE email = 'super.admin@gmail.com';
    
    RAISE NOTICE 'Found % users with email super.admin@gmail.com', v_count;
    
    -- Delete existing user if found (for clean slate)
    IF v_count > 0 THEN
        -- Delete profile first due to foreign key constraints
        DELETE FROM user_profiles WHERE email = 'super.admin@gmail.com';
        -- Delete the user 
        DELETE FROM auth.users WHERE email = 'super.admin@gmail.com';
        RAISE NOTICE 'Deleted existing user and profile';
    END IF;
    
    -- Create new admin user
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
        role,
        confirmation_token
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',  -- default instance_id
        gen_random_uuid(),                        -- generate a new UUID
        'super.admin@gmail.com',                  -- email
        crypt('SuperAdmin@2025', gen_salt('bf')), -- hashed password
        v_now,                                    -- email is confirmed
        v_now,                                    -- recovery sent at
        v_now,                                    -- last sign in
        '{"provider":"email","providers":["email"]}', -- app metadata
        '{"full_name":"Super Admin","role":"admin_super"}', -- user metadata with role
        v_now,                                    -- created_at
        v_now,                                    -- updated_at
        'authenticated',                          -- role (must be authenticated)
        NULL                                      -- no confirmation token needed
    )
    RETURNING id INTO v_user_id;
    
    RAISE NOTICE 'Created new admin user with ID: %', v_user_id;
    
    -- Create profile for the new user
    INSERT INTO user_profiles (
        id,
        email,
        full_name,
        role,
        created_at,
        updated_at
    )
    VALUES (
        v_user_id,
        'super.admin@gmail.com',
        'Super Admin',
        'admin_super',
        v_now,
        v_now
    );
    
    RAISE NOTICE 'Created profile for admin user';
    
    -- Verify creation
    RAISE NOTICE 'Verification - User exists: %', EXISTS(SELECT 1 FROM auth.users WHERE email = 'super.admin@gmail.com');
    RAISE NOTICE 'Verification - Profile exists: %', EXISTS(SELECT 1 FROM user_profiles WHERE email = 'super.admin@gmail.com');
END $$;

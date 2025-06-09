-- Simpler admin user creation script
-- First, check the existing admin status
SELECT id, email, role, 
       email_confirmed_at IS NOT NULL as is_email_confirmed,
       raw_user_meta_data->>'role' as metadata_role
FROM auth.users 
WHERE email = 'super.admin@gmail.com';

-- Check user profile
SELECT id, email, role, created_at
FROM user_profiles
WHERE email = 'super.admin@gmail.com';

-- Now try creating a simple admin user with a very basic approach
DO $$
DECLARE
    v_count int;
    v_user_id uuid;
BEGIN
    -- Check if user already exists
    SELECT COUNT(*) INTO v_count FROM auth.users WHERE email = 'admin123@example.com';
    
    IF v_count > 0 THEN
        -- Delete existing user if found
        RAISE NOTICE 'User admin123@example.com already exists. Deleting...';
        DELETE FROM user_profiles WHERE email = 'admin123@example.com';
        DELETE FROM auth.users WHERE email = 'admin123@example.com';
    END IF;
    
    -- Create a new admin user with very simple password
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
        'admin123@example.com',
        -- Super simple password for testing
        crypt('Admin123!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"role":"admin_super"}',
        'authenticated'
    )
    RETURNING id INTO v_user_id;
    
    RAISE NOTICE 'Created new test admin with ID: %', v_user_id;
    
    -- Create profile for the new user
    INSERT INTO user_profiles (
        id, 
        email, 
        full_name, 
        role
    )
    VALUES (
        v_user_id, 
        'admin123@example.com', 
        'Test Admin', 
        'admin_super'
    );
    
    RAISE NOTICE 'Created profile for test admin';
    
    -- Verify creation
    RAISE NOTICE 'Verification - User exists: %', EXISTS(SELECT 1 FROM auth.users WHERE email = 'admin123@example.com');
    RAISE NOTICE 'Verification - Profile exists: %', EXISTS(SELECT 1 FROM user_profiles WHERE email = 'admin123@example.com');
END $$;

-- Final verification query to see what was created
SELECT id, email, role, email_confirmed_at, raw_user_meta_data
FROM auth.users
WHERE email = 'admin123@example.com';

SELECT id, email, role
FROM user_profiles
WHERE email = 'admin123@example.com';

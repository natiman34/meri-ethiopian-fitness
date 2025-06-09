-- Check if user exists in auth.users
SELECT id, email, email_confirmed_at, raw_user_meta_data
FROM auth.users
WHERE email = 'super.admin@gmail.com';

-- Check if profile exists
SELECT id, email, role, full_name
FROM user_profiles
WHERE email = 'super.admin@gmail.com';

-- If not found, create the user and profile
DO $$
BEGIN
    -- Create auth user if not exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'super.admin@gmail.com') THEN
        INSERT INTO auth.users (
            email,
            raw_user_meta_data,
            email_confirmed_at,
            encrypted_password,
            role
        ) VALUES (
            'super.admin@gmail.com',
            '{"role": "admin_super"}',
            NOW(),
            crypt('SuperAdmin@2025', gen_salt('bf')),
            'authenticated'
        );
    END IF;

    -- Create profile if not exists
    IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE email = 'super.admin@gmail.com') THEN
        INSERT INTO user_profiles (
            email,
            full_name,
            role
        ) VALUES (
            'super.admin@gmail.com',
            'Super Admin',
            'admin_super'
        );
    END IF;
END $$;

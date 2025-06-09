-- CRITICAL: Use this script in the Supabase SQL Editor (NOT in your local environment)
-- This will create an admin user with confirmed email and proper password hash

-- 1. Check existing admin user
SELECT id, email, raw_user_meta_data, email_confirmed_at
FROM auth.users
WHERE email = 'super.admin@gmail.com';

-- 2. Delete existing admin if it exists (to start fresh)
DELETE FROM user_profiles 
WHERE email = 'super.admin@gmail.com';

DELETE FROM auth.users 
WHERE email = 'super.admin@gmail.com';

-- 3. Create admin user with confirmed email
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  confirmation_token
)
VALUES (
  'super.admin@gmail.com',
  crypt('SuperAdmin@2025', gen_salt('bf')),
  NOW(),
  '{"role": "admin_super", "full_name": "Super Admin"}',
  NOW(),
  NOW(),
  'authenticated',
  NULL
);

-- 4. Get the user ID
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user ID
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'super.admin@gmail.com';
  RAISE NOTICE 'User ID: %', v_user_id;
  
  -- 5. Create user profile
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
    NOW(),
    NOW()
  );
  
  RAISE NOTICE 'Admin user and profile created successfully';
END $$;

-- 1. Check if the user exists in auth.users
SELECT * FROM auth.users 
WHERE email = 'super.admin@gmail.com';

-- 2. If not found, insert the user with confirmed email
INSERT INTO auth.users (
  email,
  raw_user_meta_data,
  email_confirmed_at,
  encrypted_password,
  role
)
SELECT 
  'super.admin@gmail.com',
  '{"role": "admin_super", "full_name": "Super Admin"}',
  NOW(),
  crypt('SuperAdmin@2025', gen_salt('bf')),
  'authenticated'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'super.admin@gmail.com'
);

-- 3. Get the user ID (even if it already existed)
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user ID
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'super.admin@gmail.com';
  
  -- Output the user ID for reference
  RAISE NOTICE 'User ID: %', v_user_id;
  
  -- 4. Insert or update the user profile
  INSERT INTO user_profiles (id, email, full_name, role)
  VALUES (
    v_user_id,
    'super.admin@gmail.com',
    'Super Admin',
    'admin_super'
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    full_name = 'Super Admin',
    role = 'admin_super',
    updated_at = NOW();
    
  RAISE NOTICE 'Profile updated for user ID: %', v_user_id;
END $$;

-- First, create the user in auth.users if it doesn't exist
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  '87f4b707-5c99-4234-b4fb-bcdb185fc27e',
  '00000000-0000-0000-0000-000000000000',
  'super.admin@gmail.com',
  crypt('SuperAdmin@2025', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin_super"}',
  false,
  'authenticated'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  updated_at = now(),
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- Then ensure the profile exists
INSERT INTO public.user_profiles (
  id,
  full_name,
  email,
  role,
  created_at,
  updated_at
)
VALUES (
  '87f4b707-5c99-4234-b4fb-bcdb185fc27e',
  'Super Admin',
  'super.admin@gmail.com',
  'admin_super',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = now();

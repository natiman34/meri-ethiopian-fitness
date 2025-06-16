-- Fix password reset functionality
-- This migration creates a secure function to check user existence without RLS issues

-- Create a function to safely check if a user exists by email
-- This function runs with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.check_user_exists_by_email(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user exists in auth.users table (more reliable than user_profiles)
    RETURN EXISTS (
        SELECT 1 
        FROM auth.users 
        WHERE email = user_email 
        AND email_confirmed_at IS NOT NULL
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.check_user_exists_by_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_exists_by_email(TEXT) TO anon;

-- Add comment to document the function
COMMENT ON FUNCTION public.check_user_exists_by_email(TEXT) IS 'Safely checks if a user exists by email without RLS restrictions. Used for password reset validation.';

-- Clean up duplicate RLS policies on user_profiles table
-- Remove conflicting policies that might cause issues
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable select for users based on user_id" ON public.user_profiles;

-- Keep only the essential policies
-- Users can view their own profile
-- This policy already exists: "Allow authenticated users to view their own profile"

-- Users can insert their own profile (for registration)
-- This policy already exists: "Users can insert their own profile"

-- Users can update their own profile
-- This policy already exists: "Users can update own profile"

-- Add a policy for service role to read user profiles (for admin functions)
CREATE POLICY "Service role can read all profiles" ON public.user_profiles
    FOR SELECT
    TO service_role
    USING (true);

-- Add a policy for anonymous users to check email existence (for password reset)
CREATE POLICY "Anonymous can check email existence" ON public.user_profiles
    FOR SELECT
    TO anon
    USING (email IS NOT NULL);

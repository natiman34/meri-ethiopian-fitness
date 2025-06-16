-- Apply registration fix to prevent duplicate user registrations
-- This script should be run on the Supabase database

-- First, create the user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- For backward compatibility
    full_name TEXT,
    email TEXT UNIQUE NOT NULL, -- UNIQUE constraint prevents duplicate emails
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin_super', 'admin_nutritionist', 'admin_fitness', 'nutritionist', 'planner')),
    fitness_goal TEXT,
    height NUMERIC,
    weight NUMERIC,
    bmi NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint on email if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_profiles_email_key'
    ) THEN
        ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_email_key UNIQUE (email);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_profiles updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow profile creation during registration" ON user_profiles;

-- RLS Policies for user_profiles
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow profile creation during registration (needed for the trigger)
CREATE POLICY "Allow profile creation during registration" ON user_profiles
    FOR INSERT WITH CHECK (true);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.id = auth.uid() 
            AND up.role LIKE 'admin_%'
        )
    );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON user_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.id = auth.uid() 
            AND up.role LIKE 'admin_%'
        )
    );

-- Function to handle new user registration
-- This function will be called automatically when a new user is created in auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name, role, user_id)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
        NEW.id -- Set user_id for backward compatibility
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
        role = COALESCE(EXCLUDED.role, user_profiles.role),
        updated_at = NOW();
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- If there's a unique constraint violation on email, log it but don't fail
        RAISE LOG 'Duplicate email detected during user profile creation: %', NEW.email;
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log other errors but don't fail the auth user creation
        RAISE LOG 'Error creating user profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create user profile when auth user is created
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add comments to document the purpose
COMMENT ON TABLE user_profiles IS 'User profiles table with unique email constraint to prevent duplicate registrations';
COMMENT ON COLUMN user_profiles.email IS 'User email address - UNIQUE constraint prevents duplicate registrations';
COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates user profile when new auth user is registered';

-- Clean up any duplicate profiles that might exist (run this carefully in production)
-- This will keep the first profile for each email and remove duplicates
-- DELETE FROM user_profiles 
-- WHERE id NOT IN (
--     SELECT DISTINCT ON (email) id 
--     FROM user_profiles 
--     ORDER BY email, created_at ASC
-- );

COMMIT;

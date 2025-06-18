-- Fix Activity Logging System
-- This migration fixes the activity logging system by:
-- 1. Creating the missing admin_logs table
-- 2. Adding missing columns to existing tables
-- 3. Updating the activity_log table to include user tracking
-- 4. Creating proper indexes and RLS policies

-- Create admin_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing updated_at column to activities table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'activities' AND column_name = 'updated_at') THEN
        ALTER TABLE activities ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add user_id and admin_id columns to activity_log table to track who performed actions
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'activity_log' AND column_name = 'user_id') THEN
        ALTER TABLE activity_log ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'activity_log' AND column_name = 'admin_id') THEN
        ALTER TABLE activity_log ADD COLUMN admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create indexes for admin_logs table
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);

-- Create indexes for activity_log table
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_admin_id ON activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_type ON activity_log(type);
CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON activity_log(timestamp);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for activities table
DROP TRIGGER IF EXISTS update_activities_updated_at ON activities;
CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for admin_logs
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_logs table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view their own logs" ON admin_logs;
DROP POLICY IF EXISTS "Admins can create their own logs" ON admin_logs;
DROP POLICY IF EXISTS "Super admins can view all logs" ON admin_logs;

-- Admins can view their own logs
CREATE POLICY "Admins can view their own logs" ON admin_logs
    FOR SELECT USING (
        auth.uid() = admin_id AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role LIKE 'admin_%'
        )
    );

-- Admins can create their own logs
CREATE POLICY "Admins can create their own logs" ON admin_logs
    FOR INSERT WITH CHECK (
        auth.uid() = admin_id AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role LIKE 'admin_%'
        )
    );

-- Super admins can view all logs
CREATE POLICY "Super admins can view all logs" ON admin_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin_super'
        )
    );

-- Update activity_log RLS policies to include user/admin tracking
-- Enable RLS if not already enabled
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view activity log" ON activity_log;
DROP POLICY IF EXISTS "Users can view activity log" ON activity_log;
DROP POLICY IF EXISTS "Admins can manage activity log" ON activity_log;

-- Allow public to view general activity log (without sensitive details)
CREATE POLICY "Public can view activity log" ON activity_log
    FOR SELECT USING (true);

-- Allow authenticated users to create activity log entries
CREATE POLICY "Authenticated users can create activity log" ON activity_log
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow admins to manage all activity log entries
CREATE POLICY "Admins can manage activity log" ON activity_log
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role LIKE 'admin_%'
        )
    );

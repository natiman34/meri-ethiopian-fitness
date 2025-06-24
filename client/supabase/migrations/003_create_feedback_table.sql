-- Create feedback table for user feedback management
-- This migration creates the feedback table with comprehensive structure for SuperAdmin management

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_resolved BOOLEAN DEFAULT FALSE,
    reply_message TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_is_resolved ON feedback(is_resolved);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_email ON feedback(email);

-- Create updated_at trigger for feedback table
DROP TRIGGER IF EXISTS update_feedback_updated_at ON feedback;
CREATE TRIGGER update_feedback_updated_at
    BEFORE UPDATE ON feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for feedback table
-- Allow authenticated users to insert their own feedback
CREATE POLICY "Users can insert their own feedback" ON feedback
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        auth.uid() IS NULL -- Allow anonymous feedback
    );

-- Allow users to view their own feedback
CREATE POLICY "Users can view their own feedback" ON feedback
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role IN ('admin_super', 'admin_nutritionist', 'admin_fitness')
        )
    );

-- Allow admins to view all feedback
CREATE POLICY "Admins can view all feedback" ON feedback
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role IN ('admin_super', 'admin_nutritionist', 'admin_fitness')
        )
    );

-- Allow admins to update feedback (for resolving and replying)
CREATE POLICY "Admins can update feedback" ON feedback
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role IN ('admin_super', 'admin_nutritionist', 'admin_fitness')
        )
    );

-- Allow anonymous feedback submission (for users not logged in)
CREATE POLICY "Allow anonymous feedback" ON feedback
    FOR INSERT WITH CHECK (user_id IS NULL);

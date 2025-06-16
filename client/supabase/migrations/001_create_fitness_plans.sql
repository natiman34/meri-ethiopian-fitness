-- Create fitness_plans table with comprehensive structure
-- Note: user_profiles table is created in 000_create_user_profiles.sql migration

-- Create activities table for user activity tracking
CREATE TABLE IF NOT EXISTS activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('workout', 'cardio', 'strength', 'flexibility', 'custom', 'manual')),
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_activity_progress table for manually selected activity days
CREATE TABLE IF NOT EXISTS user_activity_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    selected_dates TEXT[] NOT NULL DEFAULT '{}', -- Array of date strings in 'yyyy-MM-dd' format
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id) -- One record per user
);

-- Create indexes for activities table
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_activities_user_date ON activities(user_id, date);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);

-- Create indexes for user_activity_progress table
CREATE INDEX IF NOT EXISTS idx_user_activity_progress_user_id ON user_activity_progress(user_id);
CREATE TABLE IF NOT EXISTS fitness_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('weight-loss', 'weight-gain', 'maintenance', 'strength', 'flexibility', 'endurance', 'muscle-building', 'functional')),
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    duration INTEGER NOT NULL DEFAULT 30, -- in days
    image_url TEXT,
    thumbnail_gif_url TEXT,
    full_gif_url TEXT,
    weekly_workouts INTEGER NOT NULL DEFAULT 3,
    estimated_calories_burn INTEGER,
    difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
    target_audience TEXT,
    prerequisites TEXT[] DEFAULT '{}',
    equipment TEXT[] DEFAULT '{}',
    goals TEXT[] DEFAULT '{}',
    schedule JSONB DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(2,1),
    review_count INTEGER DEFAULT 0,
    completion_rate INTEGER DEFAULT 0,
    average_workout_time INTEGER, -- in minutes
    muscle_groups TEXT[] DEFAULT '{}',
    equipment_required TEXT[] DEFAULT '{}',
    time_of_day TEXT CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'any')),
    location TEXT,
    intensity TEXT CHECK (intensity IN ('low', 'moderate', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fitness_plans_category ON fitness_plans(category);
CREATE INDEX IF NOT EXISTS idx_fitness_plans_level ON fitness_plans(level);
CREATE INDEX IF NOT EXISTS idx_fitness_plans_status ON fitness_plans(status);
CREATE INDEX IF NOT EXISTS idx_fitness_plans_featured ON fitness_plans(featured);
CREATE INDEX IF NOT EXISTS idx_fitness_plans_user_id ON fitness_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_fitness_plans_created_at ON fitness_plans(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fitness_plans_updated_at
    BEFORE UPDATE ON fitness_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for activities table
CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for user_activity_progress table
CREATE TRIGGER update_user_activity_progress_updated_at
    BEFORE UPDATE ON user_activity_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE fitness_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow public read access to published plans
CREATE POLICY "Public can view published fitness plans" ON fitness_plans
    FOR SELECT USING (status = 'published');

-- Allow authenticated users to view all plans
CREATE POLICY "Authenticated users can view all fitness plans" ON fitness_plans
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to create their own plans
CREATE POLICY "Users can create their own fitness plans" ON fitness_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own plans
CREATE POLICY "Users can update their own fitness plans" ON fitness_plans
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own plans
CREATE POLICY "Users can delete their own fitness plans" ON fitness_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Allow admins full access
CREATE POLICY "Admins have full access to fitness plans" ON fitness_plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role LIKE 'admin_%'
        )
    );

-- RLS Policies for activities table
-- Users can view their own activities
CREATE POLICY "Users can view their own activities" ON activities
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own activities
CREATE POLICY "Users can create their own activities" ON activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own activities
CREATE POLICY "Users can update their own activities" ON activities
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own activities
CREATE POLICY "Users can delete their own activities" ON activities
    FOR DELETE USING (auth.uid() = user_id);

-- Admins can manage all activities
CREATE POLICY "Admins can manage all activities" ON activities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role LIKE 'admin_%'
        )
    );

-- RLS Policies for user_activity_progress table
-- Users can view their own activity progress
CREATE POLICY "Users can view their own activity progress" ON user_activity_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own activity progress
CREATE POLICY "Users can create their own activity progress" ON user_activity_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own activity progress
CREATE POLICY "Users can update their own activity progress" ON user_activity_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own activity progress
CREATE POLICY "Users can delete their own activity progress" ON user_activity_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Admins can manage all activity progress
CREATE POLICY "Admins can manage all activity progress" ON user_activity_progress
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role LIKE 'admin_%'
        )
    );

-- Create storage bucket for fitness assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('fitness-assets', 'fitness-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for fitness assets
CREATE POLICY "Public can view fitness assets" ON storage.objects
    FOR SELECT USING (bucket_id = 'fitness-assets');

CREATE POLICY "Authenticated users can upload fitness assets" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'fitness-assets' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update their own fitness assets" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'fitness-assets' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Admins can manage all fitness assets" ON storage.objects
    FOR ALL USING (
        bucket_id = 'fitness-assets' 
        AND EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role LIKE 'admin_%'
        )
    );

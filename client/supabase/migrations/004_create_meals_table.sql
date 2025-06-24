-- Create meals table with comprehensive structure and duplicate prevention
-- This migration creates the meals table with unique constraints to prevent duplicate meals

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_ethiopian BOOLEAN DEFAULT FALSE,
    ingredients TEXT[] DEFAULT '{}',
    preparation TEXT,
    nutritional_info JSONB DEFAULT '{"calories": 0, "protein": 0, "carbs": 0, "fat": 0}',
    category TEXT CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage')),
    cuisine_type TEXT DEFAULT 'international' CHECK (cuisine_type IN ('ethiopian', 'international', 'mediterranean', 'asian', 'american', 'european')),
    difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    prep_time INTEGER, -- in minutes
    cook_time INTEGER, -- in minutes
    servings INTEGER DEFAULT 1 CHECK (servings > 0),
    tags TEXT[] DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicate meal names (case-insensitive)
    CONSTRAINT unique_meal_name UNIQUE (LOWER(name)),
    
    -- Composite unique constraint to prevent duplicate meals with same name and cuisine type
    CONSTRAINT unique_meal_name_cuisine UNIQUE (LOWER(name), cuisine_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meals_name ON meals(name);
CREATE INDEX IF NOT EXISTS idx_meals_category ON meals(category);
CREATE INDEX IF NOT EXISTS idx_meals_cuisine_type ON meals(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_meals_difficulty_level ON meals(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_meals_is_ethiopian ON meals(is_ethiopian);
CREATE INDEX IF NOT EXISTS idx_meals_status ON meals(status);
CREATE INDEX IF NOT EXISTS idx_meals_created_by ON meals(created_by);
CREATE INDEX IF NOT EXISTS idx_meals_created_at ON meals(created_at);
CREATE INDEX IF NOT EXISTS idx_meals_tags ON meals USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_meals_ingredients ON meals USING GIN(ingredients);

-- Create updated_at trigger for meals table
DROP TRIGGER IF EXISTS update_meals_updated_at ON meals;
CREATE TRIGGER update_meals_updated_at
    BEFORE UPDATE ON meals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for meals table
-- Allow public read access to active meals
CREATE POLICY "Public can view active meals" ON meals
    FOR SELECT USING (status = 'active');

-- Allow authenticated users to view all meals
CREATE POLICY "Authenticated users can view all meals" ON meals
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to create meals
CREATE POLICY "Users can create meals" ON meals
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        (created_by = auth.uid() OR created_by IS NULL)
    );

-- Allow users to update their own meals
CREATE POLICY "Users can update their own meals" ON meals
    FOR UPDATE USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role IN ('admin_super', 'admin_nutritionist')
        )
    );

-- Allow users to delete their own meals (soft delete by setting status to archived)
CREATE POLICY "Users can delete their own meals" ON meals
    FOR UPDATE USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role IN ('admin_super', 'admin_nutritionist')
        )
    );

-- Allow admins full access to meals
CREATE POLICY "Admins have full access to meals" ON meals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role IN ('admin_super', 'admin_nutritionist')
        )
    );

-- Create storage bucket for meal images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('meal-images', 'meal-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for meal images
CREATE POLICY "Public can view meal images" ON storage.objects
    FOR SELECT USING (bucket_id = 'meal-images');

CREATE POLICY "Authenticated users can upload meal images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'meal-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update their own meal images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'meal-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own meal images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'meal-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Add comments to document the purpose
COMMENT ON TABLE meals IS 'Meals table with unique constraints to prevent duplicate meal names';
COMMENT ON CONSTRAINT unique_meal_name ON meals IS 'Prevents duplicate meal names (case-insensitive)';
COMMENT ON CONSTRAINT unique_meal_name_cuisine ON meals IS 'Prevents duplicate meals with same name and cuisine type';

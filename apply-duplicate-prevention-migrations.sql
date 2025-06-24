-- Apply duplicate prevention migrations
-- This script applies the meals table creation and fitness plans constraints

-- First, create the meals table with unique constraints
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

-- Add unique constraints to fitness_plans table if they don't exist
DO $$ 
BEGIN
    -- Add unique constraint to prevent duplicate plan titles (case-insensitive)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_fitness_plan_title' 
        AND table_name = 'fitness_plans'
    ) THEN
        ALTER TABLE fitness_plans 
        ADD CONSTRAINT unique_fitness_plan_title 
        UNIQUE (LOWER(title));
    END IF;

    -- Add composite unique constraint to prevent duplicate plans with same title, category, and level
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_fitness_plan_title_category_level' 
        AND table_name = 'fitness_plans'
    ) THEN
        ALTER TABLE fitness_plans 
        ADD CONSTRAINT unique_fitness_plan_title_category_level 
        UNIQUE (LOWER(title), category, level);
    END IF;
END $$;

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
CREATE INDEX IF NOT EXISTS idx_fitness_plans_title_lower ON fitness_plans(LOWER(title));

-- Create updated_at trigger for meals table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_meals_updated_at'
    ) THEN
        CREATE TRIGGER update_meals_updated_at
            BEFORE UPDATE ON meals
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Enable Row Level Security (RLS) for meals table
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for meals table if they don't exist
DO $$
BEGIN
    -- Allow public read access to active meals
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'meals' 
        AND policyname = 'Public can view active meals'
    ) THEN
        CREATE POLICY "Public can view active meals" ON meals
            FOR SELECT USING (status = 'active');
    END IF;

    -- Allow authenticated users to view all meals
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'meals' 
        AND policyname = 'Authenticated users can view all meals'
    ) THEN
        CREATE POLICY "Authenticated users can view all meals" ON meals
            FOR SELECT USING (auth.role() = 'authenticated');
    END IF;

    -- Allow users to create meals
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'meals' 
        AND policyname = 'Users can create meals'
    ) THEN
        CREATE POLICY "Users can create meals" ON meals
            FOR INSERT WITH CHECK (
                auth.role() = 'authenticated' AND
                (created_by = auth.uid() OR created_by IS NULL)
            );
    END IF;

    -- Allow users to update their own meals
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'meals' 
        AND policyname = 'Users can update their own meals'
    ) THEN
        CREATE POLICY "Users can update their own meals" ON meals
            FOR UPDATE USING (
                auth.uid() = created_by OR
                EXISTS (
                    SELECT 1 FROM user_profiles
                    WHERE user_profiles.id = auth.uid()
                    AND user_profiles.role IN ('admin_super', 'admin_nutritionist')
                )
            );
    END IF;

    -- Allow admins full access to meals
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'meals' 
        AND policyname = 'Admins have full access to meals'
    ) THEN
        CREATE POLICY "Admins have full access to meals" ON meals
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM user_profiles
                    WHERE user_profiles.id = auth.uid()
                    AND user_profiles.role IN ('admin_super', 'admin_nutritionist')
                )
            );
    END IF;
END $$;

-- Add comments to document the purpose
COMMENT ON TABLE meals IS 'Meals table with unique constraints to prevent duplicate meal names';
COMMENT ON CONSTRAINT unique_meal_name ON meals IS 'Prevents duplicate meal names (case-insensitive)';
COMMENT ON CONSTRAINT unique_meal_name_cuisine ON meals IS 'Prevents duplicate meals with same name and cuisine type';
COMMENT ON CONSTRAINT unique_fitness_plan_title ON fitness_plans IS 'Prevents duplicate fitness plan titles (case-insensitive)';
COMMENT ON CONSTRAINT unique_fitness_plan_title_category_level ON fitness_plans IS 'Prevents duplicate fitness plans with same title, category, and level';

-- Display success message
SELECT 'Duplicate prevention migrations applied successfully!' as status;

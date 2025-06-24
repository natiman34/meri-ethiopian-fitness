-- Add unique constraints to fitness_plans table to prevent duplicate plans
-- This migration adds unique constraints to prevent duplicate fitness plan titles

-- Add unique constraint to prevent duplicate plan titles (case-insensitive)
ALTER TABLE fitness_plans 
ADD CONSTRAINT unique_fitness_plan_title 
UNIQUE (LOWER(title));

-- Add composite unique constraint to prevent duplicate plans with same title, category, and level
ALTER TABLE fitness_plans 
ADD CONSTRAINT unique_fitness_plan_title_category_level 
UNIQUE (LOWER(title), category, level);

-- Add index for better performance on title searches
CREATE INDEX IF NOT EXISTS idx_fitness_plans_title_lower ON fitness_plans(LOWER(title));

-- Add comments to document the purpose
COMMENT ON CONSTRAINT unique_fitness_plan_title ON fitness_plans IS 'Prevents duplicate fitness plan titles (case-insensitive)';
COMMENT ON CONSTRAINT unique_fitness_plan_title_category_level ON fitness_plans IS 'Prevents duplicate fitness plans with same title, category, and level';

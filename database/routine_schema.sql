-- Fitness Routine System Database Schema
-- Integrates with existing Ethiopian Fitness app

-- User Routines Table
CREATE TABLE user_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  duration_weeks INTEGER DEFAULT 4,
  days_per_week INTEGER DEFAULT 3,
  estimated_duration_minutes INTEGER,
  is_public BOOLEAN DEFAULT FALSE,
  is_template BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Routine Days Table
CREATE TABLE routine_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID REFERENCES user_routines(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  day_name VARCHAR(50), -- e.g., "Push Day", "Leg Day"
  focus_muscle_groups TEXT[],
  estimated_duration_minutes INTEGER,
  rest_day BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Exercises Table (Enhanced from existing)
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT[],
  muscle_groups TEXT[] NOT NULL,
  equipment TEXT[],
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  exercise_type VARCHAR(50), -- 'strength', 'cardio', 'flexibility', 'balance'
  is_ethiopian_traditional BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  video_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Routine Exercises Table (Junction table with exercise details)
CREATE TABLE routine_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_day_id UUID REFERENCES routine_days(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  sets INTEGER,
  reps VARCHAR(50), -- Can be "8-12", "AMRAP", "30 seconds", etc.
  weight_kg DECIMAL(5,2),
  rest_seconds INTEGER,
  notes TEXT,
  is_superset BOOLEAN DEFAULT FALSE,
  superset_group INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Routine Progress Table
CREATE TABLE user_routine_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_id UUID REFERENCES user_routines(id) ON DELETE CASCADE,
  routine_exercise_id UUID REFERENCES routine_exercises(id) ON DELETE CASCADE,
  workout_date DATE NOT NULL,
  sets_completed INTEGER,
  reps_completed INTEGER[],
  weight_used_kg DECIMAL(5,2)[],
  duration_minutes INTEGER,
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Routine Templates Table (Pre-built routines)
CREATE TABLE routine_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'strength', 'weight_loss', 'muscle_building', 'ethiopian_traditional'
  difficulty_level VARCHAR(20),
  duration_weeks INTEGER,
  days_per_week INTEGER,
  target_audience TEXT[], -- 'beginners', 'women', 'men', 'seniors'
  is_featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_routines_user_id ON user_routines(user_id);
CREATE INDEX idx_routine_days_routine_id ON routine_days(routine_id);
CREATE INDEX idx_routine_exercises_day_id ON routine_exercises(routine_day_id);
CREATE INDEX idx_user_progress_user_routine ON user_routine_progress(user_id, routine_id);
CREATE INDEX idx_exercises_muscle_groups ON exercises USING GIN(muscle_groups);
CREATE INDEX idx_exercises_equipment ON exercises USING GIN(equipment);

-- Row Level Security
ALTER TABLE user_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_routine_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own routines" ON user_routines
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own routines" ON user_routines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routines" ON user_routines
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routines" ON user_routines
  FOR DELETE USING (auth.uid() = user_id);

-- Function to get dashboard statistics
create or replace function get_dashboard_stats()
returns json
language plpgsql
security definer
as $$
declare
  current_month_start date := date_trunc('month', current_date);
  last_month_start date := date_trunc('month', current_date - interval '1 month');
  last_month_end date := current_month_start - interval '1 day';
  
  total_users integer;
  last_month_users integer;
  user_growth numeric;
  
  total_fitness_plans integer;
  last_month_fitness_plans integer;
  fitness_plan_growth numeric;
  
  total_nutrition_plans integer;
  last_month_nutrition_plans integer;
  nutrition_plan_growth numeric;
  
  total_feedback integer;
  last_month_feedback integer;
  feedback_growth numeric;
begin
  -- Get total users and last month's users
  select count(*) into total_users from user_profiles;
  select count(*) into last_month_users 
  from user_profiles 
  where created_at >= last_month_start and created_at < current_month_start;
  
  -- Calculate user growth
  if last_month_users = 0 then
    user_growth := 100;
  else
    user_growth := ((total_users - last_month_users)::numeric / last_month_users) * 100;
  end if;
  
  -- Get total fitness plans and last month's plans
  select count(*) into total_fitness_plans from fitness_plans where status = 'published';
  select count(*) into last_month_fitness_plans 
  from fitness_plans 
  where status = 'published' 
    and created_at >= last_month_start 
    and created_at < current_month_start;
  
  -- Calculate fitness plan growth
  if last_month_fitness_plans = 0 then
    fitness_plan_growth := 100;
  else
    fitness_plan_growth := ((total_fitness_plans - last_month_fitness_plans)::numeric / last_month_fitness_plans) * 100;
  end if;
  
  -- Get total nutrition plans and last month's plans
  select count(*) into total_nutrition_plans from nutrition_plans where status = 'published';
  select count(*) into last_month_nutrition_plans 
  from nutrition_plans 
  where status = 'published' 
    and created_at >= last_month_start 
    and created_at < current_month_start;
  
  -- Calculate nutrition plan growth
  if last_month_nutrition_plans = 0 then
    nutrition_plan_growth := 100;
  else
    nutrition_plan_growth := ((total_nutrition_plans - last_month_nutrition_plans)::numeric / last_month_nutrition_plans) * 100;
  end if;
  
  -- Get total feedback and last month's feedback
  select count(*) into total_feedback from feedback;
  select count(*) into last_month_feedback 
  from feedback 
  where created_at >= last_month_start 
    and created_at < current_month_start;
  
  -- Calculate feedback growth
  if last_month_feedback = 0 then
    feedback_growth := 100;
  else
    feedback_growth := ((total_feedback - last_month_feedback)::numeric / last_month_feedback) * 100;
  end if;
  
  return json_build_object(
    'totalUsers', total_users,
    'totalFitnessPlans', total_fitness_plans,
    'totalNutritionPlans', total_nutrition_plans,
    'totalFeedback', total_feedback,
    'userGrowth', round(user_growth, 1),
    'fitnessPlanGrowth', round(fitness_plan_growth, 1),
    'nutritionPlanGrowth', round(nutrition_plan_growth, 1),
    'feedbackGrowth', round(feedback_growth, 1)
  );
end;
$$;

-- Function to get growth data for the last N months
create or replace function get_growth_data(months integer)
returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  with months as (
    select generate_series(
      date_trunc('month', current_date - (months - 1) * interval '1 month'),
      date_trunc('month', current_date),
      interval '1 month'
    ) as month
  ),
  monthly_stats as (
    select
      to_char(month, 'Mon') as name,
      (
        select count(*)
        from user_profiles
        where date_trunc('month', created_at) <= month
      ) as users,
      (
        select count(*)
        from fitness_plans
        where status = 'published'
          and date_trunc('month', created_at) <= month
      ) as fitness_plans,
      (
        select count(*)
        from nutrition_plans
        where status = 'published'
          and date_trunc('month', created_at) <= month
      ) as nutrition_plans
    from months
  )
  select json_agg(row_to_json(monthly_stats))
  into result
  from monthly_stats;
  
  return result;
end;
$$;

-- Create activity_log table if it doesn't exist
create table if not exists activity_log (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('user', 'fitness', 'nutrition', 'feedback')),
  title text not null,
  description text not null,
  timestamp timestamptz default now(),
  created_at timestamptz default now()
);

-- Create trigger to log user registrations
create or replace function log_user_registration()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into activity_log (type, title, description)
  values (
    'user',
    'New user registered',
    new.full_name || ' joined the platform'
  );
  return new;
end;
$$;

create trigger on_user_registration
  after insert on user_profiles
  for each row
  execute function log_user_registration();

-- Create trigger to log fitness plan creation
create or replace function log_fitness_plan_creation()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.status = 'published' then
    insert into activity_log (type, title, description)
    values (
      'fitness',
      'New fitness plan created',
      new.name || ' added'
    );
  end if;
  return new;
end;
$$;

create trigger on_fitness_plan_creation
  after insert on fitness_plans
  for each row
  execute function log_fitness_plan_creation();

-- Create trigger to log nutrition plan creation
create or replace function log_nutrition_plan_creation()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.status = 'published' then
    insert into activity_log (type, title, description)
    values (
      'nutrition',
      'New nutrition plan created',
      new.name || ' added'
    );
  end if;
  return new;
end;
$$;

create trigger on_nutrition_plan_creation
  after insert on nutrition_plans
  for each row
  execute function log_nutrition_plan_creation();

-- Create trigger to log feedback
create or replace function log_feedback()
returns trigger
language plpgsql
security definer
as $$
declare
  user_name text;
  feedback_description text;
begin
  select full_name into user_name
  from user_profiles
  where id = new.user_id; -- Use id instead of user_id as foreign key

  -- Construct the base description using content, which is NOT NULL
  feedback_description := COALESCE(user_name, 'A user') || ' left feedback: ' || COALESCE(NEW.content, '');

  -- Conditionally append rating if it's not NULL
  IF NEW.rating IS NOT NULL THEN
    feedback_description := feedback_description || ' (' || NEW.rating::text || '-star rating)';
  END IF;
  
  insert into activity_log (type, title, description)
  values (
    'feedback',
    'New feedback received',
    feedback_description
  );
  return new;
end;
$$;

create trigger on_feedback
  after insert on feedback
  for each row
  execute function log_feedback();

-- Insert admin users into the user_profiles table with their respective roles
INSERT INTO user_profiles (id, full_name, email, role)
VALUES
    ('89173a84-df40-41d6-9a53-77bb73048310', 'Super Admin One', 'super.admin1@gmail.com', 'admin_super'),
    ('fcac3803-141f-4254-896f-c9276b4011d8', 'Fitness Admin One', 'fitness.admin1@gmail.com', 'admin_fitness'),
    ('0900fc17-4ea1-45e7-8a80-f6eadcc563fb', 'Nutrition Admin One', 'nutrition.admin1@gmail.com', 'admin_nutritionist')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role;

-- Create the Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_resolved BOOLEAN DEFAULT FALSE,
  reply_message TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security (RLS) for the feedback table
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policy to allow all authenticated users to read feedback (admins will see all, users might see their own if implemented)
DROP POLICY IF EXISTS "Allow authenticated users to read feedback" ON feedback;
CREATE POLICY "Allow authenticated users to read feedback"
ON feedback FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy to allow authenticated users to create feedback
DROP POLICY IF EXISTS "Allow authenticated users to create feedback" ON feedback;
CREATE POLICY "Allow authenticated users to create feedback"
ON feedback FOR INSERT
WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));

-- Policy to allow admins to update feedback resolution and reply
DROP POLICY IF EXISTS "Allow admins to update feedback" ON feedback;
CREATE POLICY "Allow admins to update feedback"
ON feedback FOR UPDATE
USING (auth.jwt() ->> 'user_role' IN ('admin_super', 'admin_nutritionist', 'admin_fitness')); -- Assuming these are your admin roles

-- Policy to allow super admins to delete feedback
DROP POLICY IF EXISTS "Allow super admins to delete feedback" ON feedback;
CREATE POLICY "Allow super admins to delete feedback"
ON feedback FOR DELETE
USING (auth.jwt() ->> 'user_role' = 'admin_super');

-- Create the Fitness Plans Table
DROP TABLE IF EXISTS fitness_plans CASCADE;
CREATE TABLE IF NOT EXISTS fitness_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('weight-loss', 'weight-gain', 'maintenance', 'strength', 'flexibility', 'endurance')),
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration INTEGER NOT NULL, -- Duration in weeks
  image_url TEXT,
  weekly_workouts INTEGER NOT NULL,
  estimated_calories_burn INTEGER,
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  target_audience TEXT,
  prerequisites TEXT[],
  equipment TEXT[],
  goals TEXT[],
  schedule JSONB NOT NULL, -- Array of daily exercises
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) for fitness_plans
ALTER TABLE fitness_plans ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to read published fitness plans
DROP POLICY IF EXISTS "Allow authenticated users to read published fitness_plans" ON fitness_plans;
CREATE POLICY "Allow authenticated users to read published fitness_plans"
ON fitness_plans FOR SELECT
USING (status = 'published');

-- Policy to allow workout admins/planners to create fitness plans
DROP POLICY IF EXISTS "Allow fitness admins to create fitness_plans" ON fitness_plans;
CREATE POLICY "Allow fitness admins to create fitness_plans"
ON fitness_plans FOR INSERT
WITH CHECK (auth.jwt() ->> 'user_role' IN ('admin_super', 'admin_fitness'));

-- Policy to allow workout admins/planners to update their own fitness plans
DROP POLICY IF EXISTS "Allow fitness admins to update fitness_plans" ON fitness_plans;
CREATE POLICY "Allow fitness admins to update fitness_plans"
ON fitness_plans FOR UPDATE
USING (auth.jwt() ->> 'user_role' IN ('admin_super', 'admin_fitness'));

-- Policy to allow super admins to delete fitness plans
DROP POLICY IF EXISTS "Allow super admins to delete fitness_plans" ON fitness_plans;
CREATE POLICY "Allow super admins to delete fitness_plans"
ON fitness_plans FOR DELETE
USING (auth.jwt() ->> 'user_role' = 'admin_super');


-- Create the Nutrition Plans Table
CREATE TABLE IF NOT EXISTS nutrition_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Creator of the plan
  name TEXT NOT NULL, -- Name or title of the nutrition plan
  description TEXT NOT NULL, -- Detailed description of meal plans/guidelines
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft' or 'published'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) for nutrition_plans
ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to read published nutrition plans
DROP POLICY IF EXISTS "Allow authenticated users to read published nutrition_plans" ON nutrition_plans;
CREATE POLICY "Allow authenticated users to read published nutrition_plans"
ON nutrition_plans FOR SELECT
USING (status = 'published' AND auth.role() = 'authenticated');

-- Policy to allow nutrition admins/nutritionists to create nutrition plans
DROP POLICY IF EXISTS "Allow nutritionists to create nutrition_plans" ON nutrition_plans;
CREATE POLICY "Allow nutritionists to create nutrition_plans"
ON nutrition_plans FOR INSERT
WITH CHECK (auth.jwt() ->> 'user_role' IN ('admin_super', 'admin_nutritionist'));

-- Policy to allow nutrition admins/nutritionists to update their own nutrition plans
DROP POLICY IF EXISTS "Allow nutritionists to update nutrition_plans" ON nutrition_plans;
CREATE POLICY "Allow nutritionists to update nutrition_plans"
ON nutrition_plans FOR UPDATE
USING (auth.jwt() ->> 'user_role' IN ('admin_super', 'admin_nutritionist'));

-- Policy to allow super admins to delete nutrition plans
DROP POLICY IF EXISTS "Allow super admins to delete nutrition_plans" ON nutrition_plans;
CREATE POLICY "Allow super admins to delete nutrition_plans"
ON nutrition_plans FOR DELETE
USING (auth.jwt() ->> 'user_role' = 'admin_super'); 
-- Sample Ethiopian Traditional Exercises and General Exercises
-- Insert into exercises table

-- Ethiopian Traditional Exercises
INSERT INTO exercises (name, description, instructions, muscle_groups, equipment, difficulty_level, exercise_type, is_ethiopian_traditional, image_url) VALUES

-- Traditional Ethiopian Bodyweight Exercises
('Eskista Push-ups', 'Traditional Ethiopian dance-inspired push-ups that incorporate shoulder movements from Eskista dance', 
 ARRAY['Start in push-up position', 'Lower body while moving shoulders in circular motion', 'Push up while continuing shoulder dance movement', 'Maintain rhythm throughout'], 
 ARRAY['Chest', 'Shoulders', 'Arms', 'Core'], 
 ARRAY['Bodyweight'], 
 'intermediate', 
 'strength', 
 true, 
 null),

('Genna Squats', 'Deep squats inspired by traditional Ethiopian Genna game positions', 
 ARRAY['Stand with feet wider than shoulder-width', 'Lower into deep squat while keeping chest up', 'Hold position for 3-5 seconds', 'Rise slowly to starting position'], 
 ARRAY['Legs', 'Glutes', 'Core'], 
 ARRAY['Bodyweight'], 
 'beginner', 
 'strength', 
 true, 
 null),

('Injera Stretching', 'Circular stretching movements inspired by injera making motions', 
 ARRAY['Stand with arms extended', 'Make large circular motions with arms', 'Alternate directions every 10 repetitions', 'Focus on full range of motion'], 
 ARRAY['Shoulders', 'Arms', 'Back'], 
 ARRAY['Bodyweight'], 
 'beginner', 
 'flexibility', 
 true, 
 null),

('Coffee Ceremony Lunges', 'Lunges that mimic the graceful movements of Ethiopian coffee ceremony', 
 ARRAY['Step forward into lunge position', 'Lower back knee toward ground', 'Rise gracefully while maintaining balance', 'Alternate legs with flowing motion'], 
 ARRAY['Legs', 'Glutes', 'Core'], 
 ARRAY['Bodyweight'], 
 'intermediate', 
 'strength', 
 true, 
 null),

('Habesha Warrior Planks', 'Plank variations inspired by traditional Ethiopian warrior training', 
 ARRAY['Start in plank position', 'Lift one arm and opposite leg', 'Hold for 10 seconds', 'Switch sides and repeat'], 
 ARRAY['Core', 'Shoulders', 'Back'], 
 ARRAY['Bodyweight'], 
 'advanced', 
 'strength', 
 true, 
 null),

('Teff Farmer Carries', 'Carrying exercises inspired by traditional teff farming work', 
 ARRAY['Hold weights at sides', 'Walk forward with controlled steps', 'Keep core engaged and posture upright', 'Focus on endurance and stability'], 
 ARRAY['Arms', 'Core', 'Legs'], 
 ARRAY['Dumbbells', 'Traditional Ethiopian'], 
 'intermediate', 
 'strength', 
 true, 
 null),

-- Modern Exercises with Ethiopian Cultural Context
('Addis Ababa Hill Climbers', 'Mountain climbers inspired by the hilly terrain of Addis Ababa', 
 ARRAY['Start in plank position', 'Bring knees to chest alternately', 'Maintain fast pace like climbing hills', 'Keep core tight throughout'], 
 ARRAY['Core', 'Legs', 'Arms'], 
 ARRAY['Bodyweight'], 
 'intermediate', 
 'cardio', 
 true, 
 null),

('Blue Nile Flow', 'Flowing yoga-inspired movements representing the Blue Nile river', 
 ARRAY['Start in standing position', 'Flow through warrior poses', 'Move like water flowing downstream', 'Focus on breath and fluidity'], 
 ARRAY['Core', 'Legs', 'Back'], 
 ARRAY['Bodyweight'], 
 'beginner', 
 'flexibility', 
 true, 
 null);

-- General Fitness Exercises
INSERT INTO exercises (name, description, instructions, muscle_groups, equipment, difficulty_level, exercise_type, is_ethiopian_traditional) VALUES

-- Bodyweight Exercises
('Push-ups', 'Classic upper body strengthening exercise', 
 ARRAY['Start in plank position with hands shoulder-width apart', 'Lower body until chest nearly touches floor', 'Push back up to starting position', 'Keep body in straight line'], 
 ARRAY['Chest', 'Shoulders', 'Arms'], 
 ARRAY['Bodyweight'], 
 'beginner', 
 'strength', 
 false),

('Squats', 'Fundamental lower body exercise', 
 ARRAY['Stand with feet shoulder-width apart', 'Lower body by bending knees and hips', 'Keep chest up and knees behind toes', 'Return to starting position'], 
 ARRAY['Legs', 'Glutes'], 
 ARRAY['Bodyweight'], 
 'beginner', 
 'strength', 
 false),

('Plank', 'Core strengthening isometric exercise', 
 ARRAY['Start in push-up position', 'Hold body in straight line', 'Engage core muscles', 'Breathe normally while holding'], 
 ARRAY['Core', 'Shoulders'], 
 ARRAY['Bodyweight'], 
 'beginner', 
 'strength', 
 false),

('Lunges', 'Single-leg strengthening exercise', 
 ARRAY['Step forward with one leg', 'Lower hips until both knees are 90 degrees', 'Push back to starting position', 'Alternate legs'], 
 ARRAY['Legs', 'Glutes'], 
 ARRAY['Bodyweight'], 
 'beginner', 
 'strength', 
 false),

('Burpees', 'Full-body cardio and strength exercise', 
 ARRAY['Start standing', 'Drop into squat and place hands on floor', 'Jump feet back to plank', 'Do push-up, jump feet forward, jump up'], 
 ARRAY['Chest', 'Legs', 'Core', 'Arms'], 
 ARRAY['Bodyweight'], 
 'advanced', 
 'cardio', 
 false),

-- Dumbbell Exercises
('Dumbbell Bench Press', 'Upper body pressing exercise using dumbbells', 
 ARRAY['Lie on bench with dumbbells in hands', 'Press weights up until arms are extended', 'Lower weights to chest level', 'Press back up'], 
 ARRAY['Chest', 'Shoulders', 'Arms'], 
 ARRAY['Dumbbells'], 
 'intermediate', 
 'strength', 
 false),

('Dumbbell Rows', 'Back strengthening exercise with dumbbells', 
 ARRAY['Bend over with dumbbell in one hand', 'Pull weight to hip while squeezing shoulder blade', 'Lower weight with control', 'Complete set then switch sides'], 
 ARRAY['Back', 'Arms'], 
 ARRAY['Dumbbells'], 
 'intermediate', 
 'strength', 
 false),

('Dumbbell Shoulder Press', 'Overhead pressing exercise for shoulders', 
 ARRAY['Hold dumbbells at shoulder level', 'Press weights overhead until arms are extended', 'Lower weights back to shoulders', 'Keep core engaged'], 
 ARRAY['Shoulders', 'Arms'], 
 ARRAY['Dumbbells'], 
 'intermediate', 
 'strength', 
 false),

-- Resistance Band Exercises
('Band Pull-Aparts', 'Rear deltoid and upper back exercise', 
 ARRAY['Hold resistance band with arms extended', 'Pull band apart by squeezing shoulder blades', 'Return to starting position with control', 'Keep arms straight'], 
 ARRAY['Shoulders', 'Back'], 
 ARRAY['Resistance Bands'], 
 'beginner', 
 'strength', 
 false),

('Band Squats', 'Lower body exercise with added resistance', 
 ARRAY['Stand on band with handles at shoulders', 'Perform squat while band provides resistance', 'Keep tension throughout movement', 'Return to standing'], 
 ARRAY['Legs', 'Glutes'], 
 ARRAY['Resistance Bands'], 
 'beginner', 
 'strength', 
 false),

-- Cardio Exercises
('Jumping Jacks', 'Classic cardio exercise', 
 ARRAY['Start with feet together and arms at sides', 'Jump while spreading legs and raising arms overhead', 'Jump back to starting position', 'Maintain steady rhythm'], 
 ARRAY['Legs', 'Arms'], 
 ARRAY['Bodyweight'], 
 'beginner', 
 'cardio', 
 false),

('High Knees', 'Running in place with high knee lifts', 
 ARRAY['Stand in place', 'Lift knees as high as possible alternately', 'Pump arms as if running', 'Maintain fast pace'], 
 ARRAY['Legs', 'Core'], 
 ARRAY['Bodyweight'], 
 'beginner', 
 'cardio', 
 false),

-- Flexibility Exercises
('Cat-Cow Stretch', 'Spinal mobility exercise', 
 ARRAY['Start on hands and knees', 'Arch back and look up (cow)', 'Round back and tuck chin (cat)', 'Alternate between positions'], 
 ARRAY['Back', 'Core'], 
 ARRAY['Bodyweight'], 
 'beginner', 
 'flexibility', 
 false),

('Downward Dog', 'Full body stretch from yoga', 
 ARRAY['Start on hands and knees', 'Tuck toes and lift hips up', 'Straighten legs and arms', 'Hold stretch while breathing deeply'], 
 ARRAY['Back', 'Legs', 'Shoulders'], 
 ARRAY['Bodyweight'], 
 'beginner', 
 'flexibility', 
 false);



export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  role: 'user' | 'admin_super' | 'admin_nutritionist' | 'admin_fitness';
  fitness_goal: string | null;
  created_at: string;
  updated_at: string;
}

export interface BMIRecord {
  id: string;
  user_id: string;
  height: number;
  weight: number;
  bmi_value: number;
  created_at: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type PlanStatus = 'draft' | 'published' | 'archived';
export type PlanType = 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'endurance';

export interface FitnessPlan {
  id: string;
  planner_id: string;
  name: string;
  description: string | null;
  plan_type: PlanType;
  difficulty_level: DifficultyLevel;
  duration: string;
  exercise_list: {
    exercises: Array<{
      name: string;
      sets: number;
      reps: number;
      duration?: string;
      description?: string;
    }>;
  };
  status: PlanStatus;
  created_at: string;
  updated_at: string;
}

export type DietType = 'traditional' | 'high-protein' | 'vegetarian' | 'balanced' | 'high-energy';

export interface NutritionPlan {
  id: string;
  nutritionist_id: string;
  name: string;
  meal_plan: {
    meals: Array<{
      name: string;
      ingredients: string[];
      preparation: string;
      nutritionalInfo?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      };
    }>;
  };
  calories: number;
  duration: string;
  description: string | null;
  diet_type: 'traditional' | 'high-protein' | 'vegetarian' | 'balanced' | 'high-energy';
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface UserPlanSubscription {
  id: string;
  user_id: string;
  fitness_plan_id: string | null;
  nutrition_plan_id: string | null;
  start_date: string;
  end_date: string | null;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Feedback {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  content: string;
  rating: number | null;
  is_resolved: boolean;
  reply_message: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  details: any;
  created_at: string;
}

export interface ProgressTracking {
  id: string;
  user_id: string;
  weight: number | null;
  height: number | null;
  measurements: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  } | null;
  progress_photos: string[];
  notes: string | null;
  recorded_date: string;
}

export interface Activity {
  id: string;
  user_id: string;
  date: string; // 'yyyy-MM-dd' format
  type: 'workout' | 'cardio' | 'strength' | 'flexibility' | 'custom' | 'manual';
  details: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserActivityProgress {
  id: string;
  user_id: string;
  selected_dates: string[]; // Array of date strings in 'yyyy-MM-dd' format
  created_at: string;
  updated_at: string;
}

export interface MealDB {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_ethiopian: boolean;
  ingredients: string[];
  preparation: string | null;
  nutritional_info: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  category: string | null; // breakfast, lunch, dinner, snack
  cuisine_type: string | null; // ethiopian, international, etc.
  difficulty_level: string | null; // easy, medium, hard
  prep_time: number | null; // in minutes
  cook_time: number | null; // in minutes
  servings: number;
  tags: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
  status: string; // active, archived
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'created_at' | 'updated_at'>>;
      };
      bmi_records: {
        Row: BMIRecord;
        Insert: Omit<BMIRecord, 'id' | 'created_at'>;
        Update: Partial<Omit<BMIRecord, 'id' | 'created_at'>>;
      };
      fitness_plans: {
        Row: FitnessPlan;
        Insert: Omit<FitnessPlan, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<FitnessPlan, 'id' | 'created_at' | 'updated_at'>>;
      };
      nutrition_plans: {
        Row: NutritionPlan;
        Insert: Omit<NutritionPlan, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NutritionPlan, 'id' | 'created_at' | 'updated_at'>>;
      };
      activities: {
        Row: Activity;
        Insert: Omit<Activity, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Activity, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_activity_progress: {
        Row: UserActivityProgress;
        Insert: Omit<UserActivityProgress, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserActivityProgress, 'id' | 'created_at' | 'updated_at'>>;
      };
      meals: {
        Row: MealDB;
        Insert: Omit<MealDB, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MealDB, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_plan_subscriptions: {
        Row: UserPlanSubscription;
        Insert: Omit<UserPlanSubscription, 'id'>;
        Update: Partial<Omit<UserPlanSubscription, 'id'>>;
      };
      feedback: {
        Row: Feedback;
        Insert: Omit<Feedback, 'id' | 'created_at'>;
        Update: Partial<Omit<Feedback, 'id' | 'created_at'>>;
      };
      admin_logs: {
        Row: AdminLog;
        Insert: Omit<AdminLog, 'id' | 'created_at'>;
        Update: Partial<Omit<AdminLog, 'id' | 'created_at'>>;
      };
      progress_tracking: {
        Row: ProgressTracking;
        Insert: Omit<ProgressTracking, 'id'>;
        Update: Partial<Omit<ProgressTracking, 'id'>>;
      };
    };
  };
}

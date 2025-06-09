import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhcgrpsgvaggrtfcykyf.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5MDQxNCwiZXhwIjoyMDY0MTY2NDE0fQ.3OxOyBtYuPABwAYt2Z6h7_oJONHBrNXbCkUoQI4eE8U';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const adminAccounts = [
  {
    email: 'super.admin@gmail.com',
    password: 'SuperAdmin@2025',
    name: 'Super Admin',
    role: 'admin_super'
  },
  {
    email: 'fitness.admin@gmail.com',
    password: 'FitnessAdmin@2025',
    name: 'Fitness Admin',
    role: 'admin_fitness'
  },
  {
    email: 'nutrition.admin@gmail.com',
    password: 'NutritionAdmin@2025',
    name: 'Nutrition Admin',
    role: 'admin_nutritionist'
  }
];

async function setupAdmin(admin) {
  try {
    console.log(`Creating account for ${admin.email}...`);
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: admin.email,
      password: admin.password,
      email_confirm: true,
      user_metadata: {
        role: admin.role
      }
    });

    if (authError) {
      console.error(`Error creating auth account for ${admin.email}:`, authError);
      return;
    }

    if (!authData.user) {
      console.error(`No user data returned for ${admin.email}`);
      return;
    }

    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: authData.user.id,
          full_name: admin.name,
          email: admin.email,
          role: admin.role
        }
      ]);

    if (profileError) {
      console.error(`Error creating profile for ${admin.email}:`, profileError);
      return;
    }

    console.log(`Successfully created admin account for ${admin.email}`);
  } catch (error) {
    console.error(`Error in setupAdmin for ${admin.email}:`, error);
  }
}

console.log('Setting up admin accounts...');

for (const [index, admin] of adminAccounts.entries()) {
  // Add delay between operations
  if (index > 0) {
    console.log('Waiting 30 seconds before next operation...');
    await delay(30000);
  }
  await setupAdmin(admin);
}

console.log('Admin account setup complete!');

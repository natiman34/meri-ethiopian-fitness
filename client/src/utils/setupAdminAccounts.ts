const { supabase } = require('../lib/supabase');

const adminAccounts = [
  {
    email: 'super.admin@ethiopianfitness.com',
    password: 'SuperAdmin@2025',
    name: 'Super Admin',
    role: 'admin_super'
  },
  {
    email: 'fitness.admin@ethiopianfitness.com',
    password: 'FitnessAdmin@2025',
    name: 'Fitness Admin',
    role: 'admin_fitness'
  },
  {
    email: 'nutrition.admin@ethiopianfitness.com',
    password: 'NutritionAdmin@2025',
    name: 'Nutrition Admin',
    role: 'admin_nutritionist'
  }
];

const setupAdminAccounts = async () => {
  for (const admin of adminAccounts) {
    try {
      // Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: admin.email,
        password: admin.password,
        options: {
          data: {
            full_name: admin.name
          }
        }
      });

      if (authError) {
        console.error(`Error creating auth account for ${admin.email}:`, authError);
        continue;
      }

      if (!authData.user) {
        console.error(`No user data returned for ${admin.email}`);
        continue;
      }

      // Create profile
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
        continue;
      }

      console.log(`Successfully created admin account for ${admin.email}`);

    } catch (error) {
      console.error(`Unexpected error creating admin ${admin.email}:`, error);
    }
  }
};

module.exports = { setupAdminAccounts };

import { createClient } from '@supabase/supabase-js';

// Supabase connection info
const supabaseUrl = 'https://dhcgrpsgvaggrtfcykyf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTA0MTQsImV4cCI6MjA2NDE2NjQxNH0.fkcetY89lCpLbJegbKCoala2B-s_ra13WqU7SaYGI-Y';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin user data
const adminUsers = [
  {
    email: 'super.admin@gmail.com',
    password: 'SuperAdmin@2025',
    role: 'admin_super',
    fullName: 'Super Admin'
  }
];

// Create admin user
async function createAdmin(adminUser) {
  console.log(`Creating admin user: ${adminUser.email}`);
  
  try {
    // First, check if the user already exists
    const { data: existingUsers, error: existingError } = await supabase
      .from('user_profiles')
      .select('id, email')
      .eq('email', adminUser.email);
    
    if (existingError) {
      console.error('Error checking existing user:', existingError);
    }
    
    if (existingUsers && existingUsers.length > 0) {
      console.log(`User with email ${adminUser.email} already exists. Attempting login...`);
      
      // Try logging in with the credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminUser.email,
        password: adminUser.password
      });
      
      if (signInError) {
        console.error('Error signing in with existing credentials:', signInError);
        console.log('Will attempt to reset password and create new profile.');
      } else {
        console.log('Successfully signed in with existing credentials.');
        return;
      }
    }
    
    // Create a new user using signUp
    console.log('Creating new user via signUp...');
    const { data, error } = await supabase.auth.signUp({
      email: adminUser.email,
      password: adminUser.password,
      options: {
        data: {
          role: adminUser.role,
          full_name: adminUser.fullName
        }
      }
    });
    
    if (error) {
      console.error('Error creating user:', error);
      return;
    }
    
    console.log('User created successfully:', data);
    
    // Create user profile if needed
    if (data?.user?.id) {
      console.log('Creating user profile...');
      
      // Insert profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: data.user.id,
            email: adminUser.email,
            full_name: adminUser.fullName,
            role: adminUser.role
          }
        ]);
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
      } else {
        console.log('Profile created successfully');
      }
    }
    
    console.log(`Admin user ${adminUser.email} created successfully.`);
    console.log(`You can now log in with email: ${adminUser.email} and password: ${adminUser.password}`);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Create all admin users
async function createAdmins() {
  for (const admin of adminUsers) {
    await createAdmin(admin);
  }
  console.log('Admin setup complete.');
}

createAdmins();

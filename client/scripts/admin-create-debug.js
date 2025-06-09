const { createClient } = require('@supabase/supabase-js');

// Connection parameters
const supabaseUrl = 'https://dhcgrpsgvaggrtfcykyf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTA0MTQsImV4cCI6MjA2NDE2NjQxNH0.fkcetY89lCpLbJegbKCoala2B-s_ra13WqU7SaYGI-Y';

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Admin user credentials
const email = 'super.admin@gmail.com';
const password = 'SuperAdmin@2025';

// Function to handle the signup process
async function createAdminUser() {
  try {
    console.log('Attempting to create admin user:', email);
    
    // 1. Try signing up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin_super',
          full_name: 'Super Admin'
        }
      }
    });
    
    if (signUpError) {
      console.error('Error during signup:', signUpError);
      
      // 2. If signup failed, try signing in
      console.log('Attempting to sign in instead...');
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        console.error('Sign-in also failed:', signInError);
        return;
      }
      
      console.log('Sign-in successful! User exists:', signInData);
      
      // Get user ID from signin data
      const userId = signInData.user.id;
      console.log('User ID:', userId);
      
      // Update profile
      await updateProfile(userId);
      
      return;
    }
    
    console.log('Signup successful!', signUpData);
    
    // Get user ID from signup data
    const userId = signUpData.user.id;
    console.log('New user ID:', userId);
    
    // Create profile
    await createProfile(userId);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

async function createProfile(userId) {
  try {
    console.log('Creating user profile for ID:', userId);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: userId,
          email: email,
          full_name: 'Super Admin',
          role: 'admin_super'
        }
      ]);
    
    if (error) {
      console.error('Error creating profile:', error);
      return;
    }
    
    console.log('Profile created successfully!');
  } catch (error) {
    console.error('Error in profile creation:', error);
  }
}

async function updateProfile(userId) {
  try {
    console.log('Updating user profile for ID:', userId);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert([
        {
          id: userId,
          email: email,
          full_name: 'Super Admin',
          role: 'admin_super',
          updated_at: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('Error updating profile:', error);
      return;
    }
    
    console.log('Profile updated successfully!');
  } catch (error) {
    console.error('Error in profile update:', error);
  }
}

// Execute the function
createAdminUser()
  .then(() => console.log('Process completed'))
  .catch(err => console.error('Fatal error:', err));

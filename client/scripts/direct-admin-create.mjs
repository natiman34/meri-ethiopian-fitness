import fetch from 'node-fetch';

// Your Supabase project details
const supabaseUrl = 'https://dhcgrpsgvaggrtfcykyf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5MDQxNCwiZXhwIjoyMDY0MTY2NDE0fQ.3OxOyBtYuPABwAYt2Z6h7_oJONHBrNXbCkUoQI4eE8U';

// Admin details
const admin = {
  email: 'super.admin@gmail.com',
  password: 'SuperAdmin@2025',
  role: 'admin_super'
};

// Step 1: Create or update user with admin API
async function createAdmin() {
  try {
    console.log(`Creating admin user: ${admin.email}`);
    
    // First try to delete if exists (to ensure a clean slate)
    try {
      const deleteResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${admin.email}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'apikey': supabaseKey
        }
      });
      console.log('Delete response:', deleteResponse.status);
    } catch (err) {
      console.log('Delete operation error (can be ignored):', err.message);
    }
    
    // Create the user in auth.users
    const createResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseKey
      },
      body: JSON.stringify({
        email: admin.email,
        password: admin.password,
        email_confirm: true,
        user_metadata: { role: admin.role }
      })
    });
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Failed to create user: ${createResponse.status} - ${errorText}`);
    }
    
    const userData = await createResponse.json();
    console.log('User created:', userData);
    
    // Step 2: Create user profile in the database
    const userId = userData.id;
    
    // Create profile entry
    const profileResponse = await fetch(`${supabaseUrl}/rest/v1/user_profiles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        id: userId,
        email: admin.email,
        full_name: 'Super Admin',
        role: admin.role
      })
    });
    
    if (!profileResponse.ok) {
      // If there's an error (likely a conflict), try to update instead
      console.log('Creating profile failed, trying update instead');
      
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/user_profiles?id=eq.${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          email: admin.email,
          full_name: 'Super Admin',
          role: admin.role
        })
      });
      
      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Failed to update profile: ${updateResponse.status} - ${errorText}`);
      }
      
      console.log('Profile updated successfully');
    } else {
      console.log('Profile created successfully');
    }
    
    console.log(`Admin user ${admin.email} with role ${admin.role} has been set up successfully.`);
    console.log(`You can now log in with email: ${admin.email} and password: ${admin.password}`);
    
  } catch (error) {
    console.error('Error in admin user setup:', error);
  }
}

createAdmin();

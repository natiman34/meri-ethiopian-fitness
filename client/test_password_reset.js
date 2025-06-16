// Test script to create a proper test user and verify password reset functionality
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestUser() {
  console.log('Creating test user...')

  try {
    // Create a proper test user through Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
      options: {
        data: {
          full_name: 'Test User',
          role: 'user'
        }
      }
    })

    if (error) {
      console.error('Error creating user:', error)
      return false
    } else {
      console.log('Test user created successfully:', data)
      return true
    }

  } catch (err) {
    console.error('Exception creating user:', err)
    return false
  }
}

async function testPasswordReset() {
  console.log('Testing password reset functionality...')

  try {
    // Test with existing user
    console.log('Sending password reset for test@example.com...')
    const { data, error } = await supabase.auth.resetPasswordForEmail('test@example.com', {
      redirectTo: 'http://127.0.0.1:5173/verify-reset-otp?email=test@example.com&type=recovery'
    })

    if (error) {
      console.error('Error:', error)
    } else {
      console.log('Success:', data)
      console.log('Password reset email should be sent to Inbucket')
      console.log('Check http://127.0.0.1:54324 for the email')
    }

  } catch (err) {
    console.error('Exception:', err)
  }
}

async function testLogin() {
  console.log('Testing login functionality...')

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword123'
    })

    if (error) {
      console.error('Login error:', error)
    } else {
      console.log('Login successful:', data)
      // Sign out after test
      await supabase.auth.signOut()
    }

  } catch (err) {
    console.error('Login exception:', err)
  }
}

async function runTests() {
  console.log('User already exists, testing login and password reset...')
  await testLogin()
  await testPasswordReset()
}

runTests()

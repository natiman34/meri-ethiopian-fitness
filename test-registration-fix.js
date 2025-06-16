// Test script to verify the registration fix prevents duplicate users
// Run this script to test the registration system

import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase URL and anon key
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test data
const testUser = {
  email: 'test-duplicate@example.com',
  password: 'TestPassword123!',
  name: 'Test User'
}

async function testRegistrationPrevention() {
  console.log('🧪 Testing Registration Duplicate Prevention System')
  console.log('=' .repeat(60))

  try {
    // Test 1: First registration should succeed
    console.log('\n📝 Test 1: First registration attempt')
    console.log(`Attempting to register: ${testUser.email}`)
    
    const { data: firstAttempt, error: firstError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          full_name: testUser.name,
          role: 'user'
        }
      }
    })

    if (firstError) {
      console.log('❌ First registration failed:', firstError.message)
      if (firstError.message.includes('already registered')) {
        console.log('✅ This is expected if user already exists from previous test')
      }
    } else {
      console.log('✅ First registration successful')
      console.log('User ID:', firstAttempt.user?.id)
      console.log('Email confirmed:', !!firstAttempt.user?.email_confirmed_at)
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Test 2: Second registration with same email should fail
    console.log('\n📝 Test 2: Duplicate registration attempt')
    console.log(`Attempting to register same email again: ${testUser.email}`)
    
    const { data: secondAttempt, error: secondError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password + '2', // Different password
      options: {
        data: {
          full_name: testUser.name + ' 2',
          role: 'user'
        }
      }
    })

    if (secondError) {
      console.log('✅ Second registration correctly failed:', secondError.message)
      if (secondError.message.includes('already registered') || 
          secondError.message.includes('User already registered')) {
        console.log('✅ Duplicate prevention is working!')
      }
    } else {
      console.log('❌ Second registration should have failed but succeeded')
      console.log('❌ DUPLICATE PREVENTION IS NOT WORKING!')
    }

    // Test 3: Check user_profiles table for duplicates
    console.log('\n📝 Test 3: Checking user_profiles table')
    
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, created_at')
      .eq('email', testUser.email)

    if (profileError) {
      console.log('❌ Error checking profiles:', profileError.message)
    } else {
      console.log(`Found ${profiles.length} profile(s) for ${testUser.email}`)
      if (profiles.length === 1) {
        console.log('✅ Only one profile exists - duplicate prevention working!')
        console.log('Profile:', profiles[0])
      } else if (profiles.length > 1) {
        console.log('❌ Multiple profiles found - duplicate prevention failed!')
        profiles.forEach((profile, index) => {
          console.log(`Profile ${index + 1}:`, profile)
        })
      } else {
        console.log('⚠️  No profiles found - this might indicate an issue')
      }
    }

    // Test 4: Test case sensitivity
    console.log('\n📝 Test 4: Testing email case sensitivity')
    const upperCaseEmail = testUser.email.toUpperCase()
    console.log(`Attempting to register with uppercase email: ${upperCaseEmail}`)
    
    const { data: caseAttempt, error: caseError } = await supabase.auth.signUp({
      email: upperCaseEmail,
      password: testUser.password + '3',
      options: {
        data: {
          full_name: testUser.name + ' Case Test',
          role: 'user'
        }
      }
    })

    if (caseError) {
      console.log('✅ Case-insensitive duplicate prevention working:', caseError.message)
    } else {
      console.log('❌ Case-insensitive duplicate prevention failed')
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
  }

  console.log('\n' + '=' .repeat(60))
  console.log('🏁 Test completed')
}

async function cleanupTestUser() {
  console.log('\n🧹 Cleaning up test user...')
  
  // Note: This requires admin privileges to delete users
  // In a real scenario, you'd use the admin API or Supabase dashboard
  console.log('⚠️  Manual cleanup required: Delete test user from Supabase dashboard')
  console.log(`Email to delete: ${testUser.email}`)
}

// Run the tests
testRegistrationPrevention()
  .then(() => {
    console.log('\n✨ All tests completed')
    return cleanupTestUser()
  })
  .catch(error => {
    console.error('❌ Test suite failed:', error)
  })

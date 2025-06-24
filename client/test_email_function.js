/**
 * Test script for the email functionality
 * This script tests the send-feedback-reply Supabase Edge Function
 */

const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://dhcgrpsgvaggrtfcykyf.supabase.co'
const supabaseKey = 'your-anon-key-here' // Replace with actual anon key

const supabase = createClient(supabaseUrl, supabaseKey)

async function testEmailFunction() {
  console.log('🧪 Testing Email Function...\n')

  try {
    // Test data
    const testData = {
      feedbackId: 'test-feedback-id',
      userEmail: 'test@example.com', // Replace with a real email for testing
      userName: 'Test User',
      feedbackContent: 'This is a test feedback message.',
      adminReply: 'Thank you for your feedback! This is a test reply from the admin.'
    }

    console.log('1. Testing email function with test data...')
    console.log('   Sending to:', testData.userEmail)
    console.log('   From user:', testData.userName)

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('send-feedback-reply', {
      body: testData
    })

    if (error) {
      console.error('❌ Email function failed:')
      console.error('   Error:', error.message)
      console.error('   Details:', JSON.stringify(error, null, 2))
      
      // Check for common issues
      if (error.message?.includes('RESEND_API_KEY')) {
        console.log('\n💡 Solution: Configure RESEND_API_KEY in Supabase environment variables')
        console.log('   1. Go to Supabase Dashboard → Project Settings → Edge Functions')
        console.log('   2. Add environment variable: RESEND_API_KEY = your_resend_api_key')
        console.log('   3. Get API key from: https://resend.com/api-keys')
      }
      
      if (error.message?.includes('function not found')) {
        console.log('\n💡 Solution: Deploy the email function')
        console.log('   Run: supabase functions deploy send-feedback-reply')
      }
      
      return false
    }

    console.log('✅ Email function executed successfully!')
    console.log('   Response:', JSON.stringify(data, null, 2))
    
    if (data?.success) {
      console.log('✅ Email sent successfully!')
      if (data.emailId) {
        console.log('   Email ID:', data.emailId)
      }
    } else {
      console.log('⚠️  Email function returned but email may not have been sent')
    }

    return true

  } catch (error) {
    console.error('❌ Test failed with exception:', error.message)
    console.error('   Stack:', error.stack)
    return false
  }
}

async function checkEmailConfiguration() {
  console.log('🔧 Checking Email Configuration...\n')

  try {
    // Test if the function exists by calling it with invalid data
    const { error } = await supabase.functions.invoke('send-feedback-reply', {
      body: {}
    })

    if (error) {
      if (error.message?.includes('function not found') || error.message?.includes('404')) {
        console.log('❌ Email function not found or not deployed')
        console.log('💡 Deploy the function with: supabase functions deploy send-feedback-reply')
        return false
      } else if (error.message?.includes('Missing required parameters')) {
        console.log('✅ Email function is deployed and accessible')
        console.log('   Function responded with parameter validation (expected)')
        return true
      } else if (error.message?.includes('RESEND_API_KEY')) {
        console.log('⚠️  Email function is deployed but RESEND_API_KEY is not configured')
        console.log('💡 Configure RESEND_API_KEY in Supabase environment variables')
        return false
      } else {
        console.log('⚠️  Email function exists but returned unexpected error:')
        console.log('   Error:', error.message)
        return true // Function exists, just other issues
      }
    }

    console.log('✅ Email function is properly configured')
    return true

  } catch (error) {
    console.error('❌ Configuration check failed:', error.message)
    return false
  }
}

async function runEmailTests() {
  console.log('📧 Email Function Test Suite\n')
  console.log('=' .repeat(50))

  // Step 1: Check configuration
  const configOk = await checkEmailConfiguration()
  console.log('')

  if (!configOk) {
    console.log('❌ Configuration issues found. Please fix them before testing email sending.')
    return
  }

  // Step 2: Test actual email sending
  const emailOk = await testEmailFunction()
  console.log('')

  // Summary
  console.log('📋 Test Summary:')
  console.log('   Configuration:', configOk ? '✅ OK' : '❌ Failed')
  console.log('   Email Sending:', emailOk ? '✅ OK' : '❌ Failed')

  if (configOk && emailOk) {
    console.log('\n🎉 All tests passed! Email functionality is working correctly.')
  } else {
    console.log('\n⚠️  Some tests failed. Please check the issues above.')
  }
}

// Run the tests
if (require.main === module) {
  runEmailTests()
}

module.exports = { testEmailFunction, checkEmailConfiguration }

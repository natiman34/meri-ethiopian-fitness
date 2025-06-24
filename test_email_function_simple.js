/**
 * Simple test for the email function
 */

const { createClient } = require('./client/node_modules/@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://dhcgrpsgvaggrtfcykyf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MjE5NzQsImV4cCI6MjA1MDE5Nzk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testEmailFunction() {
  console.log('🧪 Testing Email Function...')

  try {
    const testData = {
      feedbackId: 'test-123',
      userEmail: 'test@example.com', // Test email address
      userName: 'Test User',
      feedbackContent: 'This is a test feedback message to verify email sending functionality.',
      adminReply: 'Thank you for your feedback! This is a test reply from the admin to verify that emails are being sent correctly.'
    }

    console.log('Calling function with data:', testData)

    const { data, error } = await supabase.functions.invoke('send-email-reply', {
      body: testData
    })

    if (error) {
      console.error('❌ Function call failed:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return false
    }

    console.log('✅ Function call successful!')
    console.log('Response:', JSON.stringify(data, null, 2))

    if (data?.success) {
      if (data.data?.status === 'sent') {
        console.log('🎉 EMAIL ACTUALLY SENT!')
        console.log('📧 Email ID:', data.emailId)
        console.log('📬 Check your inbox at:', testData.userEmail)
        return true
      } else if (data.data?.status === 'simulated_no_api_key') {
        console.log('⚠️ Email function working but RESEND_API_KEY not configured')
        console.log('💡 Configure RESEND_API_KEY to enable actual email sending')
        return 'needs_api_key'
      } else {
        console.log('⚠️ Function returned but email status unclear:', data.data?.status)
        return false
      }
    } else {
      console.log('⚠️ Function returned but success was false')
      return false
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

// Run the test
testEmailFunction().then(result => {
  console.log('\n' + '='.repeat(60))
  if (result === true) {
    console.log('🎉 EMAIL SENDING IS WORKING!')
    console.log('✅ Emails are being sent successfully')
    console.log('✅ Check your inbox for the test email')
    console.log('✅ Admin dashboard email replies will work')
  } else if (result === 'needs_api_key') {
    console.log('⚠️  EMAIL FUNCTION WORKING BUT NEEDS CONFIGURATION')
    console.log('📋 TO ENABLE ACTUAL EMAIL SENDING:')
    console.log('   1. Go to https://resend.com and create free account')
    console.log('   2. Get your API key (starts with "re_")')
    console.log('   3. Go to Supabase Dashboard → Project Settings → Edge Functions')
    console.log('   4. Add environment variable: RESEND_API_KEY = your_api_key')
    console.log('   5. Test again')
  } else {
    console.log('❌ EMAIL FUNCTION TEST FAILED')
    console.log('Please check the function deployment and configuration.')
  }
  console.log('='.repeat(60))
})

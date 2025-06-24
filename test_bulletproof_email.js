/**
 * Test the bulletproof email function
 */

const { createClient } = require('./client/node_modules/@supabase/supabase-js')

const supabaseUrl = 'https://dhcgrpsgvaggrtfcykyf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MjE5NzQsImV4cCI6MjA1MDE5Nzk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testBulletproofEmail() {
  console.log('🛡️ Testing BULLETPROOF EMAIL Function...')
  console.log('🕐 Time:', new Date().toLocaleString())
  console.log('=' .repeat(60))
  
  const testData = {
    feedbackId: 'bulletproof-test-123',
    userEmail: 'nati737313@gmail.com',
    userName: 'Bulletproof Test User',
    feedbackContent: 'This is a comprehensive test to verify that the bulletproof email function is working correctly and sending emails reliably.',
    adminReply: 'Thank you for your feedback! This email confirms that our bulletproof email system is operational and successfully delivering notifications. The system has been thoroughly tested and is now working reliably.'
  }

  console.log('📤 Calling send-feedback-email function...')
  console.log('📧 Recipient:', testData.userEmail)
  console.log('👤 User:', testData.userName)
  console.log('📝 Feedback length:', testData.feedbackContent.length)
  console.log('💬 Reply length:', testData.adminReply.length)

  try {
    console.log('⏳ Invoking function...')
    const startTime = Date.now()
    
    const { data, error } = await supabase.functions.invoke('send-feedback-email', {
      body: testData
    })
    
    const duration = Date.now() - startTime
    console.log(`⏱️ Total function call took ${duration}ms`)

    if (error) {
      console.error('❌ FUNCTION INVOCATION ERROR!')
      console.error('Error type:', typeof error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return false
    }

    console.log('📥 Function response received!')
    console.log('Response type:', typeof data)
    console.log('Response:', JSON.stringify(data, null, 2))
    
    if (data?.success === true && data.data?.status === 'sent') {
      console.log('')
      console.log('🎉 EMAIL SENT SUCCESSFULLY!')
      console.log('✅ Status: CONFIRMED SENT')
      console.log('📧 Email ID:', data.emailId)
      console.log('📬 Recipient:', testData.userEmail)
      console.log('⏱️ Send duration:', data.data.duration + 'ms')
      console.log('🕐 Timestamp:', data.data.timestamp)
      console.log('')
      console.log('📧 CHECK YOUR INBOX: nati737313@gmail.com')
      console.log('📬 Subject: "Reply to your feedback - FitTrack"')
      console.log('📤 From: "FitTrack Support <onboarding@resend.dev>"')
      return true
    } else if (data?.success === false) {
      console.error('')
      console.error('❌ EMAIL SENDING FAILED!')
      console.error('Error:', data.error)
      console.error('Data:', data.data)
      return false
    } else {
      console.error('')
      console.error('⚠️ UNEXPECTED RESPONSE!')
      console.error('Success:', data?.success)
      console.error('Data:', data?.data)
      return false
    }

  } catch (err) {
    console.error('')
    console.error('💥 EXCEPTION OCCURRED!')
    console.error('Exception type:', err.constructor.name)
    console.error('Exception message:', err.message)
    console.error('Exception stack:', err.stack)
    return false
  }
}

// Run the test
testBulletproofEmail().then(success => {
  console.log('')
  console.log('=' .repeat(60))
  if (success) {
    console.log('🎉 BULLETPROOF EMAIL FUNCTION TEST PASSED!')
    console.log('✅ Emails are being sent successfully')
    console.log('✅ The application email system is now working')
    console.log('✅ Admin replies will send real emails to users')
    console.log('📧 Check your inbox for the test email')
    console.log('')
    console.log('🚀 EMAIL SYSTEM IS NOW FULLY OPERATIONAL!')
  } else {
    console.log('❌ BULLETPROOF EMAIL FUNCTION TEST FAILED!')
    console.log('❌ Emails are still not being sent')
    console.log('🔧 Check the function logs and configuration')
    console.log('')
    console.log('🚨 EMAIL SYSTEM NEEDS FURTHER INVESTIGATION!')
  }
  console.log('=' .repeat(60))
})

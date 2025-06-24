/**
 * Test the new working-email function
 */

const { createClient } = require('./client/node_modules/@supabase/supabase-js')

const supabaseUrl = 'https://dhcgrpsgvaggrtfcykyf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MjE5NzQsImV4cCI6MjA1MDE5Nzk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testWorkingEmail() {
  console.log('🧪 Testing WORKING EMAIL Function...')
  console.log('Time:', new Date().toLocaleString())
  
  const testData = {
    feedbackId: 'working-test-123',
    userEmail: 'nati737313@gmail.com',
    userName: 'Working Test User',
    feedbackContent: 'This is a test to verify the working email function is sending emails correctly.',
    adminReply: 'Thank you for your feedback! This email confirms that the working email function is operational and sending emails successfully.'
  }

  console.log('📤 Calling working-email function...')
  console.log('📧 Sending to:', testData.userEmail)

  try {
    const startTime = Date.now()
    
    const { data, error } = await supabase.functions.invoke('working-email', {
      body: testData
    })
    
    const duration = Date.now() - startTime
    console.log(`⏱️ Function call completed in ${duration}ms`)

    if (error) {
      console.error('❌ Function error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return false
    }

    console.log('📥 Response received!')
    console.log('Response:', JSON.stringify(data, null, 2))
    
    if (data?.success && data.data?.status === 'sent') {
      console.log('🎉 EMAIL SENT SUCCESSFULLY!')
      console.log('📧 Email ID:', data.emailId)
      console.log('📬 Recipient:', testData.userEmail)
      console.log('✅ Status:', data.data.status)
      console.log('')
      console.log('📧 CHECK YOUR INBOX: nati737313@gmail.com')
      return true
    } else if (data?.success === false) {
      console.error('❌ Email sending failed!')
      console.error('Error:', data.error)
      return false
    } else {
      console.log('⚠️ Unexpected response:', data)
      return false
    }

  } catch (err) {
    console.error('💥 Exception:', err.message)
    console.error('Stack:', err.stack)
    return false
  }
}

// Run the test
testWorkingEmail().then(success => {
  console.log('\n' + '='.repeat(50))
  if (success) {
    console.log('🎉 WORKING EMAIL FUNCTION TEST PASSED!')
    console.log('✅ Emails are being sent successfully')
    console.log('✅ The application will now send emails')
    console.log('📧 Check your inbox for the test email')
  } else {
    console.log('❌ WORKING EMAIL FUNCTION TEST FAILED!')
    console.log('❌ Emails are not being sent')
    console.log('🔧 Check the function logs for details')
  }
  console.log('='.repeat(50))
})

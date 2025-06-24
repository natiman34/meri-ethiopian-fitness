/**
 * Test the reliable email function
 */

const { createClient } = require('./client/node_modules/@supabase/supabase-js')

const supabaseUrl = 'https://dhcgrpsgvaggrtfcykyf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MjE5NzQsImV4cCI6MjA1MDE5Nzk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testReliableEmail() {
  console.log('🛡️ Testing RELIABLE EMAIL Function...')
  console.log('🕐 Time:', new Date().toLocaleString())
  
  const testData = {
    feedbackId: 'reliable-test-123',
    userEmail: 'nati737313@gmail.com',
    userName: 'Reliable Test User',
    feedbackContent: 'This is a test of the reliable email function to ensure emails are being sent correctly.',
    adminReply: 'Thank you for your feedback! This email confirms that the reliable email system is working and sending notifications successfully.'
  }

  console.log('📤 Calling reliable-email function...')

  try {
    const { data, error } = await supabase.functions.invoke('reliable-email', {
      body: testData
    })

    if (error) {
      console.error('❌ Function error:', error)
      return false
    }

    console.log('📥 Response:', JSON.stringify(data, null, 2))
    
    if (data?.success && data.data?.status === 'sent') {
      console.log('🎉 EMAIL SENT SUCCESSFULLY!')
      console.log('📧 Email ID:', data.emailId)
      console.log('📬 Sent to:', testData.userEmail)
      console.log('')
      console.log('📧 CHECK YOUR INBOX: nati737313@gmail.com')
      return true
    } else {
      console.error('❌ Email not sent:', data)
      return false
    }

  } catch (err) {
    console.error('💥 Exception:', err.message)
    return false
  }
}

testReliableEmail().then(success => {
  console.log('')
  console.log('='.repeat(50))
  if (success) {
    console.log('✅ RELIABLE EMAIL FUNCTION WORKING!')
    console.log('📧 Emails are being sent successfully')
    console.log('🚀 Application email system is operational')
  } else {
    console.log('❌ RELIABLE EMAIL FUNCTION FAILED!')
    console.log('🔧 Check function logs for details')
  }
  console.log('='.repeat(50))
})

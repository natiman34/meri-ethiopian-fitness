/**
 * Test the new email function
 */

const { createClient } = require('./client/node_modules/@supabase/supabase-js')

const supabaseUrl = 'https://dhcgrpsgvaggrtfcykyf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MjE5NzQsImV4cCI6MjA1MDE5Nzk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testNewEmailFunction() {
  console.log('🧪 Testing NEW Email Function...')
  
  const testData = {
    feedbackId: 'test-123',
    userEmail: 'nati737313@gmail.com', // Using your email for testing
    userName: 'Test User',
    feedbackContent: 'This is a test feedback message to verify that emails are actually being sent.',
    adminReply: 'Thank you for your feedback! This is a test reply from the admin. If you receive this email, the system is working perfectly!'
  }

  console.log('📤 Calling email-with-key function (with your API key)...')

  try {
    const { data, error } = await supabase.functions.invoke('email-with-key', {
      body: testData
    })

    console.log('📥 Response received!')
    
    if (error) {
      console.error('❌ Error:', error)
      return
    }

    console.log('✅ Success!')
    console.log('📧 Response:', JSON.stringify(data, null, 2))
    
    if (data?.data?.status === 'sent') {
      console.log('🎉 EMAIL WAS ACTUALLY SENT!')
      console.log('📬 Check your inbox!')
    } else if (data?.data?.status === 'simulated_no_api_key') {
      console.log('⚠️ Email simulated - need to configure RESEND_API_KEY')
    } else {
      console.log('❓ Status:', data?.data?.status)
    }

  } catch (err) {
    console.error('❌ Exception:', err)
  }
}

testNewEmailFunction()

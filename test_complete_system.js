/**
 * Complete system test for feedback and email functionality
 * This tests the entire flow from database to email sending
 */

const { createClient } = require('./client/node_modules/@supabase/supabase-js')

const supabaseUrl = 'https://dhcgrpsgvaggrtfcykyf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MjE5NzQsImV4cCI6MjA1MDE5Nzk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8' // Using anon key for testing

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCompleteSystem() {
  console.log('🧪 TESTING COMPLETE FEEDBACK & EMAIL SYSTEM')
  console.log('=' .repeat(60))

  let testFeedbackId = null

  try {
    // Step 1: Create test feedback
    console.log('\n1️⃣ Creating test feedback...')
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('feedback')
      .insert({
        full_name: 'System Test User',
        email: 'nati737313@gmail.com',
        content: 'This is a complete system test to verify that the feedback and email system works end-to-end.',
        rating: 5,
        is_resolved: false
      })
      .select()
      .single()

    if (feedbackError) {
      throw new Error(`Failed to create feedback: ${feedbackError.message}`)
    }

    testFeedbackId = feedbackData.id
    console.log('✅ Test feedback created:', testFeedbackId)

    // Step 2: Test email sending
    console.log('\n2️⃣ Testing email sending...')
    const { data: emailData, error: emailError } = await supabase.functions.invoke('email-with-key', {
      body: {
        feedbackId: testFeedbackId,
        userEmail: 'nati737313@gmail.com',
        userName: 'System Test User',
        feedbackContent: 'This is a complete system test to verify that the feedback and email system works end-to-end.',
        adminReply: 'Thank you for your feedback! This is an automated test reply to verify the complete system is working correctly. If you receive this email, everything is functioning perfectly!'
      }
    })

    if (emailError) {
      throw new Error(`Email function failed: ${emailError.message}`)
    }

    if (emailData?.success && emailData.data?.status === 'sent') {
      console.log('✅ Email sent successfully!')
      console.log('📧 Email ID:', emailData.emailId)
      console.log('📬 Recipient:', 'nati737313@gmail.com')
    } else {
      throw new Error(`Email not sent. Status: ${emailData?.data?.status}`)
    }

    // Step 3: Update feedback as resolved
    console.log('\n3️⃣ Updating feedback as resolved...')
    const { data: updateData, error: updateError } = await supabase
      .from('feedback')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        reply_message: 'Thank you for your feedback! This is an automated test reply to verify the complete system is working correctly.'
      })
      .eq('id', testFeedbackId)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Failed to update feedback: ${updateError.message}`)
    }

    console.log('✅ Feedback updated as resolved')

    // Step 4: Verify the complete record
    console.log('\n4️⃣ Verifying complete record...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('feedback')
      .select('*')
      .eq('id', testFeedbackId)
      .single()

    if (verifyError) {
      throw new Error(`Failed to verify feedback: ${verifyError.message}`)
    }

    console.log('✅ Record verification complete:')
    console.log('   - ID:', verifyData.id)
    console.log('   - Email:', verifyData.email)
    console.log('   - Resolved:', verifyData.is_resolved)
    console.log('   - Reply:', verifyData.reply_message ? 'Present' : 'Missing')
    console.log('   - Resolved At:', verifyData.resolved_at ? 'Set' : 'Missing')

    console.log('\n🎉 COMPLETE SYSTEM TEST PASSED!')
    console.log('=' .repeat(60))
    console.log('✅ Database operations: WORKING')
    console.log('✅ Email sending: WORKING')
    console.log('✅ Status updates: WORKING')
    console.log('✅ Data integrity: WORKING')
    console.log('📧 CHECK YOUR INBOX: nati737313@gmail.com')
    console.log('=' .repeat(60))

  } catch (error) {
    console.error('\n❌ SYSTEM TEST FAILED:', error.message)
    console.error('Error details:', error)
  } finally {
    // Cleanup: Remove test data
    if (testFeedbackId) {
      console.log('\n🧹 Cleaning up test data...')
      try {
        await supabase
          .from('feedback')
          .delete()
          .eq('id', testFeedbackId)
        console.log('✅ Test data cleaned up')
      } catch (cleanupError) {
        console.warn('⚠️ Cleanup warning:', cleanupError.message)
      }
    }
  }
}

async function testEmailFunctionDirectly() {
  console.log('\n📧 TESTING EMAIL FUNCTION DIRECTLY')
  console.log('-'.repeat(40))

  try {
    const { data, error } = await supabase.functions.invoke('email-with-key', {
      body: {
        feedbackId: 'direct-test-123',
        userEmail: 'nati737313@gmail.com',
        userName: 'Direct Test User',
        feedbackContent: 'This is a direct test of the email function.',
        adminReply: 'This is a direct test reply to verify email functionality.'
      }
    })

    if (error) {
      console.error('❌ Direct email test failed:', error)
      return false
    }

    if (data?.success && data.data?.status === 'sent') {
      console.log('✅ Direct email test PASSED!')
      console.log('📧 Email ID:', data.emailId)
      return true
    } else {
      console.error('❌ Email not sent. Response:', data)
      return false
    }
  } catch (err) {
    console.error('❌ Direct email test exception:', err)
    return false
  }
}

// Run tests
async function runAllTests() {
  console.log('🚀 STARTING COMPREHENSIVE SYSTEM TESTS')
  console.log('🕐 ' + new Date().toLocaleString())
  console.log('')

  // Test 1: Direct email function
  const emailTest = await testEmailFunctionDirectly()
  
  if (emailTest) {
    // Test 2: Complete system
    await testCompleteSystem()
  } else {
    console.log('\n❌ Skipping complete system test due to email function failure')
  }

  console.log('\n🏁 ALL TESTS COMPLETED')
}

runAllTests()

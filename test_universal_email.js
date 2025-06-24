/**
 * Test the universal email function that can send to any email
 */

const { createClient } = require('./client/node_modules/@supabase/supabase-js')

const supabaseUrl = 'https://dhcgrpsgvaggrtfcykyf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MjE5NzQsImV4cCI6MjA1MDE5Nzk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testUniversalEmail() {
  console.log('🌍 Testing UNIVERSAL EMAIL Function...')
  console.log('🕐 Time:', new Date().toLocaleString())
  console.log('=' .repeat(60))
  
  // Test with different email addresses
  const testEmails = [
    {
      email: 'nati737313@gmail.com',
      name: 'Your Email Test',
      note: 'Your verified email'
    },
    {
      email: 'test@example.com',
      name: 'External Email Test',
      note: 'External email address'
    },
    {
      email: 'user@domain.com',
      name: 'Another External Test',
      note: 'Another external email'
    }
  ]

  for (let i = 0; i < testEmails.length; i++) {
    const testEmail = testEmails[i]
    
    console.log(`\n📧 TEST ${i + 1}: ${testEmail.note}`)
    console.log('📬 Email:', testEmail.email)
    
    const testData = {
      feedbackId: `universal-test-${i + 1}`,
      userEmail: testEmail.email,
      userName: testEmail.name,
      feedbackContent: `This is a test of the universal email function to ${testEmail.note}. Testing if emails can be sent to any email address.`,
      adminReply: `Thank you for your feedback! This email confirms that our universal email system can send to any email address, including ${testEmail.email}.`
    }

    try {
      console.log('⏳ Calling universal-email function...')
      const startTime = Date.now()
      
      const { data, error } = await supabase.functions.invoke('universal-email', {
        body: testData
      })
      
      const duration = Date.now() - startTime
      console.log(`⏱️ Function call took ${duration}ms`)

      if (error) {
        console.error('❌ Function error:', error)
        continue
      }

      console.log('📥 Response:', JSON.stringify(data, null, 2))
      
      if (data?.success && data.data?.status === 'sent') {
        console.log('🎉 EMAIL SENT SUCCESSFULLY!')
        console.log('📧 Email ID:', data.emailId)
        console.log('📬 Sent to:', testEmail.email)
        console.log('🚀 Method:', data.data.method || 'standard')
        console.log('🔄 Attempt:', data.data.attempt || 1)
        
        if (testEmail.email === 'nati737313@gmail.com') {
          console.log('📧 CHECK YOUR INBOX!')
        }
      } else {
        console.error('❌ Email failed for:', testEmail.email)
        console.error('Error:', data?.error)
      }

    } catch (err) {
      console.error('💥 Exception for', testEmail.email, ':', err.message)
    }
    
    // Wait a bit between tests
    if (i < testEmails.length - 1) {
      console.log('⏳ Waiting 2 seconds before next test...')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
}

testUniversalEmail().then(() => {
  console.log('\n' + '='.repeat(60))
  console.log('🏁 UNIVERSAL EMAIL TESTS COMPLETED!')
  console.log('📧 Check results above to see which emails were sent')
  console.log('✅ If successful, emails can now be sent to ANY user!')
  console.log('='.repeat(60))
})

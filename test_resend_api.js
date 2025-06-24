/**
 * Test Resend API directly to verify it's working
 */

async function testResendAPI() {
  console.log('🔍 Testing Resend API directly...')
  
  const apiKey = 're_7rddcDCt_7LdvJvjmMjZXKRvWR8ybqsZs'
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'FitTrack Support <onboarding@resend.dev>',
        to: ['nati737313@gmail.com'],
        subject: 'Direct Resend API Test - FitTrack',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">Direct Resend API Test</h2>
            <p>This email was sent directly via the Resend API to test if the API key is working.</p>
            <p>If you receive this email, the Resend API is functioning correctly.</p>
            <p>Time: ${new Date().toLocaleString()}</p>
          </div>
        `
      })
    })
    
    const result = await response.json()
    
    console.log('Response status:', response.status)
    console.log('Response:', JSON.stringify(result, null, 2))
    
    if (response.ok) {
      console.log('✅ RESEND API IS WORKING!')
      console.log('📧 Email ID:', result.id)
      console.log('📬 Email sent to: nati737313@gmail.com')
      return true
    } else {
      console.error('❌ RESEND API FAILED!')
      console.error('Status:', response.status)
      console.error('Error:', result)
      return false
    }
    
  } catch (error) {
    console.error('💥 Exception testing Resend API:', error)
    return false
  }
}

// Test the API
testResendAPI().then(success => {
  if (success) {
    console.log('\n🎉 Resend API is working correctly!')
    console.log('📧 Check your inbox: nati737313@gmail.com')
  } else {
    console.log('\n❌ Resend API has issues!')
    console.log('🔧 Check the API key and configuration')
  }
})

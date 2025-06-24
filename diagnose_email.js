/**
 * Diagnostic test for email function
 */

const { createClient } = require('./client/node_modules/@supabase/supabase-js')

const supabaseUrl = 'https://dhcgrpsgvaggrtfcykyf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MjE5NzQsImV4cCI6MjA1MDE5Nzk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function diagnoseEmailFunction() {
  console.log('🔍 DIAGNOSING EMAIL FUNCTION...')
  console.log('Time:', new Date().toISOString())
  
  const testData = {
    feedbackId: 'diagnostic-test',
    userEmail: 'nati737313@gmail.com',
    userName: 'Diagnostic Test',
    feedbackContent: 'Diagnostic test message',
    adminReply: 'Diagnostic test reply'
  }

  console.log('📤 Testing email-with-key function...')
  console.log('Data:', testData)

  try {
    console.log('⏳ Calling function...')
    
    const startTime = Date.now()
    const { data, error } = await supabase.functions.invoke('email-with-key', {
      body: testData
    })
    const endTime = Date.now()
    
    console.log(`⏱️ Function call took: ${endTime - startTime}ms`)
    
    if (error) {
      console.error('❌ Function error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return false
    }

    console.log('📥 Function response received!')
    console.log('Response:', JSON.stringify(data, null, 2))
    
    if (data?.success) {
      if (data.data?.status === 'sent') {
        console.log('🎉 EMAIL SENT SUCCESSFULLY!')
        console.log('📧 Email ID:', data.emailId)
        return true
      } else {
        console.log('⚠️ Email not sent. Status:', data.data?.status)
        console.log('Message:', data.message)
        return false
      }
    } else {
      console.log('❌ Function returned success=false')
      return false
    }

  } catch (err) {
    console.error('💥 Exception occurred:', err)
    console.error('Stack:', err.stack)
    return false
  }
}

async function testDirectAPI() {
  console.log('\n🔗 TESTING DIRECT RESEND API...')
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_7rddcDCt_7LdvJvjmMjZXKRvWR8ybqsZs',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'FitTrack Support <onboarding@resend.dev>',
        to: ['nati737313@gmail.com'],
        subject: 'Direct API Test - FitTrack',
        html: '<h1>Direct API Test</h1><p>This is a direct test of the Resend API.</p>'
      })
    })
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Direct API test PASSED!')
      console.log('📧 Email ID:', result.id)
      return true
    } else {
      console.error('❌ Direct API test FAILED!')
      console.error('Status:', response.status)
      console.error('Error:', result)
      return false
    }
    
  } catch (err) {
    console.error('💥 Direct API exception:', err)
    return false
  }
}

async function runDiagnostics() {
  console.log('🚀 STARTING EMAIL DIAGNOSTICS')
  console.log('=' .repeat(50))
  
  // Test 1: Direct API
  const apiTest = await testDirectAPI()
  
  // Test 2: Supabase function
  const functionTest = await diagnoseEmailFunction()
  
  console.log('\n📊 DIAGNOSTIC RESULTS:')
  console.log('=' .repeat(50))
  console.log('Direct Resend API:', apiTest ? '✅ WORKING' : '❌ FAILED')
  console.log('Supabase Function:', functionTest ? '✅ WORKING' : '❌ FAILED')
  
  if (apiTest && functionTest) {
    console.log('\n🎉 EMAIL SYSTEM IS WORKING!')
  } else if (apiTest && !functionTest) {
    console.log('\n⚠️ API works but function has issues')
  } else if (!apiTest && functionTest) {
    console.log('\n⚠️ Function works but API has issues')
  } else {
    console.log('\n❌ BOTH API AND FUNCTION HAVE ISSUES')
  }
}

runDiagnostics()

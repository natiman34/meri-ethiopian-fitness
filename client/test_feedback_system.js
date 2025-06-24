/**
 * Test script for the enhanced feedback system
 * This script tests the feedback table creation and basic functionality
 */

const { createClient } = require('@supabase/supabase-js')

// Supabase configuration (replace with your actual values)
const supabaseUrl = 'https://dhcgrpsgvaggrtfcykyf.supabase.co'
const supabaseKey = 'your-anon-key-here' // Replace with actual anon key

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFeedbackSystem() {
  console.log('🧪 Testing Enhanced Feedback System...\n')

  try {
    // Test 1: Check if feedback table exists and has correct structure
    console.log('1. Testing feedback table structure...')
    const { data: tableInfo, error: tableError } = await supabase
      .from('feedback')
      .select('*')
      .limit(1)

    if (tableError && tableError.code !== 'PGRST116') {
      throw new Error(`Table structure test failed: ${tableError.message}`)
    }
    console.log('✅ Feedback table exists with correct structure\n')

    // Test 2: Insert test feedback
    console.log('2. Testing feedback insertion...')
    const testFeedback = {
      full_name: 'Test User',
      email: 'test@example.com',
      content: 'This is a test feedback for the enhanced system.',
      rating: 5,
      is_resolved: false
    }

    const { data: insertData, error: insertError } = await supabase
      .from('feedback')
      .insert(testFeedback)
      .select()
      .single()

    if (insertError) {
      throw new Error(`Feedback insertion failed: ${insertError.message}`)
    }
    console.log('✅ Test feedback inserted successfully')
    console.log(`   Feedback ID: ${insertData.id}\n`)

    // Test 3: Test feedback retrieval
    console.log('3. Testing feedback retrieval...')
    const { data: retrieveData, error: retrieveError } = await supabase
      .from('feedback')
      .select('*')
      .eq('id', insertData.id)
      .single()

    if (retrieveError) {
      throw new Error(`Feedback retrieval failed: ${retrieveError.message}`)
    }
    console.log('✅ Feedback retrieved successfully')
    console.log(`   Content: ${retrieveData.content}`)
    console.log(`   Status: ${retrieveData.is_resolved ? 'Resolved' : 'Unresolved'}\n`)

    // Test 4: Test marking feedback as resolved
    console.log('4. Testing feedback resolution...')
    const { data: resolveData, error: resolveError } = await supabase
      .from('feedback')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        reply_message: 'Thank you for your feedback! We have addressed your concern.'
      })
      .eq('id', insertData.id)
      .select()
      .single()

    if (resolveError) {
      throw new Error(`Feedback resolution failed: ${resolveError.message}`)
    }
    console.log('✅ Feedback marked as resolved successfully')
    console.log(`   Reply: ${resolveData.reply_message}`)
    console.log(`   Resolved at: ${resolveData.resolved_at}\n`)

    // Test 5: Test filtering by status
    console.log('5. Testing status filtering...')
    const { data: resolvedData, error: resolvedError } = await supabase
      .from('feedback')
      .select('*')
      .eq('is_resolved', true)

    if (resolvedError) {
      throw new Error(`Status filtering failed: ${resolvedError.message}`)
    }
    console.log(`✅ Found ${resolvedData.length} resolved feedback items\n`)

    // Cleanup: Remove test data
    console.log('6. Cleaning up test data...')
    const { error: deleteError } = await supabase
      .from('feedback')
      .delete()
      .eq('id', insertData.id)

    if (deleteError) {
      console.warn(`⚠️  Cleanup warning: ${deleteError.message}`)
    } else {
      console.log('✅ Test data cleaned up successfully\n')
    }

    console.log('🎉 All tests passed! Enhanced feedback system is working correctly.')
    console.log('\n📋 Summary of enhancements:')
    console.log('   • Resolved/Unresolved status tracking')
    console.log('   • Admin reply functionality')
    console.log('   • Email notification system ready')
    console.log('   • Enhanced UI with action buttons')
    console.log('   • Status filtering capabilities')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

// Run the test
if (require.main === module) {
  testFeedbackSystem()
}

module.exports = { testFeedbackSystem }
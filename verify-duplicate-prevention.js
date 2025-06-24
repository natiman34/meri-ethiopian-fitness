// Verification script for duplicate prevention
// Run this in the browser console on your admin page

async function verifyDuplicatePrevention() {
    console.log('🔍 Starting duplicate prevention verification...');
    
    // Test data
    const testFitnessPlan = {
        title: 'Test Duplicate Plan',
        description: 'This is a test plan for duplicate prevention',
        category: 'weight-loss',
        level: 'beginner',
        duration: 30,
        weekly_workouts: 3,
        difficulty: 1,
        prerequisites: [],
        equipment: [],
        goals: [],
        schedule: [],
        status: 'published',
        tags: ['test'],
        featured: false,
        muscle_groups: [],
        equipment_required: [],
        time_of_day: 'any',
        location: 'home',
        intensity: 'low'
    };

    const testMeal = {
        name: 'Test Duplicate Meal',
        description: 'This is a test meal for duplicate prevention',
        image_url: null,
        is_ethiopian: false,
        ingredients: ['Test ingredient 1', 'Test ingredient 2'],
        preparation: 'Test preparation instructions',
        nutritional_info: { calories: 100, protein: 10, carbs: 15, fat: 5 },
        category: 'lunch',
        cuisine_type: 'international',
        difficulty_level: 'easy',
        prep_time: 15,
        cook_time: 30,
        servings: 2,
        tags: ['test'],
        status: 'active'
    };

    let results = [];

    try {
        // Test 1: Create first fitness plan (should succeed)
        console.log('📝 Test 1: Creating first fitness plan...');
        const response1 = await fetch('/api/supabase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'insert',
                table: 'fitness_plans',
                data: testFitnessPlan
            })
        });

        if (response1.ok) {
            const plan1 = await response1.json();
            console.log('✅ First fitness plan created successfully:', plan1.id);
            results.push('✅ First fitness plan creation: SUCCESS');

            // Test 2: Try to create duplicate fitness plan (should fail)
            console.log('📝 Test 2: Attempting to create duplicate fitness plan...');
            const response2 = await fetch('/api/supabase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'insert',
                    table: 'fitness_plans',
                    data: testFitnessPlan
                })
            });

            if (!response2.ok) {
                const error = await response2.text();
                if (error.includes('23505') || error.includes('unique')) {
                    console.log('✅ Duplicate fitness plan correctly prevented');
                    results.push('✅ Duplicate fitness plan prevention: SUCCESS');
                } else {
                    console.log('❌ Unexpected error:', error);
                    results.push('❌ Duplicate fitness plan prevention: UNEXPECTED ERROR');
                }
            } else {
                console.log('❌ Duplicate fitness plan was incorrectly allowed!');
                results.push('❌ Duplicate fitness plan prevention: FAILED');
            }

            // Clean up fitness plan
            await fetch('/api/supabase', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete',
                    table: 'fitness_plans',
                    id: plan1.id
                })
            });
            console.log('🧹 Fitness plan cleaned up');
        } else {
            console.log('❌ Failed to create first fitness plan');
            results.push('❌ First fitness plan creation: FAILED');
        }

        // Test 3: Create first meal (should succeed)
        console.log('📝 Test 3: Creating first meal...');
        const response3 = await fetch('/api/supabase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'insert',
                table: 'meals',
                data: testMeal
            })
        });

        if (response3.ok) {
            const meal1 = await response3.json();
            console.log('✅ First meal created successfully:', meal1.id);
            results.push('✅ First meal creation: SUCCESS');

            // Test 4: Try to create duplicate meal (should fail)
            console.log('📝 Test 4: Attempting to create duplicate meal...');
            const response4 = await fetch('/api/supabase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'insert',
                    table: 'meals',
                    data: testMeal
                })
            });

            if (!response4.ok) {
                const error = await response4.text();
                if (error.includes('23505') || error.includes('unique')) {
                    console.log('✅ Duplicate meal correctly prevented');
                    results.push('✅ Duplicate meal prevention: SUCCESS');
                } else {
                    console.log('❌ Unexpected error:', error);
                    results.push('❌ Duplicate meal prevention: UNEXPECTED ERROR');
                }
            } else {
                console.log('❌ Duplicate meal was incorrectly allowed!');
                results.push('❌ Duplicate meal prevention: FAILED');
            }

            // Clean up meal
            await fetch('/api/supabase', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete',
                    table: 'meals',
                    id: meal1.id
                })
            });
            console.log('🧹 Meal cleaned up');
        } else {
            console.log('❌ Failed to create first meal');
            results.push('❌ First meal creation: FAILED');
        }

    } catch (error) {
        console.error('❌ Verification failed with error:', error);
        results.push('❌ Verification failed: ' + error.message);
    }

    // Display results
    console.log('\n📊 VERIFICATION RESULTS:');
    console.log('========================');
    results.forEach(result => console.log(result));
    
    const successCount = results.filter(r => r.includes('SUCCESS')).length;
    const totalTests = results.length;
    
    console.log(`\n🎯 Overall Score: ${successCount}/${totalTests} tests passed`);
    
    if (successCount === totalTests) {
        console.log('🎉 ALL TESTS PASSED! Duplicate prevention is working correctly.');
    } else {
        console.log('⚠️  Some tests failed. Please check the implementation.');
    }

    return {
        success: successCount === totalTests,
        results: results,
        score: `${successCount}/${totalTests}`
    };
}

// Alternative verification using direct Supabase client
async function verifyWithSupabase() {
    if (typeof supabase === 'undefined') {
        console.error('❌ Supabase client not available. Make sure you\'re on a page with Supabase loaded.');
        return;
    }

    console.log('🔍 Starting Supabase direct verification...');
    
    const testPlan = {
        name: 'Direct Test Plan',
        title: 'Direct Test Plan',
        description: 'Direct test',
        duration: '30',
        plan_type: 'weight-loss',
        exercise_list: [],
        category: 'weight-loss',
        level: 'beginner',
        status: 'published'
    };

    try {
        // Create first plan
        const { data: plan1, error: error1 } = await supabase
            .from('fitness_plans')
            .insert([testPlan])
            .select()
            .single();

        if (error1) {
            console.error('❌ Failed to create first plan:', error1);
            return;
        }

        console.log('✅ First plan created:', plan1.id);

        // Try to create duplicate
        const { data: plan2, error: error2 } = await supabase
            .from('fitness_plans')
            .insert([testPlan])
            .select()
            .single();

        if (error2) {
            if (error2.code === '23505') {
                console.log('✅ Duplicate correctly prevented:', error2.message);
            } else {
                console.log('❌ Unexpected error:', error2);
            }
        } else {
            console.log('❌ Duplicate was incorrectly allowed!');
        }

        // Clean up
        await supabase.from('fitness_plans').delete().eq('id', plan1.id);
        console.log('🧹 Test plan cleaned up');

    } catch (error) {
        console.error('❌ Verification error:', error);
    }
}

// Export functions for use
window.verifyDuplicatePrevention = verifyDuplicatePrevention;
window.verifyWithSupabase = verifyWithSupabase;

console.log('🚀 Duplicate prevention verification script loaded!');
console.log('📋 Available functions:');
console.log('  - verifyDuplicatePrevention() - Full verification suite');
console.log('  - verifyWithSupabase() - Direct Supabase verification');
console.log('');
console.log('💡 Usage: Run verifyWithSupabase() in the browser console on your admin page');

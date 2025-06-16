// supabase/functions/add-user/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// This is your Supabase Service Role Key - Keep it secret!
// It should be set as an environment variable in your Supabase project (Settings -> Edge Functions -> Environment Variables)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://127.0.0.1:5173',
  'Access-Control-Allow-Methods': 'POST, PUT, DELETE, GET',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 405,
    })
  }

  try {
    const { email, password, full_name, role } = await req.json()

    if (!email || !password || !full_name || !role) {
      return new Response(JSON.stringify({ error: 'Missing required fields: email, password, full_name, role' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400,
      })
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists in user_profiles table
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from('user_profiles')
      .select('email, id')
      .eq('email', normalizedEmail)
      .limit(1)

    if (profileCheckError) {
      console.error('Error checking existing profiles:', profileCheckError.message);
    }

    if (existingProfile && existingProfile.length > 0) {
      return new Response(JSON.stringify({ error: 'User with this email already exists' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 409, // Conflict status code
      })
    }

    // Create user in Supabase Auth using the admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true, // Set to false if you don't want email confirmation for admin-added users
      user_metadata: {
        full_name,
        role
      }
    })

    if (authError) {
      console.error('Auth create user error:', authError.message);

      // Handle specific auth errors
      if (authError.message.includes('User already registered') ||
          authError.message.includes('already been registered')) {
        return new Response(JSON.stringify({ error: 'User with this email already exists' }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 409, // Conflict status code
        })
      }

      return new Response(JSON.stringify({ error: authError.message }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400,
      })
    }

    if (authData.user) {
      // The user profile should be automatically created by the database trigger
      // But let's verify it was created and handle any edge cases

      // Wait a moment for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 100))

      // Check if profile was created by the trigger
      const { data: createdProfile, error: profileCheckError } = await supabaseAdmin
        .from('user_profiles')
        .select('id, email, full_name, role')
        .eq('id', authData.user.id)
        .single()

      if (profileCheckError || !createdProfile) {
        console.warn('Profile not created by trigger, creating manually:', profileCheckError?.message);

        // Manually create the profile if the trigger didn't work
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            user_id: authData.user.id,
            full_name,
            email: normalizedEmail,
            role,
          })

        if (profileError) {
          console.error('Manual profile insertion error:', profileError.message);

          // If it's a unique constraint violation, the user already exists
          if (profileError.code === '23505') {
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id); // Clean up auth user
            return new Response(JSON.stringify({ error: 'User with this email already exists' }), {
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
              status: 409,
            })
          }

          // For other errors, clean up and return error
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id); // Clean up auth user
          return new Response(JSON.stringify({ error: profileError.message }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 500,
          })
        }
      }

      return new Response(JSON.stringify({ message: 'User added successfully', user: authData.user }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ error: 'User creation failed unexpectedly' }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    })

  } catch (error: any) {
    console.error('Error in add-user function:', error.message)

    // Handle specific error cases
    if (error.message.includes('duplicate key value') ||
        error.code === '23505' ||
        error.message.includes('already exists')) {
      return new Response(JSON.stringify({ error: 'User with this email already exists' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 409,
      })
    }

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    })
  }
})
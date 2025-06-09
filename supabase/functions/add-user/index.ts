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

    // Create user in Supabase Auth using the admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Set to false if you don't want email confirmation for admin-added users
    })

    if (authError) {
      console.error('Auth create user error:', authError.message);
      return new Response(JSON.stringify({ error: authError.message }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400,
      })
    }

    if (authData.user) {
      // Add user profile to user_profiles table
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          full_name,
          email,
          role,
        })

      if (profileError) {
        // If profile insertion fails, attempt to delete the auth user to prevent orphaned entries
        console.error('Profile insertion error:', profileError.message);
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id); // Clean up auth user
        return new Response(JSON.stringify({ error: profileError.message }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 500,
        })
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
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    })
  }
})
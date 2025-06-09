// supabase/functions/delete-user/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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

  if (req.method !== 'DELETE') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    })
  }

  try {
    // Get user ID from URL path (e.g., /api/admin/users/YOUR_USER_ID)
    const urlParts = req.url.split('/');
    const userId = urlParts[urlParts.length - 1]; // Assuming userId is the last segment

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Delete user from Supabase Auth.
    // Ensure you have CASCADE DELETE set up on your user_profiles table's user_id foreign key
    // so that deleting from auth.users also deletes from user_profiles.
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('Auth delete user error:', authError.message);
      return new Response(JSON.stringify({ error: authError.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: authError.status || 500,
      })
    }

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    })

  } catch (error: any) {
    console.error('Error in delete-user function:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    })
  }
})
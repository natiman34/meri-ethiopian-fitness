// supabase/functions/edit-user/index.ts
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

  if (req.method !== 'PUT') {
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

    const { full_name, role } = await req.json()

    if (!full_name || !role) {
      return new Response(JSON.stringify({ error: 'Missing required fields: full_name, role' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Update user profile in user_profiles table
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        full_name,
        role,
      })
      .eq('id', userId)
      .select(); // Select to return the updated data

    if (profileError) {
      console.error('Profile update error:', profileError.message);
      return new Response(JSON.stringify({ error: profileError.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // Optionally update auth user metadata if needed (e.g., email or name in auth.users)
    // const { data: authUpdateData, error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
    //   userId,
    //   { user_metadata: { full_name: full_name } }
    // );
    // if (authUpdateError) {
    //   console.error('Auth user metadata update error:', authUpdateError.message);
    //   // Decide how to handle this error:
    //   // - Return it to client
    //   // - Log it and proceed with profile update success
    // }

    if (profileData && profileData.length > 0) {
        return new Response(JSON.stringify({ message: 'User updated successfully', user: profileData[0] }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 200,
        });
    } else {
        return new Response(JSON.stringify({ error: 'User not found or no changes made' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 404,
        });
    }


  } catch (error: any) {
    console.error('Error in edit-user function:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    })
  }
})
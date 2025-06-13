// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Use environment variables for security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Security check - warn if environment variables are not set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("[CRITICAL ERROR] Supabase credentials not found. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are set.");
}

console.log("[supabase.ts] Supabase URL loaded:", !!supabaseUrl);
console.log("[supabase.ts] Supabase key loaded:", !!supabaseAnonKey);

// Create and export the Supabase client instance
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true, // Automatically refresh the session token
    persistSession: true,   // Persist session in storage (localStorage by default)
    detectSessionInUrl: true, // Detect session from URL (useful for OAuth redirects)
    flowType: 'pkce', // Use PKCE flow for better security
  },
});

console.log("[supabase.ts] Supabase client instance created successfully.");


// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Use environment variables with fallbacks for security
// TODO: Remove hardcoded fallbacks once environment variables are properly set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://dhcgrpsgvaggrtfcykyf.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTA0MTQsImV4cCI6MjA2NDE2NjQxNH0.fkcetY89lCpLbJegbKCoala2B-s_ra13WqU7SaYGI-Y";

// Security check - warn if using hardcoded values
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("[SECURITY WARNING] Using hardcoded Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.");
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
    redirectTo: `${window.location.origin}/set-new-password`, // Redirect to our password reset page
  },
});

console.log("[supabase.ts] Supabase client instance created successfully.");


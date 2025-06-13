import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhcgrpsgvaggrtfcykyf.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5MDQxNCwiZXhwIjoyMDY0MTY2NDE0fQ.3OxOyBtYuPABwAYt2Z6h7_oJONHBrNXbCkUoQI4eE8U';

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

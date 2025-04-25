import { createClient } from "@supabase/supabase-js";

// Provide fallback values for development and testing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key-for-build-process';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
); 
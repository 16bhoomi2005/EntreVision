import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (supabaseUrl === 'https://placeholder-url.supabase.co') {
  console.warn(
    '⚠ Supabase environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing. Authentication and database saves will run in offline demo simulation mode.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

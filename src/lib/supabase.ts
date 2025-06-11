import { createClient } from '@supabase/supabase-js';

declare global {
  interface ImportMeta {
    env: {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
    }
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type VolunteerLog = {
  id: string;
  user_id: string;
  organization: string;
  description: string;
  proof_of_service: string;
  start_time: string;
  end_time: string;
  date_of_service: string;
  additional_info?: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
}; 
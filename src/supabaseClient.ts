import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ibcicuglwuaoupdhureh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY2ljdWdsd3Vhb3VwZGh1cmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1OTA5NTUsImV4cCI6MjA2NTE2Njk1NX0.TbCwUBkwggcwzAJxYwiRRE1biHm31i6ZN1tMiSGQot4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
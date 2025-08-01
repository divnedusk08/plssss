// Script to make a user an admin
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials from supabaseClient.ts
const supabaseUrl = 'https://ibcicuglwuaoupdhureh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY2ljdWdsd3Vhb3VwZGh1cmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1OTA5NTUsImV4cCI6MjA2NTE2Njk1NX0.TbCwUBkwggcwzAJxYwiRRE1biHm31i6ZN1tMiSGQot4';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function makeUserAdmin() {
  const userEmail = 'dhriti.erusalagandi58@k12.leanderisd.org';
  
  try {
    // First, check if the user exists in the users table
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail);
    
    if (fetchError) {
      throw fetchError;
    }
    
    if (existingUsers && existingUsers.length > 0) {
      // User exists, update is_admin to true
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_admin: true })
        .eq('email', userEmail);
      
      if (updateError) {
        throw updateError;
      }
      
      console.log(`User ${userEmail} has been made an admin.`);
    } else {
      // User doesn't exist in the users table yet
      // We need to get the user's auth ID from the auth.users table
      console.log(`User ${userEmail} not found in the users table.`);
      
      // Since we can't directly query auth.users with the client, we'll need to create a record
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          email: userEmail,
          first_name: 'Dhriti',
          last_name: 'Erusalagandi',
          is_admin: true
        });
      
      if (insertError) {
        throw insertError;
      }
      
      console.log(`Created new admin user for ${userEmail}.`);
    }
  } catch (error) {
    console.error('Error making user admin:', error);
  }
}

// Run the function
makeUserAdmin();
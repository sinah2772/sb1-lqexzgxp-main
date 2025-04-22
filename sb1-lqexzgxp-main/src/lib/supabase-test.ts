import { supabase } from './supabase';

// Test database connection
export async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test auth connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Auth connection error:', authError);
      return { success: false, error: authError };
    }
    console.log('Auth connection successful');
    
    // Test database connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
      
    if (error) {
      console.error('Database connection error:', error);
      return { success: false, error };
    }
    
    console.log('Database connection successful');
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error testing connection:', err);
    return { success: false, error: err };
  }
}

// Run the test
testSupabaseConnection().then(result => {
  console.log('Connection test result:', result);
}); 
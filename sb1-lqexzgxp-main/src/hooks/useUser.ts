import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  name?: string;
  avatar_url?: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        if (!mounted) return;
        setLoading(true);
        setError(null);

        console.log('Fetching user session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (!session?.user?.id) {
          console.log('No session found');
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        console.log('Fetching user data...');
        const { data, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (dbError) {
          console.error('Database error:', dbError);
          throw dbError;
        }
        
        if (!data) {
          console.log('No user data found');
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        console.log('User data fetched successfully');
        if (mounted) {
          setUser(data as User);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in fetchUser:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'An error occurred while fetching user data');
          setUser(null);
          setLoading(false);
        }
      }
    };

    fetchUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            try {
              const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (error) throw error;
              if (mounted) {
                setUser(data as User);
                setLoading(false);
              }
            } catch (err) {
              console.error('Error fetching user on auth change:', err);
              if (mounted) {
                setUser(null);
                setLoading(false);
              }
            }
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
      throw err;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      setUser(data as User);
      return data;
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signOut,
    updateUser
  };
}
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  isDemoMode: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Detect if running in fallback offline simulation mode
  const isDemoMode = import.meta.env.VITE_SUPABASE_URL === undefined || 
                     import.meta.env.VITE_SUPABASE_URL === 'https://placeholder-url.supabase.co';

  useEffect(() => {
    if (isDemoMode) {
      // Simulate checking local session
      const savedUser = localStorage.getItem('entrevision_simulated_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
      return;
    }

    // Live Supabase initialization
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isDemoMode]);

  // Auth Operations
  const signUp = async (email, password, displayName) => {
    if (isDemoMode) {
      // Simulate signup
      const mockUser = {
        id: 'mock-user-uuid-1234',
        email,
        user_metadata: { display_name: displayName || email.split('@')[0] }
      };
      localStorage.setItem('entrevision_simulated_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { data: { user: mockUser }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0]
          }
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const signIn = async (email, password) => {
    if (isDemoMode) {
      // Simulate sign in
      const mockUser = {
        id: 'mock-user-uuid-1234',
        email,
        user_metadata: { display_name: email.split('@')[0] }
      };
      localStorage.setItem('entrevision_simulated_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { data: { user: mockUser }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const signInWithGoogle = async () => {
    if (isDemoMode) {
      const mockUser = {
        id: 'mock-user-uuid-google',
        email: 'google.demo@gmail.com',
        user_metadata: { display_name: 'Google Demo User' }
      };
      localStorage.setItem('entrevision_simulated_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const signOut = async () => {
    if (isDemoMode) {
      localStorage.removeItem('entrevision_simulated_user');
      setUser(null);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isDemoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

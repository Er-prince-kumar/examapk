import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient.js';
import { storageService } from '../services/storageService.js';
import { useNotification } from './NotificationContext.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const { addToast } = useNotification();

  // Load existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      // Check if user was logged in as guest previously
      const savedAuthType = localStorage.getItem('ewnc_auth_type');
      if (savedAuthType === 'guest') {
        const guestProfile = storageService.getProfile();
        setUser({
          id: guestProfile.id,
          email: 'alex.rivera@student.lpu.in',
          user_metadata: { full_name: guestProfile.full_name }
        });
        setProfile(guestProfile);
        setIsGuest(true);
        setLoading(false);
        return;
      }

      // Check Supabase session if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
            await fetchSupabaseProfile(initialSession.user.id);
          }
        } catch (err) {
          console.warn('Error fetching Supabase session:', err);
        }

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
          setSession(newSession);
          if (newSession?.user) {
            setUser(newSession.user);
            await fetchSupabaseProfile(newSession.user.id);
          } else {
            setUser(null);
            setProfile(null);
          }
        });

        setLoading(false);
        return () => subscription.unsubscribe();
      }

      // Default: If no session, auto-login as guest for seamless first-run experience
      loginAsGuest();
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const fetchSupabaseProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setProfile(data);
      } else {
        // Fallback to local profile
        setProfile(storageService.getProfile());
      }
    } catch {
      setProfile(storageService.getProfile());
    }
  };

  const loginAsGuest = () => {
    const guestProf = storageService.getProfile();
    const guestUser = {
      id: guestProf.id,
      email: 'alex.rivera@student.lpu.in',
      user_metadata: { full_name: guestProf.full_name }
    };
    setUser(guestUser);
    setProfile(guestProf);
    setIsGuest(true);
    localStorage.setItem('ewnc_auth_type', 'guest');
    localStorage.setItem('ewnc_auth_token', 'guest-token');
    addToast({
      title: 'Welcome to ExamWeekWithoutTheCrash',
      message: `Logged in as ${guestProf.full_name}. Data saved locally.`,
      type: 'success'
    });
  };

  const login = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured yet. Set VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY in your .env or click "Explore Demo Mode".');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    setUser(data.user);
    setSession(data.session);
    setIsGuest(false);
    localStorage.setItem('ewnc_auth_type', 'supabase');
    localStorage.setItem('ewnc_auth_token', data.session.access_token);
    addToast({
      title: 'Welcome back!',
      message: 'Successfully authenticated with Supabase.',
      type: 'success'
    });
    return data;
  };

  const signup = async (email, password, fullName) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured yet. Configure VITE_SUPABASE_URL or use Demo Mode.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (error) throw error;

    addToast({
      title: 'Account created!',
      message: 'Please check your email to verify your registration if required.',
      type: 'success'
    });
    return data;
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase && !isGuest) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsGuest(false);
    localStorage.removeItem('ewnc_auth_type');
    localStorage.removeItem('ewnc_auth_token');
    addToast({
      title: 'Logged out',
      message: 'You have been safely signed out.',
      type: 'info'
    });
  };

  const resetPassword = async (email) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured. Password reset is not available in offline mode.');
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
    addToast({
      title: 'Reset link sent',
      message: 'Check your email inbox for password reset instructions.',
      type: 'success'
    });
    return data;
  };

  const updateProfile = async (updates) => {
    const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
    setProfile(updated);
    storageService.saveProfile(updated);

    if (isSupabaseConfigured && supabase && !isGuest && user?.id) {
      try {
        await supabase.from('profiles').update(updates).eq('id', user.id);
      } catch (e) {
        console.warn('Failed to sync profile with Supabase:', e);
      }
    }

    addToast({
      title: 'Profile Updated',
      message: 'Your preferences and wellness goals have been saved.',
      type: 'success'
    });
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isGuest,
        isSupabaseConfigured,
        login,
        signup,
        logout,
        loginAsGuest,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

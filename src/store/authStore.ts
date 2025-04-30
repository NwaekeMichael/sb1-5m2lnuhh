import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface User {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    avatar_url?: string;
    bio?: string;
    phone?: string;
    location?: string;
  };
  created_at: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (metadata: Partial<User['user_metadata']>) => Promise<void>;
}

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      signUp: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name,
              },
            },
          });
          if (error) {
            if (error.message === 'User already registered') {
              throw new AuthError('This email is already registered. Please sign in instead.', 'user_already_exists');
            }
            throw new AuthError(error.message, error.name);
          }
          set({ user: data.user as User });
        } catch (error) {
          if (error instanceof AuthError) {
            throw error;
          }
          console.error('Error signing up:', error);
          throw new AuthError('An unexpected error occurred during sign up. Please try again.');
        } finally {
          set({ isLoading: false });
        }
      },
      signIn: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) {
            throw new AuthError(error.message, error.name);
          }
          set({ user: data.user as User });
        } catch (error) {
          if (error instanceof AuthError) {
            throw error;
          }
          console.error('Error signing in:', error);
          throw new AuthError('An unexpected error occurred during sign in. Please try again.');
        } finally {
          set({ isLoading: false });
        }
      },
      signOut: async () => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw new AuthError(error.message, error.name);
          set({ user: null });
        } catch (error) {
          console.error('Error signing out:', error);
          throw new AuthError('An unexpected error occurred during sign out. Please try again.');
        } finally {
          set({ isLoading: false });
        }
      },
      resetPassword: async (email: string) => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          });
          if (error) throw new AuthError(error.message, error.name);
        } catch (error) {
          if (error instanceof AuthError) {
            throw error;
          }
          console.error('Error resetting password:', error);
          throw new AuthError('An unexpected error occurred while sending reset instructions. Please try again.');
        } finally {
          set({ isLoading: false });
        }
      },
      updateProfile: async (metadata: Partial<User['user_metadata']>) => {
        const currentUser = get().user;
        if (!currentUser) throw new Error('No user logged in');

        try {
          const { data, error } = await supabase.auth.updateUser({
            data: {
              ...currentUser.user_metadata,
              ...metadata,
            },
          });

          if (error) throw error;

          set({ user: data.user as User });
        } catch (error) {
          console.error('Error updating profile:', error);
          throw new Error('Failed to update profile');
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
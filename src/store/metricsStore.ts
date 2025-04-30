import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface UserMetrics {
  stress_level: number;
  focus_score: number;
  activity_score: number;
  heart_rate: number;
  updated_at: string;
}

interface MetricsState {
  metrics: UserMetrics | null;
  isLoading: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
  updateMetrics: (metrics: Partial<UserMetrics>) => Promise<void>;
}

const defaultMetrics = {
  stress_level: 0,
  focus_score: 0,
  activity_score: 0,
  heart_rate: 0,
  updated_at: new Date().toISOString()
};

export const useMetricsStore = create<MetricsState>((set, get) => ({
  metrics: null,
  isLoading: false,
  error: null,

  fetchMetrics: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No metrics exist yet, create default metrics
          const { data: newMetrics, error: insertError } = await supabase
            .from('user_metrics')
            .insert([{ ...defaultMetrics, user_id: user.id }])
            .select()
            .single();

          if (insertError) throw insertError;
          set({ metrics: newMetrics });
        } else {
          throw error;
        }
      } else {
        set({ metrics: data });
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      set({ error: 'Failed to fetch metrics' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateMetrics: async (metrics: Partial<UserMetrics>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('user_metrics')
        .update({
          ...metrics,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Refresh metrics after update
      const currentMetrics = get().metrics;
      set({
        metrics: currentMetrics ? {
          ...currentMetrics,
          ...metrics,
          updated_at: new Date().toISOString(),
        } : null,
      });
    } catch (error) {
      console.error('Error updating metrics:', error);
      set({ error: 'Failed to update metrics' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
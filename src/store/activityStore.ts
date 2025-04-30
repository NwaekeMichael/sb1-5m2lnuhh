import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Activity {
  id: string;
  title: string;
  type: string;
  description: string;
  duration: string;
  time: string;
  participants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface ActivityState {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  fetchActivities: () => Promise<void>;
  createActivity: (activity: Omit<Activity, 'id'>) => Promise<void>;
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  isLoading: false,
  error: null,

  fetchActivities: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ activities: data || [] });
    } catch (error) {
      console.error('Error fetching activities:', error);
      set({ error: 'Failed to fetch activities' });
    } finally {
      set({ isLoading: false });
    }
  },

  createActivity: async (activity) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('activities')
        .insert([{ ...activity, user_id: user.id }]);

      if (error) throw error;
      
      // Refresh activities after creation
      await get().fetchActivities();
    } catch (error) {
      console.error('Error creating activity:', error);
      set({ error: 'Failed to create activity' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateActivity: async (id, activity) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('activities')
        .update(activity)
        .eq('id', id);

      if (error) throw error;
      
      // Refresh activities after update
      await get().fetchActivities();
    } catch (error) {
      console.error('Error updating activity:', error);
      set({ error: 'Failed to update activity' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteActivity: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh activities after deletion
      await get().fetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
      set({ error: 'Failed to delete activity' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
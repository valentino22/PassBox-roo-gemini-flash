import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { onAuthStateChange, getCurrentUser, signOut } from '../services/auth'; // Added signOut import

interface AuthState {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set: any) => ({ // Explicitly typed set as any for now
  user: null,
  isLoading: true,
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const user = await getCurrentUser();
      set({ user, isLoading: false });
    } catch (error) {
      console.error('Error fetching user:', error);
      set({ user: null, isLoading: false });
    }
  },
  signOut: async () => {
    try {
      await signOut();
      set({ user: null });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },
}));

// Listen for auth state changes and update the store
onAuthStateChange((event, session) => {
  const { user, fetchUser } = useAuthStore.getState();
  if (event === 'SIGNED_IN' && session?.user && !user) {
    fetchUser(); // Fetch user details if signed in and not already in store
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null });
  }
});

// Initial fetch of user on app start
useAuthStore.getState().fetchUser();
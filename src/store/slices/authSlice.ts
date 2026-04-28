import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

const stored = localStorage.getItem('healthsync-auth');
const parsedUser: AuthUser | null = stored ? (JSON.parse(stored) as AuthUser) : null;

const initialState: AuthState = {
  user: parsedUser,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.error = null;
      if (action.payload) {
        localStorage.setItem('healthsync-auth', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('healthsync-auth');
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    signOut(state) {
      state.user = null;
      state.error = null;
      localStorage.removeItem('healthsync-auth');
    },
  },
});

export const { setUser, setLoading, setError, signOut } = authSlice.actions;
export default authSlice.reducer;

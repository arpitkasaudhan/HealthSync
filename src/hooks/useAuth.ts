import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux';
import { setUser, setLoading, setError, signOut as signOutAction } from '@/store/slices/authSlice';
import { pushToast } from '@/store/slices/notificationSlice';
import { loginWithEmail, signOut as firebaseSignOut } from '@/services/firebase';

export function useAuth() {
  const dispatch  = useAppDispatch();
  const user      = useAppSelector((s) => s.auth.user);
  const loading   = useAppSelector((s) => s.auth.loading);
  const error     = useAppSelector((s) => s.auth.error);
  const navigate  = useNavigate();

  const login = useCallback(
    async (email: string, password: string) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        // Demo credentials — works without a real Firebase project
        if (email === 'admin@healthsync.ai' && password === 'Demo@1234') {
          dispatch(setUser({ uid: 'demo-001', email, displayName: 'Dr. Admin', photoURL: null }));
          dispatch(pushToast({ title: 'Welcome back!', message: 'Signed in as Admin', type: 'success' }));
          navigate('/dashboard');
          return;
        }

        const cred = await loginWithEmail(email, password);
        if (cred?.user) {
          dispatch(setUser({
            uid: cred.user.uid,
            email: cred.user.email,
            displayName: cred.user.displayName,
            photoURL: cred.user.photoURL,
          }));
          navigate('/dashboard');
        }
      } catch (err: unknown) {
        const raw = err instanceof Error ? err.message : '';
        const msg =
          raw.includes('invalid-credential') || raw.includes('wrong-password')
            ? 'Invalid email or password.'
            : raw.includes('too-many-requests')
            ? 'Too many attempts. Please wait a moment.'
            : raw.includes('network')
            ? 'Network error. Check your connection.'
            : 'Login failed. Please try again.';
        dispatch(setError(msg));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, navigate],
  );

  const logout = useCallback(async () => {
    try { await firebaseSignOut(); } catch { /* already signed out */ }
    dispatch(signOutAction());
    navigate('/login');
  }, [dispatch, navigate]);

  return { user, loading, error, login, logout };
}

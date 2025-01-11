// hooks/useAuth.ts
import { useEffect, Dispatch } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { loginUser, fetchCurrentUser, logoutUser } from '@/store/slices/authSlice';

export const useAuth = () => {
  const router = useRouter();
  const dispatch: Dispatch<any> = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token && !user) {
        try {
          await dispatch(fetchCurrentUser());
        } catch (error) {
          console.error('Failed to fetch user:', error);
          dispatch(logoutUser());
          router.push('/auth/login');
        }
      }
    };

    initAuth();
  }, [dispatch, router, user]);

  const login = async (email: string, password: string) => {
    try {
      const result = await dispatch(loginUser({ email, password }));
      
      if (loginUser.fulfilled.match(result)) {
        router.push('/dashboard');
      }
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    dispatch(logoutUser());
    router.push('/auth/login');
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout
  };
};
import { createContext, useContext, ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { clearUser, setUser } from '@/redux/userSlice';
import { api } from '@/lib/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<{ isLoading: boolean, error: string }>({ isLoading: true, error: '' });

export function UserProvider({ children }: UserProviderProps) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const refreshStatus = useRef(false);
  const whiteList = useRef(['/accounts/signin', '/accounts/signup', '/accounts/reset-password', '/accounts/confirm-email', '/accounts/additional-info']);
  const path = location.pathname + location.search;
  const count = useRef(0)

  const refreshUser = useCallback(async (email: string) => {
    try {
      if (refreshStatus.current && count.current === 0) return;
      count.current += 1;
      const response = await api.get(`/refresh?email=${email}`);
      const now = Date.now();
      dispatch(setUser({
        ...response.data,
        papers: response.data.papers || [],
        signed_in: true
      }));
      localStorage.setItem('ivy_user_token', JSON.stringify({
        token: response.data.email,
        timestamp: now
      }));
      refreshStatus.current = true;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      if (error instanceof Error) {
        const message = (error as AxiosError<{error: {[x: string]: string} }>).response?.data?.error
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, description] = Object.entries(message as { [x: string]: string })[0] || { 'Error': 'An unexpected error occurred' };
        setError(description);
        if (description?.includes('Account does not exist')) navigate('/accounts/signup' + (path ? `?redirect=${path}` : ''));
        localStorage.removeItem('ivy_user_token');
        dispatch(clearUser());
        if (!whiteList.current.includes(location.pathname)) {
          navigate('/accounts/signin' + (path ? `?redirect=${path}` : ''));
        }
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { error: string } } }
        console.error('API Error:', axiosError.response.data.error)
        setError(axiosError.response.data.error);
      } else {
        console.error('Unexpected error:', error)
        setError('An unexpected error occurred');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = JSON.parse(localStorage.getItem('ivy_user_token') || '{}');    
      if (storedToken.token) {
        const now = Date.now();
        const storedTime = storedToken.timestamp;
        
        // Check if stored data is less than 24 hours old
        if (now - storedTime < 24 * 60 * 60 * 1000) {
          // Refresh user data from server
          await refreshUser(storedToken.token);
        } else {
          // Clear expired data
          localStorage.removeItem('ivy_user_token');
          dispatch(clearUser());
          if (!whiteList.current.includes(location.pathname)) {
            navigate('/accounts/signin' + (path ? `?redirect=${path}` : ''));
          }
        }
      } else {
        if (!whiteList.current.includes(location.pathname)) {
          navigate('/accounts/signin' + (path ? `?redirect=${path}` : ''));
        }
      }
      setIsLoading(false);
    }
    fetchUser();
  }, [isLoading]);

  return (
    <UserContext.Provider value={{ isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

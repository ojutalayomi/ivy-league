import { createContext, useContext, ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, initialState, setUser, UserState } from '@/redux/userSlice';
import { api } from '@/lib/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';
import { CheckForIncorrectPermission } from '@/lib/utils';

interface UserProviderProps {
  children: ReactNode;
}

export enum ModeEnum {
  staff = "staff",
  student = "student"
}

export enum AdminModeEnum {
  admin = "admin",
  tutor = "tutor",
  liteAdmin = "lite_admin",
  proAdmin = "pro_admin",
  superAdmin = "super_admin",
  boardMember = "board_member"
}

export enum EmployeeEnum {
  Intern = "Intern",
  PartTime = "Part-Time",
  FullTime = "Full-Time"
}

type UserContextType = { isLoading: boolean, error: string, Mode: ModeEnum | null, user: UserState }
const UserContext = createContext<UserContextType>({ isLoading: true, error: '', Mode: null, user: initialState });

export function UserProvider({ children }: UserProviderProps) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user)
  const refreshStatus = useRef(false);
  const whiteList = useRef(['/a','/accounts/signin', '/accounts/signup', '/accounts/reset-password', '/accounts/confirm-email', '/accounts/additional-info']);
  const path = location.pathname + location.search;
  const count = useRef(0)
  const Mode = import.meta.env.VITE_Is_Staff && ModeEnum[import.meta.env.VITE_Is_Staff as keyof typeof ModeEnum] ? ModeEnum[import.meta.env.VITE_Is_Staff as keyof typeof ModeEnum] : null;

  const refreshUser = useCallback(async (email: string) => {
    try {
      if (refreshStatus.current && count.current === 0) return;
      count.current += 1;
      const response = await api.get(`/refresh?email=${email}`);
      if (CheckForIncorrectPermission(response.data, toast, Mode, dispatch, navigate, location, path, whiteList.current) === 1) return;
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
      const err = (error as AxiosError).response?.data || null;
      if (err && typeof err === 'object' && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
        console.error('Error refreshing user data:', err.message);
        setError((err as { message: string }).message);
        return;
      }
      if (error instanceof Error) {
        const message = (error as AxiosError<{ error: { [x: string]: string } }>).response?.data?.error;
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
  }, [Mode, dispatch, location, navigate, path])

  const fetchUser = useCallback(async () => {
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
  }, [dispatch, navigate, location.pathname, path, refreshUser])

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading && !whiteList.current.includes(location.pathname) && !user.signed_in) {
      navigate('/accounts/signin' + (path ? `?redirect=${path}` : ''));
    }
  }, [isLoading, location.pathname, navigate, path, user.signed_in]);

  return (
    <UserContext.Provider value={{ isLoading, error, Mode, user }}>
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

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  role: string;
  name: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(requiredRole?: string) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check if user is logged in and has correct role
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      // No credentials found, redirect to login
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr) as User;

      // If a specific role is required, check if user has it
      if (requiredRole) {
        const userRole = user.role?.toLowerCase() || '';
        const isAdmin = userRole === 'admin';
        const isSeller = userRole === 'sales staff';

        // Check role access
        if (requiredRole === 'admin' && !isAdmin) {
          // User trying to access admin page without admin role
          router.push('/dashboard');
          return;
        }

        if (requiredRole === 'seller' && !isSeller && isAdmin) {
          // Admin trying to access seller page (redirect to admin)
          router.push('/admin');
          return;
        }
      }

      setAuthState({
        user,
        loading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      // Invalid token/user data, redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      router.push('/login');
    }
  }, [router, requiredRole]);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return { ...authState, logout };
}

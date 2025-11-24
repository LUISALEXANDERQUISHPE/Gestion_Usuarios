"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/src/services/authService';
import { LoginCredentials, User } from '@/src/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const isAuth = authService.isAuthenticated();
    if (isAuth) {
      // Primero intentar obtener usuario de la cookie
      const userFromCookie = authService.getUser();
      if (userFromCookie) {
        setUser(userFromCookie);
      } else {
        // Si no hay usuario en cookie, decodificar del token
        const decoded = authService.getDecodedToken();
        if (decoded) {
          setUser({
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
          });
        }
      }
    }
    setLoading(false);
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      router.push('/dashboard');
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    role: authService.getRole(),
  };
}

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
      
      // El servicio ahora devuelve { success, data, static? }
      if (response.success) {
        // Esperar un momento para que las cookies se guarden
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const userFromCookie = authService.getUser();
        if (userFromCookie) {
          setUser(userFromCookie);
        }
        
        router.push('/dashboard');
        return { success: true };
      }
      
      return { 
        success: false, 
        error: 'Error al iniciar sesión' 
      };
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

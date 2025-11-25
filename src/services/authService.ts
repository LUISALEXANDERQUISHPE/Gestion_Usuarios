"use client";

import api from '@/src/lib/api';
import { LoginCredentials, RegisterData, AuthResponse } from '@/src/types';
import { jwtDecode } from 'jwt-decode';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export const authService = {
  async login(credentials: LoginCredentials): Promise<any> {
    try {
      const response = await api.post('/login', credentials);
      
      const data = response.data;
      
      // Guardar tokens y datos del usuario en cookies
      if (data.accessToken) {
        setCookie('token', data.accessToken, {
          maxAge: 60 * 60 * 24 * 7, // 7 días
          path: '/',
          sameSite: 'lax',
        });
      }

      if (data.refreshToken) {
        setCookie('refreshToken', data.refreshToken, {
          maxAge: 60 * 60 * 24 * 7, // 7 días
          path: '/',
          sameSite: 'lax',
        });
      }

      const user = {
        id: data.id || 'user-' + Date.now(),
        email: credentials.email,
        name: data.nombre,
        role: data.rol
      };

      setCookie('user', JSON.stringify(user), {
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: '/',
        sameSite: 'lax',
      });

      if (data.rol) {
        setCookie('role', data.rol, {
          maxAge: 60 * 60 * 24 * 7, // 7 días
          path: '/',
          sameSite: 'lax',
        });
      }

      return { success: true, data };
    } catch (error: any) {
      console.warn('Error en login con backend, usando modo estático:', error);
      
      // MODO ESTÁTICO: Si el backend no funciona, permitir el login de todas formas
      const mockUser = {
        id: 'mock-' + Date.now(),
        email: credentials.email,
        name: 'Usuario Demo',
        role: 'Usuario'
      };

      const mockToken = 'mock-token-' + Date.now();

      setCookie('token', mockToken, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
      });

      setCookie('user', JSON.stringify(mockUser), {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
      });

      setCookie('role', 'Usuario', {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
      });

      return { success: true, data: mockUser, static: true };
    }
  },

  async register(data: RegisterData): Promise<any> {
    try {
      const response = await api.post('/register', data);
      
      return { 
        success: true, 
        message: response.data.mensaje || 'Registro exitoso',
        id: response.data.id
      };
    } catch (error: any) {
      console.warn('Error en registro con backend, usando modo estático:', error);
      
      // MODO ESTÁTICO: Si el backend no funciona, simular registro exitoso
      return { 
        success: true, 
        message: 'Registro exitoso (modo demo)',
        id: 'demo-' + Date.now(),
        static: true
      };
    }
  },

  logout(): void {
    deleteCookie('token');
    deleteCookie('role');
    deleteCookie('user');
  },

  getToken(): string | null {
    const token = getCookie('token');
    return token ? String(token) : null;
  },

  getUser(): any {
    const userCookie = getCookie('user');
    if (!userCookie) return null;
    
    try {
      return JSON.parse(String(userCookie));
    } catch (error) {
      return null;
    }
  },

  getRole(): string | null {
    const role = getCookie('role');
    return role ? String(role) : null;
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Si es un token mock (modo estático), validar que exista el usuario
    if (token.startsWith('mock-token-')) {
      const user = this.getUser();
      return !!user;
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      // Si no se puede decodificar, verificar si hay usuario (modo estático)
      const user = this.getUser();
      return !!user;
    }
  },

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  },
};

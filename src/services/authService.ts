"use client";

import api from '@/src/lib/api';
import { LoginCredentials, AuthResponse } from '@/src/types';
import { jwtDecode } from 'jwt-decode';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      
      const data = response.data;
      
      // Guardar token y datos del usuario en cookies
      if (data.token) {
        setCookie('token', data.token, {
          maxAge: 60 * 60 * 24 * 7, // 7 días
          path: '/',
          sameSite: 'lax',
        });
      }

      if (data.user) {
        setCookie('user', JSON.stringify(data.user), {
          maxAge: 60 * 60 * 24 * 7, // 7 días
          path: '/',
          sameSite: 'lax',
        });
      }

      // Guardar role si viene en la respuesta
      if (data.user?.role) {
        setCookie('role', data.user.role, {
          maxAge: 60 * 60 * 24 * 7, // 7 días
          path: '/',
          sameSite: 'lax',
        });
      }

      return data;
    } catch (error: any) {
      console.error('Error en login:', error);
      const message = error.response?.data?.message || error.message || 'Error al iniciar sesión';
      throw new Error(message);
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

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
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

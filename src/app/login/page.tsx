"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useAuth } from '@/src/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validación básica
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, ingresa un correo válido');
      setLoading(false);
      return;
    }

    const result = await login({ email, password });
    
    if (!result.success) {
      setError(result.error || 'Error al iniciar sesión');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useAuth } from '@/src/hooks/useAuth';

export default function DashboardPage() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <nav className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button onClick={logout} variant="outline">
            Cerrar Sesión
          </Button>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Bienvenido</CardTitle>
              <CardDescription>Has iniciado sesión correctamente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Email:</span> {user?.email}
                </p>
                {user?.name && (
                  <p className="text-sm">
                    <span className="font-semibold">Nombre:</span> {user.name}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-semibold">ID:</span> {user?.id}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
              <CardDescription>Información general</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Estado:</span>
                  <span className="text-sm font-medium text-green-600">Activo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sesión:</span>
                  <span className="text-sm font-medium">Válida</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Opciones disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Ver Perfil
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

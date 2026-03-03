import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Droplet, Lock, Mail, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface LoginScreenProps {
  onLogin: (email: string, role: 'admin' | 'user', predioId: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [predioId, setPredioId] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [showRecover, setShowRecover] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && predioId) {
      onLogin(email, role, predioId);
    }
  };

  if (showRecover) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 md:p-8 rounded-2xl shadow-xl">
          <div className="text-center mb-6 md:mb-8">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Droplet className="w-8 h-8 md:w-9 md:h-9 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl mb-2">Recuperar Contraseña</h1>
            <p className="text-sm md:text-base text-gray-600">
              Ingresa tu correo electrónico para recuperar tu contraseña
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowRecover(false); }}>
            <div className="space-y-2">
              <Label htmlFor="recover-email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="recover-email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl">
              Enviar Enlace de Recuperación
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setShowRecover(false)}
            >
              Volver al Inicio de Sesión
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 md:p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6 md:mb-8">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Droplet className="w-8 h-8 md:w-9 md:h-9 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl mb-2">AgroRiego IoT</h1>
          <p className="text-sm md:text-base text-gray-600">
            Sistema de Riego Automatizado
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="pl-10 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="predio">ID del Predio</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                id="predio"
                type="text"
                value={predioId}
                onChange={(e) => setPredioId(e.target.value)}
                placeholder="P-001"
                className="pl-10 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol de Usuario</Label>
            <Select value={role} onValueChange={(value) => setRole(value as 'admin' | 'user')}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Usuario (Solo Visualización)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl"
          >
            Iniciar Sesión
          </Button>

          <button
            type="button"
            onClick={() => setShowRecover(true)}
            className="w-full text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Actualización cada 10 minutos • Soporte 24/7
          </p>
        </div>
      </Card>
    </div>
  );
}
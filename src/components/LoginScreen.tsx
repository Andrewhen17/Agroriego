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

  return (
    // CONTENEDOR MAESTRO: Centrado absoluto
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 flex items-center justify-center p-4 sm:p-8">
      
      {/* TARJETA PRINCIPAL (Envoltorio exterior) */}
      <Card className="mx-auto w-full max-w-md sm:p-10 rounded-[2rem] shadow-2xl bg-white backdrop-blur-sm border-none">
        
        {/* Cabecera: Logo y Título */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Droplet className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            AgroRiego IoT
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Gestión inteligente de cultivos
          </p>
        </div>

        {/* ESTA ES LA TARJETA INTERNA: 
            En móvil es invisible, pero en pantallas 'sm' en adelante 
            aparece como un bloque envuelto. 
        */}
        <div className="w-full my-8 p-8 sm:border sm:border-gray-100 sm:rounded-3xl sm:shadow-sm">

          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative border border-gray-200 rounded-xl bg-gray-50/50 px-3">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="pl-10 rounded-xl bg-gray-50/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative border border-gray-200 rounded-xl bg-gray-50/50 px-3">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 rounded-xl bg-gray-50/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="predio">ID del Predio</Label>
              <div className="relative border border-gray-200 rounded-xl bg-gray-50/50 px-3">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="predio"
                  type="text"
                  value={predioId}
                  onChange={(e) => setPredioId(e.target.value)}
                  placeholder="P-001"
                  className="pl-10 rounded-xl bg-gray-50/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol de Usuario</Label>
              <Select value={role} onValueChange={(value) => setRole(value as 'admin' | 'user')}>
                <SelectTrigger className="relative border border-gray-200 rounded-xl bg-gray-50/50 px-3 rounded-xl bg-gray-50/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="user">Usuario (Visualización)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl shadow-md font-bold text-white transition-all hover:scale-[1.01]"
            >
              Iniciar Sesión
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setShowRecover(true)}
            className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Footer de la tarjeta */}
        <div className="mt-12 pb-6 text-center">
          <p className="text-xs text-gray-400">
            Actualización cada 10 min • Soporte 24/7
          </p>
        </div>

      </Card>
    </div>
  );
}
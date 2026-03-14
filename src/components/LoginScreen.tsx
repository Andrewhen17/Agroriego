import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Droplet, Lock, Mail } from 'lucide-react';
import { api } from '../api';

interface LoginScreenProps {
  onLogin: (user: any) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const result = await api.login(email, password);
      if (result.token) {
        localStorage.setItem('token', result.token);
        onLogin(result.user);
      } else {
        setErr(result.error || 'Credenciales incorrectas');
        setLoading(false);
      }
    } catch {
      setErr('No se pudo conectar con el servidor');
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <Card className="mx-auto p-8 rounded-3xl shadow-2xl bg-white border-none">

            {/* Logo y título */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Droplet className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">AgroRiego IoT</h1>
              <p className="text-gray-500 text-sm mt-1">Gestión inteligente de cultivos</p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@agroriego.mx"
                      className="pl-10 rounded-xl"
                      required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
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

              {err && (
                  <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3">
                    {err}
                  </div>
              )}

              <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl font-bold text-white"
              >
                {loading ? 'Verificando...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Cuentas de demo */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs font-semibold text-gray-500 mb-2">Cuentas de demostración:</p>
              {[
                { email: 'admin@agroriego.mx', password: 'admin123', rol: 'Admin Sistema' },
                { email: 'predio@agroriego.mx', password: 'predio123', rol: 'Admin Predio' },
                { email: 'operador@agroriego.mx', password: 'op123', rol: 'Operador' },
              ].map(u => (
                  <div
                      key={u.email}
                      onClick={() => { setEmail(u.email); setPassword(u.password); }}
                      className="flex justify-between text-xs py-1 cursor-pointer hover:text-blue-600"
                  >
                    <span>{u.email}</span>
                    <span className="text-green-600 font-medium">{u.rol}</span>
                  </div>
              ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              Actualización cada 10 min · Soporte 24/7
            </p>
          </Card>
        </div>
      </div>
  );
}
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Droplet, Lock, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../api';

interface LoginScreenProps {
  onLogin: (user: any) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const [showRecover, setShowRecover] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverStatus, setRecoverStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [recoverMessage, setRecoverMessage] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
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

  const handleRecoverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverEmail) return;

    setRecoverStatus('loading');
    setRecoverMessage('');

    try {
      const result = await api.recuperarPassword(recoverEmail);

      if (result.success || result.mensaje) {
        setRecoverStatus('success');
        setRecoverMessage('Se ha enviado un enlace de recuperación a tu correo.');
      } else {
        setRecoverStatus('error');
        setRecoverMessage(result.error || 'No se encontró un usuario con ese correo.');
      }
    } catch (error) {
      setRecoverStatus('error');
      setRecoverMessage('Error de conexión con el servidor.');
    }
  };

  const goToLogin = () => {
    setShowRecover(false);
    setRecoverStatus('idle');
    setRecoverEmail('');
    setRecoverMessage('');
  };

  if (showRecover) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md mx-auto">
            <Card className="w-full p-8 rounded-3xl shadow-2xl bg-white border-none">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Droplet className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Recuperar Contraseña</h1>
                <p className="text-sm text-gray-500 mt-2">
                  Ingresa tu correo para recuperar tu acceso
                </p>
              </div>

              {recoverStatus === 'success' ? (
                  <div className="text-center space-y-6 mt-8">
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl flex flex-col items-center border border-green-200">
                      <CheckCircle className="w-10 h-10 mb-2 text-green-600" />
                      <p className="font-medium">{recoverMessage}</p>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full h-12 rounded-xl text-gray-500 hover:text-gray-800 transition-colors"
                        onClick={goToLogin}
                    >
                      Volver al Inicio de Sesión
                    </Button>
                  </div>
              ) : (
                  <form className="max-w-md mx-auto space-y-4 mt-8" onSubmit={handleRecoverSubmit}>
                    <div className="space-y-3">
                      <Label htmlFor="recover-email">Correo Electrónico</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <Input
                            id="recover-email"
                            type="email"
                            value={recoverEmail}
                            onChange={(e) => setRecoverEmail(e.target.value)}
                            placeholder="usuario@agroriego.mx"
                            className="pl-10 rounded-xl"
                            required
                            disabled={recoverStatus === 'loading'}
                        />
                      </div>
                    </div>

                    {recoverStatus === 'error' && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3 mt-4">
                          <AlertCircle className="w-4 h-4" />
                          {recoverMessage}
                        </div>
                    )}

                    <div className="h-2" />

                    <Button
                        type="submit"
                        disabled={recoverStatus === 'loading'}
                        className="w-full h-12 mt-8 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl font-bold text-white disabled:opacity-70"
                    >
                      {recoverStatus === 'loading' ? 'Enviando...' : 'Enviar Enlace'}
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full h-12 rounded-xl text-gray-500 hover:text-gray-800 transition-colors"
                        onClick={goToLogin}
                        disabled={recoverStatus === 'loading'}
                    >
                      Cancelar
                    </Button>
                  </form>
              )}
            </Card>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md mx-auto">
          <Card className="w-full p-8 rounded-3xl shadow-2xl bg-white border-none">

            {/* Logo y título */}
            <div className="text-center mb-16">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Droplet className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">AgroRiego IoT</h1>
              <p className="text-gray-500 text-sm mt-1">Gestión inteligente de cultivos</p>
            </div>

            <div className="h-6" />

            {/* Formulario */}
            <div className="space-y-9">
              <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto space-y-4 mt-12">
                <div className="space-y-3">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
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

                <div className="space-y-3">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 rounded-xl w-full"
                        required
                    />
                  </div>
                </div>

                <div className="h-2" />
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full max-w-md h-12 mt-8 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl font-bold text-white"
                >
                  {loading ? 'Verificando...' : 'Iniciar Sesión'}
                </Button>

                {err && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3 mt-4">
                      <AlertCircle className="w-4 h-4" />
                      {err}
                    </div>
                )}

                {/* Botón de Olvidaste tu contraseña */}
                <div className="text-center mt-4">
                  <button
                      type="button"
                      onClick={() => setShowRecover(true)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </form>
            </div>

            {/* Cuentas de demo */}
            <div className="mt-20 p-4 bg-gray-100 rounded-xl max-w-md mx-auto">
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
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { UserPlus, Edit, Shield, Eye, Trash2 } from 'lucide-react';
import { api } from '../api';

interface UsuariosScreenProps {
  userRole: 'admin' | 'user';
}

export function UsuariosScreen({ userRole }: UsuariosScreenProps) {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    password_hash: '',
    rol: 'Operador Campo',
  });

  const cargarUsuarios = () => {
    api.getUsuarios().then(data => {
      setUsuarios(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await api.crearUsuario(formData);
      if (result.ok) {
        setShowDialog(false);
        setFormData({ nombre_completo: '', email: '', password_hash: '', rol: 'Operador Campo' });
        cargarUsuarios();
      } else {
        setError(result.error || 'Error al crear usuario');
      }
    } catch {
      setError('No se pudo conectar con el servidor');
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar a ${nombre}?`)) return;
    try {
      await api.eliminarUsuario(id);
      cargarUsuarios();
    } catch {
      alert('Error al eliminar usuario');
    }
  };

  const roleColors: Record<string, string> = {
    'Administrador Sistema': '#8b5cf6',
    'Administrador Predio': '#3b82f6',
    'Operador Campo': '#10b981',
  };

  const roleIcons: Record<string, string> = {
    'Administrador Sistema': '🛡️',
    'Administrador Predio': '🏡',
    'Operador Campo': '👤',
  };

  if (userRole !== 'admin') {
    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 rounded-2xl shadow-sm text-center">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl mb-2">Acceso Restringido</h2>
              <p className="text-gray-600">Solo los administradores pueden gestionar usuarios</p>
            </Card>
          </div>
        </div>
    );
  }

  if (loading) {
    return (
        <div className="p-8 flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Cargando usuarios...</div>
        </div>
    );
  }

  return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl mb-2">Gestión de Usuarios</h1>
              <p className="text-sm text-gray-600">Usuarios registrados en el sistema</p>
            </div>
            <Button
                onClick={() => { setShowDialog(true); setError(''); }}
                className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl"
            >
              <UserPlus className="w-5 h-5 mr-2" /> Nuevo Usuario
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Usuarios', value: usuarios.length, color: 'text-gray-700' },
              { label: 'Administradores', value: usuarios.filter(u => u.rol !== 'Operador Campo').length, color: 'text-purple-700' },
              { label: 'Operadores', value: usuarios.filter(u => u.rol === 'Operador Campo').length, color: 'text-green-700' },
            ].map(s => (
                <Card key={s.label} className="p-4 rounded-2xl shadow-sm text-center">
                  <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                </Card>
            ))}
          </div>

          {/* Lista */}
          <div className="space-y-3">
            {usuarios.map(u => (
                <Card key={u.id_usuario} className="p-4 md:p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background: roleColors[u.rol] + '22' }}
                    >
                      {roleIcons[u.rol] || '👤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-gray-800">{u.nombre_completo}</span>
                        <span
                            className="text-xs px-2 py-0.5 rounded-md font-medium"
                            style={{ background: roleColors[u.rol] + '22', color: roleColors[u.rol] }}
                        >
                      {u.rol}
                    </span>
                      </div>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                    <Button
                        onClick={() => handleDelete(u.id_usuario, u.nombre_completo)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
            ))}
          </div>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                    {error}
                  </div>
              )}
              <div className="space-y-2">
                <Label>Nombre Completo</Label>
                <Input
                    value={formData.nombre_completo}
                    onChange={e => setFormData({ ...formData, nombre_completo: e.target.value })}
                    placeholder="Juan Pérez"
                    className="rounded-xl"
                    required
                />
              </div>
              <div className="space-y-2">
                <Label>Correo Electrónico</Label>
                <Input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="usuario@agroriego.mx"
                    className="rounded-xl"
                    required
                />
              </div>
              <div className="space-y-2">
                <Label>Contraseña</Label>
                <Input
                    type="password"
                    value={formData.password_hash}
                    onChange={e => setFormData({ ...formData, password_hash: e.target.value })}
                    placeholder="••••••••"
                    className="rounded-xl"
                    required
                />
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select
                    value={formData.rol}
                    onValueChange={v => setFormData({ ...formData, rol: v })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador Sistema">Administrador Sistema</SelectItem>
                    <SelectItem value="Administrador Predio">Administrador Predio</SelectItem>
                    <SelectItem value="Operador Campo">Operador Campo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1 rounded-xl">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl">
                  Crear Usuario
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  );
}
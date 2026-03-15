import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { UserPlus, Shield, Eye, Trash2, AlertCircle, Home } from 'lucide-react';
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
    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario ${nombre}?`)) return;
    try {
      await api.eliminarUsuario(id);
      cargarUsuarios();
    } catch {
      alert('Error al eliminar usuario');
    }
  };

  const getRoleConfig = (rol: string) => {
    switch (rol) {
      case 'Administrador Sistema':
        return {
          icon: Shield,
          colorClass: 'text-purple-600',
          bgClass: 'bg-purple-100',
          badgeClass: 'bg-purple-100 text-purple-700',
          desc: 'Control total del sistema'
        };
      case 'Administrador Predio':
        return {
          icon: Home,
          colorClass: 'text-blue-600',
          bgClass: 'bg-blue-100',
          badgeClass: 'bg-blue-100 text-blue-700',
          desc: 'Gestiona predios asignados'
        };
      case 'Operador Campo':
      default:
        return {
          icon: Eye,
          colorClass: 'text-green-600',
          bgClass: 'bg-green-100',
          badgeClass: 'bg-green-100 text-green-700',
          desc: 'Visualización y tareas de campo'
        };
    }
  };

  if (userRole !== 'admin') {
    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 md:p-8 rounded-2xl shadow-sm text-center">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl mb-2">Acceso Restringido</h2>
              <p className="text-gray-600">
                Solo los administradores pueden gestionar usuarios y roles
              </p>
            </Card>
          </div>
        </div>
    );
  }

  if (loading) {
    return (
        <div className="p-8 flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-gray-500 animate-pulse">Cargando usuarios...</div>
        </div>
    );
  }

  const totalAdmins = usuarios.filter(u => u.rol.includes('Administrador')).length;
  const totalOperadores = usuarios.filter(u => u.rol === 'Operador Campo').length;

  return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl mb-2">Gestión de Usuarios y Roles</h1>
              <p className="text-sm md:text-base text-gray-600">Administra los usuarios del sistema</p>
            </div>
            <Button
                onClick={() => { setShowDialog(true); setError(''); }}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl w-full sm:w-auto"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Crear Usuario
            </Button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <Card className="p-6 rounded-2xl shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Total de Usuarios</p>
              <p className="text-3xl">{usuarios.length}</p>
            </Card>
            <Card className="p-6 rounded-2xl shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Administradores</p>
              <p className="text-3xl text-purple-700">{totalAdmins}</p>
            </Card>
            <Card className="p-6 rounded-2xl shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Operadores</p>
              <p className="text-3xl text-green-700">{totalOperadores}</p>
            </Card>
          </div>

          {/* Lista de Usuarios */}
          <div className="space-y-4">
            {usuarios.map((usuario) => {
              const config = getRoleConfig(usuario.rol);
              const RoleIcon = config.icon;

              return (
                  <Card key={usuario.id_usuario} className="p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0 w-full">
                        {/* Icono de Avatar */}
                        <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${config.bgClass}`}>
                          <RoleIcon className={`w-6 h-6 ${config.colorClass}`} />
                        </div>

                        {/* Información del Usuario */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                            <h3 className="text-base md:text-lg font-semibold text-gray-800">{usuario.nombre_completo}</h3>
                            <Badge className={config.badgeClass}>
                              {usuario.rol}
                            </Badge>
                          </div>

                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="break-words">
                              <span className="font-medium">Email:</span> {usuario.email}
                            </p>
                            <p>
                              <span className="font-medium">ID:</span> {usuario.id_usuario}
                            </p>
                          </div>

                          <div className="mt-3">
                            <p className="text-xs text-gray-500">
                              {config.desc}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Botón de Eliminar adaptado al diseño */}
                      <Button
                          onClick={() => handleDelete(usuario.id_usuario, usuario.nombre_completo)}
                          variant="outline"
                          className="rounded-xl w-full lg:w-auto flex-shrink-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </Card>
              );
            })}

            {usuarios.length === 0 && (
                <Card className="p-8 text-center text-gray-500 rounded-2xl shadow-sm">
                  No hay usuarios registrados en el sistema.
                </Card>
            )}
          </div>
        </div>

        {/* Modal de Creación */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                      id="nombre"
                      value={formData.nombre_completo}
                      onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                      placeholder="Ej: Juan Pérez"
                      className="rounded-xl"
                      required
                  />
                </div>

                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="usuario@agroriego.mx"
                      className="rounded-xl"
                      required
                  />
                </div>

                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label htmlFor="password">Contraseña temporal</Label>
                  <Input
                      id="password"
                      type="password"
                      value={formData.password_hash}
                      onChange={(e) => setFormData({ ...formData, password_hash: e.target.value })}
                      placeholder="••••••••"
                      className="rounded-xl"
                      required
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="rol">Rol de Usuario</Label>
                  <Select
                      value={formData.rol}
                      onValueChange={(value) => setFormData({ ...formData, rol: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrador Sistema">
                        Administrador Sistema (Control Total)
                      </SelectItem>
                      <SelectItem value="Administrador Predio">
                        Administrador Predio (Gestión de zonas)
                      </SelectItem>
                      <SelectItem value="Operador Campo">
                        Operador Campo (Solo Visualización)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                    className="flex-1 rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl"
                >
                  Crear Usuario
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  );
}
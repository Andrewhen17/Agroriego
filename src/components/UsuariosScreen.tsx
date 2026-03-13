import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { UserPlus, Edit, Shield, Eye, Trash2 } from 'lucide-react';

interface UsuariosScreenProps {
  userRole: 'admin' | 'user';
}

export function UsuariosScreen({ userRole }: UsuariosScreenProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [usuarios, setUsuarios] = useState([
    {
      id: 'U-001',
      nombre: 'Juan Perez',
      email: 'juan.perez@agroriego.com',
      rol: 'admin' as const,
      prediosAsignados: ['P-001', 'P-002', 'P-003', 'P-004'],
      ultimoAcceso: '2024-12-04T10:30:00',
      activo: true,
    },
    {
      id: 'U-002',
      nombre: 'Maria Gonzalez',
      email: 'maria.gonzalez@agroriego.com',
      rol: 'user' as const,
      prediosAsignados: ['P-001', 'P-002'],
      ultimoAcceso: '2024-12-04T09:15:00',
      activo: true,
    },
    {
      id: 'U-003',
      nombre: 'Carlos Ramirez',
      email: 'carlos.ramirez@agroriego.com',
      rol: 'user' as const,
      prediosAsignados: ['P-003'],
      ultimoAcceso: '2024-12-03T16:45:00',
      activo: true,
    },
    {
      id: 'U-004',
      nombre: 'Ana Lopez',
      email: 'ana.lopez@agroriego.com',
      rol: 'admin' as const,
      prediosAsignados: ['P-001', 'P-002', 'P-003', 'P-004'],
      ultimoAcceso: '2024-12-04T08:20:00',
      activo: true,
    },
    {
      id: 'U-005',
      nombre: 'Luis Martinez',
      email: 'luis.martinez@agroriego.com',
      rol: 'user' as const,
      prediosAsignados: ['P-004'],
      ultimoAcceso: '2024-12-02T14:30:00',
      activo: false,
    },
  ]);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: 'user' as 'admin' | 'user',
    prediosAsignados: [] as string[],
  });

  const prediosDisponibles = [
    { id: 'P-001', nombre: 'Predio Norte' },
    { id: 'P-002', nombre: 'Predio Sur' },
    { id: 'P-003', nombre: 'Predio Este' },
    { id: 'P-004', nombre: 'Predio Oeste' },
  ];

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      nombre: '',
      email: '',
      rol: 'user',
      prediosAsignados: [],
    });
    setShowDialog(true);
  };

  const handleEdit = (usuario: any) => {
    setEditingUser(usuario);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      prediosAsignados: usuario.prediosAsignados,
    });
    setShowDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se guardarían los datos
    alert(editingUser ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
    setShowDialog(false);
  };

  const handleDelete = (usuarioId: string, usuarioNombre: string) => {
    if (userRole !== 'admin') return;

    const confirmado = window.confirm(`Deseas eliminar a ${usuarioNombre}?`);
    if (!confirmado) return;

    setUsuarios((prevUsuarios) => prevUsuarios.filter((u) => u.id !== usuarioId));
    alert('Usuario eliminado exitosamente');
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-2">Gestión de Usuarios y Roles</h1>
            <p className="text-sm md:text-base text-gray-600">Administra los usuarios del sistema</p>
          </div>
          <Button
            onClick={handleCreate}
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
            <p className="text-3xl">{usuarios.filter(u => u.rol === 'admin').length}</p>
          </Card>
          <Card className="p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Usuarios Activos</p>
            <p className="text-3xl">{usuarios.filter(u => u.activo).length}</p>
          </Card>
        </div>

        {/* Lista de Usuarios */}
        <div className="space-y-4">
          {usuarios.map((usuario) => (
            <Card key={usuario.id} className="p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0 w-full">
                  <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${
                    usuario.rol === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    {usuario.rol === 'admin' ? (
                      <Shield className="w-6 h-6 text-purple-600" />
                    ) : (
                      <Eye className="w-6 h-6 text-blue-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                      <h3 className="text-base md:text-lg">{usuario.nombre}</h3>
                      <Badge className={
                        usuario.rol === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }>
                        {usuario.rol === 'admin' ? 'Administrador' : 'Usuario'}
                      </Badge>
                      {!usuario.activo && (
                        <Badge className="bg-gray-100 text-gray-700">
                          Inactivo
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="break-words">
                        <span className="font-medium">Email:</span> {usuario.email}
                      </p>
                      <p>
                        <span className="font-medium">ID:</span> {usuario.id}
                      </p>
                      <p className="break-words">
                        <span className="font-medium">Predios Asignados:</span>{' '}
                        {usuario.prediosAsignados.map((predioId) => {
                          const predio = prediosDisponibles.find(p => p.id === predioId);
                          return predio?.nombre || predioId;
                        }).join(', ')}
                      </p>
                      <p className="break-words">
                        <span className="font-medium">Último Acceso:</span> {formatFecha(usuario.ultimoAcceso)}
                      </p>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-gray-500">
                        {usuario.rol === 'admin' 
                          ? 'Puede editar y ver todo el sistema' 
                          : 'Solo puede visualizar datos'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex w-full lg:w-auto gap-2 flex-shrink-0">
                  <Button
                    onClick={() => handleEdit(usuario)}
                    variant="outline"
                    className="flex-1 lg:flex-none rounded-xl w-full lg:w-auto"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(usuario.id, usuario.nombre)}
                    variant="destructive"
                    className="flex-1 lg:flex-none rounded-xl w-full lg:w-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usuario@agroriego.com"
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="rol">Rol de Usuario</Label>
                <Select 
                  value={formData.rol} 
                  onValueChange={(value) => setFormData({ ...formData, rol: value as 'admin' | 'user' })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      Administrador (Editar y Ver Todo)
                    </SelectItem>
                    <SelectItem value="user">
                      Usuario (Solo Visualizar)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Predios Asignados</Label>
                <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-xl">
                  {prediosDisponibles.map((predio) => (
                    <label key={predio.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.prediosAsignados.includes(predio.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              prediosAsignados: [...formData.prediosAsignados, predio.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              prediosAsignados: formData.prediosAsignados.filter(id => id !== predio.id)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{predio.nombre}</span>
                    </label>
                  ))}
                </div>
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
                {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
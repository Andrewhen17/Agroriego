import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { MapPin, Plus, Edit, Droplet, Thermometer } from 'lucide-react';
import { api } from '../api';

interface PrediosScreenProps {
  userRole: 'admin' | 'user';
  onNavigate: (view: string, data?: any) => void;
}

export function PrediosScreen({ userRole, onNavigate }: PrediosScreenProps) {
  const [predios, setPredios] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPredio, setEditingPredio] = useState<any>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    latitud: '',
    longitud: '',
  });

  const cargarDatos = () => {
    Promise.all([api.getPredios(), api.getAreas()])
        .then(([p, a]) => {
          setPredios(Array.isArray(p) ? p : []);
          setAreas(Array.isArray(a) ? a : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCreate = () => {
    setEditingPredio(null);
    setFormData({ nombre: '', latitud: '', longitud: '' });
    setError('');
    setShowDialog(true);
  };

  const handleEdit = (predio: any) => {
    setEditingPredio(predio);
    setFormData({
      nombre: predio.nombre,
      latitud: predio.latitud?.toString() || '',
      longitud: predio.longitud?.toString() || '',
    });
    setError('');
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await api.crearPredio({
        nombre: formData.nombre,
        latitud: parseFloat(formData.latitud),
        longitud: parseFloat(formData.longitud),
        id_usuario: 2,
      });
      if (result.ok) {
        setShowDialog(false);
        cargarDatos();
      } else {
        setError(result.error || 'Error al guardar');
      }
    } catch {
      setError('No se pudo conectar con el servidor');
    }
  };

  const getAreasDePredio = (id_predio: number) =>
      areas.filter(a => a.id_predio === id_predio);

  if (loading) {
    return (
        <div className="p-8 flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Cargando predios...</div>
        </div>
    );
  }

  return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl mb-2">Gestión de Predios</h1>
              <p className="text-sm text-gray-600">Administra los predios registrados</p>
            </div>
            {userRole === 'admin' && (
                <Button
                    onClick={handleCreate}
                    className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl"
                >
                  <Plus className="w-5 h-5 mr-2" /> Crear Predio
                </Button>
            )}
          </div>

          {predios.length === 0 ? (
              <Card className="p-12 rounded-2xl text-center">
                <p className="text-gray-500">No hay predios registrados</p>
              </Card>
          ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {predios.map(predio => {
                  const areasPredio = getAreasDePredio(predio.id_predio);
                  const activas = areasPredio.filter(a => a.estatus_activo).length;

                  return (
                      <Card key={predio.id_predio} className="p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4 gap-2">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-3 h-3 flex-shrink-0 rounded-full bg-green-500 mt-2" />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold mb-1">{predio.nombre}</h3>
                              <p className="text-xs text-gray-600 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {predio.latitud?.toFixed(4)}, {predio.longitud?.toFixed(4)}
                              </p>
                            </div>
                          </div>
                          {userRole === 'admin' && (
                              <Button onClick={() => handleEdit(predio)} variant="ghost" size="sm" className="rounded-xl">
                                <Edit className="w-4 h-4" />
                              </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="p-3 bg-gray-50 rounded-xl text-center">
                            <p className="text-xs text-gray-500">Áreas</p>
                            <p className="text-xl font-bold text-gray-700">{areasPredio.length}</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-xl text-center">
                            <p className="text-xs text-gray-500">Activas</p>
                            <p className="text-xl font-bold text-green-700">{activas}</p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-xl text-center">
                            <p className="text-xs text-gray-500">ID</p>
                            <p className="text-xl font-bold text-blue-700">#{predio.id_predio}</p>
                          </div>
                        </div>

                        <div className="space-y-1 mb-4 text-xs text-gray-500">
                          {areasPredio.slice(0, 3).map(a => (
                              <div key={a.id_area} className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${a.estatus_activo ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <span>{a.nombre} — {a.tipo_cultivo}</span>
                              </div>
                          ))}
                          {areasPredio.length > 3 && (
                              <p className="text-gray-400">+{areasPredio.length - 3} más...</p>
                          )}
                        </div>

                        <Button
                            onClick={() => onNavigate('areas', predio.id_predio)}
                            variant="outline"
                            className="w-full rounded-xl"
                        >
                          Ver Áreas de Riego
                        </Button>
                      </Card>
                  );
                })}
              </div>
          )}
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>{editingPredio ? 'Editar Predio' : 'Crear Nuevo Predio'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                    {error}
                  </div>
              )}
              <div className="space-y-2">
                <Label>Nombre del Predio</Label>
                <Input
                    value={formData.nombre}
                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Predio El Mezquital"
                    className="rounded-xl"
                    required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Latitud</Label>
                  <Input
                      type="number"
                      step="any"
                      value={formData.latitud}
                      onChange={e => setFormData({ ...formData, latitud: e.target.value })}
                      placeholder="28.6353"
                      className="rounded-xl"
                      required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Longitud</Label>
                  <Input
                      type="number"
                      step="any"
                      value={formData.longitud}
                      onChange={e => setFormData({ ...formData, longitud: e.target.value })}
                      placeholder="-106.0889"
                      className="rounded-xl"
                      required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1 rounded-xl">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl">
                  {editingPredio ? 'Guardar Cambios' : 'Crear Predio'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  );
}
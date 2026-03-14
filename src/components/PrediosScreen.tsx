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
  const [form, setForm] = useState({ nombre: '', latitud: '', longitud: '' });

  const cargar = () => {
    Promise.all([api.getPredios(), api.getAreas()])
        .then(([p, a]) => {
          setPredios(Array.isArray(p) ? p : []);
          setAreas(Array.isArray(a) ? a : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const openCreate = () => {
    setEditingPredio(null);
    setForm({ nombre: '', latitud: '', longitud: '' });
    setError('');
    setShowDialog(true);
  };

  const openEdit = (p: any) => {
    setEditingPredio(p);
    setForm({ nombre: p.nombre, latitud: String(p.latitud ?? ''), longitud: String(p.longitud ?? '') });
    setError('');
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await api.crearPredio({
        nombre: form.nombre,
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud),
        id_usuario: 2,
      });
      if (result.ok) {
        setShowDialog(false);
        cargar();
      } else {
        setError(result.error || 'Error al guardar');
      }
    } catch {
      setError('No se pudo conectar con el servidor');
    }
  };

  const areasDe = (id: number) => areas.filter(a => a.id_predio === id);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <p className="text-gray-400">Cargando predios...</p>
        </div>
    );
  }

  return (
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl text-gray-900">Gestión de Predios</h1>
              <p className="text-gray-500 mt-1">Administra los predios registrados en el sistema</p>
            </div>
            {userRole === 'admin' && (
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white self-start transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(to right, #155dfc, #00a63e)' }}
                >
                  <Plus className="w-5 h-5" /> Crear Predio
                </button>
            )}
          </div>

          {predios.length === 0 ? (
              <div
                  className="bg-white rounded-2xl p-12 text-center"
                  style={{ border: '1px solid rgba(0,0,0,0.1)' }}
              >
                <p className="text-gray-400">No hay predios registrados</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {predios.map(predio => {
                  const ap = areasDe(predio.id_predio);
                  const activas = ap.filter(a => a.estatus_activo).length;
                  return (
                      <div
                          key={predio.id_predio}
                          className="bg-white rounded-2xl p-6 transition-shadow hover:shadow-md"
                          style={{ border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <span className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#00c950' }} />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{predio.nombre}</h3>
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                {Number(predio.latitud).toFixed(4)}, {Number(predio.longitud).toFixed(4)}
                              </p>
                            </div>
                          </div>
                          {userRole === 'admin' && (
                              <button
                                  onClick={() => openEdit(predio)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <Edit className="w-4 h-4 text-gray-500" />
                              </button>
                          )}
                        </div>

                        {/* Counters */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {[
                            { label: 'Áreas', value: ap.length, color: '#374151', bg: '#f9fafb' },
                            { label: 'Activas', value: activas, color: '#00c950', bg: '#f0fdf4' },
                            { label: 'ID', value: `#${predio.id_predio}`, color: '#2b7fff', bg: '#eff6ff' },
                          ].map(c => (
                              <div key={c.label} className="p-3 rounded-xl text-center" style={{ background: c.bg }}>
                                <p className="text-xs text-gray-500">{c.label}</p>
                                <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
                              </div>
                          ))}
                        </div>

                        {/* Mini lista de áreas */}
                        {ap.slice(0, 3).map(a => (
                            <div key={a.id_area} className="flex items-center gap-2 text-xs text-gray-500 py-0.5">
                      <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: a.estatus_activo ? '#00c950' : '#d1d5db' }}
                      />
                              {a.nombre} — {a.tipo_cultivo}
                            </div>
                        ))}
                        {ap.length > 3 && (
                            <p className="text-xs text-gray-400 mt-1">+{ap.length - 3} más...</p>
                        )}

                        <button
                            onClick={() => onNavigate('areas', predio.id_predio)}
                            className="w-full mt-4 py-2 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          Ver Áreas de Riego
                        </button>
                      </div>
                  );
                })}
              </div>
          )}
        </div>

        {/* Dialog crear/editar */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>{editingPredio ? 'Editar Predio' : 'Crear Nuevo Predio'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>
              )}
              <div className="space-y-1.5">
                <Label>Nombre del Predio</Label>
                <Input
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Ej: Predio El Mezquital"
                    className="rounded-xl"
                    required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Latitud</Label>
                  <Input
                      type="number" step="any"
                      value={form.latitud}
                      onChange={e => setForm({ ...form, latitud: e.target.value })}
                      placeholder="28.6353"
                      className="rounded-xl"
                      required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Longitud</Label>
                  <Input
                      type="number" step="any"
                      value={form.longitud}
                      onChange={e => setForm({ ...form, longitud: e.target.value })}
                      placeholder="-106.0889"
                      className="rounded-xl"
                      required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => setShowDialog(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(to right, #155dfc, #00a63e)' }}
                >
                  {editingPredio ? 'Guardar Cambios' : 'Crear Predio'}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  );
}
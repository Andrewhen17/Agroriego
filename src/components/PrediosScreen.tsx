import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { MapPin, Plus, Edit, Droplet, Thermometer } from 'lucide-react';

interface PrediosScreenProps {
  userRole: 'admin' | 'user';
  onNavigate: (view: string, data?: any) => void;
}

export function PrediosScreen({ userRole, onNavigate }: PrediosScreenProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingPredio, setEditingPredio] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    gpsLat: '',
    gpsLng: '',
    numAreas: '',
    nodoClimatico: '',
  });

  const predios = [
    {
      id: 'P-001',
      nombre: 'Predio Norte',
      ubicacion: 'Zona Norte, Parcela 1',
      gps: { lat: 19.4326, lng: -99.1332 },
      numAreas: 5,
      nodoClimatico: 'NC-001',
      humedad: 25,
      temperatura: 27,
      status: 'good'
    },
    {
      id: 'P-002',
      nombre: 'Predio Sur',
      ubicacion: 'Zona Sur, Parcela 2',
      gps: { lat: 19.4200, lng: -99.1400 },
      numAreas: 8,
      nodoClimatico: 'NC-002',
      humedad: 18,
      temperatura: 29,
      status: 'warning'
    },
    {
      id: 'P-003',
      nombre: 'Predio Este',
      ubicacion: 'Zona Este, Parcela 3',
      gps: { lat: 19.4500, lng: -99.1200 },
      numAreas: 6,
      nodoClimatico: 'NC-003',
      humedad: 28,
      temperatura: 26,
      status: 'good'
    },
    {
      id: 'P-004',
      nombre: 'Predio Oeste',
      ubicacion: 'Zona Oeste, Parcela 4',
      gps: { lat: 19.4100, lng: -99.1500 },
      numAreas: 4,
      nodoClimatico: 'NC-004',
      humedad: 42,
      temperatura: 25,
      status: 'excess'
    },
  ];

  const handleEdit = (predio: any) => {
    setEditingPredio(predio);
    setFormData({
      nombre: predio.nombre,
      ubicacion: predio.ubicacion,
      gpsLat: predio.gps.lat.toString(),
      gpsLng: predio.gps.lng.toString(),
      numAreas: predio.numAreas.toString(),
      nodoClimatico: predio.nodoClimatico,
    });
    setShowDialog(true);
  };

  const handleCreate = () => {
    setEditingPredio(null);
    setFormData({
      nombre: '',
      ubicacion: '',
      gpsLat: '',
      gpsLng: '',
      numAreas: '',
      nodoClimatico: '',
    });
    setShowDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se guardarían los datos
    setShowDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'excess': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-2">Gestión de Predios</h1>
            <p className="text-sm md:text-base text-gray-600">Administra los predios y sus configuraciones</p>
          </div>
          {userRole === 'admin' && (
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear Predio
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {predios.map((predio) => (
            <Card key={predio.id} className="p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4 gap-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-3 h-3 flex-shrink-0 rounded-full ${getStatusColor(predio.status)} mt-2`} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg lg:text-xl mb-1">{predio.nombre}</h3>
                    <p className="text-xs md:text-sm text-gray-600 flex items-start gap-1 break-words">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{predio.ubicacion}</span>
                    </p>
                  </div>
                </div>
                {userRole === 'admin' && (
                  <Button
                    onClick={() => handleEdit(predio)}
                    variant="ghost"
                    size="sm"
                    className="rounded-xl flex-shrink-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Humedad Promedio</p>
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-blue-600" />
                    <span className="text-base md:text-lg">{predio.humedad}%</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Temperatura</p>
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-orange-600" />
                    <span className="text-base md:text-lg">{predio.temperatura}°C</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">ID del Predio</span>
                  <span>{predio.id}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Áreas de Riego</span>
                  <span>{predio.numAreas} áreas</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Nodo Climático</span>
                  <span>{predio.nodoClimatico}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">GPS</span>
                  <span className="text-xs">{predio.gps.lat}, {predio.gps.lng}</span>
                </div>
              </div>

              <Button
                onClick={() => onNavigate('areas', predio)}
                variant="outline"
                className="w-full rounded-xl"
              >
                Ver Áreas de Riego
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPredio ? 'Editar Predio' : 'Crear Nuevo Predio'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nombre">Nombre del Predio</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Predio Norte"
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input
                  id="ubicacion"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  placeholder="Ej: Zona Norte, Parcela 1"
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gpsLat">GPS Latitud</Label>
                <Input
                  id="gpsLat"
                  type="number"
                  step="any"
                  value={formData.gpsLat}
                  onChange={(e) => setFormData({ ...formData, gpsLat: e.target.value })}
                  placeholder="19.4326"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gpsLng">GPS Longitud</Label>
                <Input
                  id="gpsLng"
                  type="number"
                  step="any"
                  value={formData.gpsLng}
                  onChange={(e) => setFormData({ ...formData, gpsLng: e.target.value })}
                  placeholder="-99.1332"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numAreas">Número de Áreas</Label>
                <Input
                  id="numAreas"
                  type="number"
                  value={formData.numAreas}
                  onChange={(e) => setFormData({ ...formData, numAreas: e.target.value })}
                  placeholder="5"
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nodoClimatico">Nodo Climático</Label>
                <Input
                  id="nodoClimatico"
                  value={formData.nodoClimatico}
                  onChange={(e) => setFormData({ ...formData, nodoClimatico: e.target.value })}
                  placeholder="NC-001"
                  className="rounded-xl"
                  required
                />
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
                {editingPredio ? 'Guardar Cambios' : 'Crear Predio'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
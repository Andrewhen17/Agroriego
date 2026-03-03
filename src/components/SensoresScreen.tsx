import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { 
  Gauge, 
  Droplet, 
  Thermometer, 
  Wind, 
  Sun, 
  TrendingDown, 
  Waves,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  WifiOff
} from 'lucide-react';

export function SensoresScreen() {
  const [filtroPredio, setFiltroPredio] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const sensores = [
    {
      id: 'S-001-H',
      tipo: 'Humedad del Suelo',
      area: 'Zona Tomate A1',
      predio: 'Predio Norte',
      predioId: 'P-001',
      valor: 25,
      unidad: '%',
      estado: 'normal',
      ultimaLectura: '2024-12-04 10:30',
      icon: Droplet,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'S-002-H',
      tipo: 'Humedad del Suelo',
      area: 'Zona Maíz B2',
      predio: 'Predio Sur',
      predioId: 'P-002',
      valor: 18,
      unidad: '%',
      estado: 'alerta',
      ultimaLectura: '2024-12-04 10:30',
      icon: Droplet,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      id: 'S-001-T',
      tipo: 'Temperatura',
      area: 'Zona Tomate A1',
      predio: 'Predio Norte',
      predioId: 'P-001',
      valor: 27,
      unidad: '°C',
      estado: 'normal',
      ultimaLectura: '2024-12-04 10:30',
      icon: Thermometer,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      id: 'S-003-H',
      tipo: 'Humedad del Suelo',
      area: 'Zona Pepino D3',
      predio: 'Predio Oeste',
      predioId: 'P-004',
      valor: null,
      unidad: '%',
      estado: 'falla',
      ultimaLectura: '2024-12-04 09:15',
      icon: Droplet,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      id: 'S-001-HR',
      tipo: 'Humedad Relativa',
      area: 'Zona Tomate A1',
      predio: 'Predio Norte',
      predioId: 'P-001',
      valor: 65,
      unidad: '%',
      estado: 'normal',
      ultimaLectura: '2024-12-04 10:30',
      icon: Wind,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'S-001-R',
      tipo: 'Radiación Solar',
      area: 'Zona Tomate A1',
      predio: 'Predio Norte',
      predioId: 'P-001',
      valor: 680,
      unidad: 'W/m²',
      estado: 'normal',
      ultimaLectura: '2024-12-04 10:30',
      icon: Sun,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      id: 'S-001-ET',
      tipo: 'Evapotranspiración',
      area: 'Zona Tomate A1',
      predio: 'Predio Norte',
      predioId: 'P-001',
      valor: 4.5,
      unidad: 'mm/día',
      estado: 'normal',
      ultimaLectura: '2024-12-04 10:30',
      icon: TrendingDown,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'S-001-C',
      tipo: 'Consumo de Agua',
      area: 'Zona Tomate A1',
      predio: 'Predio Norte',
      predioId: 'P-001',
      valor: 0.12,
      unidad: 'm³/10min',
      estado: 'normal',
      ultimaLectura: '2024-12-04 10:30',
      icon: Waves,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      id: 'S-001-CD',
      tipo: 'Conductividad',
      area: 'Zona Tomate A1',
      predio: 'Predio Norte',
      predioId: 'P-001',
      valor: 1.5,
      unidad: '?',
      estado: 'normal',
      ultimaLectura: '2024-12-04 10:30',
      icon: HelpCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const filteredSensores = sensores.filter(sensor => {
    if (filtroPredio !== 'todos' && sensor.predioId !== filtroPredio) return false;
    if (filtroEstado !== 'todos' && sensor.estado !== filtroEstado) return false;
    return true;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'normal':
        return { icon: CheckCircle, text: 'Normal', class: 'bg-green-100 text-green-700' };
      case 'alerta':
        return { icon: AlertTriangle, text: 'Alerta', class: 'bg-yellow-100 text-yellow-700' };
      case 'falla':
        return { icon: WifiOff, text: 'Falla', class: 'bg-red-100 text-red-700' };
      default:
        return { icon: CheckCircle, text: 'Normal', class: 'bg-gray-100 text-gray-700' };
    }
  };

  const sensoresNormales = sensores.filter(s => s.estado === 'normal').length;
  const sensoresAlerta = sensores.filter(s => s.estado === 'alerta').length;
  const sensoresFalla = sensores.filter(s => s.estado === 'falla').length;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Sensores IoT</h1>
          <p className="text-sm md:text-base text-gray-600">Monitoreo en tiempo real de todos los sensores</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Gauge className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sensores</p>
                <p className="text-3xl">{sensores.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Normales</p>
                <p className="text-3xl">{sensoresNormales}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En Alerta</p>
                <p className="text-3xl">{sensoresAlerta}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <WifiOff className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Con Fallas</p>
                <p className="text-3xl">{sensoresFalla}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Predio</label>
              <Select value={filtroPredio} onValueChange={setFiltroPredio}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los Predios</SelectItem>
                  <SelectItem value="P-001">Predio Norte</SelectItem>
                  <SelectItem value="P-002">Predio Sur</SelectItem>
                  <SelectItem value="P-003">Predio Este</SelectItem>
                  <SelectItem value="P-004">Predio Oeste</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Estado</label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los Estados</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="alerta">En Alerta</SelectItem>
                  <SelectItem value="falla">Con Falla</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Lista de Sensores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSensores.map((sensor) => {
            const Icon = sensor.icon;
            const badge = getEstadoBadge(sensor.estado);
            const BadgeIcon = badge.icon;

            return (
              <Card key={sensor.id} className="p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${sensor.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${sensor.color}`} />
                  </div>
                  <Badge className={badge.class}>
                    <BadgeIcon className="w-3 h-3 mr-1" />
                    {badge.text}
                  </Badge>
                </div>

                <h3 className="font-medium mb-1">{sensor.tipo}</h3>
                <p className="text-sm text-gray-600 mb-4">{sensor.area}</p>

                <div className="mb-4">
                  {sensor.valor !== null ? (
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl ${sensor.color}`}>
                        {sensor.valor}
                      </span>
                      <span className="text-lg text-gray-600">
                        {sensor.unidad}
                      </span>
                    </div>
                  ) : (
                    <div className="text-2xl text-gray-400">
                      Sin lectura
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-xs text-gray-500 border-t pt-3">
                  <p><span className="font-medium">Predio:</span> {sensor.predio}</p>
                  <p><span className="font-medium">ID:</span> {sensor.id}</p>
                  <p><span className="font-medium">Última lectura:</span> {sensor.ultimaLectura}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredSensores.length === 0 && (
          <Card className="p-12 rounded-2xl shadow-sm text-center">
            <Gauge className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl mb-2">No se encontraron sensores</h3>
            <p className="text-gray-600">
              No hay sensores que coincidan con los filtros seleccionados
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
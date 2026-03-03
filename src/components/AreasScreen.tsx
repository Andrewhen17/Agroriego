import { Card } from './ui/card';
import { Button } from './ui/button';
import { Droplet, Calendar, Sprout, Settings } from 'lucide-react';

interface AreasScreenProps {
  userRole: 'admin' | 'user';
  onNavigate: (view: string, data?: any) => void;
}

export function AreasScreen({ userRole, onNavigate }: AreasScreenProps) {
  const areas = [
    {
      id: 'A-001',
      nombre: 'Zona Tomate A1',
      predio: 'Predio Norte',
      predioId: 'P-001',
      cultivo: 'Tomate',
      humedad: 25,
      temperatura: 27,
      status: 'good',
      fechaInicio: '2024-01-15',
      fechaFin: '2024-06-15',
      activa: true
    },
    {
      id: 'A-002',
      nombre: 'Zona Maíz B2',
      predio: 'Predio Sur',
      predioId: 'P-002',
      cultivo: 'Maíz',
      humedad: 18,
      temperatura: 29,
      status: 'critical',
      fechaInicio: '2024-02-01',
      fechaFin: '2024-08-01',
      activa: true
    },
    {
      id: 'A-003',
      nombre: 'Zona Lechuga C1',
      predio: 'Predio Este',
      predioId: 'P-003',
      cultivo: 'Lechuga',
      humedad: 28,
      temperatura: 26,
      status: 'good',
      fechaInicio: '2024-03-01',
      fechaFin: '2024-05-01',
      activa: true
    },
    {
      id: 'A-004',
      nombre: 'Zona Pepino D3',
      predio: 'Predio Oeste',
      predioId: 'P-004',
      cultivo: 'Pepino',
      humedad: 40,
      temperatura: 25,
      status: 'excess',
      fechaInicio: '2024-01-20',
      fechaFin: '2024-05-20',
      activa: true
    },
    {
      id: 'A-005',
      nombre: 'Zona Calabaza E1',
      predio: 'Predio Norte',
      predioId: 'P-001',
      cultivo: 'Calabaza',
      humedad: 22,
      temperatura: 28,
      status: 'warning',
      fechaInicio: '2024-02-15',
      fechaFin: '2024-07-15',
      activa: true
    },
    {
      id: 'A-006',
      nombre: 'Zona Zanahoria F2',
      predio: 'Predio Sur',
      predioId: 'P-002',
      cultivo: 'Zanahoria',
      humedad: 26,
      temperatura: 27,
      status: 'good',
      fechaInicio: '2024-03-10',
      fechaFin: '2024-07-10',
      activa: true
    },
    {
      id: 'A-007',
      nombre: 'Zona Pimiento G3',
      predio: 'Predio Este',
      predioId: 'P-003',
      cultivo: 'Pimiento',
      humedad: 19,
      temperatura: 30,
      status: 'warning',
      fechaInicio: '2024-01-25',
      fechaFin: '2024-06-25',
      activa: true
    },
    {
      id: 'A-008',
      nombre: 'Zona Frijol H1',
      predio: 'Predio Oeste',
      predioId: 'P-004',
      cultivo: 'Frijol',
      humedad: 24,
      temperatura: 26,
      status: 'good',
      fechaInicio: '2024-02-20',
      fechaFin: '2024-08-20',
      activa: false
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'excess': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good': return { text: 'Adecuado', class: 'bg-green-100 text-green-700' };
      case 'warning': return { text: 'Nivel Crítico', class: 'bg-yellow-100 text-yellow-700' };
      case 'critical': return { text: 'Falta de Agua', class: 'bg-red-100 text-red-700' };
      case 'excess': return { text: 'Exceso de Agua', class: 'bg-blue-100 text-blue-700' };
      default: return { text: 'Desconocido', class: 'bg-gray-100 text-gray-700' };
    }
  };

  const getHumidityColor = (humidity: number) => {
    if (humidity >= 10 && humidity < 20) return 'text-red-600';
    if (humidity >= 20 && humidity <= 30) return 'text-green-600';
    if (humidity > 30 && humidity <= 50) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Áreas de Riego</h1>
          <p className="text-sm md:text-base text-gray-600">Monitoreo de todas las áreas de cultivo</p>
        </div>

        {/* Legend */}
        <Card className="p-3 md:p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 md:gap-6 flex-wrap">
            <p className="text-xs md:text-sm font-medium text-gray-700">Estados:</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs md:text-sm">Adecuado (20-30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs md:text-sm">Nivel Crítico</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs md:text-sm">Falta de Agua (10-20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs md:text-sm">Exceso de Agua (30-50%)</span>
            </div>
          </div>
        </Card>

        {/* Areas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {areas.map((area) => {
            const badge = getStatusBadge(area.status);
            return (
              <Card key={area.id} className="p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(area.status)} mt-2`} />
                    <div>
                      <h3 className="text-sm md:text-base font-medium mb-1">{area.nombre}</h3>
                      <p className="text-xs md:text-sm text-gray-600">{area.predio}</p>
                    </div>
                  </div>
                  {!area.activa && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">
                      Inactiva
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <span className={`text-xs px-3 py-1 rounded-lg ${badge.class}`}>
                    {badge.text}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Cultivo:</span>
                    <span className="text-sm font-medium">{area.cultivo}</span>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Humedad del Suelo</span>
                      <Droplet className={`w-4 h-4 ${getHumidityColor(area.humedad)}`} />
                    </div>
                    <p className={`text-2xl ${getHumidityColor(area.humedad)}`}>
                      {area.humedad}%
                    </p>
                  </div>

                  <div className="flex items-start gap-2 text-xs md:text-sm">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 break-words">
                      {new Date(area.fechaInicio).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })} - {new Date(area.fechaFin).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => onNavigate('area-detail', area)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl"
                  >
                    Ver Detalles
                  </Button>
                  {userRole === 'admin' && (
                    <Button
                      onClick={() => onNavigate('area-config', area)}
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
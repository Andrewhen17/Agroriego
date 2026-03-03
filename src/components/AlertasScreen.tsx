import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { AlertTriangle, Droplet, WifiOff, CheckCircle, Clock } from 'lucide-react';

export function AlertasScreen() {
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroPredio, setFiltroPredio] = useState('todos');
  const [filtroArea, setFiltroArea] = useState('todas');

  const [alertas, setAlertas] = useState([
    {
      id: 'AL-001',
      tipo: 'falta_agua',
      area: 'Zona Maíz B2',
      areaId: 'A-002',
      predio: 'Predio Sur',
      predioId: 'P-002',
      humedad: 18,
      fecha: '2024-12-04T10:30:00',
      estado: 'pendiente',
      severidad: 'alta',
    },
    {
      id: 'AL-002',
      tipo: 'sensor_falla',
      area: 'Zona Pepino D3',
      areaId: 'A-004',
      predio: 'Predio Oeste',
      predioId: 'P-004',
      humedad: null,
      fecha: '2024-12-04T09:15:00',
      estado: 'pendiente',
      severidad: 'media',
    },
    {
      id: 'AL-003',
      tipo: 'falta_agua',
      area: 'Zona Pimiento G3',
      areaId: 'A-007',
      predio: 'Predio Este',
      predioId: 'P-003',
      humedad: 19,
      fecha: '2024-12-04T08:45:00',
      estado: 'atendida',
      severidad: 'media',
    },
    {
      id: 'AL-004',
      tipo: 'exceso_agua',
      area: 'Zona Pepino D3',
      areaId: 'A-004',
      predio: 'Predio Oeste',
      predioId: 'P-004',
      humedad: 42,
      fecha: '2024-12-04T07:20:00',
      estado: 'atendida',
      severidad: 'baja',
    },
    {
      id: 'AL-005',
      tipo: 'falta_agua',
      area: 'Zona Calabaza E1',
      areaId: 'A-005',
      predio: 'Predio Norte',
      predioId: 'P-001',
      humedad: 21,
      fecha: '2024-12-04T06:50:00',
      estado: 'atendida',
      severidad: 'media',
    },
    {
      id: 'AL-006',
      tipo: 'sensor_falla',
      area: 'Zona Tomate A1',
      areaId: 'A-001',
      predio: 'Predio Norte',
      predioId: 'P-001',
      humedad: null,
      fecha: '2024-12-03T23:30:00',
      estado: 'pendiente',
      severidad: 'baja',
    },
  ]);

  const handleMarcarAtendida = (alertaId: string) => {
    setAlertas(alertas.map(alerta => 
      alerta.id === alertaId 
        ? { ...alerta, estado: 'atendida' }
        : alerta
    ));
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'falta_agua': return Droplet;
      case 'exceso_agua': return Droplet;
      case 'sensor_falla': return WifiOff;
      default: return AlertTriangle;
    }
  };

  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case 'falta_agua': return 'Falta de Agua';
      case 'exceso_agua': return 'Exceso de Agua';
      case 'sensor_falla': return 'Falla de Sensor';
      default: return 'Alerta';
    }
  };

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'alta': return 'bg-red-100 text-red-700';
      case 'media': return 'bg-yellow-100 text-yellow-700';
      case 'baja': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredAlertas = alertas.filter(alerta => {
    if (filtroEstado !== 'todas' && alerta.estado !== filtroEstado) return false;
    if (filtroPredio !== 'todos' && alerta.predioId !== filtroPredio) return false;
    if (filtroArea !== 'todas' && alerta.areaId !== filtroArea) return false;
    return true;
  });

  const alertasPendientes = alertas.filter(a => a.estado === 'pendiente').length;
  const alertasAtendidas = alertas.filter(a => a.estado === 'atendida').length;

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

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Alertas del Sistema</h1>
          <p className="text-sm md:text-base text-gray-600">Monitorea las alertas de tus áreas de riego</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Alertas Pendientes</p>
                <p className="text-3xl">{alertasPendientes}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Alertas Atendidas</p>
                <p className="text-3xl">{alertasAtendidas}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Alertas</p>
                <p className="text-3xl">{alertas.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Estado</label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las Alertas</SelectItem>
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="atendida">Atendidas</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              <label className="text-sm text-gray-600">Área</label>
              <Select value={filtroArea} onValueChange={setFiltroArea}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las Áreas</SelectItem>
                  <SelectItem value="A-001">Zona Tomate A1</SelectItem>
                  <SelectItem value="A-002">Zona Maíz B2</SelectItem>
                  <SelectItem value="A-003">Zona Lechuga C1</SelectItem>
                  <SelectItem value="A-004">Zona Pepino D3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Lista de Alertas */}
        <div className="space-y-4">
          {filteredAlertas.length === 0 ? (
            <Card className="p-12 rounded-2xl shadow-sm text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl mb-2">No hay alertas</h3>
              <p className="text-gray-600">
                No se encontraron alertas con los filtros seleccionados
              </p>
            </Card>
          ) : (
            filteredAlertas.map((alerta) => {
              const Icon = getTipoIcon(alerta.tipo);
              return (
                <Card 
                  key={alerta.id} 
                  className={`p-4 md:p-6 rounded-2xl shadow-sm ${ 
                    alerta.estado === 'pendiente' ? 'border-l-4 border-l-red-500' : ''
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${ 
                        alerta.tipo === 'falta_agua' ? 'bg-red-100' :
                        alerta.tipo === 'exceso_agua' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          alerta.tipo === 'falta_agua' ? 'text-red-600' :
                          alerta.tipo === 'exceso_agua' ? 'text-blue-600' :
                          'text-gray-600'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                          <h3 className="text-base md:text-lg">{getTipoText(alerta.tipo)}</h3>
                          <Badge className={getSeveridadColor(alerta.severidad)}>
                            {alerta.severidad === 'alta' ? 'Alta' : alerta.severidad === 'media' ? 'Media' : 'Baja'}
                          </Badge>
                          {alerta.estado === 'atendida' && (
                            <Badge className="bg-green-100 text-green-700">
                              Atendida
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Área:</span> {alerta.area}
                          </p>
                          <p>
                            <span className="font-medium">Predio:</span> {alerta.predio}
                          </p>
                          {alerta.humedad !== null && (
                            <p>
                              <span className="font-medium">Nivel de Humedad Actual:</span>{' '}
                              <span className={
                                alerta.humedad < 20 ? 'text-red-600 font-medium' :
                                alerta.humedad > 30 ? 'text-blue-600 font-medium' :
                                'text-green-600 font-medium'
                              }>
                                {alerta.humedad}%
                              </span>
                            </p>
                          )}
                          <p>
                            <span className="font-medium">Fecha y Hora:</span> {formatFecha(alerta.fecha)}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            ID: {alerta.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {alerta.estado === 'pendiente' && (
                      <Button
                        onClick={() => handleMarcarAtendida(alerta.id)}
                        className="w-full sm:w-auto sm:self-end bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Marcar como Atendida</span>
                        <span className="sm:hidden">Atendida</span>
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
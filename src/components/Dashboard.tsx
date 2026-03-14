import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Droplet, ThermometerSun, AlertTriangle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api';

interface DashboardProps {
  data: any;
  onNavigate: (view: string, data?: any) => void;
}

export function Dashboard({ data, onNavigate }: DashboardProps) {
  const [predios, setPredios] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getPredios(),
      api.getAreas(),
      api.getAlertas(),
    ]).then(([p, a, al]) => {
      setPredios(Array.isArray(p) ? p : []);
      setAreas(Array.isArray(a) ? a : []);
      setAlertas(Array.isArray(al) ? al : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const alertasPendientes = alertas.filter(a => !a.leida).length;

  const consumptionData = [
    { time: '00:00', consumo: 0.8 },
    { time: '02:00', consumo: 0.6 },
    { time: '04:00', consumo: 0.5 },
    { time: '06:00', consumo: 1.2 },
    { time: '08:00', consumo: 1.8 },
    { time: '10:00', consumo: 2.1 },
    { time: '12:00', consumo: 2.4 },
    { time: '14:00', consumo: 2.2 },
    { time: '16:00', consumo: 1.9 },
    { time: '18:00', consumo: 1.5 },
    { time: '20:00', consumo: 1.1 },
    { time: '22:00', consumo: 0.9 },
  ];

  const stats = [
    {
      label: 'Humedad Promedio',
      value: areas.length > 0
          ? (areas.reduce((s: number, a: any) => s + (a.humedad_suelo || 0), 0) / areas.length).toFixed(1) + '%'
          : '—',
      icon: Droplet,
      color: 'text-green-600',
      bg: 'bg-green-100',
      status: 'normal'
    },
    {
      label: 'Temperatura Actual',
      value: '27°C',
      icon: ThermometerSun,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      status: 'normal'
    },
    {
      label: 'Consumo Total Hoy',
      value: '14.8 m³',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      status: 'normal'
    },
    {
      label: 'Alertas Activas',
      value: String(alertasPendientes),
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-100',
      status: alertasPendientes > 0 ? 'warning' : 'normal'
    },
  ];

  const getStatusColor = (humedad: number, capacidad: number, marchitez: number) => {
    if (humedad < marchitez) return 'bg-red-500';
    if (humedad > capacidad) return 'bg-blue-500';
    if (humedad < marchitez * 1.3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = (humedad: number, capacidad: number, marchitez: number) => {
    if (humedad < marchitez) return { text: 'Falta de Agua', class: 'bg-red-100 text-red-700' };
    if (humedad > capacidad) return { text: 'Exceso de Agua', class: 'bg-blue-100 text-blue-700' };
    if (humedad < marchitez * 1.3) return { text: 'Nivel Crítico', class: 'bg-yellow-100 text-yellow-700' };
    return { text: 'Adecuado', class: 'bg-green-100 text-green-700' };
  };

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'Crítica': return 'border-l-red-500 bg-red-50';
      case 'Advertencia': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  if (loading) {
    return (
        <div className="p-8 flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Cargando datos...</div>
        </div>
    );
  }

  return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl mb-2">Dashboard General</h1>
            <p className="text-sm md:text-base text-gray-600">
              Resumen de todos los predios y áreas de riego
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                  <Card key={index} className="p-4 md:p-6 rounded-2xl shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-2xl md:text-3xl mb-2">{stat.value}</p>
                        {stat.status === 'warning' && (
                            <span className="text-xs text-red-600">Requiere atención</span>
                        )}
                      </div>
                      <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </Card>
              );
            })}
          </div>

          {/* Consumption Chart */}
          <Card className="p-4 md:p-6 rounded-2xl shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg md:text-xl mb-1">Consumo de Agua</h2>
              <p className="text-xs md:text-sm text-gray-600">Actualización cada 10 minutos</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => [`${value} m³`, 'Consumo']}
                />
                <Line
                    type="monotone"
                    dataKey="consumo"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Predios */}
            <Card className="p-4 md:p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg md:text-xl mb-4">Estado de Predios</h2>
              {predios.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay predios registrados</p>
              ) : (
                  <div className="space-y-3">
                    {predios.map((predio: any) => (
                        <div
                            key={predio.id_predio}
                            onClick={() => onNavigate('predios', predio)}
                            className="p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-green-500" />
                              <div>
                                <p className="text-sm md:text-base font-medium">{predio.nombre}</p>
                                <p className="text-xs md:text-sm text-gray-600">
                                  {predio.latitud?.toFixed(4)}, {predio.longitud?.toFixed(4)}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">#{predio.id_predio}</span>
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </Card>

            {/* Alertas recientes */}
            <Card className="p-4 md:p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg md:text-xl mb-4">Alertas Recientes</h2>
              {alertas.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay alertas registradas</p>
              ) : (
                  <div className="space-y-3">
                    {alertas.slice(0, 4).map((alerta: any) => (
                        <div
                            key={alerta.id_alerta}
                            className={`p-3 rounded-xl border-l-4 ${getSeveridadColor(alerta.severidad)}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{alerta.tipo_alerta}</span>
                            {!alerta.leida && (
                                <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                          Nueva
                        </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">{alerta.mensaje}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Área: {alerta.nombre_area || alerta.id_area}
                          </p>
                        </div>
                    ))}
                    <button
                        onClick={() => onNavigate('alertas')}
                        className="w-full text-sm text-blue-600 hover:text-blue-800 text-center mt-2"
                    >
                      Ver todas las alertas →
                    </button>
                  </div>
              )}
            </Card>
          </div>

          {/* Areas overview */}
          <Card className="p-4 md:p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg md:text-xl mb-4">Áreas de Riego</h2>
            {areas.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay áreas registradas</p>
            ) : (
                <div className="space-y-3">
                  {areas.map((area: any) => {
                    const st = getStatusText(
                        area.humedad_suelo || 0,
                        area.capacidad_campo,
                        area.punto_marchitez
                    );
                    return (
                        <div
                            key={area.id_area}
                            onClick={() => onNavigate('area-detail', area)}
                            className="p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(
                                  area.humedad_suelo || 0,
                                  area.capacidad_campo,
                                  area.punto_marchitez
                              )}`} />
                              <p className="text-sm md:text-base font-medium">{area.nombre}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-lg ${st.class}`}>
                        {st.text}
                      </span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600">
                            {area.nombre_predio} · {area.tipo_cultivo} · {area.tamano_hectareas} ha
                          </p>
                        </div>
                    );
                  })}
                </div>
            )}
          </Card>
        </div>
      </div>
  );
}
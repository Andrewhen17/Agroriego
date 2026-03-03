import { Card } from './ui/card';
import { Droplet, ThermometerSun, AlertTriangle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  data: any;
  onNavigate: (view: string, data?: any) => void;
}

export function Dashboard({ data, onNavigate }: DashboardProps) {
  const stats = [
    {
      label: 'Humedad Promedio',
      value: '24.5%',
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
      value: '3',
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-100',
      status: 'warning'
    },
  ];

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

  const predios = [
    { id: 'P-001', name: 'Predio Norte', areas: 5, status: 'good', humidity: 25 },
    { id: 'P-002', name: 'Predio Sur', areas: 8, status: 'warning', humidity: 18 },
    { id: 'P-003', name: 'Predio Este', areas: 6, status: 'good', humidity: 28 },
    { id: 'P-004', name: 'Predio Oeste', areas: 4, status: 'excess', humidity: 42 },
  ];

  const areas = [
    { id: 'A-001', name: 'Zona Tomate A1', predio: 'Predio Norte', humidity: 25, status: 'good' },
    { id: 'A-002', name: 'Zona Maíz B2', predio: 'Predio Sur', humidity: 18, status: 'critical' },
    { id: 'A-003', name: 'Zona Lechuga C1', predio: 'Predio Este', humidity: 28, status: 'good' },
    { id: 'A-004', name: 'Zona Pepino D3', predio: 'Predio Oeste', humidity: 40, status: 'excess' },
    { id: 'A-005', name: 'Zona Calabaza E1', predio: 'Predio Norte', humidity: 22, status: 'warning' },
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good': return 'Adecuado';
      case 'warning': return 'Nivel Crítico';
      case 'critical': return 'Falta de Agua';
      case 'excess': return 'Exceso de Agua';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Dashboard General</h1>
          <p className="text-sm md:text-base text-gray-600">Resumen de todos los predios y áreas de riego</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
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
              <YAxis stroke="#6b7280" label={{ value: 'm³', angle: -90, position: 'insideLeft' }} style={{ fontSize: '12px' }} />
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
          {/* Predios Overview */}
          <Card className="p-4 md:p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg md:text-xl mb-4">Estado de Predios</h2>
            <div className="space-y-3">
              {predios.map((predio) => (
                <div
                  key={predio.id}
                  onClick={() => onNavigate('predios', predio)}
                  className="p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(predio.status)}`} />
                      <div>
                        <p className="text-sm md:text-base font-medium">{predio.name}</p>
                        <p className="text-xs md:text-sm text-gray-600">{predio.areas} áreas • {predio.humidity}% humedad</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{predio.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Areas Overview */}
          <Card className="p-4 md:p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg md:text-xl mb-4">Áreas de Riego Recientes</h2>
            <div className="space-y-3">
              {areas.map((area) => (
                <div
                  key={area.id}
                  onClick={() => onNavigate('area-detail', area)}
                  className="p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(area.status)}`} />
                      <p className="text-sm md:text-base font-medium">{area.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      area.status === 'good' ? 'bg-green-100 text-green-700' :
                      area.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      area.status === 'critical' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {getStatusText(area.status)}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">{area.predio} • {area.humidity}% humedad</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Droplet, 
  Thermometer, 
  Wind, 
  Sun, 
  TrendingDown, 
  Waves,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AreaDetailScreenProps {
  area: any;
  onNavigate: (view: string, data?: any) => void;
}

export function AreaDetailScreen({ area, onNavigate }: AreaDetailScreenProps) {
  const [period, setPeriod] = useState('24h');

  // Mock data para diferentes periodos
  const generateData = () => {
    const baseData = {
      '24h': Array.from({ length: 24 }, (_, i) => ({
        time: `${i.toString().padStart(2, '0')}:00`,
        humedad: 18 + Math.random() * 10,
        temperatura: 25 + Math.random() * 5,
        humedadRelativa: 50 + Math.random() * 20,
        radiacion: 200 + Math.random() * 500,
        evapotranspiracion: 3 + Math.random() * 3,
        consumo: 0.08 + Math.random() * 0.08,
        conductividad: 1.2 + Math.random() * 0.5,
      })),
      '7d': Array.from({ length: 7 }, (_, i) => ({
        time: `Día ${i + 1}`,
        humedad: 18 + Math.random() * 10,
        temperatura: 25 + Math.random() * 5,
        humedadRelativa: 50 + Math.random() * 20,
        radiacion: 200 + Math.random() * 500,
        evapotranspiracion: 3 + Math.random() * 3,
        consumo: 0.08 + Math.random() * 0.08,
        conductividad: 1.2 + Math.random() * 0.5,
      })),
      '30d': Array.from({ length: 30 }, (_, i) => ({
        time: `${i + 1}`,
        humedad: 18 + Math.random() * 10,
        temperatura: 25 + Math.random() * 5,
        humedadRelativa: 50 + Math.random() * 20,
        radiacion: 200 + Math.random() * 500,
        evapotranspiracion: 3 + Math.random() * 3,
        consumo: 0.08 + Math.random() * 0.08,
        conductividad: 1.2 + Math.random() * 0.5,
      })),
    };
    return baseData[period as keyof typeof baseData];
  };

  const data = generateData();

  const sensors = [
    {
      id: 'humedad',
      nombre: 'Humedad del Suelo',
      valor: 18,
      unidad: '%',
      icon: Droplet,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      chartColor: '#dc2626',
      dataKey: 'humedad',
      status: 'critical'
    },
    {
      id: 'temperatura',
      nombre: 'Temperatura',
      valor: 27,
      unidad: '°C',
      icon: Thermometer,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      chartColor: '#ea580c',
      dataKey: 'temperatura',
      status: 'normal'
    },
    {
      id: 'humedad-relativa',
      nombre: 'Humedad Relativa',
      valor: 65,
      unidad: '%',
      icon: Wind,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      chartColor: '#2563eb',
      dataKey: 'humedadRelativa',
      status: 'normal'
    },
    {
      id: 'radiacion',
      nombre: 'Radiación Solar',
      valor: 680,
      unidad: 'W/m²',
      icon: Sun,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      chartColor: '#ca8a04',
      dataKey: 'radiacion',
      status: 'normal'
    },
    {
      id: 'evapotranspiracion',
      nombre: 'Evapotranspiración',
      valor: 4.5,
      unidad: 'mm/día',
      icon: TrendingDown,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      chartColor: '#16a34a',
      dataKey: 'evapotranspiracion',
      status: 'normal'
    },
    {
      id: 'consumo',
      nombre: 'Consumo de Agua',
      valor: 0.12,
      unidad: 'm³/10min',
      icon: Waves,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      chartColor: '#0891b2',
      dataKey: 'consumo',
      status: 'normal'
    },
    {
      id: 'conductividad',
      nombre: 'Conductividad',
      valor: 1.5,
      unidad: '?',
      icon: HelpCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      chartColor: '#9333ea',
      dataKey: 'conductividad',
      status: 'normal'
    },
  ];

  const getHumidityStatus = (humidity: number) => {
    if (humidity >= 10 && humidity < 20) return { text: 'Falta de Agua', color: 'text-red-600', bg: 'bg-red-100' };
    if (humidity >= 20 && humidity <= 30) return { text: 'Adecuado', color: 'text-green-600', bg: 'bg-green-100' };
    if (humidity > 30 && humidity <= 50) return { text: 'Exceso de Agua', color: 'text-blue-600', bg: 'bg-blue-100' };
    return { text: 'Fuera de Rango', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const humidityStatus = getHumidityStatus(sensors[0].valor);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            onClick={() => onNavigate('areas')}
            variant="ghost"
            className="rounded-xl w-fit"
          >
            ← Volver a Áreas
          </Button>
          <div className="w-px h-6 bg-gray-300 hidden sm:block" />
          <div>
            <h1 className="text-2xl md:text-3xl">{area?.nombre || 'Detalle del Área'}</h1>
            <p className="text-sm md:text-base text-gray-600">{area?.predio || 'Información detallada'}</p>
          </div>
        </div>

        {/* Estado General */}
        <Card className="p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Estado Actual de Humedad</p>
              <div className="flex items-center gap-3">
                <p className="text-4xl">{sensors[0].valor}%</p>
                <span className={`px-3 py-1 rounded-xl text-sm ${humidityStatus.bg} ${humidityStatus.color}`}>
                  {humidityStatus.text}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Actualización cada 10 minutos
            </div>
          </div>
        </Card>

        {/* Indicadores de Sensores */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {sensors.map((sensor) => {
            const Icon = sensor.icon;
            return (
              <Card key={sensor.id} className={`p-4 rounded-2xl shadow-sm ${sensor.bgColor}`}>
                <div className="text-center">
                  <Icon className={`w-8 h-8 ${sensor.color} mx-auto mb-2`} />
                  <p className="text-xs text-gray-600 mb-1">{sensor.nombre}</p>
                  <p className={`text-xl ${sensor.color}`}>
                    {sensor.valor}
                    <span className="text-sm ml-1">{sensor.unidad}</span>
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tabs con Gráficas */}
        <Card className="p-6 rounded-2xl shadow-sm">
          <Tabs defaultValue="humedad" className="w-full">
            <TabsList className="flex flex-wrap mb-6 bg-gray-100 p-1 rounded-xl h-auto gap-1">
              {sensors.map((sensor) => (
                <TabsTrigger 
                  key={sensor.id} 
                  value={sensor.id}
                  className="rounded-lg text-xs"
                >
                  {sensor.nombre}
                </TabsTrigger>
              ))}
            </TabsList>

            {sensors.map((sensor) => (
              <TabsContent key={sensor.id} value={sensor.id}>
                <div className="mb-4">
                  <h3 className="text-xl mb-1">{sensor.nombre}</h3>
                  <p className="text-sm text-gray-600">
                    Valor actual: <span className={sensor.color}>{sensor.valor} {sensor.unidad}</span>
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      label={{ 
                        value: sensor.unidad, 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fontSize: '12px' }
                      }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                      }}
                      formatter={(value: any) => [`${Number(value).toFixed(2)} ${sensor.unidad}`, sensor.nombre]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={sensor.dataKey}
                      stroke={sensor.chartColor}
                      strokeWidth={3}
                      dot={{ fill: sensor.chartColor, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            ))}
          </Tabs>
        </Card>

        {/* Tabla de Datos Detallados */}
        <Card className="p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl mb-4">Datos Detallados (Cada 10 minutos)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-gray-600">Hora</th>
                  <th className="text-right p-3 text-gray-600">Humedad %</th>
                  <th className="text-right p-3 text-gray-600">Temp °C</th>
                  <th className="text-right p-3 text-gray-600">H. Relativa %</th>
                  <th className="text-right p-3 text-gray-600">Radiación W/m²</th>
                  <th className="text-right p-3 text-gray-600">ET mm/día</th>
                  <th className="text-right p-3 text-gray-600">Consumo m³</th>
                  <th className="text-right p-3 text-gray-600">Conductividad</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{row.time}</td>
                    <td className="text-right p-3">{row.humedad.toFixed(1)}</td>
                    <td className="text-right p-3">{row.temperatura.toFixed(1)}</td>
                    <td className="text-right p-3">{row.humedadRelativa.toFixed(1)}</td>
                    <td className="text-right p-3">{row.radiacion.toFixed(0)}</td>
                    <td className="text-right p-3">{row.evapotranspiracion.toFixed(2)}</td>
                    <td className="text-right p-3">{row.consumo.toFixed(3)}</td>
                    <td className="text-right p-3">{row.conductividad.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
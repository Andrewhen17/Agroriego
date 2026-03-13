import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileDown, FileText } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {detailedData} from '../data_reportes.ts';

export function ReportesScreen() {
  const [periodo, setPeriodo] = useState('diario');
  const [predio, setPredio] = useState('todos');
  const [area, setArea] = useState('todas');

  const generateData = () => {
    if (periodo === 'diario') {
      return Array.from({ length: 24 }, (_, i) => ({
        hora: `${i.toString().padStart(2, '0')}:00`,
        consumo: 0.5 + Math.random() * 2,
        humedad: 20 + Math.random() * 10,
      }));
    } else if (periodo === 'semanal') {
      return ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia) => ({
        hora: dia,
        consumo: 8 + Math.random() * 12,
        humedad: 20 + Math.random() * 10,
      }));
    } else {
      return Array.from({ length: 30 }, (_, i) => ({
        hora: `Día ${i + 1}`,
        consumo: 15 + Math.random() * 20,
        humedad: 20 + Math.random() * 10,
      }));
    }
  };

  const data = generateData();

  const handleExportPDF = () => {
    alert('Exportando reporte a PDF...\n\nEn una implementación real, esto generaría un archivo PDF con los datos y gráficas del reporte.');
  };

  const handleExportExcel = () => {
    alert('Exportando reporte a Excel...\n\nEn una implementación real, esto generaría un archivo Excel con todos los datos detallados.');
  };

  const stats = [
    { label: 'Consumo Total', value: periodo === 'diario' ? '14.8 m³' : periodo === 'semanal' ? '103.6 m³' : '450.2 m³' },
    { label: 'Humedad Promedio', value: '24.5%' },
    { label: 'Temperatura Promedio', value: '27.3°C' },
    { label: 'Lecturas Realizadas', value: periodo === 'diario' ? '144' : periodo === 'semanal' ? '1,008' : '4,320' },
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-2">Reportes</h1>
            <p className="text-sm md:text-base text-gray-600">Análisis y reportes del sistema de riego</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={handleExportPDF}
              variant="outline"
              className="rounded-xl w-full sm:w-auto"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Exportar PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
            <Button
              onClick={handleExportExcel}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl w-full sm:w-auto"
            >
              <FileDown className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Exportar Excel</span>
              <span className="sm:hidden">Excel</span>
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg mb-4">Filtros de Reporte</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Periodo</label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diario (Últimas 24h)</SelectItem>
                  <SelectItem value="semanal">Semanal (Últimos 7 días)</SelectItem>
                  <SelectItem value="mensual">Mensual (Últimos 30 días)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Predio</label>
              <Select value={predio} onValueChange={setPredio}>
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
              <Select value={area} onValueChange={setArea}>
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

        {/* Estadísticas Resumidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 rounded-2xl shadow-sm">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Gráfica de Consumo de Agua */}
        <Card className="p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl mb-4">Consumo de Agua Respecto al Tiempo</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="hora" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'm³', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                }}
                formatter={(value: any) => [`${value.toFixed(2)} m³`, 'Consumo']}
              />
              <Legend />
              <Bar 
                dataKey="consumo" 
                fill="#3b82f6" 
                radius={[8, 8, 0, 0]}
                name="Consumo de Agua"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfica de Humedad */}
        <Card className="p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl mb-4">Humedad del Suelo Respecto al Tiempo</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="hora" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: '%', angle: -90, position: 'insideLeft' }}
                domain={[0, 50]}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                }}
                formatter={(value: any) => [`${value.toFixed(1)}%`, 'Humedad']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="humedad" 
                stroke="#16a34a" 
                strokeWidth={3}
                dot={{ fill: '#16a34a', r: 4 }}
                activeDot={{ r: 6 }}
                name="Humedad del Suelo"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Tabla Detallada */}
        <Card className="p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl mb-4">Datos Detallados (Cada 10 minutos)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-gray-600">Tiempo</th>
                  <th className="text-right p-3 text-gray-600">Humedad (%)</th>
                  <th className="text-right p-3 text-gray-600">Temperatura (°C)</th>
                  <th className="text-right p-3 text-gray-600">Consumo (m³)</th>
                  <th className="text-right p-3 text-gray-600">Radiación (W/m²)</th>
                  <th className="text-right p-3 text-gray-600">ET (mm/día)</th>
                </tr>
              </thead>
              <tbody>
                {detailedData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{row.tiempo}</td>
                    <td className="text-right p-3">{row.humedad.toFixed(1)}</td>
                    <td className="text-right p-3">{row.temperatura.toFixed(1)}</td>
                    <td className="text-right p-3">{row.consumo.toFixed(2)}</td>
                    <td className="text-right p-3">{row.radiacion}</td>
                    <td className="text-right p-3">{row.evapotranspiracion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Mostrando las primeras 10 lecturas. Exporta a Excel para ver todos los datos.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
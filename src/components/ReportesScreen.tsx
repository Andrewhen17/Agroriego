import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileDown, FileText } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { api } from '../api';

export function ReportesScreen() {
  const [areas, setAreas] = useState<any[]>([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState('todas');
  const [lecturas, setLecturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [desde, setDesde] = useState(
      new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
  );
  const [hasta, setHasta] = useState(
      new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    api.getAreas().then(data => {
      setAreas(Array.isArray(data) ? data : []);
    });
  }, []);

  useEffect(() => {
    if (areaSeleccionada === 'todas' || !areaSeleccionada) return;
    setLoading(true);
    api.getTelemetria(areaSeleccionada, desde, hasta).then(data => {
      setLecturas(Array.isArray(data) ? data.reverse() : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [areaSeleccionada, desde, hasta]);

  const exportarCSV = () => {
    if (lecturas.length === 0) {
      alert('No hay datos para exportar. Selecciona un área y un rango de fechas.');
      return;
    }
    const headers = Object.keys(lecturas[0]).join(',');
    const filas = lecturas.map(r => Object.values(r).join(','));
    const csv = [headers, ...filas].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${areaSeleccionada}_${desde}_${hasta}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportarPDF = () => {
    alert('Exportación a PDF: En producción se generaría un PDF con las gráficas y tablas del período seleccionado.');
  };

  const humProm = lecturas.length
      ? (lecturas.reduce((s, l) => s + (l.humedad_suelo || 0), 0) / lecturas.length).toFixed(1)
      : '—';
  const tempProm = lecturas.length
      ? (lecturas.reduce((s, l) => s + (l.temperatura_ambiental || 0), 0) / lecturas.length).toFixed(1)
      : '—';
  const consumoTotal = lecturas
      .filter(l => l.estatus_riego)
      .reduce((s, l) => s + (l.flujo_riego || 0), 0)
      .toFixed(1);

  const formatFecha = (str: string) =>
      new Date(str).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' });

  return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl mb-2">Reportes y Análisis</h1>
              <p className="text-sm text-gray-600">Consulta y exporta datos históricos</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportarPDF} variant="outline" className="rounded-xl">
                <FileText className="w-4 h-4 mr-2" /> PDF
              </Button>
              <Button
                  onClick={exportarCSV}
                  className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl"
              >
                <FileDown className="w-4 h-4 mr-2" /> Exportar CSV
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <Card className="p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">Área de Riego</label>
                <Select value={areaSeleccionada} onValueChange={setAreaSeleccionada}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecciona un área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las áreas</SelectItem>
                    {areas.map(a => (
                        <SelectItem key={a.id_area} value={a.id_area}>
                          {a.nombre}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">Desde</label>
                <input
                    type="date"
                    value={desde}
                    onChange={e => setDesde(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">Hasta</label>
                <input
                    type="date"
                    value={hasta}
                    onChange={e => setHasta(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
            </div>
            {loading && <p className="text-sm text-gray-500 mt-3">Cargando datos...</p>}
            {!loading && lecturas.length > 0 && (
                <p className="text-sm text-green-600 mt-3">{lecturas.length} lecturas encontradas</p>
            )}
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Lecturas', value: lecturas.length, color: 'text-purple-700' },
              { label: 'Hum. Promedio', value: humProm + '%', color: 'text-green-700' },
              { label: 'Temp. Promedio', value: tempProm + '°C', color: 'text-orange-700' },
              { label: 'Consumo Total', value: consumoTotal + ' m³', color: 'text-blue-700' },
            ].map(s => (
                <Card key={s.label} className="p-5 rounded-2xl shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </Card>
            ))}
          </div>

          {lecturas.length > 0 && (
              <>
                {/* Gráfica humedad */}
                <Card className="p-6 rounded-2xl shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Humedad del Suelo</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lecturas}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                          dataKey="fecha_hora"
                          stroke="#6b7280"
                          style={{ fontSize: '11px' }}
                          tickFormatter={formatFecha}
                      />
                      <YAxis stroke="#6b7280" style={{ fontSize: '11px' }} />
                      <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none' }}
                          labelFormatter={v => new Date(v).toLocaleString('es-MX')}
                          formatter={(v: any) => [`${Number(v).toFixed(1)}%`, 'Humedad']}
                      />
                      <Legend />
                      <Line
                          type="monotone"
                          dataKey="humedad_suelo"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={false}
                          name="Humedad Suelo %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Gráfica consumo */}
                <Card className="p-6 rounded-2xl shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Consumo de Agua (m³/h)</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={lecturas.filter(l => l.estatus_riego)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                          dataKey="fecha_hora"
                          stroke="#6b7280"
                          style={{ fontSize: '11px' }}
                          tickFormatter={formatFecha}
                      />
                      <YAxis stroke="#6b7280" style={{ fontSize: '11px' }} />
                      <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none' }}
                          formatter={(v: any) => [`${Number(v).toFixed(2)} m³/h`, 'Flujo']}
                      />
                      <Legend />
                      <Bar dataKey="flujo_riego" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Flujo Riego" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Tabla */}
                <Card className="p-6 rounded-2xl shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">
                    Tabla Detallada ({lecturas.length} registros)
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                      <tr className="border-b bg-gray-50">
                        {['Fecha/Hora', 'Hum. %', 'Temp. Suelo', 'Temp. Amb.', 'H. Relativa', 'Radiación', 'ET', 'E. Cond.', 'Riego', 'Flujo'].map(h => (
                            <th key={h} className="text-left p-3 text-gray-600 font-medium whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                      </thead>
                      <tbody>
                      {lecturas.slice(0, 50).map((l, i) => (
                          <tr key={i} className="border-b hover:bg-gray-50">
                            <td className="p-3 whitespace-nowrap text-gray-600">
                              {new Date(l.fecha_hora).toLocaleString('es-MX')}
                            </td>
                            <td className="p-3 font-bold text-green-700">{l.humedad_suelo}%</td>
                            <td className="p-3">{l.temperatura_suelo}°C</td>
                            <td className="p-3">{l.temperatura_ambiental}°C</td>
                            <td className="p-3">{l.humedad_relativa}%</td>
                            <td className="p-3">{l.radiacion_solar}</td>
                            <td className="p-3">{l.evapotranspiracion}</td>
                            <td className="p-3">{l.electroconductividad}</td>
                            <td className="p-3">{l.estatus_riego ? '🟢' : '⚪'}</td>
                            <td className="p-3">{l.flujo_riego}</td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                    {lecturas.length > 50 && (
                        <p className="text-center text-xs text-gray-400 mt-3">
                          Mostrando 50 de {lecturas.length} — usa "Exportar CSV" para todos los datos
                        </p>
                    )}
                  </div>
                </Card>
              </>
          )}

          {areaSeleccionada !== 'todas' && !loading && lecturas.length === 0 && (
              <Card className="p-12 rounded-2xl text-center">
                <p className="text-gray-500">No hay lecturas en el rango de fechas seleccionado</p>
              </Card>
          )}
        </div>
      </div>
  );
}
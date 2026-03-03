import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { ArrowLeft, Save } from "lucide-react";

interface AreaConfigScreenProps {
  area: any;
  userRole: "admin" | "user";
  onNavigate: (view: string, data?: any) => void;
}

export function AreaConfigScreen({
  area,
  userRole,
  onNavigate,
}: AreaConfigScreenProps) {
  const [config, setConfig] = useState({
    tipoCultivo: area?.cultivo || "Tomate",
    humedadMinima: "20",
    humedadMaxima: "30",
    humedadOptima: "25",
    intervaloRiego: "tiempo",
    tiempoRiego: "30",
    nivelHumedadRiego: "20",
    activa: area?.activa !== false,
    fechaInicio: area?.fechaInicio || "",
    fechaFin: area?.fechaFin || "",
    temperaturaMinima: "15",
    temperaturaMaxima: "35",
    radiacionOptima: "600",
    evapotranspiracionMaxima: "6",
  });

  const cultivosDisponibles = [
    "Nogak",
    "Alfalfa",
    "Manzana",
    "Maíz",
    "Chile",
    "Algodón",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se guardaría la configuración
    alert("Configuración guardada exitosamente");
    onNavigate("areas");
  };

  if (userRole !== "admin") {
    return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 md:p-8 rounded-2xl shadow-sm text-center">
            <h2 className="text-2xl mb-2">
              Acceso Restringido
            </h2>
            <p className="text-gray-600 mb-6">
              Solo los administradores pueden configurar áreas
              de riego
            </p>
            <Button
              onClick={() => onNavigate("areas")}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl"
            >
              Volver a Áreas
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-2">
              Configuración del Área
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {area?.nombre || "Área de Riego"} • ID:{" "}
              {area?.id || "A-000"}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => onNavigate("areas")}
            className="rounded-xl w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <Card className="p-4 md:p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg md:text-xl mb-4">
              Información General del Cultivo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoCultivo">
                  Tipo de Cultivo
                </Label>
                <Select
                  value={config.tipoCultivo}
                  onValueChange={(value) =>
                    setConfig({ ...config, tipoCultivo: value })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cultivosDisponibles.map((cultivo) => (
                      <SelectItem key={cultivo} value={cultivo}>
                        {cultivo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activa">Estado del Área</Label>
                <div className="flex items-center gap-3 h-10 px-4 bg-gray-50 rounded-xl">
                  <Switch
                    id="activa"
                    checked={config.activa}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, activa: checked })
                    }
                  />
                  <span className="text-sm">
                    {config.activa
                      ? "Área Activa (Monitoreando)"
                      : "Área Inactiva"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaInicio">
                  Fecha Inicio de Temporada
                </Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={config.fechaInicio}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      fechaInicio: e.target.value,
                    })
                  }
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaFin">
                  Fecha Fin de Temporada
                </Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={config.fechaFin}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      fechaFin: e.target.value,
                    })
                  }
                  className="rounded-xl"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Parámetros de Humedad */}
          <Card className="p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl mb-4">
              Rangos de Humedad del Suelo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="humedadMinima">
                  Humedad Mínima (%)
                </Label>
                <Input
                  id="humedadMinima"
                  type="number"
                  value={config.humedadMinima}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      humedadMinima: e.target.value,
                    })
                  }
                  className="rounded-xl"
                  min="0"
                  max="100"
                  required
                />
                <p className="text-xs text-gray-500">
                  Alerta de falta de agua
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="humedadOptima">
                  Humedad Óptima (%)
                </Label>
                <Input
                  id="humedadOptima"
                  type="number"
                  value={config.humedadOptima}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      humedadOptima: e.target.value,
                    })
                  }
                  className="rounded-xl"
                  min="0"
                  max="100"
                  required
                />
                <p className="text-xs text-gray-500">
                  Nivel ideal para el cultivo
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="humedadMaxima">
                  Humedad Máxima (%)
                </Label>
                <Input
                  id="humedadMaxima"
                  type="number"
                  value={config.humedadMaxima}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      humedadMaxima: e.target.value,
                    })
                  }
                  className="rounded-xl"
                  min="0"
                  max="100"
                  required
                />
                <p className="text-xs text-gray-500">
                  Alerta de exceso de agua
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-900">
                <span className="font-medium">
                  Código de Colores:
                </span>{" "}
                Rojo (10-20%) • Verde (20-30%) • Azul (30-50%)
              </p>
            </div>
          </Card>

          {/* Configuración de Riego */}
          <Card className="p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl mb-4">
              Intervalos de Riego
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="intervaloRiego">
                  Modo de Riego
                </Label>
                <Select
                  value={config.intervaloRiego}
                  onValueChange={(value) =>
                    setConfig({
                      ...config,
                      intervaloRiego: value,
                    })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tiempo">
                      Por Tiempo (Intervalos Fijos)
                    </SelectItem>
                    <SelectItem value="humedad">
                      Por Nivel de Humedad
                    </SelectItem>
                    <SelectItem value="manual">
                      Manual
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.intervaloRiego === "tiempo" && (
                <div className="space-y-2">
                  <Label htmlFor="tiempoRiego">
                    Intervalo de Riego (minutos)
                  </Label>
                  <Input
                    id="tiempoRiego"
                    type="number"
                    value={config.tiempoRiego}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        tiempoRiego: e.target.value,
                      })
                    }
                    className="rounded-xl"
                    min="1"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    El sistema regará cada {config.tiempoRiego}{" "}
                    minutos
                  </p>
                </div>
              )}

              {config.intervaloRiego === "humedad" && (
                <div className="space-y-2">
                  <Label htmlFor="nivelHumedadRiego">
                    Activar Riego cuando Humedad sea menor a (%)
                  </Label>
                  <Input
                    id="nivelHumedadRiego"
                    type="number"
                    value={config.nivelHumedadRiego}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        nivelHumedadRiego: e.target.value,
                      })
                    }
                    className="rounded-xl"
                    min="0"
                    max="100"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    El sistema regará automáticamente cuando la
                    humedad baje de este nivel
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Parámetros Adicionales */}
          <Card className="p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl mb-4">
              Parámetros Ambientales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperaturaMinima">
                  Temperatura Mínima (°C)
                </Label>
                <Input
                  id="temperaturaMinima"
                  type="number"
                  value={config.temperaturaMinima}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      temperaturaMinima: e.target.value,
                    })
                  }
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperaturaMaxima">
                  Temperatura Máxima (°C)
                </Label>
                <Input
                  id="temperaturaMaxima"
                  type="number"
                  value={config.temperaturaMaxima}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      temperaturaMaxima: e.target.value,
                    })
                  }
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="radiacionOptima">
                  Radiación Solar Óptima (W/m²)
                </Label>
                <Input
                  id="radiacionOptima"
                  type="number"
                  value={config.radiacionOptima}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      radiacionOptima: e.target.value,
                    })
                  }
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evapotranspiracionMaxima">
                  Evapotranspiración Máxima (mm/día)
                </Label>
                <Input
                  id="evapotranspiracionMaxima"
                  type="number"
                  value={config.evapotranspiracionMaxima}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      evapotranspiracionMaxima: e.target.value,
                    })
                  }
                  className="rounded-xl"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Botones de Acción */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate("areas")}
              className="flex-1 rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl"
            >
              <Save className="w-5 h-5 mr-2" />
              Guardar Configuración
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
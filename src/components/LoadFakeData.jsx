import React, { useState } from "react";
import { Database, Play, CheckCircle, AlertCircle, Loader } from "lucide-react";

const DataLoader = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const loadFakeData = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    setStatus("Iniciando carga de datos...");

    try {
      // Llamada a tu endpoint Django para cargar datos ficticios
      const response = await fetch(
        "http://127.0.0.1:8000/api/clientes/load_fake_data/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Agregar token CSRF si es necesario
            // 'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setStatus("Datos cargados exitosamente");
      setSuccess(true);

      // Mostrar estadísticas si están disponibles
      if (data.statistics) {
        setStatus(
          `Datos cargados: ${data.statistics.users} usuarios, ${data.statistics.companies} empresas, ${data.statistics.customers} clientes, ${data.statistics.interactions} interacciones`
        );
      }
    } catch (error) {
      console.error("Error loading fake data:", error);
      setError(`Error al cargar datos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetDatabase = async () => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres limpiar la base de datos? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);
    setStatus("Limpiando base de datos...");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/clientes/reset_database/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      setStatus("Base de datos limpiada exitosamente");
      setSuccess(true);
    } catch (error) {
      console.error("Error resetting database:", error);
      setError(`Error al limpiar base de datos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-white mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Cargador de Datos
                </h1>
                <p className="text-blue-100 mt-2">
                  Genera datos ficticios para tu aplicación CRM
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                ¿Qué hace esta herramienta?
              </h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Genera 3 representantes de ventas (usuarios)</li>
                <li>• Crea múltiples compañías</li>
                <li>
                  • Genera 1000 clientes distribuidos entre compañías y
                  representantes
                </li>
                <li>
                  • Crea 500 interacciones por cliente (~500,000 interacciones
                  totales)
                </li>
                <li>
                  • Tipos de interacciones: Call, Email, SMS, Facebook, etc.
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={loadFakeData}
                disabled={loading}
                className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <Play className="h-5 w-5 mr-2" />
                )}
                {loading ? "Cargando..." : "Cargar Datos Ficticios"}
              </button>

              <button
                onClick={resetDatabase}
                disabled={loading}
                className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Database className="h-5 w-5 mr-2" />
                Limpiar Base de Datos
              </button>
            </div>

            {/* Status */}
            {(status || error) && (
              <div className="mt-6">
                {error && (
                  <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                    <div>
                      <h4 className="font-semibold text-red-900">Error</h4>
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {success && status && (
                  <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <h4 className="font-semibold text-green-900">Éxito</h4>
                      <p className="text-green-700">{status}</p>
                    </div>
                  </div>
                )}

                {!success && !error && status && (
                  <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Loader className="animate-spin h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        Procesando
                      </h4>
                      <p className="text-blue-700">{status}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Instrucciones
              </h3>
              <ol className="text-gray-700 text-sm space-y-1 list-decimal list-inside">
                <li>
                  Asegúrate de que tu servidor Django esté ejecutándose en{" "}
                  <code className="bg-gray-200 px-1 rounded">
                    http://127.0.0.1:8000
                  </code>
                </li>
                <li>
                  Haz clic en "Cargar Datos Ficticios" para generar los datos de
                  prueba
                </li>
                <li>
                  Espera a que termine el proceso (puede tomar varios minutos)
                </li>
                <li>Ve al CRM Dashboard para ver los datos cargados</li>
                <li>
                  Usa "Limpiar Base de Datos" si necesitas empezar de nuevo
                </li>
              </ol>
            </div>

            {/* Navigation */}
            <div className="flex justify-center">
              <a
                href="/crm"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ir al CRM Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataLoader;

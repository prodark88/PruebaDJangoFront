import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  Users,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const CRMDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [birthdayFilter, setBirthdayFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  // Datos de ejemplo - En tu caso real, estos vendrían de tu API Django
  const mockCustomers = [
    {
      id: 1,
      firstName: "Ana",
      lastName: "García",
      fullName: "Ana García",
      company: "TechCorp S.A.",
      birthday: new Date("1990-02-15"),
      lastInteraction: {
        date: new Date("2025-06-27"),
        type: "Phone",
      },
    },
    {
      id: 2,
      firstName: "Carlos",
      lastName: "Rodríguez",
      fullName: "Carlos Rodríguez",
      company: "Innovate Ltd.",
      birthday: new Date("1985-07-03"),
      lastInteraction: {
        date: new Date("2025-06-25"),
        type: "Email",
      },
    },
    {
      id: 3,
      firstName: "María",
      lastName: "López",
      fullName: "María López",
      company: "Global Solutions",
      birthday: new Date("1992-12-20"),
      lastInteraction: {
        date: new Date("2025-06-28"),
        type: "SMS",
      },
    },
    {
      id: 4,
      firstName: "Juan",
      lastName: "Pérez",
      fullName: "Juan Pérez",
      company: "StartupXYZ",
      birthday: new Date("1988-06-30"),
      lastInteraction: {
        date: new Date("2025-06-20"),
        type: "Facebook",
      },
    },
    {
      id: 5,
      firstName: "Elena",
      lastName: "Martínez",
      fullName: "Elena Martínez",
      company: "Enterprise Co.",
      birthday: new Date("1995-01-10"),
      lastInteraction: {
        date: new Date("2025-06-26"),
        type: "Phone",
      },
    },
  ];

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/clientes/");
        if (!response.ok) {
          throw new Error("Error al cargar los clientes");
        }
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        // En caso de error, usar datos de ejemplo para desarrollo
        setCustomers(mockCustomers);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Función para formatear fecha de cumpleaños
  const formatBirthday = (date) => {
    const parsedDate = new Date(date); // convertir a Date
    return parsedDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };
  // Función para calcular tiempo transcurrido
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays === 0) return "Today";
    return `${diffDays} days ago`;
  };

  // Función para obtener icono de interacción
  const getInteractionIcon = (type) => {
    switch (type.toLowerCase()) {
      case "phone":
        return <Phone className="w-4 h-4 text-blue-500" />;
      case "email":
        return <Mail className="w-4 h-4 text-green-500" />;
      case "sms":
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case "facebook":
        return <Users className="w-4 h-4 text-blue-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  // Función para verificar si es cumpleaños esta semana
  const isBirthdayThisWeek = (birthday) => {
    const today = new Date();
    const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const parsedBirthday =
      birthday instanceof Date ? birthday : new Date(birthday);

    const thisYearBirthday = new Date(
      today.getFullYear(),
      parsedBirthday.getMonth(),
      parsedBirthday.getDate()
    );

    return thisYearBirthday >= today && thisYearBirthday <= oneWeekFromNow;
  };

  // Filtrar y ordenar clientes
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter((customer) => {
      const matchesSearch =
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesBirthday = true;
      if (birthdayFilter === "thisWeek") {
        matchesBirthday = isBirthdayThisWeek(customer.birthday);
      }

      return matchesSearch && matchesBirthday;
    });

    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case "name":
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
          break;
        case "company":
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case "birthday":
          aValue = a.birthday;
          bValue = b.birthday;
          break;
        case "lastInteraction":
          aValue = a.lastInteraction.date;
          bValue = b.lastInteraction.date;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [customers, searchTerm, birthdayFilter, sortConfig]);

  // Función para manejar ordenamiento
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // Componente de encabezado de tabla ordenable
  const SortableHeader = ({ sortKey, children }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortConfig.key === sortKey &&
          (sortConfig.direction === "asc" ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          ))}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Gestiona tus clientes y sus interacciones
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o empresa..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Birthday Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={birthdayFilter}
                onChange={(e) => setBirthdayFilter(e.target.value)}
              >
                <option value="">Todos los cumpleaños</option>
                <option value="thisWeek">Cumpleaños esta semana</option>
              </select>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-600">
                {filteredAndSortedCustomers.length} cliente
                {filteredAndSortedCustomers.length !== 1 ? "s" : ""} encontrado
                {filteredAndSortedCustomers.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <SortableHeader sortKey="name">
                    Nombre Completo
                  </SortableHeader>
                  <SortableHeader sortKey="company">Compañía</SortableHeader>
                  <SortableHeader sortKey="birthday">Cumpleaños</SortableHeader>
                  <SortableHeader sortKey="lastInteraction">
                    Última Interacción
                  </SortableHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {customer.firstName[0]}
                          {customer.lastName[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.fullName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {formatBirthday(customer.birthday)}
                        </span>
                        {isBirthdayThisWeek(customer.birthday) && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Esta semana
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getInteractionIcon(customer.lastInteraction.type)}
                        <span className="ml-2 text-sm text-gray-900">
                          {getTimeAgo(customer.lastInteraction.date)} (
                          {customer.lastInteraction.type})
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No se encontraron clientes
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta ajustar los filtros de búsqueda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;

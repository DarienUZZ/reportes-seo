import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Topbar } from "../components/layout/Topbar";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { ClienteFormModal } from "../components/admin/ClienteFormModal";
import { ConfirmDialog } from "../components/admin/ConfirmDialog";
import { useClientes } from "../hooks/useClientes";

export default function AdminPage() {
  const navigate = useNavigate();
  const {
    clientes,
    loading,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
  } = useClientes();

  const [filtro, setFiltro] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos"); // todos, activos, inactivos
  const [showForm, setShowForm] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(null);

  const filtrados = clientes.filter((c) => {
    if (filtroEstado === "activos" && !c.activo) return false;
    if (filtroEstado === "inactivos" && c.activo) return false;
    if (filtro) {
      const q = filtro.toLowerCase();
      return (
        c.nombre.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function handleAbrirNuevo() {
    setClienteEditando(null);
    setShowForm(true);
  }

  function handleEditar(cliente) {
    setClienteEditando(cliente);
    setShowForm(true);
    setMenuAbierto(null);
  }

  function handleEliminar(cliente) {
    setClienteAEliminar(cliente);
    setMenuAbierto(null);
  }

  async function handleSave(datos) {
    if (clienteEditando) {
      await actualizarCliente(clienteEditando.id, datos);
    } else {
      await crearCliente(datos);
    }
  }

  const activos = clientes.filter((c) => c.activo).length;
  const inactivos = clientes.filter((c) => !c.activo).length;

  return (
    <Layout>
      <Topbar />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black">
              Clientes
            </h1>
            <p className="text-sm text-[#626264] mt-0.5">
              Gestioná tus clientes y sus reportes SEO
            </p>
          </div>
          <button
            onClick={handleAbrirNuevo}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#115A36] hover:bg-[#0d4528] text-white text-sm font-semibold rounded-lg transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nuevo cliente
          </button>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wider text-[#626264] font-medium">
              Total
            </p>
            <p className="text-2xl font-bold text-black mt-1">
              {clientes.length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wider text-[#626264] font-medium">
              Activos
            </p>
            <p className="text-2xl font-bold text-[#115A36] mt-1">{activos}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wider text-[#626264] font-medium">
              Inactivos
            </p>
            <p className="text-2xl font-bold text-[#999999] mt-1">
              {inactivos}
            </p>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999999]" />
              <input
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                placeholder="Buscar por nombre o slug..."
                className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-[#F1F1F4] bg-white focus:outline-none focus:ring-2 focus:ring-[#115A36]/20 focus:border-[#115A36] transition"
              />
            </div>
            <div className="flex items-center gap-1 p-1 bg-[#F8F8FB] rounded-lg">
              {[
                { value: "todos", label: "Todos" },
                { value: "activos", label: "Activos" },
                { value: "inactivos", label: "Inactivos" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFiltroEstado(opt.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${filtroEstado === opt.value ? "bg-white text-black shadow-sm" : "text-[#626264] hover:text-black"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Lista de clientes */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-sm text-[#626264]">
              {clientes.length === 0
                ? "Aún no tenés clientes"
                : "No se encontraron resultados"}
            </p>
            {clientes.length === 0 && (
              <button
                onClick={handleAbrirNuevo}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#115A36] hover:bg-[#0d4528] text-white text-sm font-semibold rounded-lg transition"
              >
                <Plus className="h-4 w-4" />
                Crear primer cliente
              </button>
            )}
          </Card>
        ) : (
          <div className="space-y-2">
            {filtrados.map((c) => (
              <Card
                key={c.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{ backgroundColor: c.color_hex || "#115A36" }}
                  >
                    {c.nombre?.[0]?.toUpperCase() || "?"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-black truncate">
                        {c.nombre}
                      </h3>
                      {c.activo ? (
                        <Badge variant="green">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="gray">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactivo
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#626264]">
                      <span className="font-mono">/{c.slug}</span>
                      {c.ga4_property_id &&
                        c.ga4_property_id !== "properties/PENDIENTE" && (
                          <span className="hidden sm:inline truncate">
                            GA4: {c.ga4_property_id.replace("properties/", "")}
                          </span>
                        )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/cliente/${c.slug}`)}
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#115A36] hover:bg-[#E6F5EC] rounded-lg transition"
                    >
                      Ver reporte
                      <ExternalLink className="h-3 w-3" />
                    </button>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuAbierto(menuAbierto === c.id ? null : c.id)
                        }
                        className="p-2 rounded-lg hover:bg-[#F8F8FB] text-[#626264] transition"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {menuAbierto === c.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setMenuAbierto(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#F1F1F4] rounded-lg shadow-lg py-1 z-20">
                            <button
                              onClick={() => {
                                navigate(`/cliente/${c.slug}`);
                                setMenuAbierto(null);
                              }}
                              className="sm:hidden w-full flex items-center gap-2 px-3 py-2 text-xs text-black hover:bg-[#F8F8FB] transition text-left"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Ver reporte
                            </button>
                            <button
                              onClick={() => handleEditar(c)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-black hover:bg-[#F8F8FB] transition text-left"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                              Editar
                            </button>
                            <div className="h-px bg-[#F1F1F4] my-1" />
                            <button
                              onClick={() => handleEliminar(c)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#B91C1C] hover:bg-[#FDEBEB] transition text-left"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de form */}
      {showForm && (
        <ClienteFormModal
          cliente={clienteEditando}
          onClose={() => {
            setShowForm(false);
            setClienteEditando(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Modal de confirmación */}
      {clienteAEliminar && (
        <ConfirmDialog
          titulo="Eliminar cliente"
          mensaje={`¿Seguro que querés eliminar "${clienteAEliminar.nombre}"? Se borrarán todos sus reportes históricos. Esta acción no se puede deshacer.`}
          textoConfirmar="Eliminar"
          onConfirm={() => eliminarCliente(clienteAEliminar.id)}
          onCancel={() => setClienteAEliminar(null)}
        />
      )}
    </Layout>
  );
}

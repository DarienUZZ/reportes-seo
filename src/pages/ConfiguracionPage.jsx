import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUsuarios } from "../hooks/useUsuarios";
import { Layout } from "../components/layout/Layout";
import { Topbar } from "../components/layout/Topbar";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import {
  User,
  Users,
  Cog,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Shield,
  Eye,
  Mail,
  Calendar,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function ConfiguracionPage() {
  const { profile, isAdmin } = useAuth();
  const [tab, setTab] = useState("perfil");

  const tabs = [
    { id: "perfil", label: "Mi perfil", icon: User, visible: true },
    { id: "usuarios", label: "Usuarios", icon: Users, visible: isAdmin },
    { id: "sistema", label: "Sistema", icon: Cog, visible: isAdmin },
  ];

  return (
    <Layout>
      {({ openSidebar }) => (
        <>
          <Topbar onMenuClick={openSidebar} />

          <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto overflow-x-hidden">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-black">
                Configuración
              </h1>
              <p className="text-sm text-[#626264] mt-0.5">
                Gestioná tu cuenta, usuarios del sistema y ajustes generales
              </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#F1F1F4] rounded-lg mb-6 overflow-x-auto">
              {tabs
                .filter((t) => t.visible)
                .map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={clsx(
                        "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                        tab === t.id
                          ? "bg-white text-black shadow-sm"
                          : "text-[#626264] hover:text-black",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {t.label}
                    </button>
                  );
                })}
            </div>

            {tab === "perfil" && <TabPerfil />}
            {tab === "usuarios" && isAdmin && <TabUsuarios />}
            {tab === "sistema" && isAdmin && <TabSistema />}
          </div>
        </>
      )}
    </Layout>
  );
}

// ───────────────────────────────────────────
// TAB: MI PERFIL
// ───────────────────────────────────────────
function TabPerfil() {
  const { profile, user } = useAuth();
  const [nombre, setNombre] = useState(profile?.nombre || "");
  const [savingNombre, setSavingNombre] = useState(false);
  const [msgNombre, setMsgNombre] = useState(null);

  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  const [passConfirma, setPassConfirma] = useState("");
  const [savingPass, setSavingPass] = useState(false);
  const [msgPass, setMsgPass] = useState(null);

  async function guardarNombre(e) {
    e.preventDefault();
    setMsgNombre(null);
    setSavingNombre(true);
    try {
      const { error } = await supabase
        .from("usuarios")
        .update({ nombre })
        .eq("id", user.id);
      if (error) throw error;
      setMsgNombre({ tipo: "ok", texto: "Nombre actualizado" });
      setTimeout(() => setMsgNombre(null), 3000);
    } catch (err) {
      setMsgNombre({ tipo: "error", texto: err.message });
    } finally {
      setSavingNombre(false);
    }
  }

  async function cambiarPassword(e) {
    e.preventDefault();
    setMsgPass(null);

    if (passNueva !== passConfirma) {
      setMsgPass({ tipo: "error", texto: "Las contraseñas no coinciden" });
      return;
    }
    if (passNueva.length < 6) {
      setMsgPass({
        tipo: "error",
        texto: "La contraseña debe tener al menos 6 caracteres",
      });
      return;
    }

    setSavingPass(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passNueva });
      if (error) throw error;
      setMsgPass({ tipo: "ok", texto: "Contraseña actualizada correctamente" });
      setPassActual("");
      setPassNueva("");
      setPassConfirma("");
      setTimeout(() => setMsgPass(null), 3000);
    } catch (err) {
      setMsgPass({ tipo: "error", texto: err.message });
    } finally {
      setSavingPass(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Datos del perfil */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-[#259D63] flex items-center justify-center text-white text-xl font-bold shrink-0">
            {profile?.nombre?.[0]?.toUpperCase() ||
              profile?.email?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-black truncate">
              {profile?.nombre || "Sin nombre"}
            </h3>
            <p className="text-sm text-[#626264] truncate">{profile?.email}</p>
            <Badge
              variant={profile?.rol === "admin" ? "green" : "gray"}
              className="mt-1.5"
            >
              {profile?.rol === "admin" ? (
                <>
                  <Shield className="h-3 w-3 mr-1" /> Administrador
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3 mr-1" /> Lector
                </>
              )}
            </Badge>
          </div>
        </div>

        <form onSubmit={guardarNombre} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[#626264] uppercase tracking-wider">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-[#F1F1F4] bg-white focus:outline-none focus:ring-2 focus:ring-[#115A36]/20 focus:border-[#115A36] transition"
            />
          </div>

          {msgNombre && (
            <div
              className={clsx(
                "flex items-start gap-2 p-2.5 rounded-lg text-xs",
                msgNombre.tipo === "ok"
                  ? "bg-[#E6F5EC] text-[#115A36]"
                  : "bg-[#FDEBEB] text-[#7F1D1D]",
              )}
            >
              {msgNombre.tipo === "ok" ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              )}
              <span>{msgNombre.texto}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={savingNombre || nombre === (profile?.nombre || "")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#115A36] hover:bg-[#0d4528] text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingNombre && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Guardar cambios
          </button>
        </form>
      </Card>

      {/* Cambiar contraseña */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-black mb-1">
          Cambiar contraseña
        </h3>
        <p className="text-xs text-[#626264] mb-4">
          Mantén tu cuenta segura con una contraseña fuerte
        </p>

        <form onSubmit={cambiarPassword} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[#626264] uppercase tracking-wider">
              Nueva contraseña
            </label>
            <input
              type="password"
              required
              value={passNueva}
              onChange={(e) => setPassNueva(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-[#F1F1F4] bg-white focus:outline-none focus:ring-2 focus:ring-[#115A36]/20 focus:border-[#115A36] transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#626264] uppercase tracking-wider">
              Confirmar contraseña
            </label>
            <input
              type="password"
              required
              value={passConfirma}
              onChange={(e) => setPassConfirma(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-[#F1F1F4] bg-white focus:outline-none focus:ring-2 focus:ring-[#115A36]/20 focus:border-[#115A36] transition"
            />
          </div>

          {msgPass && (
            <div
              className={clsx(
                "flex items-start gap-2 p-2.5 rounded-lg text-xs",
                msgPass.tipo === "ok"
                  ? "bg-[#E6F5EC] text-[#115A36]"
                  : "bg-[#FDEBEB] text-[#7F1D1D]",
              )}
            >
              {msgPass.tipo === "ok" ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              )}
              <span>{msgPass.texto}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={savingPass || !passNueva || !passConfirma}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#115A36] hover:bg-[#0d4528] text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingPass && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Cambiar contraseña
          </button>
        </form>
      </Card>
    </div>
  );
}

// ───────────────────────────────────────────
// TAB: USUARIOS
// ───────────────────────────────────────────
function TabUsuarios() {
  const { profile } = useAuth();
  const { usuarios, loading, toggleActivo, cambiarRol } = useUsuarios();
  const [procesando, setProcesando] = useState(null);

  async function handleToggleRol(usuario) {
    if (usuario.id === profile.id) return;
    setProcesando(usuario.id);
    try {
      const nuevoRol = usuario.rol === "admin" ? "viewer" : "admin";
      await cambiarRol(usuario.id, nuevoRol);
    } catch (err) {
      alert(err.message);
    } finally {
      setProcesando(null);
    }
  }

  async function handleToggleActivo(usuario) {
    if (usuario.id === profile.id) return;
    setProcesando(usuario.id);
    try {
      await toggleActivo(usuario.id, !usuario.activo);
    } catch (err) {
      alert(err.message);
    } finally {
      setProcesando(null);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-[#E6E8F8] flex items-center justify-center shrink-0">
            <AlertCircle className="h-4 w-4 text-[#0017C1]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-black mb-1">
              Crear usuarios nuevos
            </h3>
            <p className="text-xs text-[#626264] leading-relaxed">
              Por ahora la creación de usuarios se hace desde Supabase. Andá a{" "}
              <span className="font-semibold">
                Authentication → Users → Add user
              </span>
              , creás el usuario y luego desde acá podés cambiarle el rol.
            </p>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {usuarios.map((u) => {
            const esYo = u.id === profile.id;
            const esProcesando = procesando === u.id;
            return (
              <Card key={u.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-11 w-11 rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${u.rol === "admin" ? "bg-[#115A36]" : "bg-[#666666]"}`}
                  >
                    {u.nombre?.[0]?.toUpperCase() ||
                      u.email?.[0]?.toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-black truncate">
                        {u.nombre || "Sin nombre"}
                      </h3>
                      {esYo && <Badge variant="blue">Vos</Badge>}
                      <Badge variant={u.rol === "admin" ? "green" : "gray"}>
                        {u.rol === "admin" ? (
                          <>
                            <Shield className="h-3 w-3 mr-1" /> Admin
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" /> Lector
                          </>
                        )}
                      </Badge>
                      {!u.activo && <Badge variant="gray">Inactivo</Badge>}
                    </div>
                    <p className="text-xs text-[#626264] mt-0.5 truncate flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {u.email}
                    </p>
                    <p className="text-[10px] text-[#999999] mt-0.5 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Creado{" "}
                      {formatDistanceToNow(new Date(u.created_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>

                  {!esYo && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleToggleRol(u)}
                        disabled={esProcesando}
                        className="text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-md hover:bg-[#F8F8FB] text-[#626264] transition disabled:opacity-50"
                      >
                        {u.rol === "admin" ? "Hacer lector" : "Hacer admin"}
                      </button>
                      <button
                        onClick={() => handleToggleActivo(u)}
                        disabled={esProcesando}
                        className="text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-md hover:bg-[#F8F8FB] text-[#626264] transition disabled:opacity-50"
                      >
                        {u.activo ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────
// TAB: SISTEMA
// ───────────────────────────────────────────
function TabSistema() {
  const workerUrl = import.meta.env.VITE_WORKER_URL;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const serviceAccountEmail =
    "seo-dashboard-worker@seo-dashboard-499617.iam.gserviceaccount.com";

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-black mb-4">Integraciones</h3>

        <div className="space-y-4">
          <InfoRow
            label="URL del Worker"
            value={workerUrl}
            sub="Backend que conecta con GA4 y Search Console"
          />
          <InfoRow
            label="URL de Supabase"
            value={supabaseUrl}
            sub="Base de datos y autenticación"
          />
          <InfoRow
            label="Service Account (Google)"
            value={serviceAccountEmail}
            sub="Email para dar acceso en GA4 y Search Console"
            copiable
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-black mb-4">
          Caché de datos
        </h3>
        <p className="text-xs text-[#626264] mb-4">
          Los reportes se actualizan automáticamente cada 6 horas. Si querés
          forzar una actualización, usá el botón "Actualizar" en el reporte de
          cada cliente.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-[#F8F8FB]">
            <p className="text-[10px] uppercase tracking-wider text-[#626264] font-medium">
              Duración del caché
            </p>
            <p className="text-lg font-bold text-black mt-1">6 horas</p>
          </div>
          <div className="p-3 rounded-lg bg-[#F8F8FB]">
            <p className="text-[10px] uppercase tracking-wider text-[#626264] font-medium">
              Fuentes de datos
            </p>
            <p className="text-lg font-bold text-black mt-1">2</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-black mb-4">
          Versión del sistema
        </h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#626264]">SEO Dashboard</span>
          <Badge variant="green">v1.0.0</Badge>
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ label, value, sub, copiable }) {
  const [copiado, setCopiado] = useState(false);

  function copiar() {
    navigator.clipboard.writeText(value);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-[#F8F8FB]">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-[#626264] font-medium">
          {label}
        </p>
        <p className="text-xs font-mono text-black mt-1 break-all">
          {value || "—"}
        </p>
        {sub && <p className="text-[10px] text-[#999999] mt-1">{sub}</p>}
      </div>
      {copiable && value && (
        <button
          onClick={copiar}
          className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md hover:bg-white text-[#626264] transition shrink-0"
        >
          {copiado ? "✓ Copiado" : "Copiar"}
        </button>
      )}
    </div>
  );
}

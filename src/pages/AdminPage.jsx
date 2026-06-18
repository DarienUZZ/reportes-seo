import { useAuth } from "../hooks/useAuth";
import { Layout } from "../components/layout/Layout";
import { LogOut } from "lucide-react";

export default function AdminPage() {
  const { profile, signOut } = useAuth();

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-black">
              Panel de administración
            </h1>
            <p className="text-sm text-[#626264] mt-1">
              Bienvenido, {profile?.nombre || profile?.email}
            </p>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#F1F1F4] bg-white hover:bg-[#F8F8FB] text-[#333333] text-sm font-medium transition"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>

        <div className="bg-white border border-[#F1F1F4] rounded-2xl p-8 text-center">
          <p className="text-[#626264]">Próximamente: gestión de clientes</p>
        </div>
      </div>
    </Layout>
  );
}

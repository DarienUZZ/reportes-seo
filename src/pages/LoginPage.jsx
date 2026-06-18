import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Lock, Mail, Loader2, AlertCircle, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { signIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8FB]">
        <Loader2 className="h-6 w-6 text-[#115A36] animate-spin" />
      </div>
    );
  }

  if (user) return <Navigate to="/admin" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/admin");
    } catch (err) {
      setError(
        err.message === "Invalid login credentials"
          ? "Email o contraseña incorrectos"
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8FB] px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#115A36]">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="bg-white border border-[#F1F1F4] rounded-2xl shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-black">Iniciar sesión</h1>
            <p className="text-sm text-[#626264] mt-1">
              SEO Dashboard · Panel admin
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#626264] uppercase tracking-wider">
                Email
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999999]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-[#F1F1F4] bg-white focus:outline-none focus:ring-2 focus:ring-[#115A36]/20 focus:border-[#115A36] transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#626264] uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999999]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-[#F1F1F4] bg-white focus:outline-none focus:ring-2 focus:ring-[#115A36]/20 focus:border-[#115A36] transition"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#FDEBEB] border border-[#F5BFBF]">
                <AlertCircle className="h-4 w-4 text-[#B91C1C] shrink-0 mt-0.5" />
                <p className="text-xs text-[#7F1D1D]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#115A36] hover:bg-[#0d4528] text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#999999] mt-6">
          ¿Olvidaste tu contraseña? Contactá al administrador
        </p>
      </div>
    </div>
  );
}

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8FB]">
        <Loader2 className="h-6 w-6 text-[#115A36] animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/login" replace />;

  return children;
}

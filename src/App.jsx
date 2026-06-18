import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ReportePage from "./pages/ReportePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/cliente/rehabcanino" replace />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cliente/:slug" element={<ReportePage />} />
          <Route path="/cliente/:slug/:anio/:mes" element={<ReportePage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

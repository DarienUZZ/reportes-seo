import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ReportePage from "./pages/ReportePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/cliente/rehabcanino" replace />}
        />
        <Route path="/cliente/:slug" element={<ReportePage />} />
        <Route path="/cliente/:slug/:anio/:mes" element={<ReportePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

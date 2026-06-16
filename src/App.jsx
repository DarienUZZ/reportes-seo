import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<h1 className="text-2xl font-bold p-8">SEO Dashboard</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

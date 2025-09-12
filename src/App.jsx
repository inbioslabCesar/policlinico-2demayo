


import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./components/Dashboard";
import PacientesPage from "./pages/PacientesPage";
import UsuariosPage from "./pages/UsuariosPage";


function App() {
  const [usuario, setUsuario] = useState(() => {
    // Restaurar usuario desde localStorage si existe
    const stored = localStorage.getItem('usuario');
    return stored ? JSON.parse(stored) : null;
  });

  // Al hacer logout, limpiar localStorage
  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  useEffect(() => {
    // Si cambia el usuario, sincronizar localStorage
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    }
  }, [usuario]);

  return (
    <BrowserRouter>
      {usuario ? (
        <DashboardLayout usuario={usuario} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard usuario={usuario} />} />
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            {/* Puedes agregar más rutas aquí */}
          </Routes>
        </DashboardLayout>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-blue-500 to-green-400">
          <Login onLogin={setUsuario} />
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;

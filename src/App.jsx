import LaboratorioPanelPage from "./pages/LaboratorioPanelPage";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./components/Dashboard";
import PacientesPage from "./pages/PacientesPage";
import UsuariosPage from "./pages/UsuariosPage";
import AgendarConsultaPage from "./pages/AgendarConsultaPage";
import MedicoConsultasPage from "./pages/MedicoConsultasPage";
import MedicosPage from "./pages/MedicosPage";
import PanelMedicoPage from "./pages/PanelMedicoPage";
import HistoriaClinicaPage from "./historia_clinica/HistoriaClinicaPage";
import EnfermeroPanelPage from "./pages/EnfermeroPanelPage";
import SolicitudLaboratorioPage from "./pages/SolicitudLaboratorioPage";
import ExamenesLaboratorioCrudPage from "./pages/ExamenesLaboratorioCrudPage";


function App() {
  const [usuario, setUsuario] = useState(() => {
    // Restaurar usuario o medico desde sessionStorage si existe
    const storedUsuario = sessionStorage.getItem('usuario');
    const storedMedico = sessionStorage.getItem('medico');
    if (storedUsuario) return JSON.parse(storedUsuario);
    if (storedMedico) return JSON.parse(storedMedico);
    return null;
  });

  // Al hacer logout, limpiar sessionStorage
  const handleLogout = () => {
    setUsuario(null);
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('medico');
    window.location.href = '/';
  };

  useEffect(() => {
    // Si cambia el usuario, sincronizar sessionStorage
    if (usuario) {
      if (usuario.rol === 'medico') {
        sessionStorage.setItem('medico', JSON.stringify(usuario));
        sessionStorage.removeItem('usuario');
      } else {
        sessionStorage.setItem('usuario', JSON.stringify(usuario));
        sessionStorage.removeItem('medico');
      }
    }
  }, [usuario]);

  return (
    <BrowserRouter>
      {usuario ? (
        <DashboardLayout usuario={usuario} onLogout={handleLogout}>
          <Routes>
            {/* Redirigir a médicos y laboratoristas que intenten acceder a '/' */}
            <Route path="/" element={
              usuario?.rol === 'medico'
                ? <Navigate to="/mis-consultas" replace />
                : usuario?.rol === 'laboratorista'
                  ? <Navigate to="/panel-laboratorio" replace />
                  : <Dashboard usuario={usuario} />
            } />
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/agendar-consulta" element={<AgendarConsultaPage />} />
            {/* Solo visible para médicos */}
            {usuario?.rol === 'medico' && (
              <>
                <Route path="/mis-consultas" element={<MedicoConsultasPage usuario={usuario} />} />
                <Route path="/panel-medico" element={<PanelMedicoPage />} />
                <Route path="/historia-clinica/:pacienteId" element={<HistoriaClinicaPage />} />
                <Route path="/historia-clinica/:pacienteId/:consultaId" element={<HistoriaClinicaPage />} />
                <Route path="/solicitud-laboratorio/:consultaId" element={<SolicitudLaboratorioPage />} />
              </>
            )}
            {/* Solo visible para enfermeros */}
            {usuario?.rol === 'enfermero' && (
              <Route path="/panel-enfermero" element={<EnfermeroPanelPage />} />
            )}
            {/* Solo visible para administradores */}
            {usuario?.rol === 'administrador' && (
              <Route path="/medicos" element={<MedicosPage />} />
            )}
            {/* Solo visible para laboratoristas */}
            {usuario?.rol === 'laboratorista' && (
              <>
                <Route path="/panel-laboratorio" element={<LaboratorioPanelPage />} />
                <Route path="/examenes-laboratorio" element={<ExamenesLaboratorioCrudPage />} />
              </>
            )}
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

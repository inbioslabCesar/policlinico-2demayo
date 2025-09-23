import LaboratorioPanelPage from "./pages/LaboratorioPanelPage";
import ResultadosLaboratorioPage from "./pages/ResultadosLaboratorioPage";
import ReportesPage from "./pages/ReportesPage";
import ListaConsultasPage from "./pages/ListaConsultasPage";
import ReportePacientesPage from "./pages/ReportePacientesPage";
import ReporteFinanzasPage from "./pages/ReporteFinanzasPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MedicamentosList from "./farmacia/MedicamentosList";
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
import HistorialConsultasMedico from "./historia_clinica/HistorialConsultasMedico";
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

  // Al hacer logout, limpiar sessionStorage y destruir sesión en backend
  const handleLogout = async () => {
    try {
      await fetch('/policlinico-2demayo/api_logout.php', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Error al cerrar sesión en el backend:', err);
    }
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
                  : usuario?.rol === 'enfermero'
                    ? <Navigate to="/panel-enfermero" replace />
                    : (usuario?.rol === 'químico' || usuario?.rol === 'quimico')
                      ? <Navigate to="/medicamentos" replace />
                      : <Dashboard usuario={usuario} />
            } />
            <Route path="/pacientes" element={
              <ProtectedRoute usuario={usuario} rolesPermitidos={["administrador","recepcionista"]}>
                <PacientesPage />
              </ProtectedRoute>
            } />
            <Route path="/usuarios" element={
              <ProtectedRoute usuario={usuario} rolesPermitidos={["administrador"]}>
                <UsuariosPage />
              </ProtectedRoute>
            } />
            <Route path="/agendar-consulta" element={
              <ProtectedRoute usuario={usuario} rolesPermitidos={["administrador","recepcionista"]}>
                <AgendarConsultaPage />
              </ProtectedRoute>
            } />
            {/* Solo visible para médicos */}
            {usuario?.rol === 'medico' && (
              <>
                <Route path="/mis-consultas" element={
                  <ProtectedRoute usuario={usuario} rolesPermitidos={["medico"]}>
                    <MedicoConsultasPage usuario={usuario} />
                  </ProtectedRoute>
                } />
                <Route path="/panel-medico" element={
                  <ProtectedRoute usuario={usuario} rolesPermitidos={["medico"]}>
                    <PanelMedicoPage />
                  </ProtectedRoute>
                } />
                <Route path="/historia-clinica/:pacienteId" element={
                  <ProtectedRoute usuario={usuario} rolesPermitidos={["medico"]}>
                    <HistoriaClinicaPage />
                  </ProtectedRoute>
                } />
                <Route path="/historia-clinica/:pacienteId/:consultaId" element={
                  <ProtectedRoute usuario={usuario} rolesPermitidos={["medico"]}>
                    <HistoriaClinicaPage />
                  </ProtectedRoute>
                } />
                <Route path="/historial-consultas" element={
                  <ProtectedRoute usuario={usuario} rolesPermitidos={["medico"]}>
                    <HistorialConsultasMedico medicoId={usuario.id} />
                  </ProtectedRoute>
                } />
                <Route path="/solicitud-laboratorio/:consultaId" element={
                  <ProtectedRoute usuario={usuario} rolesPermitidos={["medico"]}>
                    <SolicitudLaboratorioPage />
                  </ProtectedRoute>
                } />
                <Route path="/resultados-laboratorio/:consultaId" element={
                  <ProtectedRoute usuario={usuario} rolesPermitidos={["medico"]}>
                    <ResultadosLaboratorioPage />
                  </ProtectedRoute>
                } />
              </>
            )}
            {/* Solo visible para enfermeros */}
            {usuario?.rol === 'enfermero' && (
              <Route path="/panel-enfermero" element={
                <ProtectedRoute usuario={usuario} rolesPermitidos={["enfermero"]}>
                  <EnfermeroPanelPage />
                </ProtectedRoute>
              } />
            )}
            {/* Solo visible para administradores y recepcionistas */}
            {(usuario?.rol === 'administrador' || usuario?.rol === 'recepcionista') && (
              <>
                <Route path="/medicos" element={
                  <ProtectedRoute usuario={usuario} rolesPermitidos={["administrador"]}>
                    <MedicosPage />
                  </ProtectedRoute>
                } />
                <Route path="/reportes" element={
                  <ProtectedRoute usuario={usuario} rolesPermitidos={["administrador","recepcionista"]}>
                    <ReportesPage />
                  </ProtectedRoute>
                } />
                <Route path="/lista-consultas" element={
                  <ProtectedRoute usuario={usuario} rolesPermitidos={["administrador","recepcionista"]}>
                    <ListaConsultasPage />
                  </ProtectedRoute>
                } />
                <Route path="/reporte-pacientes" element={
                  <ProtectedRoute usuario={usuario} rolesPermitidos={["administrador","recepcionista"]}>
                    <ReportePacientesPage />
                  </ProtectedRoute>
                } />
                <Route path="/reporte-finanzas" element={
                  <ProtectedRoute usuario={usuario} rolesPermitidos={["administrador","recepcionista"]}>
                    <ReporteFinanzasPage />
                  </ProtectedRoute>
                } />
              </>
            )}
            {/* Solo visible para laboratoristas */}
            {usuario?.rol === 'laboratorista' && (
              <>
                <Route path="/panel-laboratorio" element={
                  <ProtectedRoute usuario={usuario} rolesPermitidos={["laboratorista"]}>
                    <LaboratorioPanelPage />
                  </ProtectedRoute>
                } />
                <Route path="/examenes-laboratorio" element={
                  <ProtectedRoute usuario={usuario} rolesPermitidos={["laboratorista"]}>
                    <ExamenesLaboratorioCrudPage />
                  </ProtectedRoute>
                } />
              </>
            )}
            {/* Solo visible para químicos */}
            {(usuario?.rol === 'químico' || usuario?.rol === 'quimico') && (
              <Route path="/medicamentos" element={
                <ProtectedRoute usuario={usuario} rolesPermitidos={["químico","quimico"]}>
                  <MedicamentosList />
                </ProtectedRoute>
              } />
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

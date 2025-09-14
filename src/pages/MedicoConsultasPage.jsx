import React from "react";
import MedicoConsultas from "../components/MedicoConsultas";

// El id del médico debe venir del usuario logueado (clave 'medico' en sessionStorage)
const medicoId = JSON.parse(sessionStorage.getItem('medico'))?.id;

function MedicoConsultasPage() {
  if (!medicoId) {
    return <div className="text-center mt-10 text-red-600 font-bold">No se encontró el médico logueado.</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-center mt-6 mb-4">Mis Consultas</h1>
      <MedicoConsultas medicoId={medicoId} />
    </div>
  );
}

export default MedicoConsultasPage;

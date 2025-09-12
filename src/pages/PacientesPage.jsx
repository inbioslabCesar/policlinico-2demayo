import React, { useState } from "react";
import PacienteForm from "../components/PacienteForm";
import PacienteList from "../components/PacienteList";

function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);

  const agregarPaciente = () => {
    // Aquí deberías recargar la lista desde la BD
    // Por ahora solo simula un refresh
    setPacientes([
      ...pacientes,
      { id: pacientes.length + 1, nombres: "Nuevo", apellidos: "Paciente", edad: 30 },
    ]);
  };

  return (
    <div>
      <PacienteForm onPacienteCreado={agregarPaciente} />
      <PacienteList pacientes={pacientes} />
    </div>
  );
}

export default PacientesPage;

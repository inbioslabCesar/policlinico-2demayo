import React from "react";

function PacienteResumen({ paciente }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
      <div className="font-bold text-blue-800">Paciente encontrado:</div>
      <div><span className="font-semibold">Nombre:</span> {paciente.nombre}</div>
      <div><span className="font-semibold">Apellido:</span> {paciente.apellido}</div>
      <div><span className="font-semibold">DNI:</span> {paciente.dni}</div>
      <div><span className="font-semibold">Historia Clínica:</span> {paciente.historia_clinica}</div>
      {paciente.fecha_nacimiento && (
        <div><span className="font-semibold">Fecha de nacimiento:</span> {paciente.fecha_nacimiento}</div>
      )}
      {paciente.sexo && (
        <div><span className="font-semibold">Sexo:</span> {paciente.sexo}</div>
      )}
      {paciente.direccion && (
        <div><span className="font-semibold">Dirección:</span> {paciente.direccion}</div>
      )}
      {paciente.telefono && (
        <div><span className="font-semibold">Teléfono:</span> {paciente.telefono}</div>
      )}
      {paciente.email && (
        <div><span className="font-semibold">Email:</span> {paciente.email}</div>
      )}
    </div>
  );
}

export default PacienteResumen;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../config/config";

function HistoriaClinicaPage() {
  const { pacienteId } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pacienteId) return;
    fetch(`${BASE_URL}api_pacientes.php?id=${pacienteId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.paciente) setPaciente(data.paciente);
        else setError(data.error || "No se encontró el paciente");
        setLoading(false);
      })
      .catch(() => {
        setError("Error de conexión con el servidor");
        setLoading(false);
      });
  }, [pacienteId]);

  if (loading) return <div className="p-4">Cargando historia clínica...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!paciente) return <div className="p-4">No se encontró el paciente.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Historia Clínica</h2>
      {/* Datos básicos */}
      <div className="mb-2"><b>Nombre:</b> {paciente.nombre} {paciente.apellido}</div>
      <div className="mb-2"><b>DNI:</b> {paciente.dni}</div>
      <div className="mb-2"><b>Historia Clínica:</b> {paciente.historia_clinica}</div>
      <div className="mb-2"><b>Edad:</b> {paciente.edad} {paciente.edad_unidad}</div>
      <div className="mb-2"><b>Sexo:</b> {paciente.sexo}</div>
      <div className="mb-2"><b>Dirección:</b> {paciente.direccion}</div>
      <div className="mb-2"><b>Teléfono:</b> {paciente.telefono}</div>
      <div className="mb-2"><b>Email:</b> {paciente.email}</div>

      {/* Secciones estructuradas para la historia clínica */}
      <hr className="my-4" />
      <h3 className="text-lg font-semibold mb-2">Triaje</h3>
      <div className="mb-2 flex flex-wrap gap-4">
        <div><b>P/A:</b> {/* presión arterial */}</div>
        <div><b>FC:</b> {/* frecuencia cardiaca */}</div>
        <div><b>FR:</b> {/* frecuencia respiratoria */}</div>
        <div><b>T:</b> {/* temperatura */}</div>
        <div><b>SAT O2:</b> {/* saturación de oxígeno */}</div>
        <div><b>Peso:</b> {/* peso */}</div>
        <div><b>Talla:</b> {/* talla */}</div>
      </div>

      <h3 className="text-lg font-semibold mb-2 mt-4">Anamnesis</h3>
      <div className="mb-2"><b>Tiempo de Enfermedad:</b> {/* ... */}</div>
      <div className="mb-2"><b>Forma de inicio:</b> {/* ... */}</div>
      <div className="mb-2"><b>Curso:</b> {/* ... */}</div>

      <h3 className="text-lg font-semibold mb-2 mt-4">Antecedentes</h3>
      <div className="mb-2">{/* ... */}</div>

      <h3 className="text-lg font-semibold mb-2 mt-4">Examen Físico</h3>
      <div className="mb-2">{/* ... */}</div>

      <h3 className="text-lg font-semibold mb-2 mt-4">Laboratorio y Apoyo al Diagnóstico</h3>
      <div className="mb-2">{/* ... */}</div>

      <h3 className="text-lg font-semibold mb-2 mt-4">Diagnóstico (CIE10)</h3>
      <div className="mb-2">{/* ... */}</div>

      <h3 className="text-lg font-semibold mb-2 mt-4">Tratamiento</h3>
      <div className="mb-2">{/* ... */}</div>

      <div className="mt-6 text-right text-xs text-gray-500">FIRMA Y SELLO/MÉDICO</div>
    </div>
  );
}

export default HistoriaClinicaPage;

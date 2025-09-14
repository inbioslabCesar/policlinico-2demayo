import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../config/config";

function HistoriaClinicaPage() {
  const { pacienteId, consultaId } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [triaje, setTriaje] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Historia clínica editable
  const [hc, setHc] = useState({
    tiempo_enfermedad: "",
    forma_inicio: "",
    curso: "",
    antecedentes: "",
    examen_fisico: ""
  });
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState("");
  // Cargar datos de historia clínica editable
  useEffect(() => {
    if (!consultaId) return;
    fetch(`${BASE_URL}api_historia_clinica.php?consulta_id=${consultaId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.hc && data.hc.datos) setHc({ ...hc, ...data.hc.datos });
      });
    // eslint-disable-next-line
  }, [consultaId]);

  useEffect(() => {
    if (!pacienteId) return;
    setLoading(true);
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

  // Cargar triaje por consulta_id si existe
  useEffect(() => {
    if (!consultaId) return;
    fetch(`${BASE_URL}api_triaje.php?consulta_id=${consultaId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.triaje && data.triaje.datos) setTriaje(data.triaje.datos);
        else setTriaje(null);
      })
      .catch(() => setTriaje(null));
  }, [consultaId]);

  if (loading) return <div className="p-4">Cargando historia clínica...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!paciente) return <div className="p-4">No se encontró el paciente.</div>;

  return (
  <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow mt-6" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <h2 className="text-2xl font-bold mb-4 text-center">Historia Clínica</h2>
      {/* Datos básicos en dos columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-4">
        <div><b>Nombre:</b> {paciente.nombre} {paciente.apellido}</div>
        <div><b>DNI:</b> {paciente.dni}</div>
        <div><b>Historia Clínica:</b> {paciente.historia_clinica}</div>
        <div><b>Edad:</b> {paciente.edad} {paciente.edad_unidad}</div>
        <div><b>Sexo:</b> {paciente.sexo}</div>
        <div><b>Dirección:</b> {paciente.direccion}</div>
        <div><b>Teléfono:</b> {paciente.telefono}</div>
        <div><b>Email:</b> {paciente.email}</div>
      </div>
      {/* Secciones estructuradas para la historia clínica */}
      <hr className="my-4" />
      <h3 className="text-lg font-semibold mb-2">Triaje</h3>
      <div className="mb-2 flex flex-wrap gap-4">
        <div><b>P/A:</b> {triaje?.presion_arterial || ""}</div>
        <div><b>FC:</b> {triaje?.frecuencia_cardiaca || ""}</div>
        <div><b>FR:</b> {triaje?.frecuencia_respiratoria || ""}</div>
        <div><b>T:</b> {triaje?.temperatura || ""}</div>
        <div><b>SAT O2:</b> {triaje?.saturacion || ""}</div>
        <div><b>Peso:</b> {triaje?.peso || ""}</div>
        <div><b>Talla:</b> {triaje?.talla || ""}</div>
      </div>


      <form
        onSubmit={async e => {
          e.preventDefault();
          setGuardando(true);
          setMsg("");
          const res = await fetch(`${BASE_URL}api_historia_clinica.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ consulta_id: consultaId, datos: hc })
          });
          const data = await res.json();
          setGuardando(false);
          setMsg(data.success ? "Guardado correctamente" : (data.error || "Error al guardar"));
        }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold mb-2 mt-4">Anamnesis</h3>
        <div className="mb-2">
          <label className="block font-semibold mb-1">Tiempo de Enfermedad:</label>
          <textarea className="w-full border rounded p-1" rows={2} value={hc.tiempo_enfermedad} onChange={e => setHc(h => ({ ...h, tiempo_enfermedad: e.target.value }))} />
        </div>
        <div className="mb-2">
          <label className="block font-semibold mb-1">Forma de inicio:</label>
          <textarea className="w-full border rounded p-1" rows={2} value={hc.forma_inicio} onChange={e => setHc(h => ({ ...h, forma_inicio: e.target.value }))} />
        </div>
        <div className="mb-2">
          <label className="block font-semibold mb-1">Curso:</label>
          <textarea className="w-full border rounded p-1" rows={2} value={hc.curso} onChange={e => setHc(h => ({ ...h, curso: e.target.value }))} />
        </div>
        <h3 className="text-lg font-semibold mb-2 mt-4">Antecedentes</h3>
        <div className="mb-2">
          <textarea className="w-full border rounded p-1" rows={2} value={hc.antecedentes} onChange={e => setHc(h => ({ ...h, antecedentes: e.target.value }))} />
        </div>
        <h3 className="text-lg font-semibold mb-2 mt-4">Examen Físico</h3>
        <div className="mb-2">
          <textarea className="w-full border rounded p-1" rows={2} value={hc.examen_fisico} onChange={e => setHc(h => ({ ...h, examen_fisico: e.target.value }))} />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={guardando}>{guardando ? "Guardando..." : "Guardar"}</button>
        {msg && <div className="mt-2 text-center text-green-700 font-semibold">{msg}</div>}
      </form>

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

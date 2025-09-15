import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../config/config";
import SolicitudLaboratorio from "../components/SolicitudLaboratorio"; // This line remains for context
import ResultadosLaboratorio from "../components/ResultadosLaboratorio"; // This line remains for context
import TabsApoyoDiagnostico from "../components/TabsApoyoDiagnostico";
import FormularioHistoriaClinica from "../components/FormularioHistoriaClinica";
import TriajePaciente from "../components/TriajePaciente";
import DatosPaciente from "../components/DatosPaciente";
import DiagnosticoCIE10 from "../components/DiagnosticoCIE10";
import TratamientoPaciente from "../components/TratamientoPaciente";

function HistoriaClinicaPage() {
  const { pacienteId, consultaId } = useParams();
  // Resultados de laboratorio
  const [resultadosLab, setResultadosLab] = useState([]);

  // Cargar resultados de laboratorio por consulta
  useEffect(() => {
    if (!consultaId) return;
    fetch(`${BASE_URL}api_resultados_laboratorio.php?consulta_id=${consultaId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.resultados) setResultadosLab(data.resultados);
        else setResultadosLab([]);
      })
      .catch(() => setResultadosLab([]));
  }, [consultaId]);
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
    examen_fisico: "",
  });
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState("");
  // Cargar datos de historia clínica editable
  useEffect(() => {
    if (!consultaId) return;
    fetch(`${BASE_URL}api_historia_clinica.php?consulta_id=${consultaId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.hc && data.hc.datos)
          setHc({ ...hc, ...data.hc.datos });
      });
    // eslint-disable-next-line
  }, [consultaId]);

  useEffect(() => {
    if (!pacienteId) return;
    setLoading(true);
    fetch(`${BASE_URL}api_pacientes.php?id=${pacienteId}`)
      .then((res) => res.json())
      .then((data) => {
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
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.triaje && data.triaje.datos)
          setTriaje(data.triaje.datos);
        else setTriaje(null);
      })
      .catch(() => setTriaje(null));
  }, [consultaId]);

  if (loading) return <div className="p-4">Cargando historia clínica...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!paciente) return <div className="p-4">No se encontró el paciente.</div>;

  return (
    <div
      className="max-w-2xl mx-auto p-4 bg-white rounded shadow mt-6"
      style={{ maxHeight: "80vh", overflowY: "auto" }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Historia Clínica</h2>
      {/* Datos básicos en dos columnas */}
      <DatosPaciente paciente={paciente} />
      {/* Secciones estructuradas para la historia clínica */}
      <hr className="my-4" />
      <TriajePaciente triaje={triaje} />

      <FormularioHistoriaClinica
        hc={hc}
        setHc={setHc}
        guardando={guardando}
        msg={msg}
        onSubmit={async (e) => {
          e.preventDefault();
          setGuardando(true);
          setMsg("");
          const res = await fetch(`${BASE_URL}api_historia_clinica.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ consulta_id: consultaId, datos: hc }),
          });
          const data = await res.json();
          setGuardando(false);
          setMsg(
            data.success
              ? "Guardado correctamente"
              : data.error || "Error al guardar"
          );
        }}
      />

      <h3 className="text-lg font-semibold mb-2 mt-4">
        Laboratorio y Apoyo al Diagnóstico
      </h3>

        <TabsApoyoDiagnostico consultaId={consultaId} resultadosLab={resultadosLab} />

      <DiagnosticoCIE10 />

      <TratamientoPaciente />

      <div className="mt-6 text-right text-xs text-gray-500">
        FIRMA Y SELLO/MÉDICO
      </div>
    </div>
  );
}

export default HistoriaClinicaPage;

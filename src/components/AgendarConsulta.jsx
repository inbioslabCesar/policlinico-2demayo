import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/config";
import DisponibilidadMedicos from "./DisponibilidadMedicos";

function AgendarConsulta({ pacienteId }) {
  const [medicos, setMedicos] = useState([]);
  const [medicoId, setMedicoId] = useState("");
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(BASE_URL + "api_medicos.php")
      .then(r => r.json())
      .then(data => setMedicos(data.medicos || []));
  }, []);

  useEffect(() => {
    // Cargar disponibilidad de todos los médicos
    fetch(BASE_URL + "api_disponibilidad_medicos.php")
      .then(r => r.json())
      .then(data => setDisponibilidad(data.disponibilidad || []));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    if (!pacienteId || !medicoId || !fecha || !hora) {
      setMsg("Completa todos los campos");
      return;
    }
    const res = await fetch(BASE_URL + "api_consultas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paciente_id: pacienteId, medico_id: medicoId, fecha, hora })
    });
    const data = await res.json();
    if (data.success) {
      setMsg("Consulta agendada correctamente");
    } else {
      setMsg(data.error || "Error al agendar");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <DisponibilidadMedicos />
      <h2 className="text-lg font-bold mb-2">Agendar Consulta Médica</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="border rounded px-2 py-1" required />
        <select
          value={hora ? `${medicoId}|${hora}` : ""}
          onChange={e => {
            const [mid, h] = e.target.value.split("|");
            setMedicoId(mid);
            setHora(h);
          }}
          className="border rounded px-2 py-1"
          required
        >
          <option value="">Selecciona médico y horario</option>
          {disponibilidad
            .filter(d => !fecha || d.fecha === fecha)
            .map(d => {
              const medico = medicos.find(m => m.id == d.medico_id);
              if (!medico) return null;
              // Generar opciones de hora entre hora_inicio y hora_fin, cada 30 min
              const options = [];
              let [h, m] = d.hora_inicio.split(":").map(Number);
              const [hFin, mFin] = d.hora_fin.split(":").map(Number);
              while (h < hFin || (h === hFin && m < mFin)) {
                const horaStr = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
                options.push(
                  <option key={horaStr + d.id + medico.id} value={`${medico.id}|${horaStr}`}>
                    {medico.nombre} ({medico.especialidad}) - {horaStr}
                  </option>
                );
                m += 30;
                if (m >= 60) { h++; m = 0; }
              }
              return options;
            })}
        </select>
        <button type="submit" className="bg-green-600 text-white rounded px-4 py-1 font-bold">Agendar</button>
      </form>
      {msg && <div className="mt-2 text-sm text-center">{msg}</div>}
    </div>
  );
}

export default AgendarConsulta;

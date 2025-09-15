import React, { useState } from "react";
import { BASE_URL } from "../config/config";

export default function SolicitudLaboratorio({ consultaId }) {
  const [examenes, setExamenes] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState("");
  const examenesDisponibles = [
    "Hemograma",
    "Glucosa",
    "Orina",
    "Perfil lipídico",
    "Creatinina",
    // ...agrega más según tu necesidad
  ];
  const handleChange = (e) => {
    const value = e.target.value;
    setExamenes((prev) =>
      prev.includes(value)
        ? prev.filter((ex) => ex !== value)
        : [...prev, value]
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMsg("");
    await fetch(BASE_URL + "api_ordenes_laboratorio.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consulta_id: consultaId, examenes }),
    });
    setGuardando(false);
    setMsg("Orden enviada correctamente");
    setExamenes([]);
  };
  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="font-semibold mb-1">Solicitar exámenes de laboratorio:</div>
      <div className="flex flex-wrap gap-3 mb-2">
        {examenesDisponibles.map((ex) => (
          <label key={ex} className="flex items-center gap-1">
            <input
              type="checkbox"
              value={ex}
              checked={examenes.includes(ex)}
              onChange={handleChange}
            />
            {ex}
          </label>
        ))}
      </div>
      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded" disabled={guardando || examenes.length === 0}>
        {guardando ? "Enviando..." : "Solicitar"}
      </button>
      {msg && <div className="mt-1 text-green-700 font-semibold">{msg}</div>}
    </form>
  );
}

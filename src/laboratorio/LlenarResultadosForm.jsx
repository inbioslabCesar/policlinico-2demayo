import React, { useState, useEffect } from "react";
import { BASE_URL } from "../config/config";

function LlenarResultadosForm({ orden, onVolver, onGuardado }) {
  // Inicializa los resultados con los exámenes solicitados o los ya guardados
  const [resultados, setResultados] = useState(() => {
    // Si la orden ya tiene resultados previos, usarlos
    if (orden.resultados && typeof orden.resultados === 'object') {
      return { ...orden.resultados };
    }
    // Si no, inicializar vacíos
    const res = {};
    (orden.examenes || []).forEach(ex => { res[ex] = ""; });
    return res;
  });
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState("");
  const [examenesDisponibles, setExamenesDisponibles] = useState([]);

  useEffect(() => {
    fetch(BASE_URL + "api_examenes_laboratorio.php")
      .then(res => res.json())
      .then(data => setExamenesDisponibles(data.examenes || []));
  }, []);

  // Si la orden cambia (por ejemplo, al editar otra orden), actualizar resultados
  useEffect(() => {
    if (orden.resultados && typeof orden.resultados === 'object') {
      setResultados({ ...orden.resultados });
    } else {
      const res = {};
      (orden.examenes || []).forEach(ex => { res[ex] = ""; });
      setResultados(res);
    }
  }, [orden]);

  const handleChange = (e) => {
    setResultados({ ...resultados, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMsg("");
    // Guardar resultados en la tabla resultados_laboratorio
    const res = await fetch(BASE_URL + "api_resultados_laboratorio.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consulta_id: orden.consulta_id, tipo_examen: "varios", resultados }),
    });
    const data = await res.json();
    setGuardando(false);
    if (data.success) {
      setMsg("Resultados guardados correctamente");
      onGuardado && onGuardado();
    } else {
      setMsg(data.error || "Error al guardar");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="font-semibold mb-2">Llenar resultados de laboratorio</h4>
      {(orden.examenes || []).map(ex => {
        let nombre = ex;
        const exObj = examenesDisponibles.find(e => e.id == ex);
        if (exObj) nombre = exObj.nombre;
        return (
          <div key={ex} className="mb-2">
            <label className="block font-semibold mb-1">{nombre}:</label>
            <input
              type="text"
              name={ex}
              value={resultados[ex] || ""}
              onChange={handleChange}
              className="w-full border rounded p-1"
              required
            />
          </div>
        );
      })}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onVolver} className="bg-gray-300 px-3 py-1 rounded">Volver</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={guardando}>{guardando ? "Guardando..." : "Guardar resultados"}</button>
      </div>
      {msg && <div className="mt-2 text-green-700 font-semibold">{msg}</div>}
    </form>
  );
}

export default LlenarResultadosForm;

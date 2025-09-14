import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/config";

function MedicoConsultas({ medicoId }) {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Obtener la fecha de hoy en formato YYYY-MM-DD
    // Mostrar todas las consultas del médico

  useEffect(() => {
    if (!medicoId) return;
    setLoading(true);
    fetch(`${BASE_URL}api_consultas.php?medico_id=${medicoId}`)
      .then(r => r.json())
          .then(data => { 
            setConsultas(data.consultas || []);
        setLoading(false);
      });
  }, [medicoId]);

  const actualizarEstado = async (id, estado) => {
    setMsg("");
    setLoading(true);
    await fetch(BASE_URL + "api_consultas.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, estado })
    });
    // Refrescar lista
    fetch(`${BASE_URL}api_consultas.php?medico_id=${medicoId}`)
      .then(r => r.json())
          .then(data => { 
            setConsultas(data.consultas || []);
        setLoading(false);
      });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Mis Consultas Agendadas</h2>
      {loading ? <div>Cargando...</div> : (
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1">Fecha</th>
              <th className="px-2 py-1">Hora</th>
              <th className="px-2 py-1">Paciente</th>
              <th className="px-2 py-1">Estado</th>
              <th className="px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {consultas.length === 0 && <tr><td colSpan={5} className="text-center">No hay consultas agendadas</td></tr>}
            {consultas.map(c => (
              <tr key={c.id}>
                <td className="px-2 py-1">{c.fecha}</td>
                <td className="px-2 py-1">{c.hora}</td>
                <td className="px-2 py-1">{c.paciente_nombre ? `${c.paciente_nombre} ${c.paciente_apellido}` : `Paciente #${c.paciente_id}`}</td>
                <td className="px-2 py-1 font-bold">{c.estado}</td>
                <td className="px-2 py-1 flex gap-2">
                  {c.estado === 'pendiente' && (
                    <>
                      <button onClick={() => actualizarEstado(c.id, 'completada')} className="bg-green-600 text-white px-2 py-1 rounded">Completar</button>
                      <button onClick={() => actualizarEstado(c.id, 'cancelada')} className="bg-red-600 text-white px-2 py-1 rounded">Cancelar</button>
                    </>
                  )}
                  <button
                    onClick={() => navigate(`/historia-clinica/${c.paciente_id}`)}
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Historia Clínica
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {msg && <div className="mt-2 text-center text-sm">{msg}</div>}
    </div>
  );
}

export default MedicoConsultas;

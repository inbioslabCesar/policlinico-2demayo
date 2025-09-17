import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/config";

function MedicoConsultas({ medicoId }) {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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

  // Calcular datos paginados
  const totalRows = consultas.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const pagedConsultas = consultas.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Cambiar página y filas por página
  const handleRowsPerPage = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="flex flex-col items-center w-full p-2 sm:p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Mis Consultas Agendadas</h2>
      {loading ? <div>Cargando...</div> : (
        <div className="w-full flex justify-center">
          <div className="overflow-x-auto w-full max-w-xl">
            <table className="min-w-[400px] w-full text-[11px] sm:text-sm md:text-base border bg-white rounded shadow mx-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-1 py-0.5 sm:px-2 md:px-3 md:py-2 whitespace-nowrap">Fecha</th>
                  <th className="px-1 py-0.5 sm:px-2 md:px-3 md:py-2 whitespace-nowrap">Hora</th>
                  <th className="px-1 py-0.5 sm:px-2 md:px-3 md:py-2 whitespace-nowrap">Paciente</th>
                  <th className="px-1 py-0.5 sm:px-2 md:px-3 md:py-2 whitespace-nowrap">Tipo</th>
                  <th className="px-1 py-0.5 sm:px-2 md:px-3 md:py-2 whitespace-nowrap">Estado</th>
                  <th className="px-1 py-0.5 sm:px-2 md:px-3 md:py-2 whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {consultas.length === 0 && <tr><td colSpan={6} className="text-center">No hay consultas agendadas</td></tr>}
                {pagedConsultas.map(c => {
                  let rowColor = '';
                  let etiqueta = '';
                  let alertaUrgente = null;
                  if (c.clasificacion === 'Emergencia') {
                    rowColor = 'bg-red-200';
                    etiqueta = <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs ml-2">EMERGENCIA</span>;
                    alertaUrgente = <span title="Emergencia" className="ml-1 animate-pulse text-red-700 text-lg font-bold">&#9888;</span>;
                  } else if (c.clasificacion === 'Urgente') {
                    rowColor = 'bg-yellow-200';
                    etiqueta = <span className="bg-yellow-600 text-white px-2 py-0.5 rounded text-xs ml-2">URGENTE</span>;
                    alertaUrgente = <span title="Urgente" className="ml-1 animate-pulse text-yellow-600 text-lg font-bold">&#9888;</span>;
                  } else if (c.clasificacion === 'No urgente') {
                    rowColor = 'bg-green-100';
                    etiqueta = <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs ml-2">NO URGENTE</span>;
                  }
                  return (
                    <tr key={c.id} className={rowColor}>
                      <td className="px-1 py-0.5 sm:px-2 md:px-3 md:py-2">{c.fecha}</td>
                      <td className="px-1 py-0.5 sm:px-2 md:px-3 md:py-2">{c.hora}</td>
                      <td className="px-1 py-0.5 sm:px-2 md:px-3 md:py-2">
                        {c.paciente_nombre ? `${c.paciente_nombre} ${c.paciente_apellido}` : `Paciente #${c.paciente_id}`}
                        {etiqueta} {alertaUrgente}
                      </td>
                      <td className="px-1 py-0.5 sm:px-2 md:px-3 md:py-2 text-center">
                      {/* Tipo de consulta/triaje */}
                      {c.clasificacion ? c.clasificacion : <span className="text-gray-400 italic">Sin clasificar</span>}
                    </td>
                    <td className="px-1 py-0.5 sm:px-2 md:px-3 md:py-2 font-bold">{c.estado}</td>
                    <td className="px-1 py-0.5 sm:px-2 md:px-3 md:py-2 flex flex-wrap gap-0.5 sm:gap-2">
                      {c.estado === 'pendiente' && (
                        <>
                          <button onClick={() => actualizarEstado(c.id, 'completada')} className="bg-green-600 text-white px-1 py-0.5 rounded text-lg md:text-xl" title="Completar">
                            <span role="img" aria-label="Completar">✔️</span>
                          </button>
                          <button onClick={() => actualizarEstado(c.id, 'cancelada')} className="bg-red-600 text-white px-1 py-0.5 rounded text-lg md:text-xl" title="Cancelar">
                            <span role="img" aria-label="Cancelar">✖️</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => navigate(`/historia-clinica/${c.paciente_id}/${c.id}`)}
                        className="bg-blue-600 text-white px-1 py-0.5 rounded text-lg md:text-xl"
                        title="Historia Clínica"
                      >
                        <span role="img" aria-label="Historia Clínica">📖</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>
        </div>
      )}
      {msg && <div className="mt-2 text-center text-sm">{msg}</div>}

      {/* Paginación */}
      {consultas.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
          <div className="flex items-center gap-2">
            <button onClick={handlePrev} disabled={page === 1} className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50">&lt;</button>
            <span className="text-xs">Página {page} de {totalPages}</span>
            <button onClick={handleNext} disabled={page === totalPages} className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50">&gt;</button>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>Filas por página:</span>
            <select value={rowsPerPage} onChange={handleRowsPerPage} className="border rounded px-1 py-0.5">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicoConsultas;

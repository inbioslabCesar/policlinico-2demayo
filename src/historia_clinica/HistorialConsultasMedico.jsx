import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HistorialConsultasMedico({ medicoId }) {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
  fetch(`http://localhost/policlinico-2demayo/api_historial_consultas_medico.php?medico_id=${medicoId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setHistorial(data.historial);
        else setError(data.error || "Error al cargar historial");
        setLoading(false);
      })
      .catch(() => {
        setError("Error de conexión");
        setLoading(false);
      });
  }, [medicoId]);

  const historialFiltrado = historial.filter(h =>
    h.paciente_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    h.motivo.toLowerCase().includes(busqueda.toLowerCase()) ||
    h.diagnostico.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Historial de Consultas</h2>
      <input
        type="text"
        className="border rounded p-2 mb-4 w-full"
        placeholder="Buscar por paciente, motivo o diagnóstico"
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-2 py-1">Fecha</th>
                <th className="px-2 py-1">Paciente</th>
                <th className="px-2 py-1">Motivo</th>
                <th className="px-2 py-1">Diagnóstico</th>
                <th className="px-2 py-1">Estado</th>
                <th className="px-2 py-1">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {historialFiltrado.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-2">Sin resultados</td></tr>
              ) : historialFiltrado.map(h => (
                <tr key={h.id} className="hover:bg-blue-50">
                  <td className="border px-2 py-1">{h.fecha}</td>
                  <td className="border px-2 py-1">{h.paciente_nombre}</td>
                  <td className="border px-2 py-1">{h.motivo}</td>
                  <td className="border px-2 py-1">{h.diagnostico}</td>
                  <td className="border px-2 py-1">{h.estado}</td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      className="text-blue-600 underline"
                      onClick={() => navigate(`/historia-clinica/${h.paciente_id}/${h.consulta_id}`)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

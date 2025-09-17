import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/config";

function OrdenesLaboratorioList({ onSeleccionarOrden }) {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [examenesDisponibles, setExamenesDisponibles] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(BASE_URL + "api_ordenes_laboratorio.php")
      .then(res => res.json())
      .then(data => {
        console.log('Órdenes recibidas:', data);
        if (data.success) setOrdenes(data.ordenes);
        else setError(data.error || "Error al cargar órdenes");
        setLoading(false);
      })
      .catch((err) => {
        setError("Error de conexión con el servidor");
        setLoading(false);
        console.error('Error al cargar órdenes:', err);
      });
    // Cargar lista de exámenes disponibles para mapear IDs a nombres
    fetch(BASE_URL + "api_examenes_laboratorio.php")
      .then(res => res.json())
      .then(data => {
        setExamenesDisponibles(data.examenes || []);
        console.log('Exámenes disponibles:', data.examenes);
      });
  }, []);

  if (loading || examenesDisponibles.length === 0) return <div className="p-4">Cargando órdenes de laboratorio...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">Órdenes de Laboratorio</h2>
      <div className="overflow-x-auto">
        <table className="min-w-[400px] w-full text-sm">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-2 whitespace-nowrap">ID Orden</th>
              <th className="p-2 whitespace-nowrap">Paciente</th>
              <th className="p-2 whitespace-nowrap hidden sm:table-cell">Médico</th>
              <th className="p-2 whitespace-nowrap hidden md:table-cell">Consulta</th>
              <th className="p-2 whitespace-nowrap hidden md:table-cell">Fecha</th>
              <th className="p-2 whitespace-nowrap">Estado</th>
              <th className="p-2 whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">No hay órdenes registradas.</td>
              </tr>
            ) : (
              ordenes.map(orden => (
                <tr key={orden.id} className="border-b">
                  <td className="p-2 whitespace-nowrap">{orden.id}</td>
                  <td className="p-2 whitespace-nowrap">{orden.paciente_nombre} {orden.paciente_apellido}</td>
                  <td className="p-2 whitespace-nowrap hidden sm:table-cell">{orden.medico_nombre}</td>
                  <td className="p-2 whitespace-nowrap hidden md:table-cell">{orden.consulta_id}</td>
                  <td className="p-2 whitespace-nowrap hidden md:table-cell">{orden.fecha?.slice(0,16).replace("T"," ")}</td>
                  <td className="p-2 whitespace-nowrap">
                    <span className={orden.estado === 'completado' ? 'text-green-600 font-semibold' : 'text-yellow-700 font-semibold'}>
                      {orden.estado === 'completado' ? 'Completado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <button
                      onClick={() => onSeleccionarOrden(orden)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-base md:text-sm min-w-[40px]"
                      title={orden.estado === 'completado' ? 'Editar resultado' : 'Llenar resultados'}
                    >
                      {orden.estado === 'completado' ? '✏️' : '📝'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdenesLaboratorioList;

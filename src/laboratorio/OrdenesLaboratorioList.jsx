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
  if (ordenes.length === 0) return <div className="p-4">No hay órdenes registradas.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">Órdenes de Laboratorio</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2">ID Orden</th>
            <th className="p-2">Paciente</th>
            <th className="p-2">Médico</th>
            <th className="p-2">Consulta</th>
            <th className="p-2">Exámenes Solicitados</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map(orden => (
            <tr key={orden.id} className="border-b">
              <td className="p-2">{orden.id}</td>
              <td className="p-2">{orden.paciente_nombre} {orden.paciente_apellido}</td>
              <td className="p-2">{orden.medico_nombre}</td>
              <td className="p-2">{orden.consulta_id}</td>
              <td className="p-2">
                {orden.examenes && Array.isArray(orden.examenes)
                  ? orden.examenes.map(ex => {
                      const exObj = examenesDisponibles.find(e => e.id == ex);
                      if (exObj) return exObj.nombre;
                      // Si no se encuentra, mostrar 'Desconocido'
                      // Si ex es string, mostrarlo, si es número, mostrar 'Desconocido'
                      return typeof ex === 'string' && isNaN(Number(ex)) ? ex : 'Desconocido';
                    }).join(", ")
                  : ""}
              </td>
              <td className="p-2">{orden.fecha?.slice(0,16).replace("T"," ")}</td>
              <td className="p-2">
                <span className={orden.estado === 'completado' ? 'text-green-600 font-semibold' : 'text-yellow-700 font-semibold'}>
                  {orden.estado === 'completado' ? 'Completado' : 'Pendiente'}
                </span>
              </td>
              <td className="p-2">
                <button onClick={() => onSeleccionarOrden(orden)} className="bg-green-600 text-white px-3 py-1 rounded" title={orden.estado === 'completado' ? 'Editar resultado' : 'Llenar resultados'}>
                  {orden.estado === 'completado' ? '✏️' : '📝'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdenesLaboratorioList;

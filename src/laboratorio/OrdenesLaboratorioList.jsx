import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/config";

function OrdenesLaboratorioList({ onSeleccionarOrden }) {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(BASE_URL + "api_ordenes_laboratorio.php?estado=pendiente")
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrdenes(data.ordenes);
        else setError(data.error || "Error al cargar órdenes");
        setLoading(false);
      })
      .catch(() => {
        setError("Error de conexión con el servidor");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Cargando órdenes de laboratorio...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (ordenes.length === 0) return <div className="p-4">No hay órdenes pendientes.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">Órdenes de Laboratorio Pendientes</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2">ID Orden</th>
            <th className="p-2">Consulta</th>
            <th className="p-2">Exámenes Solicitados</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map(orden => (
            <tr key={orden.id} className="border-b">
              <td className="p-2">{orden.id}</td>
              <td className="p-2">{orden.consulta_id}</td>
              <td className="p-2">{orden.examenes && Array.isArray(orden.examenes) ? orden.examenes.join(", ") : ""}</td>
              <td className="p-2">{orden.fecha?.slice(0,16).replace("T"," ")}</td>
              <td className="p-2">
                <button onClick={() => onSeleccionarOrden(orden)} className="bg-green-600 text-white px-3 py-1 rounded">Llenar resultados</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdenesLaboratorioList;

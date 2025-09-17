
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/config";
import TriageForm from "./TriageForm";

function TriageList() {
  const [consultas, setConsultas] = useState([]);
  const [triajeStatus, setTriajeStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [triajeActual, setTriajeActual] = useState(null);
  const [triajeData, setTriajeData] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [cargandoTriaje, setCargandoTriaje] = useState(false);

  // Refrescar lista de consultas
  const recargarConsultas = () => {
    setLoading(true);
    fetch(BASE_URL + "api_consultas.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const pendientes = data.consultas.filter(
            (c) => c.estado === "pendiente" && (!c.triaje_realizado || c.triaje_realizado === "0")
          );
          setConsultas(pendientes);
        } else {
          setError(data.error || "Error al cargar consultas");
        }
        setLoading(false);
      })
      .catch((_err) => {
        setError("Error de red");
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetch(BASE_URL + "api_consultas.php")
      .then((res) => res.json())
      .then(async (data) => {
        if (data.success) {
          const pendientes = data.consultas.filter(
            (c) => c.estado === "pendiente" && (!c.triaje_realizado || c.triaje_realizado === "0")
          );
          setConsultas(pendientes);
          // Consultar estado de triaje para cada consulta
          const statusObj = {};
          await Promise.all(pendientes.map(async (c) => {
            try {
              const res = await fetch(BASE_URL + `api_triaje.php?consulta_id=${c.id}`);
              const data = await res.json();
              statusObj[c.id] = (data.success && data.triaje) ? 'Completado' : 'Pendiente';
            } catch {
              statusObj[c.id] = 'Pendiente';
            }
          }));
          setTriajeStatus(statusObj);
        } else {
          setError(data.error || "Error al cargar consultas");
        }
        setLoading(false);
      })
      .catch((_err) => {
        setError("Error de red");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando pacientes en triaje...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Pacientes pendientes de triaje</h2>
      {triajeActual ? (
        <div className="bg-white rounded shadow p-4 mb-4">
          <h3 className="font-semibold mb-2">Triaje de {triajeActual.paciente_nombre} {triajeActual.paciente_apellido}</h3>
          {cargandoTriaje ? (
            <div>Cargando datos de triaje...</div>
          ) : (
            <TriageForm
              consulta={triajeActual}
              initialData={triajeData}
              onGuardar={async (datos) => {
                setGuardando(true);
                await fetch(BASE_URL + "api_triaje.php", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ consulta_id: triajeActual.id, datos })
                });
                setGuardando(false);
                setTriajeActual(null);
                setTriajeData(null);
                recargarConsultas();
              }}
              onCancelar={() => { setTriajeActual(null); setTriajeData(null); }}
              guardando={guardando}
            />
          )}
        </div>
      ) : (
        <table className="w-full bg-white rounded shadow text-sm">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-2">Historia Clínica</th>
              <th className="p-2">Paciente</th>
              <th className="p-2">Médico</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Hora</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {consultas.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">No hay pacientes pendientes de triaje.</td>
              </tr>
            ) : (
              consultas.map((c) => (
                <tr key={c.id}>
                  <td className="p-2">{c.historia_clinica || '-'}</td>
                  <td className="p-2">{c.paciente_nombre} {c.paciente_apellido}</td>
                  <td className="p-2">{c.medico_nombre || '-'}</td>
                  <td className="p-2">{c.fecha}</td>
                  <td className="p-2">{c.hora}</td>
                  <td className="p-2 font-semibold">
                    {triajeStatus[c.id] === 'Completado' ? (
                      <span className="text-green-600">Completado</span>
                    ) : (
                      <span className="text-yellow-600">Pendiente</span>
                    )}
                  </td>
                  <td className="p-2">
                    <button
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                      onClick={async () => {
                        setTriajeActual(c);
                        setCargandoTriaje(true);
                        setTriajeData(null);
                        try {
                          const res = await fetch(BASE_URL + `api_triaje.php?consulta_id=${c.id}`);
                          const data = await res.json();
                          if (data.success && data.triaje && data.triaje.datos) {
                            setTriajeData(data.triaje.datos);
                          } else {
                            setTriajeData(null);
                          }
                        } catch {
                          setTriajeData(null);
                        }
                        setCargandoTriaje(false);
                      }}
                    >
                      Realizar triaje
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TriageList;

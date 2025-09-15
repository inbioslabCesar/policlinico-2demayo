import React, { useState } from "react";
import OrdenesLaboratorioList from "../laboratorio/OrdenesLaboratorioList";
import LlenarResultadosForm from "../laboratorio/LlenarResultadosForm";

function LaboratorioPanelPage() {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

  return (
    <div className="p-4">
      {!ordenSeleccionada ? (
        <OrdenesLaboratorioList onSeleccionarOrden={setOrdenSeleccionada} />
      ) : (
        <div>
          <button onClick={() => setOrdenSeleccionada(null)} className="mb-2 bg-gray-300 px-3 py-1 rounded">Volver a la lista</button>
          <div className="bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">Llenar resultados para orden #{ordenSeleccionada.id}</h3>
            <div><b>Consulta ID:</b> {ordenSeleccionada.consulta_id}</div>
            <div><b>Exámenes solicitados:</b> {ordenSeleccionada.examenes && Array.isArray(ordenSeleccionada.examenes) ? ordenSeleccionada.examenes.join(", ") : ""}</div>
            <LlenarResultadosForm orden={ordenSeleccionada} onVolver={() => setOrdenSeleccionada(null)} onGuardado={() => setOrdenSeleccionada(null)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default LaboratorioPanelPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResultadosLaboratorio from "./ResultadosLaboratorio";

export default function TabsApoyoDiagnostico({ consultaId, resultadosLab }) {
  const [tab, setTab] = useState("laboratorio");
  const navigate = useNavigate();
  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-2">
        <button onClick={() => setTab("laboratorio")}
          className={`px-3 py-1 rounded-t ${tab === "laboratorio" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Laboratorio</button>
        <button onClick={() => setTab("rx")}
          className={`px-3 py-1 rounded-t ${tab === "rx" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>RX</button>
        <button onClick={() => setTab("ecografia")}
          className={`px-3 py-1 rounded-t ${tab === "ecografia" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Ecografía</button>
        <button onClick={() => setTab("tomografia")}
          className={`px-3 py-1 rounded-t ${tab === "tomografia" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Tomografía</button>
      </div>
      <div className="border rounded-b bg-white p-3">
        {tab === "laboratorio" && (
          <>
            <button
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => navigate(`/solicitud-laboratorio/${consultaId}`)}
            >
              Solicitar análisis de laboratorio
            </button>
            <ResultadosLaboratorio resultadosLab={resultadosLab} />
          </>
        )}
        {tab === "rx" && (
          <div className="text-gray-500">(Próximamente: solicitud y resultados de Rayos X)</div>
        )}
        {tab === "ecografia" && (
          <div className="text-gray-500">(Próximamente: solicitud y resultados de Ecografía)</div>
        )}
        {tab === "tomografia" && (
          <div className="text-gray-500">(Próximamente: solicitud y resultados de Tomografía)</div>
        )}
      </div>
    </div>
  );
}

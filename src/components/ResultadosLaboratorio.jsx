import React from "react";

export default function ResultadosLaboratorio({ resultadosLab }) {
  if (!resultadosLab || resultadosLab.length === 0) return null;
  return (
    <div className="mt-2 border rounded p-2 bg-gray-50">
      <div className="font-semibold mb-1">Resultados de laboratorio:</div>
      {resultadosLab.map((res, idx) => (
        <div key={idx} className="mb-2">
          <div className="text-xs text-gray-500">
            Fecha: {res.fecha?.slice(0, 16).replace("T", " ")}
          </div>
          {res.resultados && typeof res.resultados === "object" ? (
            <ul className="list-disc ml-5">
              {Object.entries(res.resultados).map(([ex, val]) => (
                <li key={ex}>
                  <b>{ex}:</b> {val}
                </li>
              ))}
            </ul>
          ) : (
            <div>{JSON.stringify(res.resultados)}</div>
          )}
        </div>
      ))}
    </div>
  );
}

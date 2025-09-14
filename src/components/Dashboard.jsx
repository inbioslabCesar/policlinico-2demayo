
import React, { useEffect, useState } from "react";
import RecepcionModulo from "./RecepcionModulo";
import { BASE_URL } from "../config/config";

function Dashboard({ usuario }) {
  const [ultimaHC, setUltimaHC] = useState(null);

  useEffect(() => {
    fetch(BASE_URL + "api_ultima_hc.php")
      .then(res => res.json())
      .then(data => {
        if (data.success) setUltimaHC(data.ultima_hc);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 bg-white/95 rounded-xl border border-blue-400 shadow-lg mt-10">
      <h1 className="text-2xl font-bold text-purple-800 mb-2 drop-shadow">Bienvenido, {usuario?.nombre || "Usuario"}</h1>
      <p className="text-lg text-blue-500 mb-2">Este es el dashboard empresarial del Policlínico.</p>
      {ultimaHC && (
        <div className="mb-4 text-green-700 font-semibold">Última Historia Clínica registrada: <span className="font-mono">{ultimaHC}</span></div>
      )}
      <RecepcionModulo />
    </div>
  );
}

export default Dashboard;


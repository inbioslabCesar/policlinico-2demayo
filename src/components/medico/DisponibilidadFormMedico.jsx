import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Formulario para que el médico seleccione fechas y agregue uno o varios bloques de horario por fecha
function DisponibilidadFormMedico({ onSave }) {
  const [selectedDates, setSelectedDates] = useState([]); // array de fechas seleccionadas
  const [bloques, setBloques] = useState({}); // { fecha: [{hora_inicio, hora_fin}, ...] }

  // Selección de fechas múltiples
  const toLocalYMD = (date) => {
    const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return d.toISOString().slice(0, 10);
  };
  const handleDateChange = (date) => {
    let dates = Array.isArray(date) ? date : [date];
    // Convertir a string YYYY-MM-DD en zona local
    dates = dates.map(d => toLocalYMD(d));
    setSelectedDates(dates);
    // Inicializar bloques para nuevas fechas
    setBloques(prev => {
      const nuevo = { ...prev };
      dates.forEach(f => { if (!nuevo[f]) nuevo[f] = [{ hora_inicio: "08:00:00", hora_fin: "10:00:00" }]; });
      // Eliminar fechas quitadas
      Object.keys(nuevo).forEach(f => { if (!dates.includes(f)) delete nuevo[f]; });
      return nuevo;
    });
  };

  // Cambiar hora de un bloque
  const handleBloqueChange = (fecha, idx, campo, valor) => {
    setBloques(prev => {
      const nuevo = { ...prev };
      nuevo[fecha][idx][campo] = valor;
      return { ...nuevo };
    });
  };

  // Agregar bloque a una fecha
  const addBloque = (fecha) => {
    setBloques(prev => {
      const nuevo = { ...prev };
      nuevo[fecha] = [...nuevo[fecha], { hora_inicio: "08:00:00", hora_fin: "10:00:00" }];
      return nuevo;
    });
  };

  // Eliminar bloque de una fecha
  const removeBloque = (fecha, idx) => {
    setBloques(prev => {
      const nuevo = { ...prev };
      nuevo[fecha] = nuevo[fecha].filter((_, i) => i !== idx);
      return nuevo;
    });
  };

  // Guardar todos los bloques
  const handleSave = () => {
    // Generar array [{fecha, hora_inicio, hora_fin}]
    const bloquesArray = [];
    Object.entries(bloques).forEach(([fecha, arr]) => {
      arr.forEach(b => bloquesArray.push({ fecha, ...b }));
    });
    if (onSave) onSave(bloquesArray);
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow bg-white">
      <h2 className="font-bold text-lg mb-2 text-center">Definir Disponibilidad</h2>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Selecciona fechas:</label>
        <Calendar
          onChange={handleDateChange}
          value={selectedDates.length === 1 ? new Date(selectedDates[0]) : selectedDates.map(f => new Date(f))}
          selectRange={false}
          minDetail="month"
          maxDetail="month"
          tileClassName={({ date }) => selectedDates.includes(toLocalYMD(date)) ? "bg-blue-200" : ""}
          allowPartialRange={false}
          showNeighboringMonth={false}
          locale="es-ES"
          selectMultiple
        />
      </div>
      {selectedDates.length === 0 && <div className="text-gray-500 text-sm mb-2">Selecciona al menos una fecha en el calendario.</div>}
      {selectedDates.map(fecha => (
        <div key={fecha} className="mb-4 border rounded p-2 bg-gray-50">
          <div className="font-semibold mb-1">{fecha}</div>
          {bloques[fecha].map((bloque, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-1">
              <input type="time" value={bloque.hora_inicio} onChange={e => handleBloqueChange(fecha, idx, "hora_inicio", e.target.value + ":00")}
                className="border rounded px-2 py-1" step="1800" />
              <span>a</span>
              <input type="time" value={bloque.hora_fin} onChange={e => handleBloqueChange(fecha, idx, "hora_fin", e.target.value + ":00")}
                className="border rounded px-2 py-1" step="1800" />
              <button type="button" onClick={() => removeBloque(fecha, idx)} className="text-red-600 hover:underline">Eliminar</button>
            </div>
          ))}
          <button type="button" onClick={() => addBloque(fecha)} className="text-blue-600 hover:underline text-sm mt-1">+ Agregar otro horario</button>
        </div>
      ))}
      <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded font-bold w-full mt-2">Guardar Disponibilidad</button>
    </div>
  );
}

export default DisponibilidadFormMedico;

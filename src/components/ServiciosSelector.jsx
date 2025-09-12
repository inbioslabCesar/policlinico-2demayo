import React from "react";

const servicios = [
  { key: "consulta", label: "Consulta Médica" },
  { key: "laboratorio", label: "Laboratorio" },
  { key: "farmacia", label: "Farmacia" },
  { key: "rayosx", label: "Rayos X" },
  { key: "ecografia", label: "Ecografía" },
  { key: "ocupacional", label: "Medicina Ocupacional" },
];


// Se espera que usuario_id esté disponible en localStorage/session o como prop
function ServiciosSelector({ paciente }) {
  const handleSeleccion = async (servicio) => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || !usuario.id) {
      alert('No se encontró el usuario logueado.');
      return;
    }
    try {
      const res = await fetch('/api_atenciones.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paciente_id: paciente.id,
          usuario_id: usuario.id,
          servicio: servicio.key,
          observaciones: ''
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Atención registrada. Redirigiendo a módulo: ${servicio.label}`);
        // Aquí puedes hacer la redirección real según el servicio
      } else {
        alert('Error al registrar atención: ' + (data.error || '')); 
      }
    } catch (err) {
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-4">
      {servicios.map(servicio => (
        <button
          key={servicio.key}
          onClick={() => handleSeleccion(servicio)}
          className="bg-purple-800 text-white px-4 py-2 rounded shadow hover:bg-blue-500 font-bold"
        >
          {servicio.label}
        </button>
      ))}
    </div>
  );
}

export default ServiciosSelector;

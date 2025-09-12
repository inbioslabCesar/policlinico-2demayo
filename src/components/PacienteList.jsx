import React from "react";

function PacienteList({ pacientes }) {
  return (
    <div className="card mx-auto my-4 shadow" style={{maxWidth:'400px'}}>
      <div className="card-body">
        <h2 className="h5 fw-bold mb-3">Lista de Pacientes</h2>
        <ul className="list-group list-group-flush">
          {pacientes && pacientes.length > 0 ? (
            pacientes.map((p) => (
              <li key={p.id} className="list-group-item">
                {p.nombres} {p.apellidos} - {p.edad} años
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">No hay pacientes registrados.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default PacienteList;

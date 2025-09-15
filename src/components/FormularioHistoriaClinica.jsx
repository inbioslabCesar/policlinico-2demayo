import React from "react";

export default function FormularioHistoriaClinica({ hc, setHc, guardando, msg, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-2 mt-4">Anamnesis</h3>
      <div className="mb-2">
        <label className="block font-semibold mb-1">Tiempo de Enfermedad:</label>
        <textarea
          className="w-full border rounded p-1"
          rows={2}
          value={hc.tiempo_enfermedad}
          onChange={e => setHc(h => ({ ...h, tiempo_enfermedad: e.target.value }))}
        />
      </div>
      <div className="mb-2">
        <label className="block font-semibold mb-1">Forma de inicio:</label>
        <textarea
          className="w-full border rounded p-1"
          rows={2}
          value={hc.forma_inicio}
          onChange={e => setHc(h => ({ ...h, forma_inicio: e.target.value }))}
        />
      </div>
      <div className="mb-2">
        <label className="block font-semibold mb-1">Curso:</label>
        <textarea
          className="w-full border rounded p-1"
          rows={2}
          value={hc.curso}
          onChange={e => setHc(h => ({ ...h, curso: e.target.value }))}
        />
      </div>
      <h3 className="text-lg font-semibold mb-2 mt-4">Antecedentes</h3>
      <div className="mb-2">
        <textarea
          className="w-full border rounded p-1"
          rows={2}
          value={hc.antecedentes}
          onChange={e => setHc(h => ({ ...h, antecedentes: e.target.value }))}
        />
      </div>
      <h3 className="text-lg font-semibold mb-2 mt-4">Examen Físico</h3>
      <div className="mb-2">
        <textarea
          className="w-full border rounded p-1"
          rows={2}
          value={hc.examen_fisico}
          onChange={e => setHc(h => ({ ...h, examen_fisico: e.target.value }))}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={guardando}
      >
        {guardando ? "Guardando..." : "Guardar"}
      </button>
      {msg && (
        <div className="mt-2 text-center text-green-700 font-semibold">
          {msg}
        </div>
      )}
    </form>
  );
}

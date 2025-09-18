import React, { useState } from "react";

// Estructura inicial de un parámetro o subtítulo
const defaultItem = {
  tipo: "Parámetro", // o "Subtítulo"
  nombre: "",
  metodologia: "",
  unidad: "",
  opciones: [],
  referencias: [],
  formula: "",
  negrita: false,
  color_texto: "#000000",
  color_fondo: "#ffffff",
  orden: 1
};

export default function ExamenEditorForm({ initialData = [], onChange }) {
  const [items, setItems] = useState(initialData);

  // Agregar nuevo parámetro o subtítulo
  const addItem = tipo => {
    setItems([
      ...items,
      { ...defaultItem, tipo, nombre: tipo === "Parámetro" ? "Nuevo parámetro" : "Nuevo subtítulo", orden: items.length + 1 }
    ]);
  };

  // Editar campo de un ítem
  const handleItemChange = (idx, field, value) => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setItems(updated);
    onChange && onChange(updated);
  };

  // Eliminar ítem
  const removeItem = idx => {
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
    onChange && onChange(updated);
  };

  // Agregar referencia a un parámetro
  const addReferencia = idx => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, referencias: [...item.referencias, { valor: "", desc: "", valor_min: "", valor_max: "" }] } : item
    );
    setItems(updated);
    onChange && onChange(updated);
  };

  // Editar referencia
  const handleReferenciaChange = (itemIdx, refIdx, field, value) => {
    const updated = items.map((item, i) => {
      if (i !== itemIdx) return item;
      const referencias = item.referencias.map((ref, j) =>
        j === refIdx ? { ...ref, [field]: value } : ref
      );
      return { ...item, referencias };
    });
    setItems(updated);
    onChange && onChange(updated);
  };

  // Eliminar referencia
  const removeReferencia = (itemIdx, refIdx) => {
    const updated = items.map((item, i) => {
      if (i !== itemIdx) return item;
      const referencias = item.referencias.filter((_, j) => j !== refIdx);
      return { ...item, referencias };
    });
    setItems(updated);
    onChange && onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <button type="button" className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => addItem("Parámetro")}>+ Parámetro</button>
        <button type="button" className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => addItem("Subtítulo")}>+ Subtítulo</button>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="border rounded p-3 bg-gray-50 relative">
          <button type="button" className="absolute top-2 right-2 text-red-600" onClick={() => removeItem(idx)}>Eliminar</button>
          <div className="flex gap-2 mb-2">
            <select value={item.tipo} onChange={e => handleItemChange(idx, "tipo", e.target.value)} className="border rounded px-2 py-1">
              <option value="Parámetro">Parámetro</option>
              <option value="Subtítulo">Subtítulo</option>
            </select>
            <input value={item.nombre} onChange={e => handleItemChange(idx, "nombre", e.target.value)} placeholder="Nombre" className="border rounded px-2 py-1 flex-1" />
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={item.negrita} onChange={e => handleItemChange(idx, "negrita", e.target.checked)} /> Negrita
            </label>
            <input type="color" value={item.color_texto} onChange={e => handleItemChange(idx, "color_texto", e.target.value)} title="Color texto" />
            <input type="color" value={item.color_fondo} onChange={e => handleItemChange(idx, "color_fondo", e.target.value)} title="Color fondo" />
          </div>
          {item.tipo === "Parámetro" && (
            <>
              <div className="flex gap-2 mb-2">
                <input value={item.metodologia} onChange={e => handleItemChange(idx, "metodologia", e.target.value)} placeholder="Metodología" className="border rounded px-2 py-1 flex-1" />
                <input value={item.unidad} onChange={e => handleItemChange(idx, "unidad", e.target.value)} placeholder="Unidad" className="border rounded px-2 py-1 w-32" />
                <input value={item.formula} onChange={e => handleItemChange(idx, "formula", e.target.value)} placeholder="Fórmula (opcional)" className="border rounded px-2 py-1 flex-1" />
              </div>
              <div>
                <b>Referencias:</b>
                <button type="button" className="ml-2 text-green-600" onClick={() => addReferencia(idx)}>+ Referencia</button>
                {item.referencias.map((ref, refIdx) => (
                  <div key={refIdx} className="flex gap-2 mt-1 items-center flex-wrap">
                    <input value={ref.valor} onChange={e => handleReferenciaChange(idx, refIdx, "valor", e.target.value)} placeholder="Valor texto" className="border rounded px-2 py-1 w-28" />
                    <input value={ref.valor_min} onChange={e => handleReferenciaChange(idx, refIdx, "valor_min", e.target.value)} placeholder="Min" className="border rounded px-2 py-1 w-16" />
                    <input value={ref.valor_max} onChange={e => handleReferenciaChange(idx, refIdx, "valor_max", e.target.value)} placeholder="Max" className="border rounded px-2 py-1 w-16" />
                    <input value={ref.desc} onChange={e => handleReferenciaChange(idx, refIdx, "desc", e.target.value)} placeholder="Descripción" className="border rounded px-2 py-1 flex-1" />
                    <button type="button" className="text-red-600 px-3 py-1 ml-2 border border-red-200 rounded" style={{ minWidth: '70px' }} onClick={() => removeReferencia(idx, refIdx)}>Eliminar</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

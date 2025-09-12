
import React, { useEffect, useState } from "react";
import PacienteForm from "./PacienteForm";
import { BASE_URL } from "../config/config";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


// ...existing code...

function PacienteList() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  // Paginación
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  // Filtro de fechas
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  // Buscador dinámico
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch(BASE_URL + "api_pacientes.php")
      .then(res => res.json())
      .then(data => {
        if (data.success) setPacientes(data.pacientes);
        else setError(data.error || "Error al cargar pacientes");
        setLoading(false);
      })
      .catch(() => {
        setError("Error de conexión con el servidor");
        setLoading(false);
      });
  }, []);

  const handleAgregar = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEditar = (paciente) => {
    setEditData(paciente);
    setModalOpen(true);
  };


  const handleRegistroExitoso = (nuevoPaciente) => {
    // Si es edición, reemplazar el paciente en la lista
    if (editData) {
      setPacientes(prev => prev.map(p => p.id === nuevoPaciente.id ? nuevoPaciente : p));
    } else {
      setPacientes(prev => [...prev, nuevoPaciente]);
    }
    setModalOpen(false);
    setEditData(null);
  };

  const handleEliminar = (paciente) => {
    if (!window.confirm("¿Seguro que deseas eliminar este paciente?")) return;
    fetch(BASE_URL + `api_pacientes.php?id=${paciente.id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPacientes(prev => prev.filter(p => p.id !== paciente.id));
        } else {
          alert(data.error || "Error al eliminar paciente");
        }
      })
      .catch(() => alert("Error de conexión con el servidor"));
  };


  // Filtrar por búsqueda y fechas (creado_en)
  const pacientesFiltrados = pacientes.filter(p => {
    // Filtro de búsqueda (historia_clinica, nombre, apellido, dni)
    const texto = busqueda.trim().toLowerCase();
    if (texto) {
      const match = (p.historia_clinica && p.historia_clinica.toLowerCase().includes(texto)) ||
                   (p.nombre && p.nombre.toLowerCase().includes(texto)) ||
                   (p.apellido && p.apellido.toLowerCase().includes(texto)) ||
                   (p.dni && p.dni.toLowerCase().includes(texto));
      if (!match) return false;
    }
    // Filtro de fechas
    if (!fechaDesde && !fechaHasta) return true;
    if (!p.creado_en) return false;
    const fecha = p.creado_en.split(" ")[0];
    if (fechaDesde && fecha < fechaDesde) return false;
    if (fechaHasta && fecha > fechaHasta) return false;
    return true;
  });
  // Calcular paginación
  const totalRows = pacientesFiltrados.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIdx = (page - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const pacientesPagina = pacientesFiltrados.slice(startIdx, endIdx);

  // Exportar a Excel
  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(pacientesFiltrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pacientes");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `pacientes_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Exportar a PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Pacientes", 14, 10);
    const columns = [
      { header: "Historia Clínica", dataKey: "historia_clinica" },
      { header: "Nombres", dataKey: "nombre" },
      { header: "Apellidos", dataKey: "apellido" },
      { header: "Edad", dataKey: "edad" },
      { header: "DNI", dataKey: "dni" }
    ];
    autoTable(doc, {
      columns,
      body: pacientesFiltrados,
      startY: 18,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    doc.save(`pacientes_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
        <h2 className="text-xl font-bold text-purple-800">Pacientes</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setPage(1); }}
            placeholder="Buscar por historia clínica, nombre, apellido o DNI"
            className="border rounded px-2 py-1 min-w-[220px]"
          />
          <label className="text-sm font-medium">Filas por página:</label>
          <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="border rounded px-2 py-1">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
          <button onClick={handleAgregar} className="bg-blue-500 text-white px-4 py-2 rounded font-bold ml-2">Agregar paciente</button>
          <button onClick={exportarExcel} className="bg-green-600 text-white px-3 py-2 rounded font-bold ml-2">Exportar Excel</button>
          <button onClick={exportarPDF} className="bg-red-600 text-white px-3 py-2 rounded font-bold">Exportar PDF</button>
        </div>
      </div>
      {/* Filtro de fechas */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <label className="text-sm">Desde:</label>
        <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} className="border rounded px-2 py-1" />
        <label className="text-sm">Hasta:</label>
        <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} className="border rounded px-2 py-1" />
        {(fechaDesde || fechaHasta) && (
          <button onClick={() => { setFechaDesde(""); setFechaHasta(""); }} className="text-blue-600 underline ml-2">Limpiar filtro</button>
        )}
      </div>
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-2 py-1 border">Historia Clínica</th>
                <th className="px-2 py-1 border">Nombres</th>
                <th className="px-2 py-1 border">Apellidos</th>
                <th className="px-2 py-1 border">Edad</th>
                <th className="px-2 py-1 border">DNI</th>
                <th className="px-2 py-1 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientesPagina.map(p => (
                <tr key={p.id} className="hover:bg-blue-50">
                  <td className="border px-2 py-1">{p.historia_clinica}</td>
                  <td className="border px-2 py-1">{p.nombre}</td>
                  <td className="border px-2 py-1">{p.apellido}</td>
                  <td className="border px-2 py-1">{p.edad !== null ? p.edad : '-'} </td>
                  <td className="border px-2 py-1">{p.dni}</td>
                  <td className="border px-2 py-1 flex gap-2">
                    <button onClick={() => handleEditar(p)} className="bg-yellow-400 text-white px-2 py-1 rounded">Editar</button>
                    <button onClick={() => handleEliminar(p)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Controles de paginación */}
        <div className="flex justify-end items-center gap-2 mt-2">
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50">Anterior</button>
          <span className="text-sm">Página {page} de {totalPages}</span>
          <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50">Siguiente</button>
        </div>
        </>
      )}
      {/* Modal para agregar/editar paciente */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-lg relative">
            <button
              onClick={() => { setModalOpen(false); setEditData(null); }}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
              aria-label="Cerrar"
            >
              ×
            </button>
            <PacienteForm initialData={editData || {}} onRegistroExitoso={handleRegistroExitoso} />
          </div>
        </div>
      )}
    </div>
  );
}
export default PacienteList;

import React, { useEffect, useState } from "react";
import UsuarioForm from "./UsuarioForm";
import { BASE_URL } from "../config/config";

function UsuarioModal({ open, onClose, initialData, onSave, loading }) {
  if (!open) return null;
  // Si initialData es null, pasar un objeto vacío
  const safeInitialData = initialData || {};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
        <UsuarioForm initialData={safeInitialData} onSubmit={onSave} onCancel={onClose} loading={loading} />
      </div>
    </div>
  );
}

function UsuarioList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filtroRol, setFiltroRol] = useState("");

  const fetchUsuarios = () => {
    setLoading(true);
  fetch(BASE_URL + "api_usuarios.php")
      .then(res => res.json())
      .then(data => {
        setUsuarios(Array.isArray(data) ? data : data.usuarios || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Error de conexión con el servidor");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleAgregar = () => {
    setEditData(null);
    setModalOpen(true);
  };
  const handleEditar = (u) => {
    setEditData(u);
    setModalOpen(true);
  };
  const handleEliminar = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
  fetch(BASE_URL + `api_usuarios.php?id=${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => fetchUsuarios());
  };
  const handleSave = (form) => {
    setSaving(true);
    const method = editData ? "PUT" : "POST";
  fetch(BASE_URL + "api_usuarios.php", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData ? { ...editData, ...form } : form)
    })
      .then(res => res.json())
      .then(() => {
        setModalOpen(false);
        setSaving(false);
        fetchUsuarios();
      })
      .catch(() => setSaving(false));
  };

  const roles = ["", "administrador", "medico", "enfermero", "recepcionista", "laboratorista", "quimico"];
  const usuariosFiltrados = filtroRol ? usuarios.filter(u => u.rol === filtroRol) : usuarios;

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-purple-800">Usuarios</h2>
        <button onClick={handleAgregar} className="bg-blue-500 text-white px-4 py-2 rounded font-bold">Agregar usuario</button>
      </div>
      <div className="mb-2">
        <label className="mr-2">Filtrar por rol:</label>
        <select value={filtroRol} onChange={e => setFiltroRol(e.target.value)} className="border rounded px-2 py-1">
          {roles.map(r => <option key={r} value={r}>{r ? r.charAt(0).toUpperCase() + r.slice(1) : "Todos"}</option>)}
        </select>
      </div>
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-xs md:text-sm border">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-2 py-1 border">Usuario</th>
                <th className="px-2 py-1 border">Nombre</th>
                <th className="px-2 py-1 border hidden md:table-cell">DNI</th>
                <th className="px-2 py-1 border hidden md:table-cell">Profesión</th>
                <th className="px-2 py-1 border">Rol</th>
                <th className="px-2 py-1 border hidden md:table-cell">Estado</th>
                <th className="px-2 py-1 border hidden md:table-cell">Creado</th>
                <th className="px-2 py-1 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map(u => (
                <tr key={u.id} className="hover:bg-blue-50">
                  <td className="border px-2 py-1">{u.usuario}</td>
                  <td className="border px-2 py-1">{u.nombre}</td>
                  <td className="border px-2 py-1 hidden md:table-cell">{u.dni}</td>
                  <td className="border px-2 py-1 hidden md:table-cell">{u.profesion}</td>
                  <td className="border px-2 py-1">{u.rol}</td>
                  <td className="border px-2 py-1 hidden md:table-cell">{u.activo === 1 || u.activo === "1" ? "Activo" : "Inactivo"}</td>
                  <td className="border px-2 py-1 hidden md:table-cell">{u.creado_en ? u.creado_en.split(" ")[0] : ""}</td>
                  <td className="border px-2 py-1 flex gap-2">
                    <button onClick={() => handleEditar(u)} className="bg-yellow-400 text-white px-2 py-1 rounded">Editar</button>
                    <button onClick={() => handleEliminar(u.id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <UsuarioModal open={modalOpen} onClose={() => setModalOpen(false)} initialData={editData} onSave={handleSave} loading={saving} />
    </div>
  );
}

export default UsuarioList;

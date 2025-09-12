import RecepcionModulo from "./RecepcionModulo";

function Dashboard({ usuario }) {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 bg-white/95 rounded-xl border border-blue-400 shadow-lg mt-10">
      <h1 className="text-2xl font-bold text-purple-800 mb-2 drop-shadow">Bienvenido, {usuario?.nombre || "Usuario"}</h1>
      <p className="text-lg text-blue-500 mb-6">Este es el dashboard empresarial del Policlínico.</p>
      <RecepcionModulo />
    </div>
  );
}

export default Dashboard;


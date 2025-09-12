
function Header({ usuario, onLogout }) {
  return (
    <nav className="navbar navbar-dark bg-danger px-3">
      <span className="navbar-brand mb-0 h1">Policlínico 2 de Mayo - Hospital</span>
      {usuario && (
        <button
          onClick={onLogout}
          className="btn btn-light text-danger fw-semibold"
        >
          Cerrar sesión
        </button>
      )}
    </nav>
  );
}

export default Header;

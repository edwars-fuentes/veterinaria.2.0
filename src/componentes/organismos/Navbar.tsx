import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const esRutaUsuarioLogueado = [
    "/InicioUsuario",
    "/Mascotas",
    "/Tienda",
    "/Contacto",
    "/CuentaUsuario",
  ].includes(location.pathname);

  // Cierra el menú desplegable al navegar a otra ruta
  useEffect(() => {
    setMenuAbierto(false);
  }, [location.pathname]);

  const renderEnlaces = () => (
    <>
      {location.pathname === "/" && (
        <>
          <Link
            className="nav-link text-white d-flex align-items-center gap-2 py-2 py-md-0"
            to="/Registro"
          >
            <i className="fa-solid fa-user"></i>
            <span>Registro</span>
          </Link>
          <Link
            className="nav-link text-white d-flex align-items-center gap-2 py-2 py-md-0"
            to="/"
          >
            <i className="fa-solid fa-house"></i>
            <span>Inicio</span>
          </Link>
        </>
      )}

      {esRutaUsuarioLogueado && (
        <Link
          className="nav-link text-white d-flex align-items-center gap-2 py-2 py-md-0"
          to="/InicioUsuario"
        >
          <i className="fa-solid fa-house"></i>
          <span>Inicio</span>
        </Link>
      )}

      {location.pathname === "/InicioUsuario" && (
        <>
          <Link
            className="nav-link text-white d-flex align-items-center gap-2 py-2 py-md-0"
            to="/Mascotas"
          >
            <i className="fa-solid fa-dog"></i>
            <span>Mascotas</span>
          </Link>

          <Link
            className="nav-link text-white d-flex align-items-center gap-2 py-2 py-md-0"
            to="/Tienda"
          >
            <i className="fa-solid fa-store"></i>
            <span>Tienda</span>
          </Link>

          <Link
            className="nav-link text-white d-flex align-items-center gap-2 py-2 py-md-0"
            to="/Contacto"
          >
            <i className="fa-solid fa-phone"></i>
            <span>Contacto</span>
          </Link>

          <Link
            className="nav-link text-white d-flex align-items-center gap-2 py-2 py-md-0"
            to="/CuentaUsuario"
          >
            <i className="fa-solid fa-user"></i>
            <span>Cuenta</span>
          </Link>

          <Link
            className="nav-link text-white d-flex align-items-center gap-2 py-2 py-md-0"
            to="/Carrito"
            aria-label="Carrito"
          >
            <i className="fa-solid fa-cart-shopping"></i>
            <span className="d-md-none">Carrito</span>
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-success">
      <div className="container-fluid px-3 px-md-4">
        <Link
          className="navbar-brand text-white d-flex align-items-center gap-2 fs-6 fs-md-5"
          to="/"
        >
          <img
            src="/img/icono.jpg"
            alt="Logo Veterinaria San Marcos"
            width="32"
            height="32"
            className="rounded-circle d-inline-block flex-shrink-0"
          />
          <span>Veterinaria San Marcos</span>
        </Link>

        {/* Botón hamburguesa solo en móvil (< md) */}
        <button
          type="button"
          className="navbar-toggler border-0"
          aria-label="Abrir menú de navegación"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto((prev) => !prev)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú en escritorio */}
        <div className="d-none d-md-flex align-items-center gap-3 navbar-nav ms-auto">
          {renderEnlaces()}
        </div>
      </div>

      {/* Menú desplegable en celular al pulsar la hamburguesa */}
      {menuAbierto && (
        <div className="d-md-none w-100 px-3 pb-3 pt-2 border-top border-light border-opacity-25">
          <div className="navbar-nav flex-column gap-1">
            {renderEnlaces()}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
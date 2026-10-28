import { Link, useLocation } from "react-router-dom";

function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand navbar-dark bg-success">
            {/* Cambia "container" por "container-fluid" y añade padding lateral opcional (px-4) */}
            <div className="container-fluid px-4">
                <Link className="navbar-brand text-white d-flex align-items-center gap-2" to="/">
                    <img 
                        src="/img/icono.jpg" 
                        alt="Logo Veterinaria San Marcos" 
                        width="35" 
                        height="35" 
                        className="rounded-circle d-inline-block align-text-top"
                    />
                    <span>Veterinaria San Marcos</span>
                </Link>

                <div className="navbar-nav">
                    {location.pathname === "/" && (
                    <Link className="nav-link text-white" to="/Registro">
                        <i className="fa-solid fa-user"></i>
                        <span>Registro</span>
                    </Link>
                    )}

                    {location.pathname === "/InicioUsuario" && (
                    <Link className="nav-link text-white d-flex align-items-center gap-1" to="/InicioUsuario">
                        <i className="fa-solid fa-house"></i>
                        <span>Inicio</span>
                    </Link>                       
                    )}
                    {location.pathname === "/" && (
                    <Link className="nav-link text-white d-flex align-items-center gap-1" to="/">
                        <i className="fa-solid fa-house"></i>
                        <span>Inicio</span>
                    </Link>
                    )}
                    {location.pathname === "/Mascotas" && (
                    <Link className="nav-link text-white d-flex align-items-center gap-1" to="/InicioUsuario">
                        <i className="fa-solid fa-house"></i>
                        <span>Inicio</span>
                    </Link>
                    )}
                    {location.pathname === "/Contacto" && (
                    <Link className="nav-link text-white d-flex align-items-center gap-1" to="/InicioUsuario">
                        <i className="fa-solid fa-house"></i>
                        <span>Inicio</span>
                    </Link>
                    )}
                    {location.pathname === "/CuentaUsuario" && (
                    <Link className="nav-link text-white d-flex align-items-center gap-1" to="/InicioUsuario">
                        <i className="fa-solid fa-house"></i>
                        <span>Inicio</span>
                    </Link>
                    )}
                    {location.pathname === "/InicioUsuario" && (
                        <Link className="nav-link text-white" to="/Mascotas">
                        <i className="fa-solid fa-dog"></i>
                        mascotas
                        </Link>
                    )}
                    {/* El enlace de Contacto solo se muestra si la ruta actual es /inicio-usuario */}
                    {location.pathname === "/InicioUsuario" && (
                        <Link className="nav-link text-white" to="/Contacto">
                            <i className="fa-solid fa-phone"></i>
                            <span>Contacto</span>
                        </Link>
                    )}
                    {location.pathname === "/InicioUsuario" && (
                    <Link className="nav-link text-white" to="/CuentaUsuario">
                        <i className="fa-solid fa-user"></i>
                        <span>Cuenta</span>
                    </Link>
                    )}
                    {location.pathname === "/InicioUsuario" && (
                    <Link className="nav-link text-white" to="/Carrito">
                        <i className="fa-solid fa-cart-shopping"></i>
                    </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
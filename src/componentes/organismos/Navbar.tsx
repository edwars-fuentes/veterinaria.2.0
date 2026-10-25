import { Link } from "react-router-dom";

function Navbar() {
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
                    <Link className="nav-link text-white d-flex align-items-center gap-1" to="/">
                        <i className="fa-solid fa-house"></i>
                        <span>Inicio</span>
                    </Link>

                    <Link className="nav-link text-white" to="/Mascotas">
                        <i className="fa-solid fa-dog"></i>
                        <span>mascotas</span>
                    </Link>

                    <Link className="nav-link text-white" to="/Contacto">
                        <i className="fa-solid fa-phone"></i>
                        <span>Contacto</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
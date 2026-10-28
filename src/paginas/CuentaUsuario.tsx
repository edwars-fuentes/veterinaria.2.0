import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

type MascotaRegistrada = {
    nombre: string;
    codigo?: string;
    razon: string;
    dueno: string; // Correo del dueño logueado
    estado: "Pendiente" | "Aprobado" | "Rechazado";
};

function CuentaUsuario() {
    const [usuario, setUsuario] = useState<{ nombre: string; correo: string; mensaje: string } | null>(null);

    // Estados para controlar el formulario flotante (modal) de la mascota
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [nombreMascota, setNombreMascota] = useState("");
    const [codigoMedico, setCodigoMedico] = useState("");
    const [razonVisita, setRazonVisita] = useState("");

    useEffect(() => {
        const datos = localStorage.getItem("usuarioLogueado");
        if (datos) {
            setUsuario(JSON.parse(datos));
        }
    }, []);

    // Función para manejar el envío del formulario hacia el Administrador
    const manejarRegistroMascota = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!usuario) return;

        if (nombreMascota.trim() === "") {
            alert("Por favor, ingrese el nombre de la mascota.");
            return;
        }

        if (razonVisita.trim() === "") {
            alert("Por favor, ingrese la razón o motivo del registro.");
            return;
        }

        const nuevaMascota: MascotaRegistrada = {
            nombre: nombreMascota.trim(),
            codigo: codigoMedico.trim() || undefined,
            razon: razonVisita.trim(),
            dueno: usuario.correo,
            estado: "Pendiente"
        };

        // Guardamos de forma global en la base de datos de localStorage para el Admin
        const todasLasMascotas = JSON.parse(localStorage.getItem("mascotasRegistradas") || "[]");
        todasLasMascotas.push(nuevaMascota);
        localStorage.setItem("mascotasRegistradas", JSON.stringify(todasLasMascotas));

        // Limpiar campos y cerrar el formulario modal
        setNombreMascota("");
        setCodigoMedico("");
        setRazonVisita("");
        setMostrarFormulario(false);

        alert(`¡Los datos de ${nuevaMascota.nombre} fueron enviados con éxito al administrador!`);
    };

    return (
        <div className="container mt-4" style={{ position: "relative" }}>
            <div>
                <h1 className="text-dark">Mi Cuenta</h1>
            </div>

            <div className="bg-white p-4 rounded shadow">
                {usuario ? (
                    <div>
                        <p><strong>Nombre:</strong> {usuario.nombre}</p>
                        <p><strong>Correo:</strong> {usuario.correo}</p>

                        <div className="d-flex gap-2 mt-3 ">
                            {/* Botón de Reclamo original estilizado como botón de Bootstrap */}
                            <button className="btn btn-success p-0">
                                <Link className="nav-link text-white px-3 py-2" to="/Contacto">
                                    <span>Reclamo</span>
                                </Link>
                            </button>

                            {/* Botón de Registro modificado para abrir el modal */}
                            <button className="btn btn-success px-3" onClick={() => setMostrarFormulario(true)}>
                                Registrar mascotas
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="mb-0">No hay usuario registrado todavía. Por favor ve a la sección de Registro.</p>
                )}
            </div>

            {/* FORMULARIO MODAL INTERACTIVO (Aparece sobre la pantalla al presionar el botón) */}
            {mostrarFormulario && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
                    alignItems: "center", zIndex: 1050
                }}>
                    <div className="card shadow p-4 bg-white rounded" style={{ width: "100%", maxWidth: "450px" }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="card-title text-secondary mb-0">🐾 Registrar Nueva Mascota</h5>
                            <button type="button" className="btn-close" onClick={() => setMostrarFormulario(false)} aria-label="Close"></button>
                        </div>

                        <form onSubmit={manejarRegistroMascota}>
                            <div className="mb-3">
                                <label className="form-label text-dark fw-medium">Nombre de la Mascota *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ej: Toby, Luna..." 
                                    value={nombreMascota}
                                    onChange={(e) => setNombreMascota(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-dark fw-medium">Código Médico (Opcional)</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ej: VET-1024" 
                                    value={codigoMedico}
                                    onChange={(e) => setCodigoMedico(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-dark fw-medium">Razón o Motivo *</label>
                                <textarea 
                                    className="form-control" 
                                    rows={3} 
                                    placeholder="Describa el motivo de la consulta..."
                                    value={razonVisita}
                                    onChange={(e) => setRazonVisita(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="d-flex gap-2 justify-content-end">
                                <button type="button" className="btn btn-secondary" onClick={() => setMostrarFormulario(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-success fw-bold">
                                    Enviar al Administrador
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CuentaUsuario;

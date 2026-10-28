import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Tipos de datos para el Administrador
type MascotaRegistrada = {
    id?: string;
    nombre: string;
    codigo?: string;
    razon: string;
    dueno: string; // Correo del dueño
    estado: "Pendiente" | "Aprobado" | "Rechazado";
};

type SolicitudAdopcion = {
    id: string;
    usuario: string; // Correo de quien adopta
    mascotas: Array<{ id: string; nombre: string; especie: string }>;
    fecha: string;
    estado: "Pendiente" | "Completada";
};

type Reclamo = {
    id: string;
    usuario: string;
    mensaje: string;
    fecha: string;
};

function PanelAdmin() {
    const navigate = useNavigate();
    
    // Control de la pestaña activa ("mascotas", "adopciones", "reclamos")
    const [pestanaActiva, setPestanaActiva] = useState<"mascotas" | "adopciones" | "reclamos">("mascotas");

    // Estados de las bases de datos
    const [mascotas, setMascotas] = useState<MascotaRegistrada[]>([]);
    const [adopciones, setAdopciones] = useState<SolicitudAdopcion[]>([]);
    const [reclamos, setReclamos] = useState<Reclamo[]>([]);

    // 1. Verificar sesión de administrador y cargar datos de las colecciones
    useEffect(() => {
        const usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogueado") || "{}");
        
        // Protección de ruta estricta
        if (usuarioSesion.rol !== "admin") {
            alert("Acceso denegado. Solo administradores.");
            navigate("/Login");
            return;
        }

        // Cargar colecciones desde el localStorage (Si no existen, se inician vacías o con simulaciones)
        const mascotasLocal = JSON.parse(localStorage.getItem("mascotasRegistradas") || "[]");
        const adopcionesLocal = JSON.parse(localStorage.getItem("carritoAdopcionesGlobal") || "[]");
        const reclamosLocal = JSON.parse(localStorage.getItem("reclamos") || "[]");

        // Datos de prueba iniciales por si las tablas están vacías al probar
        if (mascotasLocal.length === 0) {
            const pruebaMascotas: MascotaRegistrada[] = [
                { nombre: "Toby", codigo: "VET-001", razon: "Control de vacunas anual", dueno: "cliente@correo.com", estado: "Pendiente" }
            ];
            localStorage.setItem("mascotasRegistradas", JSON.stringify(pruebaMascotas));
            setMascotas(pruebaMascotas);
        } else {
            setMascotas(mascotasLocal);
        }

        setAdopciones(adopcionesLocal);
        setReclamos(reclamosLocal);
    }, [navigate]);

    // 2. Cambiar estado de una mascota registrada (Aprobar/Rechazar)
    const cambiarEstadoMascota = (index: number, nuevoEstado: "Aprobado" | "Rechazado") => {
        const listaActualizada = [...mascotas];
        listaActualizada[index].estado = nuevoEstado;
        localStorage.setItem("mascotasRegistradas", JSON.stringify(listaActualizada));
        setMascotas(listaActualizada);
        alert(`Mascota marcada como ${nuevoEstado}`);
    };

    // 3. Gestionar solicitudes de adopción del carrito
    const completarAdopcion = (id: string) => {
        const listaActualizada = adopciones.map(a => a.id === id ? { ...a, estado: "Completada" as const } : a);
        localStorage.setItem("carritoAdopcionesGlobal", JSON.stringify(listaActualizada));
        setAdopciones(listaActualizada);
        alert("Solicitud de adopción procesada con éxito.");
    };

    // 4. Cerrar Sesión
    const manejarCerrarSesion = () => {
        localStorage.removeItem("usuarioLogueado");
        localStorage.setItem("sesionActiva", "false");
        navigate("/Login");
    };

    return (
        <div className="container mt-5">
            {/* Cuadro de texto contenedor para el encabezado */}
            <div className="card shadow-sm border-0 bg-white p-4 mb-4 rounded-3">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="text-danger fw-bold mb-1" style={{ fontSize: "24px" }}>
                            Panel de Control: Administrador
                        </h2>
                        <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                            Supervisión global de solicitudes médicas, adopciones activas del carrito y buzón de reclamos.
                        </p>
                    </div>
                    <button className="btn btn-outline-danger btn-sm px-3" onClick={manejarCerrarSesion} style={{ borderRadius: "6px", fontWeight: "500" }}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Menú de navegación por pestañas de Bootstrap */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item" style={{ cursor: "pointer" }}>
                    <span className={`nav-link ${pestanaActiva === "mascotas" ? "active fw-bold text-danger" : "text-secondary"}`} onClick={() => setPestanaActiva("mascotas")}>
                        🐶 Mascotas Registradas ({mascotas.length})
                    </span>
                </li>
                <li className="nav-item" style={{ cursor: "pointer" }}>
                    <span className={`nav-link ${pestanaActiva === "adopciones" ? "active fw-bold text-danger" : "text-secondary"}`} onClick={() => setPestanaActiva("adopciones")}>
                        🛒 Solicitudes de Adopción ({adopciones.length})
                    </span>
                </li>
                <li className="nav-item" style={{ cursor: "pointer" }}>
                    <span className={`nav-link ${pestanaActiva === "reclamos" ? "active fw-bold text-danger" : "text-secondary"}`} onClick={() => setPestanaActiva("reclamos")}>
                        📩 Reclamos ({reclamos.length})
                    </span>
                </li>
            </ul>

            {/* Contenedor dinámico según la pestaña seleccionada */}
            <div className="card shadow-sm border-0 bg-white p-4">
                
                {/* PESTAÑA 1: MASCOTAS REGISTRADAS */}
                {pestanaActiva === "mascotas" && (
                    <div>
                        <h5 className="text-secondary mb-3">Revisión de Fichas Médicas de Dueños</h5>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Nombre Mascota</th>
                                        <th>Código Médico</th>
                                        <th>Razón/Motivo</th>
                                        <th>Dueño (Correo)</th>
                                        <th>Estado</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mascotas.map((mascota, idx) => (
                                        <tr key={idx}>
                                            <td><strong>{mascota.nombre}</strong></td>
                                            <td>{mascota.codigo || <span className="text-muted">No asignado</span>}</td>
                                            <td>{mascota.razon}</td>
                                            <td>{mascota.dueno}</td>
                                            <td>
                                                <span className={`badge ${mascota.estado === "Aprobado" ? "bg-success" : mascota.estado === "Rechazado" ? "bg-danger" : "bg-warning text-dark"}`}>
                                                    {mascota.estado}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                {mascota.estado === "Pendiente" && (
                                                    <div className="btn-group btn-group-sm">
                                                        <button className="btn btn-success" onClick={() => cambiarEstadoMascota(idx, "Aprobado")}>Aceptar</button>
                                                        <button className="btn btn-danger" onClick={() => cambiarEstadoMascota(idx, "Rechazado")}>Rechazar</button>
                                                    </div>
                                                )}
                                                {mascota.estado !== "Pendiente" && <span className="text-muted fs-7">Procesado</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* PESTAÑA 2: SOLICITUDES DE ADOPCIÓN (CARRITO) */}
                {pestanaActiva === "adopciones" && (
                    <div>
                        <h5 className="text-secondary mb-3">Pedidos del Carrito de Adopciones</h5>
                        {adopciones.length === 0 ? (
                            <p className="text-muted my-3 text-center">No hay órdenes de adopción enviadas todavía.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID Solicitud</th>
                                            <th>Usuario Interesado</th>
                                            <th>Mascotas Seleccionadas</th>
                                            <th>Fecha</th>
                                            <th>Estado</th>
                                            <th className="text-center">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adopciones.map((solicitud) => (
                                            <tr key={solicitud.id}>
                                                <td><code>{solicitud.id}</code></td>
                                                <td>{solicitud.usuario}</td>
                                                <td>
                                                    <ul className="mb-0 ps-3">
                                                        {solicitud.mascotas.map((m, i) => (
                                                            <li key={i}>{m.nombre} ({m.especie})</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td>{solicitud.fecha}</td>
                                                <td>
                                                    <span className={`badge ${solicitud.estado === "Completada" ? "bg-success" : "bg-info text-dark"}`}>
                                                        {solicitud.estado}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    {solicitud.estado === "Pendiente" ? (
                                                        <button className="btn btn-sm btn-primary" onClick={() => completarAdopcion(solicitud.id)}>Finalizar Proceso</button>
                                                    ) : (
                                                        <span className="text-success fw-bold">✓ Entregado</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* PESTAÑA 3: RECLAMOS */}
                {pestanaActiva === "reclamos" && (
                    <div>
                        <h5 className="text-secondary mb-3">Buzón de Sugerencias y Reclamos</h5>
                        {reclamos.length === 0 ? (
                            <p className="text-muted my-3 text-center">Buzón vacío. No hay reclamos registrados.</p>
                        ) : (
                            <div className="row g-3">
                                {reclamos.map((rec) => (
                                    <div className="col-md-6" key={rec.id}>
                                        <div className="card h-100 border-start border-danger border-3 shadow-sm bg-light">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <strong className="text-dark">{rec.usuario}</strong>
                                                    <small className="text-muted">{rec.fecha}</small>
                                                </div>
                                                <p className="card-text text-secondary bg-white p-2 rounded border border-gray">{rec.mensaje}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default PanelAdmin;

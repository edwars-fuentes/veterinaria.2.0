import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Tipos de datos para el Administrador
type MascotaRegistrada = {
    id?: string | number;
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
    id: string | number;
    usuario: string;
    nombreCompleto?: string;
    mensaje: string;
    fecha: string;
    respuesta?: string | null;
    estado?: string;
};

function PanelAdmin() {
    const navigate = useNavigate();
    
    // Control de la pestaña activa ("mascotas", "adopciones", "reclamos")
    const [pestanaActiva, setPestanaActiva] = useState<"mascotas" | "adopciones" | "reclamos">("mascotas");

    // Estados de las bases de datos
    const [mascotas, setMascotas] = useState<MascotaRegistrada[]>([]);
    const [adopciones, setAdopciones] = useState<SolicitudAdopcion[]>([]);
    const [reclamos, setReclamos] = useState<Reclamo[]>([]);
    const [respuestasDraft, setRespuestasDraft] = useState<Record<string, string>>({});
    const [enviandoRespuestaId, setEnviandoRespuestaId] = useState<string | null>(null);

    const obtenerToken = () => {
        const usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogueado") || "{}");
        return usuarioSesion.token || localStorage.getItem("token") || "";
    };

    const cargarMascotasDesdeApi = async (token: string, fallbackLocal: MascotaRegistrada[]) => {
        try {
            const res = await fetch("http://localhost:8082/api/mascotas-registradas", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                setMascotas(fallbackLocal.filter((m) => m.estado === "Pendiente"));
                return;
            }

            const dataApi: Array<{
                id: number;
                nombre: string;
                codigo: string | null;
                razon: string;
                dueno: string;
                estado: "Pendiente" | "Aprobado" | "Rechazado";
            }> = await res.json();

            const pendientesApi: MascotaRegistrada[] = dataApi
                .filter((m) => m.estado === "Pendiente")
                .map((m) => ({
                    id: m.id,
                    nombre: m.nombre,
                    codigo: m.codigo || undefined,
                    razon: m.razon,
                    dueno: m.dueno,
                    estado: m.estado,
                }));

            setMascotas(pendientesApi);
        } catch (error) {
            console.error("Error al obtener mascotas registradas desde la API:", error);
            setMascotas(fallbackLocal.filter((m) => m.estado === "Pendiente"));
        }
    };

    const cargarReclamosDesdeApi = async (token: string, fallbackLocal: Reclamo[]) => {
        try {
            const res = await fetch("http://localhost:8082/api/formulario-contacto", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                setReclamos(fallbackLocal.filter((item) => item.estado !== "Respondido" && !item.respuesta));
                return;
            }

            const dataApi: Array<{
                id: number;
                nombreCompleto: string;
                correo: string;
                mensaje: string;
                respuesta: string | null;
                estado: string;
                fechaCreacion: string;
            }> = await res.json();

            const mapeados: Reclamo[] = dataApi
                .filter((item) => item.estado !== "Respondido" && !item.respuesta)
                .map((item) => ({
                    id: item.id,
                    usuario: item.correo,
                    nombreCompleto: item.nombreCompleto,
                    mensaje: item.mensaje,
                    fecha: item.fechaCreacion
                        ? new Date(item.fechaCreacion).toLocaleDateString()
                        : new Date().toLocaleDateString(),
                    respuesta: item.respuesta,
                    estado: item.estado,
                }));

            setReclamos(mapeados);

            const borradores: Record<string, string> = {};
            mapeados.forEach((rec) => {
                if (rec.respuesta) {
                    borradores[String(rec.id)] = rec.respuesta;
                }
            });
            setRespuestasDraft((prev) => ({ ...borradores, ...prev }));
        } catch (error) {
            console.error("Error al obtener formulario de contacto desde la API:", error);
            setReclamos(fallbackLocal.filter((item) => item.estado !== "Respondido" && !item.respuesta));
        }
    };

    // 1. Verificar sesión de administrador y cargar datos de las colecciones
    useEffect(() => {
        const usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogueado") || "{}");
        const token = usuarioSesion.token || localStorage.getItem("token");
        
        // Protección de ruta estricta
        if (usuarioSesion.rol !== "admin" || !token) {
            alert("Acceso denegado. Solo administradores.");
            navigate("/Login");
            return;
        }

        // Cargar colecciones desde el localStorage (Si no existen, se inician vacías o con simulaciones)
        const mascotasLocal: MascotaRegistrada[] = JSON.parse(localStorage.getItem("mascotasRegistradas") || "[]");
        const adopcionesLocal: SolicitudAdopcion[] = JSON.parse(localStorage.getItem("carritoAdopcionesGlobal") || "[]");
        const reclamosLocal: Reclamo[] = JSON.parse(localStorage.getItem("reclamos") || "[]");

        setMascotas(mascotasLocal.filter((m) => m.estado === "Pendiente"));
        cargarMascotasDesdeApi(token, mascotasLocal);

        setAdopciones(adopcionesLocal.filter((a) => a.estado === "Pendiente"));
        setReclamos(reclamosLocal.filter((item) => item.estado !== "Respondido" && !item.respuesta));
        cargarReclamosDesdeApi(token, reclamosLocal);
    }, [navigate]);

    // 2. Cambiar estado de una mascota registrada (Aprobar/Rechazar) y quitarla de la lista activa
    const cambiarEstadoMascota = async (index: number, nuevoEstado: "Aprobado" | "Rechazado") => {
        const mascotaObjetivo = mascotas[index];
        if (!mascotaObjetivo) return;

        const token = obtenerToken();
        if (mascotaObjetivo.id !== undefined && token) {
            try {
                await fetch(`http://localhost:8082/api/mascotas-registradas/${mascotaObjetivo.id}/estado`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ estado: nuevoEstado }),
                });
            } catch (error) {
                console.error("Error al actualizar estado de mascota registrada en la API:", error);
            }
        }

        const todasMascotas: MascotaRegistrada[] = JSON.parse(localStorage.getItem("mascotasRegistradas") || "[]");
        const actualizadasGlobal = todasMascotas.map((m) =>
            m === mascotaObjetivo ||
            (m.nombre === mascotaObjetivo.nombre &&
                m.dueno === mascotaObjetivo.dueno &&
                m.razon === mascotaObjetivo.razon &&
                m.estado === "Pendiente")
                ? { ...m, estado: nuevoEstado }
                : m
        );
        localStorage.setItem("mascotasRegistradas", JSON.stringify(actualizadasGlobal));
        setMascotas((prev) => prev.filter((_, idx) => idx !== index));
        alert(`Mascota marcada como ${nuevoEstado}`);
    };

    // 3. Gestionar solicitudes de adopción del carrito y quitarla al completar
    const completarAdopcion = (id: string) => {
        const todasAdopciones: SolicitudAdopcion[] = JSON.parse(localStorage.getItem("carritoAdopcionesGlobal") || "[]");
        const actualizadasGlobal = todasAdopciones.map((a) =>
            a.id === id ? { ...a, estado: "Completada" as const } : a
        );
        localStorage.setItem("carritoAdopcionesGlobal", JSON.stringify(actualizadasGlobal));
        setAdopciones((prev) => prev.filter((a) => a.id !== id));
        alert("Solicitud de adopción procesada con éxito.");
    };

    // 4. Responder reclamo / mensaje de contacto y enviarlo al backend
    const manejarCambioRespuesta = (idClave: string, texto: string) => {
        setRespuestasDraft((prev) => ({ ...prev, [idClave]: texto }));
    };

    const enviarRespuestaReclamo = async (rec: Reclamo) => {
        const idClave = String(rec.id);
        const textoRespuesta = (respuestasDraft[idClave] ?? rec.respuesta ?? "").trim();

        if (!textoRespuesta) {
            alert("Debe escribir una respuesta antes de enviarla.");
            return;
        }

        const token = obtenerToken();
        if (!token) {
            alert("No se encontró el token de sesión.");
            return;
        }

        setEnviandoRespuestaId(idClave);
        try {
            const res = await fetch(`http://localhost:8082/api/formulario-contacto/${rec.id}/responder`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ respuesta: textoRespuesta }),
            });

            if (!res.ok) {
                alert("No se pudo enviar la respuesta al servidor.");
                return;
            }

            await res.json();
            setReclamos((prev) => prev.filter((item) => String(item.id) !== idClave));
            setRespuestasDraft((prev) => {
                const copia = { ...prev };
                delete copia[idClave];
                return copia;
            });
            alert("Respuesta enviada correctamente.");
        } catch (error) {
            console.error("Error al enviar respuesta de reclamo:", error);
            alert("Error de conexión al intentar enviar la respuesta.");
        } finally {
            setEnviandoRespuestaId(null);
        }
    };

    // 5. Cerrar Sesión
    const manejarCerrarSesion = () => {
        localStorage.removeItem("usuarioLogueado");
        localStorage.removeItem("token");
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
                        Mascotas Registradas ({mascotas.length})
                    </span>
                </li>
                <li className="nav-item" style={{ cursor: "pointer" }}>
                    <span className={`nav-link ${pestanaActiva === "adopciones" ? "active fw-bold text-danger" : "text-secondary"}`} onClick={() => setPestanaActiva("adopciones")}>
                        Solicitudes de Adopción ({adopciones.length})
                    </span>
                </li>
                <li className="nav-item" style={{ cursor: "pointer" }}>
                    <span className={`nav-link ${pestanaActiva === "reclamos" ? "active fw-bold text-danger" : "text-secondary"}`} onClick={() => setPestanaActiva("reclamos")}>
                        Reclamos ({reclamos.length})
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
                                {reclamos.map((rec) => {
                                    const idClave = String(rec.id);
                                    return (
                                        <div className="col-md-6" key={idClave}>
                                            <div className="card h-100 border-start border-danger border-3 shadow-sm bg-light">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <strong className="text-dark">{rec.usuario}</strong>
                                                        <small className="text-muted">{rec.fecha}</small>
                                                    </div>
                                                    <p className="card-text text-secondary bg-white p-2 rounded border border-gray">{rec.mensaje}</p>
                                                    <div className="mt-2">
                                                        <textarea
                                                            className="form-control form-control-sm mb-2"
                                                            rows={2}
                                                            placeholder="Escribir respuesta..."
                                                            value={respuestasDraft[idClave] ?? rec.respuesta ?? ""}
                                                            onChange={(e) => manejarCambioRespuesta(idClave, e.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-success"
                                                            disabled={enviandoRespuestaId === idClave}
                                                            onClick={() => enviarRespuestaReclamo(rec)}
                                                        >
                                                            {enviandoRespuestaId === idClave ? "Enviando..." : "Enviar respuesta"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default PanelAdmin;
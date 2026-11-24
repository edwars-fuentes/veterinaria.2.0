import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

type MascotaRegistrada = {
    id?: number | string;
    nombre: string;
    codigo?: string | null;
    razon: string;
    dueno: string; // Correo del dueño logueado
    estado: "Pendiente" | "Aprobado" | "Rechazado";
    fechaCreacion?: string;
};

type ReclamoHistorial = {
    id?: number | string;
    nombreCompleto?: string;
    correo?: string;
    usuario?: string;
    mensaje: string;
    respuesta?: string | null;
    estado?: string;
    fechaCreacion?: string;
    fecha?: string;
};

function CuentaUsuario() {
    const [usuario, setUsuario] = useState<{ nombre: string; correo: string; mensaje: string; token?: string } | null>(null);

    // Estados para controlar el formulario flotante (modal) de la mascota
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [nombreMascota, setNombreMascota] = useState("");
    const [codigoMedico, setCodigoMedico] = useState("");
    const [razonVisita, setRazonVisita] = useState("");

    // Estados para el modal de Historial
    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    const [tabHistorial, setTabHistorial] = useState<"mascotas" | "reclamos">("mascotas");
    const [historialMascotas, setHistorialMascotas] = useState<MascotaRegistrada[]>([]);
    const [historialReclamos, setHistorialReclamos] = useState<ReclamoHistorial[]>([]);
    const [cargandoHistorial, setCargandoHistorial] = useState(false);

    useEffect(() => {
        const datos = localStorage.getItem("usuarioLogueado");
        if (datos) {
            setUsuario(JSON.parse(datos));
        }
    }, []);

    // Cargar historial de mascotas registradas y reclamos del usuario
    const abrirHistorial = async () => {
        if (!usuario) return;
        setMostrarHistorial(true);
        setCargandoHistorial(true);

        const usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogueado") || "{}");
        const token = usuarioSesion.token || localStorage.getItem("token") || "";

        // 1. Obtener mascotas registradas del usuario
        try {
            if (token) {
                const resMascotas = await fetch("http://localhost:8082/api/mascotas-registradas/mis-mascotas", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (resMascotas.ok) {
                    const dataMascotas: MascotaRegistrada[] = await resMascotas.json();
                    setHistorialMascotas(dataMascotas);
                } else {
                    const todasLocal: MascotaRegistrada[] = JSON.parse(localStorage.getItem("mascotasRegistradas") || "[]");
                    setHistorialMascotas(
                        todasLocal.filter((m) => m.dueno?.toLowerCase() === usuario.correo.toLowerCase())
                    );
                }
            } else {
                const todasLocal: MascotaRegistrada[] = JSON.parse(localStorage.getItem("mascotasRegistradas") || "[]");
                setHistorialMascotas(
                    todasLocal.filter((m) => m.dueno?.toLowerCase() === usuario.correo.toLowerCase())
                );
            }
        } catch (error) {
            console.error("Error al cargar historial de mascotas:", error);
            const todasLocal: MascotaRegistrada[] = JSON.parse(localStorage.getItem("mascotasRegistradas") || "[]");
            setHistorialMascotas(
                todasLocal.filter((m) => m.dueno?.toLowerCase() === usuario.correo.toLowerCase())
            );
        }

        // 2. Obtener reclamos y respuestas del usuario
        try {
            if (token) {
                const resReclamos = await fetch("http://localhost:8082/api/formulario-contacto/mis-mensajes", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (resReclamos.ok) {
                    const dataReclamos: ReclamoHistorial[] = await resReclamos.json();
                    setHistorialReclamos(dataReclamos);
                } else {
                    const reclamosLocal: ReclamoHistorial[] = JSON.parse(localStorage.getItem("reclamos") || "[]");
                    setHistorialReclamos(
                        reclamosLocal.filter(
                            (r) => (r.correo || r.usuario || "").toLowerCase() === usuario.correo.toLowerCase()
                        )
                    );
                }
            } else {
                const reclamosLocal: ReclamoHistorial[] = JSON.parse(localStorage.getItem("reclamos") || "[]");
                setHistorialReclamos(
                    reclamosLocal.filter(
                        (r) => (r.correo || r.usuario || "").toLowerCase() === usuario.correo.toLowerCase()
                    )
                );
            }
        } catch (error) {
            console.error("Error al cargar historial de reclamos:", error);
            const reclamosLocal: ReclamoHistorial[] = JSON.parse(localStorage.getItem("reclamos") || "[]");
            setHistorialReclamos(
                reclamosLocal.filter(
                    (r) => (r.correo || r.usuario || "").toLowerCase() === usuario.correo.toLowerCase()
                )
            );
        } finally {
            setCargandoHistorial(false);
        }
    };

    // Función para manejar el envío del formulario hacia el Administrador
    const manejarRegistroMascota = async (e: FormEvent<HTMLFormElement>) => {
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

        const usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogueado") || "{}");
        const token = usuarioSesion.token || localStorage.getItem("token") || "";

        try {
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const res = await fetch("http://localhost:8082/api/mascotas-registradas", {
                method: "POST",
                headers,
                body: JSON.stringify(nuevaMascota),
            });

            if (res.ok) {
                setNombreMascota("");
                setCodigoMedico("");
                setRazonVisita("");
                setMostrarFormulario(false);
                alert(`¡Los datos de ${nuevaMascota.nombre} fueron enviados con éxito al administrador!`);
                return;
            }
        } catch (error) {
            console.error("Error al enviar mascota registrada a la API:", error);
        }

        // Guardamos de forma global en la base de datos de localStorage para el Admin (respaldo)
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

                        <div className="d-flex gap-2 mt-3 flex-wrap">
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

                            {/* Nuevo botón de Historial */}
                            <button className="btn btn-success px-3" onClick={abrirHistorial}>
                                Historial
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

            {/* MODAL DE HISTORIAL (Mascotas registradas + Reclamos y respuestas del Admin) */}
            {mostrarHistorial && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
                    alignItems: "center", zIndex: 1050, padding: "16px"
                }}>
                    <div className="card shadow p-4 bg-white rounded" style={{ width: "100%", maxWidth: "680px", maxHeight: "85vh", overflowY: "auto" }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="card-title text-secondary mb-0"> Mi Historial</h5>
                            <button type="button" className="btn-close" onClick={() => setMostrarHistorial(false)} aria-label="Close"></button>
                        </div>

                        {/* Pestañas internas */}
                        <ul className="nav nav-tabs mb-3">
                            <li className="nav-item" style={{ cursor: "pointer" }}>
                                <span
                                    className={`nav-link ${tabHistorial === "mascotas" ? "active fw-bold text-success" : "text-secondary"}`}
                                    onClick={() => setTabHistorial("mascotas")}
                                >
                                    Mascotas Registradas ({historialMascotas.length})
                                </span>
                            </li>
                            <li className="nav-item" style={{ cursor: "pointer" }}>
                                <span
                                    className={`nav-link ${tabHistorial === "reclamos" ? "active fw-bold text-success" : "text-secondary"}`}
                                    onClick={() => setTabHistorial("reclamos")}
                                >
                                    Reclamos y Respuestas ({historialReclamos.length})
                                </span>
                            </li>
                        </ul>

                        {cargandoHistorial ? (
                            <p className="text-muted text-center my-4">Cargando historial...</p>
                        ) : (
                            <>
                                {tabHistorial === "mascotas" && (
                                    <div>
                                        {historialMascotas.length === 0 ? (
                                            <p className="text-muted text-center my-3">Aún no has registrado mascotas.</p>
                                        ) : (
                                            <div className="d-flex flex-column gap-2">
                                                {historialMascotas.map((m, idx) => (
                                                    <div key={m.id ?? idx} className="border rounded p-3 bg-light">
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <strong className="text-dark">{m.nombre}</strong>
                                                            <span className={`badge ${
                                                                m.estado === "Aprobado"
                                                                    ? "bg-success"
                                                                    : m.estado === "Rechazado"
                                                                    ? "bg-danger"
                                                                    : "bg-warning text-dark"
                                                            }`}>
                                                                {m.estado}
                                                            </span>
                                                        </div>
                                                        <small className="text-muted d-block mb-1">
                                                            Código médico: {m.codigo ? m.codigo : "No asignado"}
                                                            {m.fechaCreacion ? ` • ${new Date(m.fechaCreacion).toLocaleDateString()}` : ""}
                                                        </small>
                                                        <p className="mb-0 text-secondary" style={{ fontSize: "14px" }}>
                                                            <strong>Motivo:</strong> {m.razon}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {tabHistorial === "reclamos" && (
                                    <div>
                                        {historialReclamos.length === 0 ? (
                                            <p className="text-muted text-center my-3">Aún no has enviado reclamos o consultas.</p>
                                        ) : (
                                            <div className="d-flex flex-column gap-3">
                                                {historialReclamos.map((rec, idx) => {
                                                    const respondido = Boolean(rec.respuesta && rec.respuesta.trim() !== "");
                                                    return (
                                                        <div key={rec.id ?? idx} className="border rounded p-3 bg-light">
                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                <small className="text-muted">
                                                                    {rec.fechaCreacion
                                                                        ? new Date(rec.fechaCreacion).toLocaleDateString()
                                                                        : rec.fecha || ""}
                                                                </small>
                                                                <span className={`badge ${respondido ? "bg-success" : "bg-warning text-dark"}`}>
                                                                    {respondido ? "Respondido" : "Pendiente"}
                                                                </span>
                                                            </div>

                                                            <div className="bg-white p-2 rounded border mb-2">
                                                                <small className="text-muted d-block fw-bold">Tu mensaje:</small>
                                                                <span className="text-dark" style={{ fontSize: "14px" }}>{rec.mensaje}</span>
                                                            </div>

                                                            {respondido ? (
                                                                <div className="p-2 rounded border border-success" style={{ backgroundColor: "#e9f7ef" }}>
                                                                    <small className="text-success d-block fw-bold">Respuesta del Administrador:</small>
                                                                    <span className="text-dark" style={{ fontSize: "14px" }}>{rec.respuesta}</span>
                                                                </div>
                                                            ) : (
                                                                <small className="text-muted fst-italic">
                                                                    Aún sin respuesta del administrador.
                                                                </small>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        <div className="d-flex justify-content-end mt-3">
                            <button type="button" className="btn btn-secondary" onClick={() => setMostrarHistorial(false)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CuentaUsuario;
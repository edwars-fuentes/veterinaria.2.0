import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type MascotaItem = {
    id: number;
    titulo: string;
    descripcion: string;
    precio: number;
    imagen: string;
};

function Carrito() {
    const navigate = useNavigate();
    const [items, setItems] = useState<MascotaItem[]>([]);
    const [usuario, setUsuario] = useState<any>(null);

    // Cargar los productos del carrito y los datos del usuario logueado
    useEffect(() => {
        const carritoLocal = JSON.parse(localStorage.getItem("carritoAdopciones") || "[]");
        const usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogueado") || "null");
        
        setItems(carritoLocal);
        setUsuario(usuarioSesion);
    }, []);

    // Función para quitar una mascota del carrito
    const eliminarDelCarrito = (id: number) => {
        const nuevaLista = items.filter(item => item.id !== id);
        localStorage.setItem("carritoAdopciones", JSON.stringify(nuevaLista));
        setItems(nuevaLista);
    };

    // Función para confirmar el proceso y enviarlo a la bandeja global del Administrador
    const procesarSolicitudAdopcion = () => {
        if (!usuario) {
            alert("Debes iniciar sesión para procesar una solicitud de adopción.");
            navigate("/Login");
            return;
        }

        if (items.length === 0) {
            alert("Tu carrito de adopción está vacío.");
            return;
        }

        // Estructuramos la orden de adopción para el Admin (coincidiendo con los tipos de PanelAdmin)
        const nuevaSolicitud = {
            id: `ADOP-${Math.floor(1000 + Math.random() * 9000)}`,
            usuario: usuario.correo,
            mascotas: items.map(item => ({ id: String(item.id), nombre: item.titulo, especie: item.descripcion })),
            fecha: new Date().toLocaleDateString(),
            estado: "Pendiente"
        };

        // Obtenemos la base de datos global de solicitudes del administrador
        const solicitudesGlobales = JSON.parse(localStorage.getItem("carritoAdopcionesGlobal") || "[]");
        solicitudesGlobales.push(nuevaSolicitud);
        
        // Guardamos en la base de datos del Admin y limpiamos el carrito del usuario local
        localStorage.setItem("carritoAdopcionesGlobal", JSON.stringify(solicitudesGlobales));
        localStorage.removeItem("carritoAdopciones");
        setItems([]);

        alert("¡Solicitud enviada con éxito! El administrador revisará tu caso a la brevedad.");
        navigate("/InicioUsuario");
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-dark fw-bold border-bottom pb-2">🛒 Solicitudes de Adopción Seleccionadas</h2>
            
            {items.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-muted fs-5">No has añadido ninguna mascota a tu lista de adopción todavía.</p>
                    <button className="btn btn-primary" onClick={() => navigate("/Mascotas")}>Ver Mascotas Disponibles</button>
                </div>
            ) : (
                <div className="row">
                    <div className="col-lg-8">
                        {items.map((mascota) => (
                            <div key={mascota.id} className="card mb-3 p-3 shadow-sm bg-white border-0">
                                <div className="row g-0 align-items-center">
                                    <div className="col-md-3">
                                        <img src={mascota.imagen} alt={mascota.titulo} className="img-fluid rounded" style={{ height: "100px", width: "100%", objectFit: "cover" }} />
                                    </div>
                                    <div className="col-md-6 px-3">
                                        <h5 className="fw-bold mb-1 text-capitalize">{mascota.titulo}</h5>
                                        <p className="text-muted small mb-0">{mascota.descripcion}</p>
                                    </div>
                                    <div className="col-md-3 text-end">
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarDelCarrito(mascota.id)}>
                                            Quitar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen lateral de adopción */}
                    <div className="col-lg-4">
                        <div className="card p-4 bg-light shadow-sm border-0">
                            <h4 className="fw-bold mb-3">Resumen</h4>
                            <hr />
                            <div className="d-flex justify-content-between mb-2">
                                <span>Mascotas a adoptar:</span>
                                <span className="fw-bold">{items.length}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <span>Gasto administrativo total:</span>
                                <span className="fw-bold text-success">${items.reduce((acc, item) => acc + item.precio, 0).toLocaleString()}</span>
                            </div>
                            <button className="btn btn-success w-100 py-2 fw-bold" onClick={procesarSolicitudAdopcion}>
                                Enviar Solicitud de Adopción
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Carrito;

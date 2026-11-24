import { useEffect, useState } from "react";
import CardMascotas from "../componentes/moleculas/CardMascotas";

type ProductoData = {
    id: number;
    titulo: string;
    descripcion: string;
    precio: number;
    imagen: string;
    estado?: string;
    disponible?: boolean;
};

const PRODUCTOS_INICIALES: ProductoData[] = [
    {
        id: 1,
        titulo: "Alimento Cachorro Premium",
        descripcion: "Saco nutritivo para perros en crecimiento",
        precio: 18990,
        imagen: "/img/alimento_cachorro.jpg",
    },
    {
        id: 2,
        titulo: "Arena Sanitaria Aglomerante",
        descripcion: "Control de olores para gatos",
        precio: 9990,
        imagen: "/img/arena_gato.jpg",
    },
    {
        id: 3,
        titulo: "Cama Acolchada Mediana",
        descripcion: "Suave y lavable para mascotas",
        precio: 15990,
        imagen: "/img/cama_mascota.jpg",
    },
    {
        id: 4,
        titulo: "Juguete Cuerda Trenzada",
        descripcion: "Ideal para morder y jugar",
        precio: 4990,
        imagen: "/img/juguete_cuerda.jpg",
    },
    {
        id: 5,
        titulo: "Plato Doble Acero",
        descripcion: "Base antideslizante para agua y comida",
        precio: 7990,
        imagen: "/img/plato_doble.jpg",
    },
    {
        id: 6,
        titulo: "Shampoo Neutro Mascotas",
        descripcion: "Limpieza suave para piel sensible",
        precio: 6990,
        imagen: "/img/shampoo_mascota.jpg",
    },
];

function ProductoMascota() {
    const [productos, setProductos] = useState<ProductoData[]>(PRODUCTOS_INICIALES);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        fetch("http://localhost:8082/api/productos?soloDisponibles=true")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    const aprobados = data.filter(
                        (item: { estado?: string; disponible?: boolean }) =>
                            (item.estado === undefined || item.estado === "Aprobado") &&
                            (item.disponible === undefined || item.disponible === true)
                    );
                    if (aprobados.length > 0) {
                        setProductos(aprobados);
                    }
                }
            })
            .catch(() => {})
            .finally(() => setCargando(false));
    }, []);

    return (
        <div className="container-fluid px-2 px-sm-3 px-md-4 py-3 overflow-x-hidden">
            <h1 className="fs-3 fs-md-1 mb-3">Tienda de Productos</h1>

            {cargando && productos.length === 0 ? (
                <p className="text-muted">Cargando productos...</p>
            ) : (
                <div className="row row-cols-2 row-cols-md-3 g-2 g-md-3">
                    {productos.map((p) => (
                        <div key={p.id} className="col">
                            <CardMascotas
                                id={p.id}
                                titulo={p.titulo}
                                descripcion={p.descripcion}
                                precio={p.precio}
                                imagen={p.imagen}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductoMascota;
import { useEffect, useState } from "react";
import CardMascotas from "../componentes/moleculas/CardMascotas";

type MascotaData = {
    id: number;
    titulo: string;
    descripcion: string;
    precio: number;
    imagen: string;
};

const MASCOTAS_INICIALES: MascotaData[] = [
    { id: 1, titulo: "golden", descripcion: "perro amigable", precio: 20000, imagen: "/img/golde.jpg" },
    { id: 2, titulo: "aleman", descripcion: "perro guardian", precio: 24000, imagen: "/img/aleman.jpg" },
    { id: 3, titulo: "American Shorthair", descripcion: "gato pequeño", precio: 19000, imagen: "/img/American Shorthair.jpg" },
    { id: 4, titulo: "pug", descripcion: "perro lindo", precio: 18000, imagen: "/img/pug.jpg" },
    { id: 5, titulo: "ragdoll", descripcion: "gato peludo", precio: 24000, imagen: "/img/ragdoll.jpg" },
];

function Mascotas() {
    const [mascotas, setMascotas] = useState<MascotaData[]>(MASCOTAS_INICIALES);

    useEffect(() => {
        fetch("http://localhost:8082/api/mascotas?soloDisponibles=true")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setMascotas(data);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <div>
            <h1>Adopcion</h1>
            <div className="d-flex gap-3">
                {mascotas.map((m) => (
                    <CardMascotas
                        key={m.id}
                        id={m.id}
                        titulo={m.titulo}
                        descripcion={m.descripcion}
                        precio={m.precio}
                        imagen={m.imagen}
                    />
                ))}
            </div>
        </div>
    );
}

export default Mascotas;
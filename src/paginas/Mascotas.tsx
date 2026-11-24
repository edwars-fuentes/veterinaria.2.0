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
    { id: 6, titulo: "cui", descripcion: "cui apto para la casa", precio: 10000, imagen: "/img/cui.jpg" },
    { id: 7, titulo: "perico verde", descripcion: "ave de casa", precio: 15000, imagen: "/img/perico.jpg" },
    { id: 8, titulo: "perico australiano", descripcion: "ave de casa azul", precio: 20000, imagen: "/img/perico_autraliano.jpg" },
    { id: 9, titulo: "erizo", descripcion: "animal puntiagudo", precio: 25000, imagen: "/img/erizo.jpg" },
    { id: 10, titulo: "pez dorado", descripcion: "animal acuatico para el cuarto", precio: 15000, imagen: "/img/pez_dorado.jpg" },
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

    const primerasCinco = mascotas.slice(0, 5);
    const segundaFila = mascotas.slice(5, 10);
    const restantes = mascotas.slice(10);

    return (
        <div className="w-100">
            <h1>Adopcion</h1>

            {/* Fila 1: 5 primeras mascotas */}
            <div className="d-flex justify-content-start gap-3 w-100 m-0 p-0">
                {primerasCinco.map((m) => (
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

            {/* Fila 2: cui, perico verde, perico australiano, erizo y pez dorado */}
            {segundaFila.length > 0 && (
                <div className="d-flex justify-content-start gap-3 mt-3 w-100 m-0 p-0">
                    {segundaFila.map((m) => (
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
            )}

            {/* Filas siguientes si la API devuelve más de 10 */}
            {restantes.length > 0 && (
                <div className="d-flex flex-wrap justify-content-start gap-3 mt-3 w-100 m-0 p-0">
                    {restantes.map((m) => (
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
            )}
        </div>
    );
}

export default Mascotas;
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const Mascotas = [
    {
        id: 1,
        titulo: "Golden Retriever",
        descripcion: "El Golden Retriever es un perro de tamaño mediano-grande originario de Escocia, famoso por su carácter equilibrado, inteligencia y gran apego a la familia.",
        precio: 20000,
        imagen: "/img/golde.jpg",
    },
    {
        id: 2,
        titulo: "Pastor Alemán",
        descripcion: "El Pastor Alemán (u ovejero alemán) es un perro grande, ágil, musculoso y de gran inteligencia. Perro guardián.",
        precio: 24000,
        imagen: "/img/aleman.jpg",
    },
    {
        id: 3,
        titulo: "American Shorthair",
        descripcion: "Felino de tamaño mediano a grande, musculoso y de gran fortaleza, famoso por su carácter equilibrado, amable y dócil.",
        precio: 19000,
        imagen: "/img/esmoquin.jpg"        
    },
    {
        id: 4,
        titulo: "Pug",
        descripcion: "Son animales de talla pequeña, afectuosos y de gran personalidad.",
        precio: 18000,
        imagen: "/img/pug.jpg"
    },
    {
        id: 5,
        titulo: "Ragdoll",
        descripcion: "Es una raza grande, de complexión musculosa y pelo semilargo, famoso por su carácter dócil, afectuoso y su tendencia a relajarse por completo.",
        precio: 24000,
        imagen: "/img/ragdoll.jpg",
    }
];

function DetalleMascotas() {
    const { id } = useParams();

    const Mascota = Mascotas.find(
        Mascota => Mascota.id === Number(id)
    );

    if (!Mascota) {
        return (
            <div className="container my-5 text-center">
                <h2>Mascota no encontrada</h2>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4 fw-bold">Detalle de la mascota</h1>

            <div className="row align-items-center">
                {/* Columna izquierda: Imagen */}
                <div className="col-12 col-md-6 text-center mb-4 mb-md-0">
                    <img 
                        src={Mascota.imagen} 
                        alt={Mascota.titulo} 
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                </div>
                {/* Columna derecha: Texto e Información */}
                <div className="col-12 col-md-6">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-capitalize fw-bold mb-3">{Mascota.titulo}</h2>
                        <p className="lead">{Mascota.descripcion}</p>
                        <h3 className="text-success fw-bold mt-4">${Mascota.precio}</h3>
                    </div>
                    <br />
                    <button type="submit" className="btn btn-success">
                        <Link className="nav-link text-white" to="/Registro">
                            <i className="fa-solid fa-bag-shopping"></i>
                            <span>Comprar</span>
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DetalleMascotas;

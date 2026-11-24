
function Carrusel() {
const imagenes = [
    {
        src: "/img/veterinaria1.jpg",
        alt: "Atención veterinaria"
    },
    {
        src: "/img/veterinaria2.avif",
        alt: "Cuidado de mascotas"
    },
    {
        src: "/img/veterinaria3.avif",
        alt: "Bienestar animal"
    }
];

    return (
        <div
            id="carruselVeterinaria"
            className="carousel slide carousel-fade"
            data-bs-ride="carousel"
            data-bs-interval="4000"
        >
            <div className="carousel-inner rounded-4 shadow">
                {imagenes.map((imagen, index) => (
                    <div
                        key={imagen.src}
                        className={`carousel-item ${
                            index === 0 ? "active" : ""
                        }`}
                    >
                        <img
                            src={imagen.src}
                            className="d-block w-100"
                            alt={imagen.alt}
                            style={{
                                height: "350px",
                                objectFit: "cover"
                            }}
                        />
                    </div>
                ))}
            </div>

            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carruselVeterinaria"
                data-bs-slide="prev"
            >
                <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                />
                <span className="visually-hidden">
                    Anterior
                </span>
            </button>

            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carruselVeterinaria"
                data-bs-slide="next"
            >
                <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                />
                <span className="visually-hidden">
                    Siguiente
                </span>
            </button>
        </div>
    );
}

export default Carrusel;

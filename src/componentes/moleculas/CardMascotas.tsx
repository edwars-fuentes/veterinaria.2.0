interface CardProps {
    id: number;
    titulo: string;
    descripcion: string;
    precio: number;
    imagen: string;
}

function CardMascotas({ id, titulo, descripcion, precio, imagen }: CardProps) {
    // Función para manejar la adición al carrito local
    const manejarAgregarAlCarrito = () => {
        // 1. Obtenemos el carrito actual o un arreglo vacío
        const carritoActual = JSON.parse(localStorage.getItem("carritoAdopciones") || "[]");

        // 2. Comprobamos si la mascota ya está agregada para no duplicarla
        const yaExiste = carritoActual.some((item: any) => item.id === id);

        if (yaExiste) {
            alert(`${titulo} ya se encuentra en tu carrito de adopción.`);
            return;
        }

        // 3. Insertamos el nuevo objeto al arreglo
        carritoActual.push({ id, titulo, descripcion, precio, imagen });

        // 4. Guardamos la nueva lista en localStorage
        localStorage.setItem("carritoAdopciones", JSON.stringify(carritoActual));
        alert(`¡${titulo} ha sido agregado al carrito de adopción con éxito!`);
    };

    return (
        <div
            className="card shadow-sm h-100"
            style={{ width: "11.5rem", flexShrink: 0 }}
        >
            <img
                src={imagen}
                className="card-img-top p-2"
                alt={titulo}
                style={{
                    height: "110px",
                    width: "100%",
                    objectFit: "contain",
                    borderRadius: "30px",
                }}
            />

            <div className="card-body d-flex flex-column p-2">
                <h6 className="card-title fw-bold text-dark mb-1" style={{ fontSize: "14px" }}>
                    {titulo}
                </h6>
                <p className="card-text text-muted flex-grow-1 mb-1" style={{ fontSize: "12px" }}>
                    {descripcion}
                </p>
                <p className="card-text fw-bold text-success mb-2" style={{ fontSize: "12px" }}>
                    Costos de gestión: ${precio.toLocaleString()}
                </p>
                <div className="mt-auto">
                    {/* Botón interactivo de Bootstrap */}
                    <button
                        className="btn btn-success btn-sm w-100"
                        style={{ fontSize: "12px" }}
                        onClick={manejarAgregarAlCarrito}
                    >
                        Añadir a adopción
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CardMascotas;
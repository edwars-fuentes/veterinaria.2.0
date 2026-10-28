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
        <div className="card shadow-sm" style={{ width: '20rem' }}>
            <img 
                src={imagen}
                className="card-img-top p-2" 
                alt={titulo} 
                style={{ height: '200px', objectFit: 'cover', borderRadius: '12px' }}
            />

            <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-dark">{titulo}</h5>
                <p className="card-text text-muted flex-grow-1">{descripcion}</p>
                <p className="card-text fw-bold text-success" style={{ fontSize: '18px' }}>
                    Costos de gestión: ${precio.toLocaleString()}
                </p>
                <div className="mt-auto">
                    {/* Botón interactivo de Bootstrap */}
                    <button className="btn btn-success w-100" onClick={manejarAgregarAlCarrito}>
                        Añadir a adopción 
                    </button>
                </div>
            </div>
        </div>        
    );
}

export default CardMascotas;

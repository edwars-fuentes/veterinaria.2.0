import { useState, useEffect } from "react";

function CuentaUsuario() {
    const [usuario, setUsuario] = useState<{ nombre: string; correo: string; mensaje: string } | null>(null);

    useEffect(() => {
        const datos = localStorage.getItem("usuarioLogueado");
        if (datos) {
            setUsuario(JSON.parse(datos));
        }
    }, []);

    return (
        <div className="container mt-4">
            <div>
                <h1 className="text-dark">Mi Cuenta</h1>
            </div>

            <div className="bg-white p-4 rounded shadow">
                {usuario ? (
                    <div>
                        <p><strong>Nombre:</strong> {usuario.nombre}</p>
                        <p><strong>Correo:</strong> {usuario.correo}</p>
                    </div>
                ) : (
                    <p className="mb-0">No hay usuario registrado todavía. Por favor ve a la sección de Registro.</p>
                )}
            </div>
        </div>
    );
}

export default CuentaUsuario;
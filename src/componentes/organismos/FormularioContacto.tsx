import { useState } from "react";
import CampoFormulario from "../moleculas/CampoFormulario";

// Definimos el tipo de datos para el formulario de contacto / reclamo
type Reclamo = {
    id: string;
    usuario: string; // Correo de quien envía
    mensaje: string;
    fecha: string;
};

function FormularioContacto() {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [mensaje, setMensaje] = useState("");

    const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (nombre.trim() === "") {
            alert("Debe ingresar su nombre");
            return;
        }
        if (correo.trim() === "") {
            alert("Debe ingresar su correo");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            alert("Ingrese un correo válido");
            return;
        }
        if (mensaje.trim() === "") {
            alert("Debe ingresar un mensaje");
            return;
        }

        const nombreLimpio = nombre.trim();
        const correoLimpio = correo.trim().toLowerCase();
        const mensajeLimpio = mensaje.trim();

        try {
            const respuesta = await fetch("http://localhost:8082/api/formulario-contacto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombreCompleto: nombreLimpio,
                    correo: correoLimpio,
                    mensaje: mensajeLimpio,
                }),
            });

            if (respuesta.ok) {
                setNombre("");
                setCorreo("");
                setMensaje("");
                alert("Formulario enviado correctamente. Su reclamo ha sido registrado por el administrador.");
                return;
            }
        } catch (error) {
            console.error("Error al enviar formulario de contacto a la API:", error);
        }

        // 1. Obtenemos el historial de reclamos que ya existen en el Administrador (respaldo local)
        const reclamosExistentes: Reclamo[] = JSON.parse(
            localStorage.getItem("reclamos") || "[]"
        );

        // 2. Creamos el nuevo objeto de reclamo adaptado al PanelAdmin
        const nuevoReclamo: Reclamo = {
            id: `REC-${Math.floor(1000 + Math.random() * 9000)}`, // ID aleatorio único
            usuario: correoLimpio, // Registramos el correo de contacto
            mensaje: mensajeLimpio,
            fecha: new Date().toLocaleDateString() // Fecha en formato legible (DD/MM/AAAA)
        };

        // 3. Lo añadimos a la lista y actualizamos el localStorage global
        reclamosExistentes.push(nuevoReclamo);
        localStorage.setItem("reclamos", JSON.stringify(reclamosExistentes));

        // 4. Limpiamos los campos del formulario tras un envío exitoso
        setNombre("");
        setCorreo("");
        setMensaje("");

        alert("Formulario enviado correctamente. Su reclamo ha sido registrado por el administrador.");
    };

    return (
        <form onSubmit={manejarEnvio} noValidate>
            <CampoFormulario
                etiqueta="Nombre completo"
                tipo="text"
                nombre="nombre"
                valor={nombre}
                placeholder=""
                alCambiar={setNombre}         
            />

            <CampoFormulario
                etiqueta="Correo electrónico"
                tipo="email"
                nombre="correo"
                valor={correo}
                placeholder=""
                alCambiar={setCorreo}            
            />

            <CampoFormulario
                etiqueta="Mensaje"
                tipo="text"
                nombre="mensaje"
                valor={mensaje}
                placeholder=""
                alCambiar={setMensaje}            
            />

            <div className="text-center mt-4">
                <button type="submit" className="btn btn-success px-4">
                    Enviar mensaje
                </button>
            </div>
        </form>
    );
}

export default FormularioContacto;
import { useState } from "react";
import CampoFormulario from "../moleculas/CampoFormulario";

function FormularioContacto() {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [mensaje, setMensaje] = useState("");

    const manejarEnvio = (e: React.FormEvent<HTMLFormElement>) => {
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
        alert("Formulario enviado correctamente");
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
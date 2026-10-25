
import { useState } from "react";
import CampoRegistro from "../moleculas/CampoRegistro";
import { useNavigate } from "react-router-dom";

function FormularioRegistro() {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");

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

        if (contraseña.trim() === "") {
            alert("Debe ingresar una contraseña");
            return;
        }

        // Guardar solo los datos no sensibles del usuario
        const nuevoUsuario = {
            nombre,
            correo
        };

        localStorage.setItem(
            "usuarioLogueado",
            JSON.stringify(nuevoUsuario)
        );

        // Estado temporal para la navegación de la interfaz
        localStorage.setItem("sesionActiva", "true");

        alert("Formulario enviado correctamente");

        navigate("/InicioUsuario");
    };

    return (
        <form onSubmit={manejarEnvio} noValidate>
            <CampoRegistro
                estiqueta="Nombre completo"
                tipo="text"
                nombre="nombre"
                valor={nombre}
                alCambiar={setNombre}
            />

            <CampoRegistro
                estiqueta="Correo electrónico"
                tipo="email"
                nombre="correo"
                valor={correo}
                alCambiar={setCorreo}
            />

            <CampoRegistro
                estiqueta="Contraseña"
                tipo="password"
                nombre="contraseña"
                valor={contraseña}
                alCambiar={setContraseña}
            />

            <br />

            <button type="submit" className="btn btn-success">
                Registrarse
            </button>
        </form>
    );
}

export default FormularioRegistro;

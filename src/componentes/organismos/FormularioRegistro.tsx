import { useState } from "react";
import type { FormEvent } from "react";
import CampoRegistro from "../moleculas/CampoRegistro";
import { Link, useNavigate } from "react-router-dom";

function FormularioRegistro() {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");

    const manejarEnvio = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const correoNormalizado = correo.trim().toLowerCase();

        if (nombre.trim() === "") {
            alert("Debe ingresar su nombre");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNormalizado)) {
            alert("Ingrese un correo válido");
            return;
        }

        if (contrasena.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        try {
            const respuesta = await fetch("http://localhost:8082/api/usuarios/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombreCompleto: nombre.trim(),
                    correo: correoNormalizado,
                    contrasena,
                }),
            });

            const datos = await respuesta.json().catch(() => null);

            if (!respuesta.ok) {
                alert(datos?.mensaje || "No se pudo completar el registro.");
                return;
            }

            alert("¡Registro exitoso! Ahora puede iniciar sesión.");
            navigate("/Login");
        } catch {
            alert("No se pudo conectar con el servidor.");
        }
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
                nombre="contrasena"
                valor={contrasena}
                alCambiar={setContrasena}
            />

            <br />

            <button type="submit" className="btn btn-success">
                Registrarse
            </button>

            <Link to="/Login" className="btn btn-outline-success ms-2">
                Iniciar sesión
            </Link>
        </form>
    );
}

export default FormularioRegistro;
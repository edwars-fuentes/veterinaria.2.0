
import { useState } from "react";
import type { FormEvent } from "react";
import CampoRegistro from "../moleculas/CampoRegistro";
import { Link, useNavigate } from "react-router-dom";

type Usuario = {
    nombre: string;
    correo: string;
    contrasena: string;
};

function FormularioRegistro() {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");

    const manejarEnvio = (e: FormEvent<HTMLFormElement>) => {
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

        let usuarios: Usuario[] = [];

        try {
            usuarios = JSON.parse(
                localStorage.getItem("usuarios") || "[]"
            );
        } catch {
            alert("No se pudieron leer los usuarios guardados.");
            return;
        }

        const existe = usuarios.some(
            (usuario) => usuario.correo === correoNormalizado
        );

        if (existe) {
            alert("Este correo ya está registrado. Inicie sesión.");
            return;
        }

        const nuevoUsuario: Usuario = {
            nombre: nombre.trim(),
            correo: correoNormalizado,
            contrasena
        };

        usuarios.push(nuevoUsuario);

        try {
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        } catch {
            alert("No se pudieron guardar los datos en este navegador.");
            return;
        }

        alert("¡Registro exitoso! Ahora puede iniciar sesión.");
        navigate("/Login");
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

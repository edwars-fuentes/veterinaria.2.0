import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import CampoFormulario from "../moleculas/CampoFormulario";
import BotonFormulario from "../atomos/BotonFormulario";

type Usuario = {
    nombre: string;
    correo: string;
    contrasena: string;
    rol?: "usuario" | "oficinista" | "admin";
};

function FormularioLogin() {
    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");

    // INSERTAMOS LAS CUENTAS DE PRUEBA DE FORMA AUTOMÁTICA AL CARGAR LA PÁGINA
    useEffect(() => {
        const lista: Usuario[] = JSON.parse(localStorage.getItem("usuarios") || "[]");

        // Verificamos si ya existe el correo de la oficinista para no duplicarlo
        const existeOficinista = lista.some(u => u.correo === "oficina@sanmarcos.com");
        if (!existeOficinista) {
            lista.push({ 
                nombre: "Ana Oficinista", 
                correo: "oficina@sanmarcos.com", 
                contrasena: "123", 
                rol: "oficinista" 
            });
        }

        // Verificamos si ya existe el correo del administrador para crear su cuenta de prueba también
        const existeAdmin = lista.some(u => u.correo === "admin@sanmarcos.com");
        if (!existeAdmin) {
            lista.push({ 
                nombre: "Carlos Administrador", 
                correo: "admin@sanmarcos.com", 
                contrasena: "123", 
                rol: "admin" 
            });
        }

        // Guardamos la lista actualizada con las cuentas especiales listas para usarse
        localStorage.setItem("usuarios", JSON.stringify(lista));
    }, []);

    const manejarEnvio = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const correoNormalizado = correo.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNormalizado)) {
            alert("Debe ingresar un correo válido");
            return;
        }

        if (contrasena.trim() === "") {
            alert("Debe ingresar su contraseña");
            return;
        }

        const usuarios: Usuario[] = JSON.parse(
            localStorage.getItem("usuarios") || "[]"
        );

        const usuarioEncontrado = usuarios.find(
            (usuario) =>
                usuario.correo === correoNormalizado &&
                usuario.contrasena === contrasena
        );

        if (!usuarioEncontrado) {
            alert("Correo o contraseña incorrectos. Verifique sus datos o regístrese.");
            return;
        }

        const rolUsuario = usuarioEncontrado.rol || "usuario";

        const usuarioLogueado = {
            nombre: usuarioEncontrado.nombre,
            correo: usuarioEncontrado.correo,
            rol: rolUsuario
        };

        localStorage.setItem(
            "usuarioLogueado",
            JSON.stringify(usuarioLogueado)
        );

        localStorage.setItem("sesionActiva", "true");

        alert(`¡Bienvenido, ${usuarioEncontrado.nombre}!`);

        if (rolUsuario === "oficinista") {
            navigate("/PanelOficinista");
        } else if (rolUsuario === "admin") {
            navigate("/PanelAdmin");
        } else {
            navigate("/InicioUsuario");
        }
    };

    return (
        <form onSubmit={manejarEnvio} noValidate>
            <CampoFormulario
                etiqueta="Correo electrónico"
                tipo="email"
                nombre="correo"
                valor={correo}
                placeholder="ejemplo@correo.com"
                alCambiar={setCorreo}
            />

            <CampoFormulario
                etiqueta="Contraseña"
                tipo="password"
                nombre="contrasena"
                valor={contrasena}
                placeholder="Ingrese su contraseña"
                alCambiar={setContrasena}
            />

            <BotonFormulario texto="Iniciar sesión" />
        </form>
    );
}

export default FormularioLogin;

import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import CampoFormulario from "../moleculas/CampoFormulario";
import BotonFormulario from "../atomos/BotonFormulario";

type RespuestaLogin = {
    token: string;
    rol: "usuario" | "oficinista" | "admin" | string;
    correo: string;
    nombreCompleto?: string;
};

function FormularioLogin() {
    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [cargando, setCargando] = useState(false);

    const manejarEnvio = async (e: FormEvent<HTMLFormElement>) => {
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

        setCargando(true);

        try {
            const respuesta = await fetch("http://localhost:8082/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    correo: correoNormalizado,
                    contrasena,
                }),
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json().catch(() => null);
                alert(errorData?.mensaje || "Correo o contraseña incorrectos.");
                return;
            }

            const data: RespuestaLogin = await respuesta.json();
            const rolUsuario = (data.rol || "usuario").toLowerCase();
            const nombreMostrar = data.nombreCompleto || data.correo;

            const usuarioLogueado = {
                nombre: nombreMostrar,
                nombreCompleto: nombreMostrar,
                correo: data.correo,
                rol: rolUsuario,
                token: data.token,
            };

            localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioLogueado));
            localStorage.setItem("token", data.token);
            localStorage.setItem("sesionActiva", "true");

            alert(`¡Bienvenido, ${nombreMostrar}!`);

            if (rolUsuario === "oficinista") {
                navigate("/PanelOficinista");
            } else if (rolUsuario === "admin") {
                navigate("/PanelAdmin");
            } else {
                navigate("/InicioUsuario");
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("No se pudo conectar con el servidor de autenticación (puerto 8082).");
        } finally {
            setCargando(false);
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

            <div style={{ "--bs-btn-bg": "#198754", "--bs-btn-border-color": "#198754", "--bs-btn-hover-bg": "#157347", "--bs-btn-hover-border-color": "#146c43" } as React.CSSProperties}>
                <BotonFormulario texto={cargando ? "Ingresando..." : "Iniciar sesión"} />
            </div>
        </form>
    );
}

export default FormularioLogin;
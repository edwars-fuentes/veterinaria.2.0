import { useState } from "react";
import type { FormEvent } from "react";
import CampoFormulario from "../moleculas/CampoFormulario";
import BotonFormulario from "../atomos/BotonFormulario";


function FormularioLogin() {
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");

    const manejarEnvio = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (correo.trim() === "") {
            alert("Debe ingresar su correo electrónico");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            alert("Debe ingresar un correo válido");
            return;
        }

        if (contrasena.trim() === "") {
            alert("Debe ingresar su contraseña");
            return;
        }

        if (contrasena.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        alert("Datos ingresados correctamente");
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
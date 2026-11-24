import MapaRancagua from "../MapaRancagua";
import { useState } from "react";
import "./Acordeon.css";

function Acordeon() {
    const [ubicacionOpen, setUbicacionOpen] = useState(false);
    return (
        <div className="acordeon-contenedor " >
            <details className="acordeon-item " name="accordionExample">
                <summary className="acordeon-titulo acordeon-verde" >
                    <span className="acordeon-texto">motivacion</span>
                    <span className="acordeon-flecha">▼</span>
                </summary>
                <div className="acordeon-contenido">
                    <strong>Nace del profundo amor, respeto y vocación por el cuidado de la vida animal y el bienestar de las mascotas</strong>
                    <img src="https://www.infobae.com/resizer/v2/Q3CRPY7CIRAWHMTWLJX3HC7YDM.png?auth=1adb15e4898339e28c74dce40af15435048ddf1fd1fcdce752e4bca9f912d3d6&smart=true&width=350&height=197&quality=85" className="w-100" alt="Motivación San Marcos"></img> 
                    <div className="accordion-body">Un ejemplo reciente y muy sonado de esta profunda motivación personal se vio reflejado en el ingresante llammado Jhan Franco en el primer puesto a la carrera de Medicina Veterinaria en San Marcos, quien dedicó todo su esfuerzo y triunfo a la memoria de su querido gatito, convirtiendo el cariño hacia su mascota en el motor para superar el exigente examen de admisión de la Decana de América.</div>
                </div>
            </details>

            <details className="acordeon-item" name="accordionExample">
                <summary className="acordeon-titulo">
                    <span className="acordeon-texto">cuidados</span>
                    <span className="acordeon-flecha">▼</span>
                </summary>
                <div className="acordeon-contenido">
                    <strong>En la Veterinaria San Marcos se ofrecen servicios integrales para la salud y el bienestar de las mascotas</strong> 
                    <div className="ratio ratio-16x9 mb-3">
                        <iframe src="https://www.youtube.com/embed/8xrQffvUFsA" title="Cuidados Generales para Mascotas" allowFullScreen></iframe>
                    </div>
                </div>
            </details>

            <details className="acordeon-item" name="accordionExample">
                <summary className="acordeon-titulo">
                    <span className="acordeon-texto">especialista</span>
                    <span className="acordeon-flecha">▼</span>
                </summary>
                <div className="acordeon-contenido">
                    <strong>profecinales y especialisa de la veterinaria san marco</strong>
                    <ul>
                        <li><u>Director/Encargado General:</u> Dr. Roberto Dávila Fernández, quien lidera la gestión de la clínica y es el principal responsable del servicio de Cardiología.</li>
                        <br />
                        <li><u>utoridades de la Facultad:</u> El Decano de la FMV es el Dr. Fernando Carcelén Cáceres y el Vicedecano Académico es el Dr. Alexei Santiani Acosta, quienes coordinan la incorporación de docentes y especialistas al hospital clínico.</li>
                        <br />
                        <li><u>Perfil del Staff:</u> Integrado por médicos veterinarios certificados que combinan la práctica clínica con la cátedra universitaria y la producción científica.</li>
                    </ul>
                </div>
            </details>
            <details className="acordeon-item " name="accordionExample">
                <summary className="acordeon-titulo acordeon-verde" >
                    <span className="acordeon-texto">ubicacion</span>
                    <span className="acordeon-flecha">▼</span>
                </summary>
                <div className="acordeon-contenido">
                    <h5>Encuéntranos en Rancagua</h5>
                    <MapaRancagua open={ubicacionOpen} />
                </div>
            </details>
        </div>
    );
}

export default Acordeon;

import Acordeon from "../componentes/organismos/bootstrap/Acordeon";
import Carrusel from "../componentes/organismos/bootstrap/Carrusel";
function InicioUsuario(){
return (
        <div className="container mt-4">
            <div className="bg-white p-4 rounded shadow">
                <p className="mb-0">bienvenido a la Veterinaria san marcos</p>
            </div>
            <br />
            <div className="mb-4">
                <Carrusel />
            </div>
            <div className="container py-4">
                <Acordeon />
            </div>
        </div>
    );
}
export default InicioUsuario;
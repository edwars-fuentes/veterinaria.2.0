import Carrusel from "../componentes/organismos/Carrusel";
function InicioUsuario(){
return (
        <div className="container mt-4">
            <div className="mb-4">
                <Carrusel />
            </div>
            
            <div className="bg-white p-4 rounded shadow">
                <p className="mb-0">bienvenido a la Veterinaria san marcos</p>
            </div>
        </div>
    );
}
export default InicioUsuario;
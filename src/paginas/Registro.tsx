import FormularioRegistro from "../componentes/organismos/FormularioRegistro";
function Registro() {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card shadow-sm p-4">
                        <h2 className="text-center mb-4 fs-3 fw-bold">Formulario registro</h2>
                        <FormularioRegistro />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registro;
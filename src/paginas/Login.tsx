
import FormularioLogin from "../componentes/organismos/FormularioLogin";

function Login() {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow-sm p-4 login-card">
                        <h2 className="text-center mb-2">
                            Iniciar sesión
                        </h2>

                        <p className="text-center text-muted mb-4">
                            Ingresa tus datos para continuar
                        </p>

                        <FormularioLogin />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

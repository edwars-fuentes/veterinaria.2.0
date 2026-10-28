import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Rol = "usuario" | "oficinista" | "admin";

type Usuario = {
  nombre: string;
  correo: string;
  contrasena: string;
  rol?: Rol;
};

function PanelOficinista() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // Estados para controlar la edición
  const [correoEditando, setCorreoEditando] = useState<string | null>(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [rolEditado, setRolEditado] = useState<Rol>("usuario");

  // 1. Cargar usuarios al montar y verificar sesión
  useEffect(() => {
    const usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogueado") || "{}");

    if (usuarioSesion.rol !== "oficinista") {
      alert("Acceso denegado. Solo personal autorizado.");
      navigate("/Login");
      return;
    }

    const usuariosLocal = JSON.parse(localStorage.getItem("usuarios") || "[]");
    setUsuarios(usuariosLocal);
  }, [navigate]);

  // 2. Eliminar usuario
  const manejarEliminar = (correoEliminar: string) => {
    const usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogueado") || "{}");

    if (usuarioSesion.correo === correoEliminar) {
      alert("No puedes eliminar tu propia cuenta en uso.");
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario con correo ${correoEliminar}?`)) {
      const nuevaLista = usuarios.filter((u) => u.correo !== correoEliminar);
      localStorage.setItem("usuarios", JSON.stringify(nuevaLista));
      setUsuarios(nuevaLista);
      alert("Usuario eliminado correctamente.");
    }
  };

  // 3. Iniciar edición
  const iniciarEdicion = (usuario: Usuario) => {
    setCorreoEditando(usuario.correo);
    setNombreEditado(usuario.nombre);
    setRolEditado(usuario.rol || "usuario");
  };

  // 4. Cancelar edición
  const cancelarEdicion = () => {
    setCorreoEditando(null);
    setNombreEditado("");
    setRolEditado("usuario");
  };

  // 5. Guardar cambios
  const manejarGuardarCambios = (correoUsuario: string) => {
    if (nombreEditado.trim() === "") {
      alert("El nombre no puede estar vacío.");
      return;
    }

    const listaActualizada = usuarios.map((u) => {
      if (u.correo === correoUsuario) {
        return {
          ...u,
          nombre: nombreEditado.trim(),
          rol: rolEditado,
        };
      }
      return u;
    });

    localStorage.setItem("usuarios", JSON.stringify(listaActualizada));
    setUsuarios(listaActualizada);
    setCorreoEditando(null);
    alert("Usuario actualizado correctamente.");
  };

  // 6. Cerrar sesión
  const manejarCerrarSesion = () => {
    localStorage.removeItem("usuarioLogueado");
    localStorage.setItem("sesionActiva", "false");
    navigate("/Login");
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="text-success mb-0">Panel de Control: Oficinista</h2>
          <small className="text-muted">Gestión interna de base de datos de usuarios</small>
        </div>

        <button className="btn btn-outline-danger btn-sm" onClick={manejarCerrarSesion}>
          Cerrar Sesión
        </button>
      </div>

      <div className="card shadow-sm border-0 bg-white p-4">
        <h5 className="card-title text-secondary mb-3">Lista Global de Usuarios Registrados</h5>

        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>Nombre Completo</th>
                <th>Correo Electrónico</th>
                <th>Rol del Sistema</th>
                <th className="text-center" style={{ width: "180px" }}>
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted">
                    No hay usuarios registrados en el sistema.
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.correo}>
                    {correoEditando === usuario.correo ? (
                      <>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={nombreEditado}
                            onChange={(e) => setNombreEditado(e.target.value)}
                          />
                        </td>

                        <td className="text-muted">{usuario.correo}</td>

                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={rolEditado}
                            onChange={(e) => setRolEditado(e.target.value as Rol)}
                          >
                            <option value="usuario">Usuario (Cliente)</option>
                            <option value="oficinista">Oficinista</option>
                            <option value="admin">Administrador</option>
                          </select>
                        </td>

                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-success"
                              onClick={() => manejarGuardarCambios(usuario.correo)}
                            >
                              Guardar
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={cancelarEdicion}
                            >
                              Cancelar
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.correo}</td>
                        <td>
                          <span
                            className={`badge ${
                              usuario.rol === "admin"
                                ? "bg-danger"
                                : usuario.rol === "oficinista"
                                ? "bg-info text-dark"
                                : "bg-secondary"
                            }`}
                          >
                            {usuario.rol || "usuario"}
                          </span>
                        </td>

                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => iniciarEdicion(usuario)}
                            >
                              Editar
                            </button>

                            <button
                              className="btn btn-outline-danger"
                              onClick={() => manejarEliminar(usuario.correo)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PanelOficinista;
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

type Rol = "usuario" | "oficinista" | "admin";

type Usuario = {
  id: number;
  nombreCompleto: string;
  correo: string;
  contrasena?: string;
  rol?: Rol;
  fechaCreacion?: string;
};

const API_URL = "http://localhost:8082/api/usuarios";

function PanelOficinista() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);

  // Estados para controlar la edición por ID
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [correoEditado, setCorreoEditado] = useState("");
  const [rolEditado, setRolEditado] = useState<Rol>("usuario");

  const obtenerToken = () => {
    const usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogueado") || "{}");
    return usuarioSesion.token || localStorage.getItem("token") || "";
  };

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    try {
      const token = obtenerToken();
      const respuesta = await fetch(API_URL, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
      }
      const datos: Usuario[] = await respuesta.json();
      setUsuarios(datos);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      alert("No se pudo cargar la lista de usuarios desde el servidor.");
    } finally {
      setCargando(false);
    }
  }, []);

  // 1. Verificar sesión y cargar usuarios desde el backend
  useEffect(() => {
    const usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogueado") || "{}");

    if (usuarioSesion.rol !== "oficinista") {
      alert("Acceso denegado. Solo personal autorizado.");
      navigate("/Login");
      return;
    }

    cargarUsuarios();
  }, [navigate, cargarUsuarios]);

  // 2. Eliminar usuario (DELETE /api/usuarios/{id})
  const manejarEliminar = async (usuario: Usuario) => {
    const usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogueado") || "{}");

    if (usuarioSesion.correo && usuarioSesion.correo === usuario.correo) {
      alert("No puedes eliminar tu propia cuenta en uso.");
      return;
    }

    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar al usuario "${usuario.nombreCompleto}" (${usuario.correo})?`
      )
    ) {
      try {
        const token = obtenerToken();
        const respuesta = await fetch(`${API_URL}/${usuario.id}`, {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const datos = await respuesta.json().catch(() => null);
        if (!respuesta.ok) {
          alert(datos?.mensaje || "No se pudo eliminar el usuario.");
          return;
        }

        await cargarUsuarios();
        alert("Usuario eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert("No se pudo conectar con el servidor al eliminar.");
      }
    }
  };

  // 3. Iniciar edición
  const iniciarEdicion = (usuario: Usuario) => {
    setIdEditando(usuario.id);
    setNombreEditado(usuario.nombreCompleto);
    setCorreoEditado(usuario.correo);
    setRolEditado(usuario.rol || "usuario");
  };

  // 4. Cancelar edición
  const cancelarEdicion = () => {
    setIdEditando(null);
    setNombreEditado("");
    setCorreoEditado("");
    setRolEditado("usuario");
  };

  // 5. Guardar cambios (PUT /api/usuarios/{id})
  const manejarGuardarCambios = async (idUsuario: number) => {
    if (nombreEditado.trim() === "") {
      alert("El nombre no puede estar vacío.");
      return;
    }

    const correoNormalizado = correoEditado.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNormalizado)) {
      alert("Ingrese un correo válido.");
      return;
    }

    try {
      const token = obtenerToken();
      const respuesta = await fetch(`${API_URL}/${idUsuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nombreCompleto: nombreEditado.trim(),
          correo: correoNormalizado,
          rol: rolEditado,
        }),
      });

      const datos = await respuesta.json().catch(() => null);
      if (!respuesta.ok) {
        alert(datos?.mensaje || "No se pudo actualizar el usuario.");
        return;
      }

      setIdEditando(null);
      await cargarUsuarios();
      alert("Usuario actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert("No se pudo conectar con el servidor al actualizar.");
    }
  };

  // 6. Cerrar sesión
  const manejarCerrarSesion = () => {
    localStorage.removeItem("usuarioLogueado");
    localStorage.removeItem("token");
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title text-secondary mb-0">Lista Global de Usuarios Registrados</h5>
          <button className="btn btn-outline-secondary btn-sm" onClick={cargarUsuarios}>
            Actualizar lista
          </button>
        </div>

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
              {cargando ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted">
                    No hay usuarios registrados en el sistema.
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    {idEditando === usuario.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={nombreEditado}
                            onChange={(e) => setNombreEditado(e.target.value)}
                          />
                        </td>

                        <td>
                          <input
                            type="email"
                            className="form-control form-control-sm"
                            value={correoEditado}
                            onChange={(e) => setCorreoEditado(e.target.value)}
                          />
                        </td>

                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={rolEditado}
                            onChange={(e) => setRolEditado(e.target.value as Rol)}
                          >
                            <option value="usuario">Usuario (Cliente)</option>
                            <option value="oficinista">Oficinista</option>
                            <option value="admin">Administrador</option>
                            <option value="trabajador">trabajador</option>
                          </select>
                        </td>

                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-success"
                              onClick={() => manejarGuardarCambios(usuario.id)}
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
                        <td>{usuario.nombreCompleto}</td>
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
                              onClick={() => manejarEliminar(usuario)}
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
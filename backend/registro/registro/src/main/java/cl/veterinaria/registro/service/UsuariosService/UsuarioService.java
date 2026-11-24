package cl.veterinaria.registro.service.UsuariosService;

import cl.veterinaria.registro.model.UsuariosModel.Usuario;
import cl.veterinaria.registro.repository.UsuariosRepository.UsuarioRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class UsuarioService {

    private static final List<String> ROLES_VALIDOS = List.of("usuario", "oficinista", "admin");

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    private String normalizarRol(String rol, boolean usarDefectoSiVacio) {
        if (rol == null || rol.isBlank()) {
            return usarDefectoSiVacio ? "usuario" : null;
        }
        String rolNormalizado = rol.trim().toLowerCase();
        if (!ROLES_VALIDOS.contains(rolNormalizado)) {
            throw new IllegalArgumentException("Rol inválido. Roles permitidos: usuario, oficinista, admin.");
        }
        return rolNormalizado;
    }

    public Usuario registrarUsuario(Usuario usuario) {
        String correoNormalizado = usuario.getCorreo().trim().toLowerCase();

        if (usuarioRepository.existsByCorreo(correoNormalizado)) {
            throw new IllegalArgumentException("Este correo ya está registrado. Inicie sesión.");
        }

        usuario.setId(null);
        usuario.setNombreCompleto(usuario.getNombreCompleto().trim());
        usuario.setCorreo(correoNormalizado);
        usuario.setRol(normalizarRol(usuario.getRol(), true));

        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID: " + id));
    }

    public Usuario actualizarUsuario(Long id, Usuario datosActualizados) {
        Usuario existente = obtenerPorId(id);

        if (datosActualizados.getNombreCompleto() != null && !datosActualizados.getNombreCompleto().isBlank()) {
            existente.setNombreCompleto(datosActualizados.getNombreCompleto().trim());
        }

        if (datosActualizados.getCorreo() != null && !datosActualizados.getCorreo().isBlank()) {
            String correoNormalizado = datosActualizados.getCorreo().trim().toLowerCase();
            boolean correoUsadoPorOtro = usuarioRepository.findByCorreo(correoNormalizado)
                    .filter(u -> !u.getId().equals(id))
                    .isPresent();

            if (correoUsadoPorOtro) {
                throw new IllegalArgumentException("Ese correo ya está en uso por otro usuario.");
            }
            existente.setCorreo(correoNormalizado);
        }

        if (datosActualizados.getContrasena() != null && !datosActualizados.getContrasena().isBlank()) {
            existente.setContrasena(datosActualizados.getContrasena());
        }

        String rolActualizado = normalizarRol(datosActualizados.getRol(), false);
        if (rolActualizado != null) {
            existente.setRol(rolActualizado);
        }

        return usuarioRepository.save(existente);
    }

    public void eliminarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new NoSuchElementException("Usuario no encontrado con ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }
}
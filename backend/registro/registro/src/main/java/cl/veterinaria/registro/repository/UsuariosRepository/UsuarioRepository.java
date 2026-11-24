package cl.veterinaria.registro.repository.UsuariosRepository;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.veterinaria.registro.model.UsuariosModel.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
}

package cl.veterinaria.registro.controller;

import cl.veterinaria.registro.model.UsuariosModel.Usuario;
import cl.veterinaria.registro.repository.UsuariosRepository.UsuarioRepository;
import cl.veterinaria.registro.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    public record LoginRequest(String correo, String contrasena) {}

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public AuthController(UsuarioRepository usuarioRepository, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.correo() == null || request.contrasena() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("mensaje", "Debe ingresar correo y contraseña."));
        }

        String correoNormalizado = request.correo().trim().toLowerCase();

        return usuarioRepository.findByCorreo(correoNormalizado)
                .filter(usuario -> usuario.getContrasena().equals(request.contrasena()))
                .map(usuario -> {
                    String rol = usuario.getRol() != null ? usuario.getRol().toLowerCase() : "usuario";
                    String token = jwtService.generarToken(usuario.getCorreo(), rol);

                    return ResponseEntity.ok(Map.of(
                            "token", token,
                            "rol", rol,
                            "correo", usuario.getCorreo(),
                            "nombreCompleto", usuario.getNombreCompleto()
                    ));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("mensaje", "Credenciales inválidas.")));
    }
}
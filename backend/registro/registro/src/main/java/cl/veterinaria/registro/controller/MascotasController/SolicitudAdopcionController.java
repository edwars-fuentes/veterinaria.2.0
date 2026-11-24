package cl.veterinaria.registro.controller.MascotasController;

import cl.veterinaria.registro.model.MascotasModel.SolicitudAdopcion;
import cl.veterinaria.registro.service.MascotasService.SolicitudAdopcionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/adopciones")
@CrossOrigin(origins = "*")
public class SolicitudAdopcionController {

    private final SolicitudAdopcionService solicitudAdopcionService;

    public SolicitudAdopcionController(SolicitudAdopcionService solicitudAdopcionService) {
        this.solicitudAdopcionService = solicitudAdopcionService;
    }

    public record MascotaCarritoDTO(Long id, String titulo, String descripcion, Integer precio) {}
    public record CrearSolicitudRequest(String usuarioCorreo, List<MascotaCarritoDTO> mascotas) {}

    @PostMapping
    public ResponseEntity<?> crearSolicitud(@RequestBody CrearSolicitudRequest request, Authentication authentication) {
        if (request == null || request.mascotas() == null || request.mascotas().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Debe incluir al menos una mascota en la solicitud."));
        }

        String correoAutenticado = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : request.usuarioCorreo();

        if (correoAutenticado == null || correoAutenticado.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("mensaje", "Usuario no autenticado."));
        }

        SolicitudAdopcion guardada = solicitudAdopcionService.crearSolicitud(request, correoAutenticado);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    @GetMapping
    public ResponseEntity<List<SolicitudAdopcion>> listarSolicitudes() {
        return ResponseEntity.ok(solicitudAdopcionService.listarSolicitudes());
    }

    @PutMapping("/{id}/completar")
    public ResponseEntity<?> completarSolicitud(@PathVariable Long id) {
        return solicitudAdopcionService.completarSolicitud(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("mensaje", "Solicitud de adopción no encontrada.")));
    }
}
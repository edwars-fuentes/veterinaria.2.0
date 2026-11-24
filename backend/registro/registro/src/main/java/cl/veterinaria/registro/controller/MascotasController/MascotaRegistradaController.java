package cl.veterinaria.registro.controller.MascotasController;

import cl.veterinaria.registro.model.MascotasModel.MascotaRegistrada;
import cl.veterinaria.registro.service.MascotasService.MascotaRegistradaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mascotas-registradas")
@CrossOrigin(origins = "*")
public class MascotaRegistradaController {

    private final MascotaRegistradaService mascotaRegistradaService;

    public MascotaRegistradaController(MascotaRegistradaService mascotaRegistradaService) {
        this.mascotaRegistradaService = mascotaRegistradaService;
    }

    public record CrearMascotaRegistradaRequest(String nombre, String codigo, String razon, String dueno) {}
    public record ActualizarEstadoMascotaRequest(String estado) {}

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody CrearMascotaRegistradaRequest request, Authentication authentication) {
        if (request == null
                || request.nombre() == null || request.nombre().isBlank()
                || request.razon() == null || request.razon().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "Nombre y razón son obligatorios."));
        }

        String correoDueno = (request.dueno() != null && !request.dueno().isBlank())
                ? request.dueno()
                : (authentication != null ? authentication.getName() : "");

        if (correoDueno == null || correoDueno.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "Debe indicar el correo del dueño."));
        }

        MascotaRegistrada guardada = mascotaRegistradaService.crearMascotaRegistrada(
                request.nombre(),
                request.codigo(),
                request.razon(),
                correoDueno
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    @GetMapping
    public ResponseEntity<List<MascotaRegistrada>> listar() {
        return ResponseEntity.ok(mascotaRegistradaService.listarTodas());
    }

    @GetMapping("/mis-mascotas")
    public ResponseEntity<?> listarMisMascotas(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("mensaje", "Debes iniciar sesión."));
        }
        return ResponseEntity.ok(mascotaRegistradaService.listarPorDueno(authentication.getName()));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestBody ActualizarEstadoMascotaRequest request) {
        if (request == null || request.estado() == null || request.estado().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "El estado es obligatorio."));
        }

        return mascotaRegistradaService.actualizarEstado(id, request.estado().trim())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("mensaje", "Mascota registrada no encontrada.")));
    }
}
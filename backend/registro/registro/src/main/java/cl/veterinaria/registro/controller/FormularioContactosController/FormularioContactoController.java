package cl.veterinaria.registro.controller.FormularioContactosController;

import cl.veterinaria.registro.model.FormularioContactoModel.FormularioContacto;
import cl.veterinaria.registro.service.FormularioContactosService.FormularioContactoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/formulario-contacto")
@CrossOrigin(origins = "*")
public class FormularioContactoController {

    private final FormularioContactoService formularioContactoService;

    public FormularioContactoController(FormularioContactoService formularioContactoService) {
        this.formularioContactoService = formularioContactoService;
    }

    public record CrearFormularioContactoRequest(String nombreCompleto, String correo, String mensaje) {}
    public record ResponderFormularioContactoRequest(String respuesta) {}

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody CrearFormularioContactoRequest request) {
        if (request == null
                || request.nombreCompleto() == null || request.nombreCompleto().isBlank()
                || request.correo() == null || request.correo().isBlank()
                || request.mensaje() == null || request.mensaje().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "Nombre completo, correo y mensaje son obligatorios."));
        }

        FormularioContacto guardado = formularioContactoService.crearFormularioContacto(
                request.nombreCompleto(),
                request.correo(),
                request.mensaje()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @GetMapping
    public ResponseEntity<List<FormularioContacto>> listar() {
        return ResponseEntity.ok(formularioContactoService.listarTodos());
    }

    @GetMapping("/mis-mensajes")
    public ResponseEntity<?> listarMisMensajes(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("mensaje", "Debes iniciar sesión."));
        }
        return ResponseEntity.ok(formularioContactoService.listarPorCorreo(authentication.getName()));
    }

    @PutMapping("/{id}/responder")
    public ResponseEntity<?> responder(@PathVariable Long id, @RequestBody ResponderFormularioContactoRequest request) {
        if (request == null || request.respuesta() == null || request.respuesta().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "La respuesta no puede estar vacía."));
        }

        return formularioContactoService.responderFormularioContacto(id, request.respuesta())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("mensaje", "Mensaje de contacto no encontrado.")));
    }
}
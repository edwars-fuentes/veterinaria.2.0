package cl.veterinaria.registro.controller.MascotasController;

import cl.veterinaria.registro.model.MascotasModel.Mascota;
import cl.veterinaria.registro.service.MascotasService.MascotaService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
@CrossOrigin(origins = "*")
public class MascotaController {

    private final MascotaService mascotaService;

    public MascotaController(MascotaService mascotaService) {
        this.mascotaService = mascotaService;
    }

    @GetMapping
    public ResponseEntity<List<Mascota>> listarMascotas(@RequestParam(defaultValue = "true") boolean soloDisponibles) {
        return ResponseEntity.ok(mascotaService.listarMascotas(soloDisponibles));
    }
}
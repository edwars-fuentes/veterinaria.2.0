package cl.veterinaria.registro.controller.ProductosController; // ajusta a tu paquete

import cl.veterinaria.registro.model.Productos.Producto;
import cl.veterinaria.registro.service.ProductosService.ProductoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<Producto> listarProductos(
            @RequestParam(name = "soloDisponibles", defaultValue = "false") boolean soloDisponibles
    ) {
        return productoService.listarProductos(soloDisponibles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Long id) {
        return productoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        Producto guardado = productoService.crearProducto(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }
    @PutMapping("/{id}/estado")
    public ResponseEntity<Producto> cambiarEstado(
        @PathVariable Long id,
        @RequestBody java.util.Map<String, String> body
    ) {
        String nuevoEstado = body.get("estado");
        if (nuevoEstado == null || nuevoEstado.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return productoService.cambiarEstado(id, nuevoEstado)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }
}
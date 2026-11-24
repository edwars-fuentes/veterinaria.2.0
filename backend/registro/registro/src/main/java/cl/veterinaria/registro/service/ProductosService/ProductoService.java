package cl.veterinaria.registro.service.ProductosService; // ajusta a tu paquete

import cl.veterinaria.registro.model.Productos.Producto;
import cl.veterinaria.registro.repository.ProductosRepository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<Producto> listarProductos(boolean soloDisponibles) {
        if (soloDisponibles) {
            return productoRepository.findByDisponibleTrue();
        }
        return productoRepository.findAll();
    }

    public Optional<Producto> obtenerPorId(Long id) {
        return productoRepository.findById(id);
    }

    public Producto crearProducto(Producto producto) {
        if (producto.getDisponible() == null) {
            producto.setDisponible(true);
        }
        return productoRepository.save(producto);
        }
        public Optional<Producto> cambiarEstado(Long id, String nuevoEstado) {
            return productoRepository.findById(id).map((prod) -> {
                prod.setEstado(nuevoEstado);
                if ("Aprobado".equalsIgnoreCase(nuevoEstado)) {
                    prod.setDisponible(true);
                } else if ("Rechazado".equalsIgnoreCase(nuevoEstado)) {
                    prod.setDisponible(false);
                }
                return productoRepository.save(prod);
            });
        }
}
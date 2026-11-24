package cl.veterinaria.registro.repository.ProductosRepository; // ajusta a tu paquete

import cl.veterinaria.registro.model.Productos.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByDisponibleTrue();
}
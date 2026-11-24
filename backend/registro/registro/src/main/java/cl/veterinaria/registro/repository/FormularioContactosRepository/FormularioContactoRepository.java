package cl.veterinaria.registro.repository.FormularioContactosRepository;

import cl.veterinaria.registro.model.FormularioContactoModel.FormularioContacto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FormularioContactoRepository extends JpaRepository<FormularioContacto, Long> {
    List<FormularioContacto> findAllByOrderByFechaCreacionDesc();
    List<FormularioContacto> findByCorreoOrderByFechaCreacionDesc(String correo);
}
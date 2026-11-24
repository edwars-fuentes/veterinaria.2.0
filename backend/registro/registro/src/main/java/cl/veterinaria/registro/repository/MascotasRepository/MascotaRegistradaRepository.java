package cl.veterinaria.registro.repository.MascotasRepository;

import cl.veterinaria.registro.model.MascotasModel.MascotaRegistrada;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MascotaRegistradaRepository extends JpaRepository<MascotaRegistrada, Long> {
    List<MascotaRegistrada> findAllByOrderByFechaCreacionDesc();
    List<MascotaRegistrada> findByDuenoOrderByFechaCreacionDesc(String dueno);
}
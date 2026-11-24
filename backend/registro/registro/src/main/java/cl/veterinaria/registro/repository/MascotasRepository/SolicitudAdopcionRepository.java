package cl.veterinaria.registro.repository.MascotasRepository;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.veterinaria.registro.model.MascotasModel.SolicitudAdopcion;

import java.util.List;

public interface SolicitudAdopcionRepository extends JpaRepository<SolicitudAdopcion, Long> {
    List<SolicitudAdopcion> findAllByOrderByFechaCreacionDesc();
}
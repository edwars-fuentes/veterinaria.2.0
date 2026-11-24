package cl.veterinaria.registro.repository.MascotasRepository;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.veterinaria.registro.model.MascotasModel.Mascota;

import java.util.List;

public interface MascotaRepository extends JpaRepository<Mascota, Long> {
    List<Mascota> findByDisponibleTrue();
}
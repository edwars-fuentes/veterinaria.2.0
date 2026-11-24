package cl.veterinaria.registro.service.MascotasService;

import cl.veterinaria.registro.model.MascotasModel.MascotaRegistrada;
import cl.veterinaria.registro.repository.MascotasRepository.MascotaRegistradaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MascotaRegistradaService {

    private final MascotaRegistradaRepository mascotaRegistradaRepository;

    public MascotaRegistradaService(MascotaRegistradaRepository mascotaRegistradaRepository) {
        this.mascotaRegistradaRepository = mascotaRegistradaRepository;
    }

    @Transactional
    public MascotaRegistrada crearMascotaRegistrada(String nombre, String codigo, String razon, String dueno) {
        MascotaRegistrada mascota = new MascotaRegistrada();
        mascota.setNombre(nombre.trim());
        mascota.setCodigo(codigo != null && !codigo.isBlank() ? codigo.trim() : null);
        mascota.setRazon(razon.trim());
        mascota.setDueno(dueno.trim().toLowerCase());
        mascota.setEstado("Pendiente");
        mascota.setFechaCreacion(LocalDateTime.now());
        return mascotaRegistradaRepository.save(mascota);
    }

    public List<MascotaRegistrada> listarTodas() {
        return mascotaRegistradaRepository.findAllByOrderByFechaCreacionDesc();
    }

    public List<MascotaRegistrada> listarPorDueno(String dueno) {
        return mascotaRegistradaRepository.findByDuenoOrderByFechaCreacionDesc(dueno.trim().toLowerCase());
    }

    @Transactional
    public Optional<MascotaRegistrada> actualizarEstado(Long id, String nuevoEstado) {
        return mascotaRegistradaRepository.findById(id)
                .map(mascota -> {
                    mascota.setEstado(nuevoEstado);
                    return mascotaRegistradaRepository.save(mascota);
                });
    }
}
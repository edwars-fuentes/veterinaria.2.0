package cl.veterinaria.registro.service.MascotasService;

import cl.veterinaria.registro.model.MascotasModel.Mascota;
import cl.veterinaria.registro.repository.MascotasRepository.MascotaRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MascotaService {

    private final MascotaRepository mascotaRepository;

    public MascotaService(MascotaRepository mascotaRepository) {
        this.mascotaRepository = mascotaRepository;
    }

    public List<Mascota> listarMascotas(boolean soloDisponibles) {
        if (soloDisponibles) {
            return mascotaRepository.findByDisponibleTrue();
        }
        return mascotaRepository.findAll();
    }
}
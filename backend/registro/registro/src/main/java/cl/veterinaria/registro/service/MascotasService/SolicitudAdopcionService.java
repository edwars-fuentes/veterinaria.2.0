package cl.veterinaria.registro.service.MascotasService;

import cl.veterinaria.registro.controller.MascotasController.SolicitudAdopcionController.CrearSolicitudRequest;
import cl.veterinaria.registro.controller.MascotasController.SolicitudAdopcionController.MascotaCarritoDTO;
import cl.veterinaria.registro.model.MascotasModel.SolicitudAdopcion;
import cl.veterinaria.registro.model.MascotasModel.SolicitudAdopcionMascota;
import cl.veterinaria.registro.repository.MascotasRepository.SolicitudAdopcionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class SolicitudAdopcionService {

    private final SolicitudAdopcionRepository solicitudRepository;

    public SolicitudAdopcionService(SolicitudAdopcionRepository solicitudRepository) {
        this.solicitudRepository = solicitudRepository;
    }

    @Transactional
    public SolicitudAdopcion crearSolicitud(CrearSolicitudRequest request, String correoAutenticado) {
        SolicitudAdopcion solicitud = new SolicitudAdopcion();
        int randomNum = ThreadLocalRandom.current().nextInt(1000, 10000);
        solicitud.setCodigoSolicitud("ADOP-" + randomNum);
        solicitud.setUsuarioCorreo(correoAutenticado.trim().toLowerCase());
        solicitud.setEstado("Pendiente");
        solicitud.setFechaCreacion(LocalDateTime.now());

        int total = 0;
        for (MascotaCarritoDTO item : request.mascotas()) {
            int precioItem = item.precio() != null ? item.precio() : 0;
            total += precioItem;

            SolicitudAdopcionMascota detalle = new SolicitudAdopcionMascota();
            detalle.setSolicitud(solicitud);
            detalle.setMascotaId(item.id());
            detalle.setNombreMascota(item.titulo() != null ? item.titulo() : "Mascota");
            detalle.setEspecieDescripcion(item.descripcion() != null ? item.descripcion() : "");
            detalle.setPrecioGestion(precioItem);
            solicitud.getMascotas().add(detalle);
        }
        solicitud.setTotalGestion(total);

        return solicitudRepository.save(solicitud);
    }

    public List<SolicitudAdopcion> listarSolicitudes() {
        return solicitudRepository.findAllByOrderByFechaCreacionDesc();
    }

    @Transactional
    public Optional<SolicitudAdopcion> completarSolicitud(Long id) {
        return solicitudRepository.findById(id)
                .map(solicitud -> {
                    solicitud.setEstado("Completada");
                    return solicitudRepository.save(solicitud);
                });
    }
}
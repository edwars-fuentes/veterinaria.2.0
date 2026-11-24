package cl.veterinaria.registro.service.FormularioContactosService;

import cl.veterinaria.registro.model.FormularioContactoModel.FormularioContacto;
import cl.veterinaria.registro.repository.FormularioContactosRepository.FormularioContactoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FormularioContactoService {

    private final FormularioContactoRepository formularioContactoRepository;

    public FormularioContactoService(FormularioContactoRepository formularioContactoRepository) {
        this.formularioContactoRepository = formularioContactoRepository;
    }

    @Transactional
    public FormularioContacto crearFormularioContacto(String nombreCompleto, String correo, String mensaje) {
        FormularioContacto contacto = new FormularioContacto();
        contacto.setNombreCompleto(nombreCompleto.trim());
        contacto.setCorreo(correo.trim().toLowerCase());
        contacto.setMensaje(mensaje.trim());
        contacto.setEstado("Pendiente");
        contacto.setFechaCreacion(LocalDateTime.now());
        return formularioContactoRepository.save(contacto);
    }

    public List<FormularioContacto> listarTodos() {
        return formularioContactoRepository.findAllByOrderByFechaCreacionDesc();
    }

    public List<FormularioContacto> listarPorCorreo(String correo) {
        return formularioContactoRepository.findByCorreoOrderByFechaCreacionDesc(correo.trim().toLowerCase());
    }

    @Transactional
    public Optional<FormularioContacto> responderFormularioContacto(Long id, String respuesta) {
        return formularioContactoRepository.findById(id)
                .map(contacto -> {
                    contacto.setRespuesta(respuesta.trim());
                    contacto.setEstado("Respondido");
                    contacto.setFechaRespuesta(LocalDateTime.now());
                    return formularioContactoRepository.save(contacto);
                });
    }
}
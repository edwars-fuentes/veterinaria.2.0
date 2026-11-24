package cl.veterinaria.registro.model.MascotasModel;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solicitud_adopcion")
public class SolicitudAdopcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_solicitud", nullable = false, unique = true, length = 30)
    private String codigoSolicitud;

    @Column(name = "usuario_correo", nullable = false, length = 150)
    private String usuarioCorreo;

    @Column(name = "total_gestion", nullable = false)
    private Integer totalGestion = 0;

    @Column(nullable = false, length = 30)
    private String estado = "Pendiente";

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @OneToMany(mappedBy = "solicitud", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SolicitudAdopcionMascota> mascotas = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigoSolicitud() { return codigoSolicitud; }
    public void setCodigoSolicitud(String codigoSolicitud) { this.codigoSolicitud = codigoSolicitud; }

    public String getUsuarioCorreo() { return usuarioCorreo; }
    public void setUsuarioCorreo(String usuarioCorreo) { this.usuarioCorreo = usuarioCorreo; }

    public Integer getTotalGestion() { return totalGestion; }
    public void setTotalGestion(Integer totalGestion) { this.totalGestion = totalGestion; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public List<SolicitudAdopcionMascota> getMascotas() { return mascotas; }
    public void setMascotas(List<SolicitudAdopcionMascota> mascotas) { this.mascotas = mascotas; }
}
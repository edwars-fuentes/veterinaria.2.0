package cl.veterinaria.registro.model.MascotasModel;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "solicitud_adopcion_mascota")
public class SolicitudAdopcionMascota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitud_id", nullable = false)
    @JsonIgnore
    private SolicitudAdopcion solicitud;

    @Column(name = "mascota_id")
    private Long mascotaId;

    @Column(name = "nombre_mascota", nullable = false, length = 100)
    private String nombreMascota;

    @Column(name = "especie_descripcion", nullable = false, length = 255)
    private String especieDescripcion;

    @Column(name = "precio_gestion", nullable = false)
    private Integer precioGestion = 0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SolicitudAdopcion getSolicitud() { return solicitud; }
    public void setSolicitud(SolicitudAdopcion solicitud) { this.solicitud = solicitud; }

    public Long getMascotaId() { return mascotaId; }
    public void setMascotaId(Long mascotaId) { this.mascotaId = mascotaId; }

    public String getNombreMascota() { return nombreMascota; }
    public void setNombreMascota(String nombreMascota) { this.nombreMascota = nombreMascota; }

    public String getEspecieDescripcion() { return especieDescripcion; }
    public void setEspecieDescripcion(String especieDescripcion) { this.especieDescripcion = especieDescripcion; }

    public Integer getPrecioGestion() { return precioGestion; }
    public void setPrecioGestion(Integer precioGestion) { this.precioGestion = precioGestion; }
}
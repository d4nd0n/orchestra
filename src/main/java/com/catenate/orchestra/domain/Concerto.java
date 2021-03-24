package com.catenate.orchestra.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Concerto.
 */
@Entity
@Table(name = "concerto")
public class Concerto implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "hours")
    private String hours;

    @Column(name = "location")
    private String location;

    @OneToMany(mappedBy = "concerto")
    @JsonIgnoreProperties(value = { "concerto" }, allowSetters = true)
    private Set<Foto> fotos = new HashSet<>();

    @OneToMany(mappedBy = "concerto")
    @JsonIgnoreProperties(value = { "concerto" }, allowSetters = true)
    private Set<Video> videos = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "concertos", "clientes", "insegnantes" }, allowSetters = true)
    private Corso corso;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Concerto id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Concerto date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getHours() {
        return this.hours;
    }

    public Concerto hours(String hours) {
        this.hours = hours;
        return this;
    }

    public void setHours(String hours) {
        this.hours = hours;
    }

    public String getLocation() {
        return this.location;
    }

    public Concerto location(String location) {
        this.location = location;
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Set<Foto> getFotos() {
        return this.fotos;
    }

    public Concerto fotos(Set<Foto> fotos) {
        this.setFotos(fotos);
        return this;
    }

    public Concerto addFoto(Foto foto) {
        this.fotos.add(foto);
        foto.setConcerto(this);
        return this;
    }

    public Concerto removeFoto(Foto foto) {
        this.fotos.remove(foto);
        foto.setConcerto(null);
        return this;
    }

    public void setFotos(Set<Foto> fotos) {
        if (this.fotos != null) {
            this.fotos.forEach(i -> i.setConcerto(null));
        }
        if (fotos != null) {
            fotos.forEach(i -> i.setConcerto(this));
        }
        this.fotos = fotos;
    }

    public Set<Video> getVideos() {
        return this.videos;
    }

    public Concerto videos(Set<Video> videos) {
        this.setVideos(videos);
        return this;
    }

    public Concerto addVideo(Video video) {
        this.videos.add(video);
        video.setConcerto(this);
        return this;
    }

    public Concerto removeVideo(Video video) {
        this.videos.remove(video);
        video.setConcerto(null);
        return this;
    }

    public void setVideos(Set<Video> videos) {
        if (this.videos != null) {
            this.videos.forEach(i -> i.setConcerto(null));
        }
        if (videos != null) {
            videos.forEach(i -> i.setConcerto(this));
        }
        this.videos = videos;
    }

    public Corso getCorso() {
        return this.corso;
    }

    public Concerto corso(Corso corso) {
        this.setCorso(corso);
        return this;
    }

    public void setCorso(Corso corso) {
        this.corso = corso;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Concerto)) {
            return false;
        }
        return id != null && id.equals(((Concerto) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Concerto{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", hours='" + getHours() + "'" +
            ", location='" + getLocation() + "'" +
            "}";
    }
}

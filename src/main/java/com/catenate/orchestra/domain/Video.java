package com.catenate.orchestra.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Video.
 */
@Entity
@Table(name = "video")
public class Video implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "fotos", "videos", "corso" }, allowSetters = true)
    private Concerto concerto;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Video id(Long id) {
        this.id = id;
        return this;
    }

    public Concerto getConcerto() {
        return this.concerto;
    }

    public Video concerto(Concerto concerto) {
        this.setConcerto(concerto);
        return this;
    }

    public void setConcerto(Concerto concerto) {
        this.concerto = concerto;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Video)) {
            return false;
        }
        return id != null && id.equals(((Video) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Video{" +
            "id=" + getId() +
            "}";
    }
}

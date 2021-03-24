package com.catenate.orchestra.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Insegnante.
 */
@Entity
@Table(name = "insegnante")
public class Insegnante implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_insegnante")
    private String nomeInsegnante;

    @ManyToMany
    @JoinTable(
        name = "rel_insegnante__corso",
        joinColumns = @JoinColumn(name = "insegnante_id"),
        inverseJoinColumns = @JoinColumn(name = "corso_id")
    )
    @JsonIgnoreProperties(value = { "concertos", "clientes", "insegnantes" }, allowSetters = true)
    private Set<Corso> corsos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Insegnante id(Long id) {
        this.id = id;
        return this;
    }

    public String getNomeInsegnante() {
        return this.nomeInsegnante;
    }

    public Insegnante nomeInsegnante(String nomeInsegnante) {
        this.nomeInsegnante = nomeInsegnante;
        return this;
    }

    public void setNomeInsegnante(String nomeInsegnante) {
        this.nomeInsegnante = nomeInsegnante;
    }

    public Set<Corso> getCorsos() {
        return this.corsos;
    }

    public Insegnante corsos(Set<Corso> corsos) {
        this.setCorsos(corsos);
        return this;
    }

    public Insegnante addCorso(Corso corso) {
        this.corsos.add(corso);
        corso.getInsegnantes().add(this);
        return this;
    }

    public Insegnante removeCorso(Corso corso) {
        this.corsos.remove(corso);
        corso.getInsegnantes().remove(this);
        return this;
    }

    public void setCorsos(Set<Corso> corsos) {
        this.corsos = corsos;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Insegnante)) {
            return false;
        }
        return id != null && id.equals(((Insegnante) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Insegnante{" +
            "id=" + getId() +
            ", nomeInsegnante='" + getNomeInsegnante() + "'" +
            "}";
    }
}

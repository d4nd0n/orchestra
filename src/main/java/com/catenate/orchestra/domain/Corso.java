package com.catenate.orchestra.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Corso.
 */
@Entity
@Table(name = "corso")
public class Corso implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "anno")
    private String anno;

    @OneToMany(mappedBy = "corso")
    @JsonIgnoreProperties(value = { "fotos", "videos", "corso" }, allowSetters = true)
    private Set<Concerto> concertos = new HashSet<>();

    @ManyToMany(mappedBy = "corsos")
    @JsonIgnoreProperties(value = { "corsos" }, allowSetters = true)
    private Set<Cliente> clientes = new HashSet<>();

    @ManyToMany(mappedBy = "corsos")
    @JsonIgnoreProperties(value = { "corsos" }, allowSetters = true)
    private Set<Insegnante> insegnantes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Corso id(Long id) {
        this.id = id;
        return this;
    }

    public String getAnno() {
        return this.anno;
    }

    public Corso anno(String anno) {
        this.anno = anno;
        return this;
    }

    public void setAnno(String anno) {
        this.anno = anno;
    }

    public Set<Concerto> getConcertos() {
        return this.concertos;
    }

    public Corso concertos(Set<Concerto> concertos) {
        this.setConcertos(concertos);
        return this;
    }

    public Corso addConcerto(Concerto concerto) {
        this.concertos.add(concerto);
        concerto.setCorso(this);
        return this;
    }

    public Corso removeConcerto(Concerto concerto) {
        this.concertos.remove(concerto);
        concerto.setCorso(null);
        return this;
    }

    public void setConcertos(Set<Concerto> concertos) {
        if (this.concertos != null) {
            this.concertos.forEach(i -> i.setCorso(null));
        }
        if (concertos != null) {
            concertos.forEach(i -> i.setCorso(this));
        }
        this.concertos = concertos;
    }

    public Set<Cliente> getClientes() {
        return this.clientes;
    }

    public Corso clientes(Set<Cliente> clientes) {
        this.setClientes(clientes);
        return this;
    }

    public Corso addCliente(Cliente cliente) {
        this.clientes.add(cliente);
        cliente.getCorsos().add(this);
        return this;
    }

    public Corso removeCliente(Cliente cliente) {
        this.clientes.remove(cliente);
        cliente.getCorsos().remove(this);
        return this;
    }

    public void setClientes(Set<Cliente> clientes) {
        if (this.clientes != null) {
            this.clientes.forEach(i -> i.removeCorso(this));
        }
        if (clientes != null) {
            clientes.forEach(i -> i.addCorso(this));
        }
        this.clientes = clientes;
    }

    public Set<Insegnante> getInsegnantes() {
        return this.insegnantes;
    }

    public Corso insegnantes(Set<Insegnante> insegnantes) {
        this.setInsegnantes(insegnantes);
        return this;
    }

    public Corso addInsegnante(Insegnante insegnante) {
        this.insegnantes.add(insegnante);
        insegnante.getCorsos().add(this);
        return this;
    }

    public Corso removeInsegnante(Insegnante insegnante) {
        this.insegnantes.remove(insegnante);
        insegnante.getCorsos().remove(this);
        return this;
    }

    public void setInsegnantes(Set<Insegnante> insegnantes) {
        if (this.insegnantes != null) {
            this.insegnantes.forEach(i -> i.removeCorso(this));
        }
        if (insegnantes != null) {
            insegnantes.forEach(i -> i.addCorso(this));
        }
        this.insegnantes = insegnantes;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Corso)) {
            return false;
        }
        return id != null && id.equals(((Corso) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Corso{" +
            "id=" + getId() +
            ", anno='" + getAnno() + "'" +
            "}";
    }
}

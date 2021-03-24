package com.catenate.orchestra.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Cliente.
 */
@Entity
@Table(name = "cliente")
public class Cliente implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_cliente")
    private String nomeCliente;

    @ManyToMany
    @JoinTable(
        name = "rel_cliente__corso",
        joinColumns = @JoinColumn(name = "cliente_id"),
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

    public Cliente id(Long id) {
        this.id = id;
        return this;
    }

    public String getNomeCliente() {
        return this.nomeCliente;
    }

    public Cliente nomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
        return this;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public Set<Corso> getCorsos() {
        return this.corsos;
    }

    public Cliente corsos(Set<Corso> corsos) {
        this.setCorsos(corsos);
        return this;
    }

    public Cliente addCorso(Corso corso) {
        this.corsos.add(corso);
        corso.getClientes().add(this);
        return this;
    }

    public Cliente removeCorso(Corso corso) {
        this.corsos.remove(corso);
        corso.getClientes().remove(this);
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
        if (!(o instanceof Cliente)) {
            return false;
        }
        return id != null && id.equals(((Cliente) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cliente{" +
            "id=" + getId() +
            ", nomeCliente='" + getNomeCliente() + "'" +
            "}";
    }
}

package com.catenate.orchestra.web.rest;

import com.catenate.orchestra.domain.Insegnante;
import com.catenate.orchestra.repository.InsegnanteRepository;
import com.catenate.orchestra.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.catenate.orchestra.domain.Insegnante}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class InsegnanteResource {

    private final Logger log = LoggerFactory.getLogger(InsegnanteResource.class);

    private static final String ENTITY_NAME = "insegnante";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InsegnanteRepository insegnanteRepository;

    public InsegnanteResource(InsegnanteRepository insegnanteRepository) {
        this.insegnanteRepository = insegnanteRepository;
    }

    /**
     * {@code POST  /insegnantes} : Create a new insegnante.
     *
     * @param insegnante the insegnante to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new insegnante, or with status {@code 400 (Bad Request)} if the insegnante has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/insegnantes")
    public ResponseEntity<Insegnante> createInsegnante(@RequestBody Insegnante insegnante) throws URISyntaxException {
        log.debug("REST request to save Insegnante : {}", insegnante);
        if (insegnante.getId() != null) {
            throw new BadRequestAlertException("A new insegnante cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Insegnante result = insegnanteRepository.save(insegnante);
        return ResponseEntity
            .created(new URI("/api/insegnantes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /insegnantes/:id} : Updates an existing insegnante.
     *
     * @param id the id of the insegnante to save.
     * @param insegnante the insegnante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated insegnante,
     * or with status {@code 400 (Bad Request)} if the insegnante is not valid,
     * or with status {@code 500 (Internal Server Error)} if the insegnante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/insegnantes/{id}")
    public ResponseEntity<Insegnante> updateInsegnante(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Insegnante insegnante
    ) throws URISyntaxException {
        log.debug("REST request to update Insegnante : {}, {}", id, insegnante);
        if (insegnante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, insegnante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!insegnanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Insegnante result = insegnanteRepository.save(insegnante);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, insegnante.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /insegnantes/:id} : Partial updates given fields of an existing insegnante, field will ignore if it is null
     *
     * @param id the id of the insegnante to save.
     * @param insegnante the insegnante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated insegnante,
     * or with status {@code 400 (Bad Request)} if the insegnante is not valid,
     * or with status {@code 404 (Not Found)} if the insegnante is not found,
     * or with status {@code 500 (Internal Server Error)} if the insegnante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/insegnantes/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Insegnante> partialUpdateInsegnante(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Insegnante insegnante
    ) throws URISyntaxException {
        log.debug("REST request to partial update Insegnante partially : {}, {}", id, insegnante);
        if (insegnante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, insegnante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!insegnanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Insegnante> result = insegnanteRepository
            .findById(insegnante.getId())
            .map(
                existingInsegnante -> {
                    if (insegnante.getNomeInsegnante() != null) {
                        existingInsegnante.setNomeInsegnante(insegnante.getNomeInsegnante());
                    }

                    return existingInsegnante;
                }
            )
            .map(insegnanteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, insegnante.getId().toString())
        );
    }

    /**
     * {@code GET  /insegnantes} : get all the insegnantes.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of insegnantes in body.
     */
    @GetMapping("/insegnantes")
    public List<Insegnante> getAllInsegnantes(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Insegnantes");
        return insegnanteRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /insegnantes/:id} : get the "id" insegnante.
     *
     * @param id the id of the insegnante to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the insegnante, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/insegnantes/{id}")
    public ResponseEntity<Insegnante> getInsegnante(@PathVariable Long id) {
        log.debug("REST request to get Insegnante : {}", id);
        Optional<Insegnante> insegnante = insegnanteRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(insegnante);
    }

    /**
     * {@code DELETE  /insegnantes/:id} : delete the "id" insegnante.
     *
     * @param id the id of the insegnante to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/insegnantes/{id}")
    public ResponseEntity<Void> deleteInsegnante(@PathVariable Long id) {
        log.debug("REST request to delete Insegnante : {}", id);
        insegnanteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

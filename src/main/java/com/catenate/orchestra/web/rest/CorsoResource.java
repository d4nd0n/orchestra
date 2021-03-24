package com.catenate.orchestra.web.rest;

import com.catenate.orchestra.domain.Corso;
import com.catenate.orchestra.repository.CorsoRepository;
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
 * REST controller for managing {@link com.catenate.orchestra.domain.Corso}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CorsoResource {

    private final Logger log = LoggerFactory.getLogger(CorsoResource.class);

    private static final String ENTITY_NAME = "corso";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CorsoRepository corsoRepository;

    public CorsoResource(CorsoRepository corsoRepository) {
        this.corsoRepository = corsoRepository;
    }

    /**
     * {@code POST  /corsos} : Create a new corso.
     *
     * @param corso the corso to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new corso, or with status {@code 400 (Bad Request)} if the corso has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/corsos")
    public ResponseEntity<Corso> createCorso(@RequestBody Corso corso) throws URISyntaxException {
        log.debug("REST request to save Corso : {}", corso);
        if (corso.getId() != null) {
            throw new BadRequestAlertException("A new corso cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Corso result = corsoRepository.save(corso);
        return ResponseEntity
            .created(new URI("/api/corsos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /corsos/:id} : Updates an existing corso.
     *
     * @param id the id of the corso to save.
     * @param corso the corso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated corso,
     * or with status {@code 400 (Bad Request)} if the corso is not valid,
     * or with status {@code 500 (Internal Server Error)} if the corso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/corsos/{id}")
    public ResponseEntity<Corso> updateCorso(@PathVariable(value = "id", required = false) final Long id, @RequestBody Corso corso)
        throws URISyntaxException {
        log.debug("REST request to update Corso : {}, {}", id, corso);
        if (corso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, corso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!corsoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Corso result = corsoRepository.save(corso);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, corso.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /corsos/:id} : Partial updates given fields of an existing corso, field will ignore if it is null
     *
     * @param id the id of the corso to save.
     * @param corso the corso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated corso,
     * or with status {@code 400 (Bad Request)} if the corso is not valid,
     * or with status {@code 404 (Not Found)} if the corso is not found,
     * or with status {@code 500 (Internal Server Error)} if the corso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/corsos/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Corso> partialUpdateCorso(@PathVariable(value = "id", required = false) final Long id, @RequestBody Corso corso)
        throws URISyntaxException {
        log.debug("REST request to partial update Corso partially : {}, {}", id, corso);
        if (corso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, corso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!corsoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Corso> result = corsoRepository
            .findById(corso.getId())
            .map(
                existingCorso -> {
                    if (corso.getAnno() != null) {
                        existingCorso.setAnno(corso.getAnno());
                    }

                    return existingCorso;
                }
            )
            .map(corsoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, corso.getId().toString())
        );
    }

    /**
     * {@code GET  /corsos} : get all the corsos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of corsos in body.
     */
    @GetMapping("/corsos")
    public List<Corso> getAllCorsos() {
        log.debug("REST request to get all Corsos");
        return corsoRepository.findAll();
    }

    /**
     * {@code GET  /corsos/:id} : get the "id" corso.
     *
     * @param id the id of the corso to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the corso, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/corsos/{id}")
    public ResponseEntity<Corso> getCorso(@PathVariable Long id) {
        log.debug("REST request to get Corso : {}", id);
        Optional<Corso> corso = corsoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(corso);
    }

    /**
     * {@code DELETE  /corsos/:id} : delete the "id" corso.
     *
     * @param id the id of the corso to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/corsos/{id}")
    public ResponseEntity<Void> deleteCorso(@PathVariable Long id) {
        log.debug("REST request to delete Corso : {}", id);
        corsoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

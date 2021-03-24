package com.catenate.orchestra.web.rest;

import com.catenate.orchestra.domain.Concerto;
import com.catenate.orchestra.repository.ConcertoRepository;
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
 * REST controller for managing {@link com.catenate.orchestra.domain.Concerto}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ConcertoResource {

    private final Logger log = LoggerFactory.getLogger(ConcertoResource.class);

    private static final String ENTITY_NAME = "concerto";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConcertoRepository concertoRepository;

    public ConcertoResource(ConcertoRepository concertoRepository) {
        this.concertoRepository = concertoRepository;
    }

    /**
     * {@code POST  /concertos} : Create a new concerto.
     *
     * @param concerto the concerto to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new concerto, or with status {@code 400 (Bad Request)} if the concerto has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/concertos")
    public ResponseEntity<Concerto> createConcerto(@RequestBody Concerto concerto) throws URISyntaxException {
        log.debug("REST request to save Concerto : {}", concerto);
        if (concerto.getId() != null) {
            throw new BadRequestAlertException("A new concerto cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Concerto result = concertoRepository.save(concerto);
        return ResponseEntity
            .created(new URI("/api/concertos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /concertos/:id} : Updates an existing concerto.
     *
     * @param id the id of the concerto to save.
     * @param concerto the concerto to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated concerto,
     * or with status {@code 400 (Bad Request)} if the concerto is not valid,
     * or with status {@code 500 (Internal Server Error)} if the concerto couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/concertos/{id}")
    public ResponseEntity<Concerto> updateConcerto(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Concerto concerto
    ) throws URISyntaxException {
        log.debug("REST request to update Concerto : {}, {}", id, concerto);
        if (concerto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, concerto.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!concertoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Concerto result = concertoRepository.save(concerto);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, concerto.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /concertos/:id} : Partial updates given fields of an existing concerto, field will ignore if it is null
     *
     * @param id the id of the concerto to save.
     * @param concerto the concerto to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated concerto,
     * or with status {@code 400 (Bad Request)} if the concerto is not valid,
     * or with status {@code 404 (Not Found)} if the concerto is not found,
     * or with status {@code 500 (Internal Server Error)} if the concerto couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/concertos/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Concerto> partialUpdateConcerto(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Concerto concerto
    ) throws URISyntaxException {
        log.debug("REST request to partial update Concerto partially : {}, {}", id, concerto);
        if (concerto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, concerto.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!concertoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Concerto> result = concertoRepository
            .findById(concerto.getId())
            .map(
                existingConcerto -> {
                    if (concerto.getDate() != null) {
                        existingConcerto.setDate(concerto.getDate());
                    }
                    if (concerto.getHours() != null) {
                        existingConcerto.setHours(concerto.getHours());
                    }
                    if (concerto.getLocation() != null) {
                        existingConcerto.setLocation(concerto.getLocation());
                    }

                    return existingConcerto;
                }
            )
            .map(concertoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, concerto.getId().toString())
        );
    }

    /**
     * {@code GET  /concertos} : get all the concertos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of concertos in body.
     */
    @GetMapping("/concertos")
    public List<Concerto> getAllConcertos() {
        log.debug("REST request to get all Concertos");
        return concertoRepository.findAll();
    }

    /**
     * {@code GET  /concertos/:id} : get the "id" concerto.
     *
     * @param id the id of the concerto to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the concerto, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/concertos/{id}")
    public ResponseEntity<Concerto> getConcerto(@PathVariable Long id) {
        log.debug("REST request to get Concerto : {}", id);
        Optional<Concerto> concerto = concertoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(concerto);
    }

    /**
     * {@code DELETE  /concertos/:id} : delete the "id" concerto.
     *
     * @param id the id of the concerto to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/concertos/{id}")
    public ResponseEntity<Void> deleteConcerto(@PathVariable Long id) {
        log.debug("REST request to delete Concerto : {}", id);
        concertoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

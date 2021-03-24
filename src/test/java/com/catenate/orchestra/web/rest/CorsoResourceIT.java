package com.catenate.orchestra.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.catenate.orchestra.IntegrationTest;
import com.catenate.orchestra.domain.Corso;
import com.catenate.orchestra.repository.CorsoRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CorsoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CorsoResourceIT {

    private static final String DEFAULT_ANNO = "AAAAAAAAAA";
    private static final String UPDATED_ANNO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/corsos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CorsoRepository corsoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCorsoMockMvc;

    private Corso corso;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Corso createEntity(EntityManager em) {
        Corso corso = new Corso().anno(DEFAULT_ANNO);
        return corso;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Corso createUpdatedEntity(EntityManager em) {
        Corso corso = new Corso().anno(UPDATED_ANNO);
        return corso;
    }

    @BeforeEach
    public void initTest() {
        corso = createEntity(em);
    }

    @Test
    @Transactional
    void createCorso() throws Exception {
        int databaseSizeBeforeCreate = corsoRepository.findAll().size();
        // Create the Corso
        restCorsoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(corso)))
            .andExpect(status().isCreated());

        // Validate the Corso in the database
        List<Corso> corsoList = corsoRepository.findAll();
        assertThat(corsoList).hasSize(databaseSizeBeforeCreate + 1);
        Corso testCorso = corsoList.get(corsoList.size() - 1);
        assertThat(testCorso.getAnno()).isEqualTo(DEFAULT_ANNO);
    }

    @Test
    @Transactional
    void createCorsoWithExistingId() throws Exception {
        // Create the Corso with an existing ID
        corso.setId(1L);

        int databaseSizeBeforeCreate = corsoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCorsoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(corso)))
            .andExpect(status().isBadRequest());

        // Validate the Corso in the database
        List<Corso> corsoList = corsoRepository.findAll();
        assertThat(corsoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCorsos() throws Exception {
        // Initialize the database
        corsoRepository.saveAndFlush(corso);

        // Get all the corsoList
        restCorsoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(corso.getId().intValue())))
            .andExpect(jsonPath("$.[*].anno").value(hasItem(DEFAULT_ANNO)));
    }

    @Test
    @Transactional
    void getCorso() throws Exception {
        // Initialize the database
        corsoRepository.saveAndFlush(corso);

        // Get the corso
        restCorsoMockMvc
            .perform(get(ENTITY_API_URL_ID, corso.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(corso.getId().intValue()))
            .andExpect(jsonPath("$.anno").value(DEFAULT_ANNO));
    }

    @Test
    @Transactional
    void getNonExistingCorso() throws Exception {
        // Get the corso
        restCorsoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCorso() throws Exception {
        // Initialize the database
        corsoRepository.saveAndFlush(corso);

        int databaseSizeBeforeUpdate = corsoRepository.findAll().size();

        // Update the corso
        Corso updatedCorso = corsoRepository.findById(corso.getId()).get();
        // Disconnect from session so that the updates on updatedCorso are not directly saved in db
        em.detach(updatedCorso);
        updatedCorso.anno(UPDATED_ANNO);

        restCorsoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCorso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCorso))
            )
            .andExpect(status().isOk());

        // Validate the Corso in the database
        List<Corso> corsoList = corsoRepository.findAll();
        assertThat(corsoList).hasSize(databaseSizeBeforeUpdate);
        Corso testCorso = corsoList.get(corsoList.size() - 1);
        assertThat(testCorso.getAnno()).isEqualTo(UPDATED_ANNO);
    }

    @Test
    @Transactional
    void putNonExistingCorso() throws Exception {
        int databaseSizeBeforeUpdate = corsoRepository.findAll().size();
        corso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCorsoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, corso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(corso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Corso in the database
        List<Corso> corsoList = corsoRepository.findAll();
        assertThat(corsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCorso() throws Exception {
        int databaseSizeBeforeUpdate = corsoRepository.findAll().size();
        corso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCorsoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(corso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Corso in the database
        List<Corso> corsoList = corsoRepository.findAll();
        assertThat(corsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCorso() throws Exception {
        int databaseSizeBeforeUpdate = corsoRepository.findAll().size();
        corso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCorsoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(corso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Corso in the database
        List<Corso> corsoList = corsoRepository.findAll();
        assertThat(corsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCorsoWithPatch() throws Exception {
        // Initialize the database
        corsoRepository.saveAndFlush(corso);

        int databaseSizeBeforeUpdate = corsoRepository.findAll().size();

        // Update the corso using partial update
        Corso partialUpdatedCorso = new Corso();
        partialUpdatedCorso.setId(corso.getId());

        partialUpdatedCorso.anno(UPDATED_ANNO);

        restCorsoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCorso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCorso))
            )
            .andExpect(status().isOk());

        // Validate the Corso in the database
        List<Corso> corsoList = corsoRepository.findAll();
        assertThat(corsoList).hasSize(databaseSizeBeforeUpdate);
        Corso testCorso = corsoList.get(corsoList.size() - 1);
        assertThat(testCorso.getAnno()).isEqualTo(UPDATED_ANNO);
    }

    @Test
    @Transactional
    void fullUpdateCorsoWithPatch() throws Exception {
        // Initialize the database
        corsoRepository.saveAndFlush(corso);

        int databaseSizeBeforeUpdate = corsoRepository.findAll().size();

        // Update the corso using partial update
        Corso partialUpdatedCorso = new Corso();
        partialUpdatedCorso.setId(corso.getId());

        partialUpdatedCorso.anno(UPDATED_ANNO);

        restCorsoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCorso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCorso))
            )
            .andExpect(status().isOk());

        // Validate the Corso in the database
        List<Corso> corsoList = corsoRepository.findAll();
        assertThat(corsoList).hasSize(databaseSizeBeforeUpdate);
        Corso testCorso = corsoList.get(corsoList.size() - 1);
        assertThat(testCorso.getAnno()).isEqualTo(UPDATED_ANNO);
    }

    @Test
    @Transactional
    void patchNonExistingCorso() throws Exception {
        int databaseSizeBeforeUpdate = corsoRepository.findAll().size();
        corso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCorsoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, corso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(corso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Corso in the database
        List<Corso> corsoList = corsoRepository.findAll();
        assertThat(corsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCorso() throws Exception {
        int databaseSizeBeforeUpdate = corsoRepository.findAll().size();
        corso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCorsoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(corso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Corso in the database
        List<Corso> corsoList = corsoRepository.findAll();
        assertThat(corsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCorso() throws Exception {
        int databaseSizeBeforeUpdate = corsoRepository.findAll().size();
        corso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCorsoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(corso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Corso in the database
        List<Corso> corsoList = corsoRepository.findAll();
        assertThat(corsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCorso() throws Exception {
        // Initialize the database
        corsoRepository.saveAndFlush(corso);

        int databaseSizeBeforeDelete = corsoRepository.findAll().size();

        // Delete the corso
        restCorsoMockMvc
            .perform(delete(ENTITY_API_URL_ID, corso.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Corso> corsoList = corsoRepository.findAll();
        assertThat(corsoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

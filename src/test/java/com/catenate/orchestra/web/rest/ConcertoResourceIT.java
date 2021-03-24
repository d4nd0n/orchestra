package com.catenate.orchestra.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.catenate.orchestra.IntegrationTest;
import com.catenate.orchestra.domain.Concerto;
import com.catenate.orchestra.repository.ConcertoRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link ConcertoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConcertoResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_HOURS = "AAAAAAAAAA";
    private static final String UPDATED_HOURS = "BBBBBBBBBB";

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/concertos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConcertoRepository concertoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConcertoMockMvc;

    private Concerto concerto;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Concerto createEntity(EntityManager em) {
        Concerto concerto = new Concerto().date(DEFAULT_DATE).hours(DEFAULT_HOURS).location(DEFAULT_LOCATION);
        return concerto;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Concerto createUpdatedEntity(EntityManager em) {
        Concerto concerto = new Concerto().date(UPDATED_DATE).hours(UPDATED_HOURS).location(UPDATED_LOCATION);
        return concerto;
    }

    @BeforeEach
    public void initTest() {
        concerto = createEntity(em);
    }

    @Test
    @Transactional
    void createConcerto() throws Exception {
        int databaseSizeBeforeCreate = concertoRepository.findAll().size();
        // Create the Concerto
        restConcertoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(concerto)))
            .andExpect(status().isCreated());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeCreate + 1);
        Concerto testConcerto = concertoList.get(concertoList.size() - 1);
        assertThat(testConcerto.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testConcerto.getHours()).isEqualTo(DEFAULT_HOURS);
        assertThat(testConcerto.getLocation()).isEqualTo(DEFAULT_LOCATION);
    }

    @Test
    @Transactional
    void createConcertoWithExistingId() throws Exception {
        // Create the Concerto with an existing ID
        concerto.setId(1L);

        int databaseSizeBeforeCreate = concertoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConcertoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(concerto)))
            .andExpect(status().isBadRequest());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConcertos() throws Exception {
        // Initialize the database
        concertoRepository.saveAndFlush(concerto);

        // Get all the concertoList
        restConcertoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(concerto.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].hours").value(hasItem(DEFAULT_HOURS)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)));
    }

    @Test
    @Transactional
    void getConcerto() throws Exception {
        // Initialize the database
        concertoRepository.saveAndFlush(concerto);

        // Get the concerto
        restConcertoMockMvc
            .perform(get(ENTITY_API_URL_ID, concerto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(concerto.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.hours").value(DEFAULT_HOURS))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION));
    }

    @Test
    @Transactional
    void getNonExistingConcerto() throws Exception {
        // Get the concerto
        restConcertoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewConcerto() throws Exception {
        // Initialize the database
        concertoRepository.saveAndFlush(concerto);

        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();

        // Update the concerto
        Concerto updatedConcerto = concertoRepository.findById(concerto.getId()).get();
        // Disconnect from session so that the updates on updatedConcerto are not directly saved in db
        em.detach(updatedConcerto);
        updatedConcerto.date(UPDATED_DATE).hours(UPDATED_HOURS).location(UPDATED_LOCATION);

        restConcertoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConcerto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConcerto))
            )
            .andExpect(status().isOk());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
        Concerto testConcerto = concertoList.get(concertoList.size() - 1);
        assertThat(testConcerto.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testConcerto.getHours()).isEqualTo(UPDATED_HOURS);
        assertThat(testConcerto.getLocation()).isEqualTo(UPDATED_LOCATION);
    }

    @Test
    @Transactional
    void putNonExistingConcerto() throws Exception {
        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();
        concerto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConcertoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, concerto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(concerto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConcerto() throws Exception {
        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();
        concerto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcertoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(concerto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConcerto() throws Exception {
        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();
        concerto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcertoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(concerto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConcertoWithPatch() throws Exception {
        // Initialize the database
        concertoRepository.saveAndFlush(concerto);

        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();

        // Update the concerto using partial update
        Concerto partialUpdatedConcerto = new Concerto();
        partialUpdatedConcerto.setId(concerto.getId());

        partialUpdatedConcerto.location(UPDATED_LOCATION);

        restConcertoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConcerto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConcerto))
            )
            .andExpect(status().isOk());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
        Concerto testConcerto = concertoList.get(concertoList.size() - 1);
        assertThat(testConcerto.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testConcerto.getHours()).isEqualTo(DEFAULT_HOURS);
        assertThat(testConcerto.getLocation()).isEqualTo(UPDATED_LOCATION);
    }

    @Test
    @Transactional
    void fullUpdateConcertoWithPatch() throws Exception {
        // Initialize the database
        concertoRepository.saveAndFlush(concerto);

        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();

        // Update the concerto using partial update
        Concerto partialUpdatedConcerto = new Concerto();
        partialUpdatedConcerto.setId(concerto.getId());

        partialUpdatedConcerto.date(UPDATED_DATE).hours(UPDATED_HOURS).location(UPDATED_LOCATION);

        restConcertoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConcerto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConcerto))
            )
            .andExpect(status().isOk());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
        Concerto testConcerto = concertoList.get(concertoList.size() - 1);
        assertThat(testConcerto.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testConcerto.getHours()).isEqualTo(UPDATED_HOURS);
        assertThat(testConcerto.getLocation()).isEqualTo(UPDATED_LOCATION);
    }

    @Test
    @Transactional
    void patchNonExistingConcerto() throws Exception {
        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();
        concerto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConcertoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, concerto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(concerto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConcerto() throws Exception {
        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();
        concerto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcertoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(concerto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConcerto() throws Exception {
        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();
        concerto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcertoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(concerto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConcerto() throws Exception {
        // Initialize the database
        concertoRepository.saveAndFlush(concerto);

        int databaseSizeBeforeDelete = concertoRepository.findAll().size();

        // Delete the concerto
        restConcertoMockMvc
            .perform(delete(ENTITY_API_URL_ID, concerto.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

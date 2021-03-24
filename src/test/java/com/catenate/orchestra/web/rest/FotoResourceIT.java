package com.catenate.orchestra.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.catenate.orchestra.IntegrationTest;
import com.catenate.orchestra.domain.Foto;
import com.catenate.orchestra.repository.FotoRepository;
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
 * Integration tests for the {@link FotoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FotoResourceIT {

    private static final String ENTITY_API_URL = "/api/fotos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FotoRepository fotoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFotoMockMvc;

    private Foto foto;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Foto createEntity(EntityManager em) {
        Foto foto = new Foto();
        return foto;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Foto createUpdatedEntity(EntityManager em) {
        Foto foto = new Foto();
        return foto;
    }

    @BeforeEach
    public void initTest() {
        foto = createEntity(em);
    }

    @Test
    @Transactional
    void createFoto() throws Exception {
        int databaseSizeBeforeCreate = fotoRepository.findAll().size();
        // Create the Foto
        restFotoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(foto)))
            .andExpect(status().isCreated());

        // Validate the Foto in the database
        List<Foto> fotoList = fotoRepository.findAll();
        assertThat(fotoList).hasSize(databaseSizeBeforeCreate + 1);
        Foto testFoto = fotoList.get(fotoList.size() - 1);
    }

    @Test
    @Transactional
    void createFotoWithExistingId() throws Exception {
        // Create the Foto with an existing ID
        foto.setId(1L);

        int databaseSizeBeforeCreate = fotoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFotoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(foto)))
            .andExpect(status().isBadRequest());

        // Validate the Foto in the database
        List<Foto> fotoList = fotoRepository.findAll();
        assertThat(fotoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFotos() throws Exception {
        // Initialize the database
        fotoRepository.saveAndFlush(foto);

        // Get all the fotoList
        restFotoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(foto.getId().intValue())));
    }

    @Test
    @Transactional
    void getFoto() throws Exception {
        // Initialize the database
        fotoRepository.saveAndFlush(foto);

        // Get the foto
        restFotoMockMvc
            .perform(get(ENTITY_API_URL_ID, foto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(foto.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingFoto() throws Exception {
        // Get the foto
        restFotoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFoto() throws Exception {
        // Initialize the database
        fotoRepository.saveAndFlush(foto);

        int databaseSizeBeforeUpdate = fotoRepository.findAll().size();

        // Update the foto
        Foto updatedFoto = fotoRepository.findById(foto.getId()).get();
        // Disconnect from session so that the updates on updatedFoto are not directly saved in db
        em.detach(updatedFoto);

        restFotoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFoto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFoto))
            )
            .andExpect(status().isOk());

        // Validate the Foto in the database
        List<Foto> fotoList = fotoRepository.findAll();
        assertThat(fotoList).hasSize(databaseSizeBeforeUpdate);
        Foto testFoto = fotoList.get(fotoList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingFoto() throws Exception {
        int databaseSizeBeforeUpdate = fotoRepository.findAll().size();
        foto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFotoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, foto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(foto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Foto in the database
        List<Foto> fotoList = fotoRepository.findAll();
        assertThat(fotoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFoto() throws Exception {
        int databaseSizeBeforeUpdate = fotoRepository.findAll().size();
        foto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(foto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Foto in the database
        List<Foto> fotoList = fotoRepository.findAll();
        assertThat(fotoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFoto() throws Exception {
        int databaseSizeBeforeUpdate = fotoRepository.findAll().size();
        foto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(foto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Foto in the database
        List<Foto> fotoList = fotoRepository.findAll();
        assertThat(fotoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFotoWithPatch() throws Exception {
        // Initialize the database
        fotoRepository.saveAndFlush(foto);

        int databaseSizeBeforeUpdate = fotoRepository.findAll().size();

        // Update the foto using partial update
        Foto partialUpdatedFoto = new Foto();
        partialUpdatedFoto.setId(foto.getId());

        restFotoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFoto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFoto))
            )
            .andExpect(status().isOk());

        // Validate the Foto in the database
        List<Foto> fotoList = fotoRepository.findAll();
        assertThat(fotoList).hasSize(databaseSizeBeforeUpdate);
        Foto testFoto = fotoList.get(fotoList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateFotoWithPatch() throws Exception {
        // Initialize the database
        fotoRepository.saveAndFlush(foto);

        int databaseSizeBeforeUpdate = fotoRepository.findAll().size();

        // Update the foto using partial update
        Foto partialUpdatedFoto = new Foto();
        partialUpdatedFoto.setId(foto.getId());

        restFotoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFoto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFoto))
            )
            .andExpect(status().isOk());

        // Validate the Foto in the database
        List<Foto> fotoList = fotoRepository.findAll();
        assertThat(fotoList).hasSize(databaseSizeBeforeUpdate);
        Foto testFoto = fotoList.get(fotoList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingFoto() throws Exception {
        int databaseSizeBeforeUpdate = fotoRepository.findAll().size();
        foto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFotoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, foto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(foto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Foto in the database
        List<Foto> fotoList = fotoRepository.findAll();
        assertThat(fotoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFoto() throws Exception {
        int databaseSizeBeforeUpdate = fotoRepository.findAll().size();
        foto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(foto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Foto in the database
        List<Foto> fotoList = fotoRepository.findAll();
        assertThat(fotoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFoto() throws Exception {
        int databaseSizeBeforeUpdate = fotoRepository.findAll().size();
        foto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(foto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Foto in the database
        List<Foto> fotoList = fotoRepository.findAll();
        assertThat(fotoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFoto() throws Exception {
        // Initialize the database
        fotoRepository.saveAndFlush(foto);

        int databaseSizeBeforeDelete = fotoRepository.findAll().size();

        // Delete the foto
        restFotoMockMvc
            .perform(delete(ENTITY_API_URL_ID, foto.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Foto> fotoList = fotoRepository.findAll();
        assertThat(fotoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

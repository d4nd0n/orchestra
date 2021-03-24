package com.catenate.orchestra.repository;

import com.catenate.orchestra.domain.Foto;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Foto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FotoRepository extends JpaRepository<Foto, Long> {}

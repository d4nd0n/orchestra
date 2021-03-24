package com.catenate.orchestra.repository;

import com.catenate.orchestra.domain.Concerto;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Concerto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConcertoRepository extends JpaRepository<Concerto, Long> {}

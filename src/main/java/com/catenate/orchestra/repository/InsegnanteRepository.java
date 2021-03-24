package com.catenate.orchestra.repository;

import com.catenate.orchestra.domain.Insegnante;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Insegnante entity.
 */
@Repository
public interface InsegnanteRepository extends JpaRepository<Insegnante, Long> {
    @Query(
        value = "select distinct insegnante from Insegnante insegnante left join fetch insegnante.corsos",
        countQuery = "select count(distinct insegnante) from Insegnante insegnante"
    )
    Page<Insegnante> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct insegnante from Insegnante insegnante left join fetch insegnante.corsos")
    List<Insegnante> findAllWithEagerRelationships();

    @Query("select insegnante from Insegnante insegnante left join fetch insegnante.corsos where insegnante.id =:id")
    Optional<Insegnante> findOneWithEagerRelationships(@Param("id") Long id);
}

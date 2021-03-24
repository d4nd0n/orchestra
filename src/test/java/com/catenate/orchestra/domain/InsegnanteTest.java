package com.catenate.orchestra.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.catenate.orchestra.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InsegnanteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Insegnante.class);
        Insegnante insegnante1 = new Insegnante();
        insegnante1.setId(1L);
        Insegnante insegnante2 = new Insegnante();
        insegnante2.setId(insegnante1.getId());
        assertThat(insegnante1).isEqualTo(insegnante2);
        insegnante2.setId(2L);
        assertThat(insegnante1).isNotEqualTo(insegnante2);
        insegnante1.setId(null);
        assertThat(insegnante1).isNotEqualTo(insegnante2);
    }
}

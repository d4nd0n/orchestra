package com.catenate.orchestra.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.catenate.orchestra.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ConcertoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Concerto.class);
        Concerto concerto1 = new Concerto();
        concerto1.setId(1L);
        Concerto concerto2 = new Concerto();
        concerto2.setId(concerto1.getId());
        assertThat(concerto1).isEqualTo(concerto2);
        concerto2.setId(2L);
        assertThat(concerto1).isNotEqualTo(concerto2);
        concerto1.setId(null);
        assertThat(concerto1).isNotEqualTo(concerto2);
    }
}

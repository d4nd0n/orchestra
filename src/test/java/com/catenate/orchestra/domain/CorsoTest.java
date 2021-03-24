package com.catenate.orchestra.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.catenate.orchestra.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CorsoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Corso.class);
        Corso corso1 = new Corso();
        corso1.setId(1L);
        Corso corso2 = new Corso();
        corso2.setId(corso1.getId());
        assertThat(corso1).isEqualTo(corso2);
        corso2.setId(2L);
        assertThat(corso1).isNotEqualTo(corso2);
        corso1.setId(null);
        assertThat(corso1).isNotEqualTo(corso2);
    }
}

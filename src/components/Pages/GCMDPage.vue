<template>
  <v-container fluid>
    <v-row>
      <h1>EnviDat Global Change Master Directory Exchange Platform</h1>

      <v-col
        class="py-2"
        v-for="metadata in metadatasContent"
        :key="metadata.id"
        cols="6"
      >
        <a :href="gcdmLink(metadata)">
          {{ gcdmLink(metadata) }}
        </a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * The gcmd page of EnviDat. It's a page not in the navigation
 * for crawling.
 *
 * @summary gcmd page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2019-10-23 16:23:19
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mapGetters } from 'vuex';
import { GCMD_PAGENAME } from '@/router/routeConsts';

export default {
  name: GCMD_PAGENAME,
  computed: {
    ...mapGetters({
      metadatasContent: 'metadata/metadatasContent',
    }),
  },
  methods: {
    gcdmLink(metadata) {
      return `https://www.envidat.ch/dataset/${metadata.name}/export/gcmd_dif.xml`;
    },
  },
  components: {},
  data: () => ({
    GCMD_PAGENAME,
  }),
};
</script>

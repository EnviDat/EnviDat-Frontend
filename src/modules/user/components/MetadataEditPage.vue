<template>
  <v-container class="pa-0"
                fluid
                id="MetadataEditPage"
                tag="article"
                >

    <NavigationStepper />
    
  </v-container>
</template>

<script>
/**
 * The MetadataEditPage shows a workflow to create and Edit 
 * metadata and data & resources
 *
 * @summary metadata detail page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-29 13:49:30
 * Last modified  : 2021-06-29 13:52:41
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

// import { mapGetters } from 'vuex';
import {
  METADATAEDIT_PAGENAME,
} from '@/router/routeConsts';
import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import NavigationStepper from '@/src/components/NavigationStepper';


export default {
  name: 'MetadataEditPage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, METADATAEDIT_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
  mounted() {
  },
  beforeDestroy() {
  },
  computed: {
    // ...mapGetters({
    // }),
  },
  methods: {
  },
  watch: {
  },
  components: {
    NavigationStepper,
  },
  data: () => ({
  }),
};
</script>

<style>


</style>

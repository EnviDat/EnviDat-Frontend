<template>

  <v-card id="EditPublications"
          class="pa-4">

    <EditImgPlaceholder :disclaimer="disclaimer"
                        :img="publications"
                        />
  </v-card>  

</template>


<script>
/**
 * EditPublications.vue renders the GenericPlaceholder component with a screenshot image of the Metadata Keywords mockup used in the slot
 * 
 *
 * @summary shows a screenshot placeholder of the editing the Related Info 
 * @author Dominik Haas-Artho
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-09-01 16:54:45
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import EditImgPlaceholder from '@/modules/user/components/EditImgPlaceholder';
import publications from '@/modules/user/assets/placeholders/publications.jpg';


export default {
  name: 'EditPublications',
  data: () => ({
    publications,
  }),
  props: {  
    genericProps: Object,
  },
  computed: {
    disclaimer() {
      return 'Please note that the screenshot below will serve as a template for the future component.';
    },
  },
  methods: {
  },
  components: {
    EditImgPlaceholder,
  },
};


</script>

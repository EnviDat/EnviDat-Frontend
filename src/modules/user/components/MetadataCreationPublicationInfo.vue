<template>

  <v-container id="MetadataCreationPublicationInfo"
              fluid
              class="pa-0">

    <v-row>
      <v-col cols="6">
        <EditPublicationInfo :genericProps="genericProps" />          

      </v-col>

      <v-col cols="6">
        <EditOrganization :genericProps="genericProps" />
      </v-col>

    </v-row>
  </v-container>

</template>


<script>
/**
 * MetadataCreationPublicationInfo.vue renders the GenericPlaceholder component with a screenshot image of the Metadata Keywords mockup used in the slot
 * 
 *
 * @summary shows a screenshot placeholder of the editing the Related Info 
 * @author Dominik Haas-Artho
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-09-01 17:54:02
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import EditPublicationInfo from '@/modules/user/components/EditPublicationInfo';
import EditOrganization from '@/modules/user/components/EditOrganization';

export default {
  name: 'MetadataCreationPublicationInfo',
  props: {  
    genericProps: Object,
  },
  computed: {
  },
  methods: {
  },
  data: () => ({
  }),
  components: {
    EditOrganization,
    EditPublicationInfo,
  },
};


</script>

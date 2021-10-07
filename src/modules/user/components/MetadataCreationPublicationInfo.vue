<template>

  <v-container id="MetadataCreationPublicationInfo"
              fluid
              class="pa-0">

    <v-row>
      <v-col cols="6">
        <EditPublicationInfo v-bind="editPublicationsProps" />

      </v-col>

      <v-col cols="6">
        <EditOrganizationTree v-bind="editOrganizationProps" />
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
 * Last modified  : 2021-10-07 13:12:25
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import EditPublicationInfo from '@/modules/user/components/EditPublicationInfo';
import EditOrganizationTree from '@/modules/user/components/EditOrganizationTree';
import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';
import {
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
} from '@/factories/eventBus';

export default {
  name: 'MetadataCreationPublicationInfo',
  props: {
  },
  computed: {
    publicationsInfo() {
      return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_PUBLICATION_INFO);
    },
    organizationsInfo() {
      return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_ORGANIZATION);
    },
    editPublicationsProps() {
      return this.publicationsInfo;
    },
    editOrganizationProps() {
      return this.organizationsInfo;
    },

  },
  methods: {
  },
  data: () => ({
  }),
  components: {
    EditOrganizationTree,
    EditPublicationInfo,
  },
};


</script>

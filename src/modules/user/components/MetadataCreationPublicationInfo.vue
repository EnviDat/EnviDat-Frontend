<template>
  <v-container id="MetadataCreationPublicationInfo" fluid class="pa-0">
    <v-row>
      <v-col cols="6">
        <!-- prettier-ignore -->
        <EditPublicationInfo v-bind="editPublicationsProps" />
      </v-col>

      <v-col cols="6">
        <!--        <EditOrganizationTree v-bind="editOrganizationProps" />-->
        <!-- prettier-ignore -->
        <EditOrganization v-bind="editOrganizationProps" />
      </v-col>
    </v-row>

    <v-row justify="end" align="end">
      <v-col class="shrink">
        <!-- prettier-ignore -->
        <BaseRectangleButton buttonText="Finish"
                             color='success'
                             @clicked="submitEdittedMetadata" />
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

import EditOrganization from '@/modules/user/components/EditOrganization';

import EditPublicationInfo from '@/modules/user/components/EditPublicationInfo';
// import EditOrganizationTree from '@/modules/user/components/EditOrganizationTree';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';
import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';
import {
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
} from '@/factories/eventBus';

export default {
  name: 'MetadataCreationPublicationInfo',
  props: {
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: '',
    },
  },
  computed: {
    publicationsInfo() {
      if (this.$store) {
        return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_PUBLICATION_INFO);
      }

      return {};
    },
    organizationsInfo() {
      if (this.$store) {
        return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_ORGANIZATION);
      }

      return {};
    },
    editPublicationsProps() {
      return {
        ...this.publicationsInfo,
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
      };
    },
    editOrganizationProps() {
      return {
        ...this.organizationsInfo,
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
      };
    },
  },
  methods: {
    submitEdittedMetadata() {
      // eslint-disable-next-line no-console
      console.log('todo');
    },
  },
  data: () => ({}),
  components: {
    //  EditOrganizationTree,
    EditPublicationInfo,
    EditOrganization,
    BaseRectangleButton,
  },
};
</script>

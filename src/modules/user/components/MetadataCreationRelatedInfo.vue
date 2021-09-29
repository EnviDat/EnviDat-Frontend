<template>

  <v-container id="MetadataCreationRelatedInfo"
                fluid
                class="pa-0">

    <v-row>
      <v-col cols="4">
        <EditRelatedPublications v-bind="editRelatedPublicationsProps" />

      </v-col>

      <v-col cols="5">
        <EditImgPlaceholder :disclaimer="disclaimer"
                            :img="relatedDatasets"
                            />
      </v-col>

      <v-col cols="3">
        <EditCustomFields v-bind="editCustomFieldsProps" />
      </v-col>
    </v-row>

  </v-container>

</template>


<script>
/**
 * EditDataInfo.vue renders the GenericPlaceholder component with a screenshot image of the Metadata Keywords mockup used in the slot
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

import EditImgPlaceholder from '@/modules/user/components/EditImgPlaceholder';
import relatedDatasets from '@/modules/user/assets/placeholders/relatedDatasets.jpg';

import EditRelatedPublications from '@/modules/user/components/EditRelatedPublications';
import EditCustomFields from '@/modules/user/components/EditCustomFields';
import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';
import {
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_RELATED_PUBLICATIONS,
} from '@/factories/eventBus';

export default {
  name: 'MetadataCreationRelatedInfo',
  props: {
  },
  computed: {
    relatedPublicationsText() {
      return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_RELATED_PUBLICATIONS).relatedPublicationsText;
    },
    customFields() {
      return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_CUSTOMFIELDS).customFields;
    },
    editRelatedPublicationsProps() {
      return {
        relatedPublicationsText: this.relatedPublicationsText,
      };
    },
    editCustomFieldsProps() {
      return {
        customFields: this.customFields,
      };
    },
  },
  methods: {
  },
  data: () => ({
    relatedDatasets,
    disclaimer: 'Please note that the screenshot below will serve as a template for the future component.',
  }),
  components: {
    EditImgPlaceholder,
    EditRelatedPublications,
    EditCustomFields,
  },
};


</script>

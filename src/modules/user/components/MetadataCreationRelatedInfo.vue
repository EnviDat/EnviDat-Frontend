<template>
  <v-container id="MetadataCreationRelatedInfo" fluid class="pa-0">
    <v-row>
      <v-col cols="4">
        <!-- prettier-ignore -->
        <EditRelatedPublications v-bind="editRelatedPublicationsProps" />
      </v-col>

      <v-col cols="5">
        <!-- prettier-ignore -->
        <EditImgPlaceholder :disclaimer="disclaimer"
                            :img="relatedDatasets" />
      </v-col>

      <v-col cols="3">
        <!-- prettier-ignore -->
        <EditCustomFields v-bind="editCustomFieldsProps" />
      </v-col>
    </v-row>

    <v-row justify="end" align="end">
      <v-col class="shrink">
        <!-- prettier-ignore -->
        <BaseRectangleButton buttonText="Next Step"
                             @clicked="nextStep" />
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
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';
import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';
import {
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_RELATED_PUBLICATIONS,
  EDITMETADATA_NEXT_MAJOR_STEP,
  eventBus,
} from '@/factories/eventBus';

export default {
  name: 'MetadataCreationRelatedInfo',
  props: {},
  computed: {
    relatedPublicationsText() {
      if (this.$store) {
        return this.$store.getters[
          `${USER_NAMESPACE}/getMetadataEditingObject`
        ](EDITMETADATA_RELATED_PUBLICATIONS);
      }

      return '';
    },
    customFields() {
      if (this.$store) {
        return this.$store.getters[
          `${USER_NAMESPACE}/getMetadataEditingObject`
        ](EDITMETADATA_CUSTOMFIELDS);
      }

      return [];
    },
    editRelatedPublicationsProps() {
      return {
        ...this.relatedPublicationsText,
      };
    },
    editCustomFieldsProps() {
      return {
        ...this.customFields,
      };
    },
  },
  methods: {
    nextStep() {
      eventBus.$emit(EDITMETADATA_NEXT_MAJOR_STEP, 'Publication Info');
    },
  },
  data: () => ({
    relatedDatasets,
    disclaimer:
      'Please note that the screenshot below will serve as a template for the future component.',
  }),
  components: {
    EditImgPlaceholder,
    EditRelatedPublications,
    EditCustomFields,
    BaseRectangleButton,
  },
};
</script>

<template>
  <v-container id="MetadataCreationRelatedInfo" fluid class="pa-0">
    <v-row>
      <v-col cols="4.5">
        <!-- prettier-ignore -->
        <EditRelatedPublications v-bind="editRelatedPublicationsProps" />
      </v-col>

      <v-col cols="4.5">
        <EditRelatedDatasets v-bind="editRelatedDatasetsProps" />
      </v-col>

      <v-col cols="3">
        <!-- prettier-ignore -->
        <EditCustomFields v-bind="editCustomFieldsProps" />
      </v-col>
    </v-row>

    <v-row justify="end" align="end">
      <v-col class="flex-grow-0">
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

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import {
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_NEXT_MAJOR_STEP,
  EDITMETADATA_RELATED_DATASETS,
  EDITMETADATA_RELATED_PUBLICATIONS,
  eventBus,
} from '@/factories/eventBus';

import relatedDatasets from '@/modules/user/assets/placeholders/relatedDatasets.jpg';
import EditCustomFields from '@/modules/user/components/EditCustomFields.vue';
import EditRelatedDatasets from '@/modules/user/components/EditRelatedDatasets.vue';
import EditRelatedPublications from '@/modules/user/components/EditRelatedPublications.vue';
import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';

export default {
  name: 'MetadataCreationRelatedInfo',
  props: {
    currentStep: Object,
    relatedPublicationsText: {
      type: String,
      default: undefined,
    },
    relatedDatasetsText: {
      type: String,
      default: undefined,
    },
    customFields: {
      type: Array,
      default: undefined,
    },
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: '',
    },
    nextMajorStep: String,
    isCreationWorkflow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    relatedPublicationsTextWrap() {
      if (this.isCreationWorkflow) {
        const stepData = this.currentStep.genericProps;
        return stepData.relatedPublicationsText;
      }

      if (!this.isCreationWorkflow && this.$store) {
        return this.$store.getters[
          `${USER_NAMESPACE}/getMetadataEditingObject`
        ](EDITMETADATA_RELATED_PUBLICATIONS).relatedPublicationsText;
      }

      return this.relatedPublicationsText;
    },
    relatedDatasetsTextWrap() {
      if (this.isCreationWorkflow) {
        const stepData = this.currentStep.genericProps;
        return stepData.relatedDatasetsText;
      }

      if (!this.isCreationWorkflow && this.$store) {
        return this.$store.getters[
          `${USER_NAMESPACE}/getMetadataEditingObject`
        ](EDITMETADATA_RELATED_DATASETS).relatedDatasetsText;
      }

      return this.relatedDatasetsText;
    },
    customFieldsWrap() {
      if (this.isCreationWorkflow) {
        const stepData = this.currentStep.genericProps;
        return stepData.customFields;
      }

      if (!this.isCreationWorkflow && this.$store) {
        return this.$store.getters[
          `${USER_NAMESPACE}/getMetadataEditingObject`
        ](EDITMETADATA_CUSTOMFIELDS).customFields;
      }

      return this.customFields;
    },
    editRelatedPublicationsProps() {
      return {
        relatedPublicationsText: this.relatedPublicationsTextWrap,
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
      };
    },
    editRelatedDatasetsProps() {
      return {
        relatedDatasetsText: this.relatedDatasetsTextWrap,
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
      };
    },
    editCustomFieldsProps() {
      return {
        customFields: this.customFieldsWrap,
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
      };
    },
  },
  methods: {
    nextStep() {
      eventBus.emit(EDITMETADATA_NEXT_MAJOR_STEP, this.nextMajorStep);
    },
  },
  data: () => ({
    relatedDatasets,
    disclaimer:
      'Please note that the screenshot below will serve as a template for the future component.',
  }),
  components: {
    EditRelatedDatasets,
    EditRelatedPublications,
    EditCustomFields,
    BaseRectangleButton,
  },
};
</script>

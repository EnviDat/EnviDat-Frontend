<template>
  <v-container id="EditRelatedInfo" fluid class="pa-0">
    <v-row>
      <v-col v-if="useListResolving"
             cols="4.5">
        <EditRelatedPublicationsList v-bind="editRelatedPublicationsProps" />
      </v-col>
      <v-col v-else
             cols="4.5">
        <EditRelatedPublications v-bind="editRelatedPublicationsProps" />
      </v-col>

      <v-col cols="4.5">
        <EditRelatedDatasets v-bind="editRelatedDatasetsProps" />
      </v-col>

      <v-col cols="4.5">
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

import { mapState } from 'vuex';
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
import EditRelatedPublicationsList from '@/modules/user/components/EditRelatedPublicationsList.vue';
import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';

export default {
  name: 'EditRelatedInfo',
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
    ...mapState(['config']),
    metadataConfig() {
      return this.$store ? this.config?.metadataConfig || {} : {};
    },
    publicationsConfig() {
      return this.metadataConfig?.publicationsConfig || {};
    },
    useListResolving() {
      // for testing in storybook just flip the false to true
      return this.publicationsConfig?.useListResolving || false;
    },
    relatedPublicationsTextWrap() {
      if (this.isCreationWorkflow) {
        const stepData = this.currentStep.genericProps;
        return stepData.relatedPublicationsText;
      }

      if (this.$store) {
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

      if (this.$store) {
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

      if (this.$store) {
        return this.$store.getters[
          `${USER_NAMESPACE}/getMetadataEditingObject`
        ](EDITMETADATA_CUSTOMFIELDS).customFields;
      }

      return this.customFields;
    },
    editRelatedPublicationsProps() {
      const editingObject = this.$store ? this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_RELATED_PUBLICATIONS) : undefined;

      return {
        relatedPublicationsText: this.relatedPublicationsTextWrap,
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
        loading: editingObject?.loading,
        message: editingObject?.message,
        messageDetails: editingObject?.messageDetails,
        error: editingObject?.error,
        errorDetails: editingObject?.errorDetails,
      };
    },
    editRelatedDatasetsProps() {
      const editingObject = this.$store ? this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_RELATED_DATASETS) : undefined;

      return {
        relatedDatasetsText: this.relatedDatasetsTextWrap,
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
        loading: editingObject?.loading,
        message: editingObject?.message,
        messageDetails: editingObject?.messageDetails,
        error: editingObject?.error,
        errorDetails: editingObject?.errorDetails,
      };
    },
    editCustomFieldsProps() {
      const editingObject = this.$store ? this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_CUSTOMFIELDS) : undefined;

      return {
        customFields: this.customFieldsWrap,
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
        loading: editingObject?.loading,
        message: editingObject?.message,
        messageDetails: editingObject?.messageDetails,
        error: editingObject?.error,
        errorDetails: editingObject?.errorDetails,
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
    EditRelatedPublicationsList,
    EditRelatedDatasets,
    EditRelatedPublications,
    EditCustomFields,
    BaseRectangleButton,
  },
};
</script>

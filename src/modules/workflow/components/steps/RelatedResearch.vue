<template>
  <v-card id="EditRelatedResearch" class="pa-0" elevation="0">
    <v-container fluid class="pa-4">
      <v-row>
        <v-col cols="12">
          <MetadataHeader v-bind="metadataPreviewEntry" />
        </v-col>
        <v-row class="mt-5">
          <v-col class="text-h5" cols="8">
            {{ labels.title }}
          </v-col>
          <v-col cols="12" class="text-body-1">
            {{ labels.instructions }}
          </v-col>
        </v-row>

        <!-- <v-col v-if="message" cols="4" class="pl-16">
          <BaseStatusLabelView
            status="check"
            statusColor="success"
            :statusText="message"
            :expandedText="messageDetails"
          />
        </v-col>
        <v-col v-if="error" cols="4" class="pl-16">
          <BaseStatusLabelView
            status="error"
            statusColor="error"
            :statusText="error"
            :expandedText="errorDetails"
          />
        </v-col> -->
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-alert type="info" closable :icon="false" class="rounded-lg">
            <v-alert-title>Information</v-alert-title>
            Lorem Ipsum
          </v-alert>
        </v-col>
        <v-col cols="12">
          <v-alert type="warning" closable :icon="info" class="rounded-lg">
            <v-alert-title>Related Research</v-alert-title>
            The information about related publications is
            <b>not required for publishing</b> — you can continue filling out
            the form even if you leave these fields empty.
            <b>However, these fields are still very important</b>, and it's good
            to remember that you can also fill them in after the publication.
          </v-alert>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-if="useListResolving" cols="6">
          <EditRelatedPublicationsList v-bind="editRelatedPublicationsProps" />
        </v-col>
        <v-col v-else cols="6">
          <EditRelatedPublications v-bind="editRelatedPublicationsProps" />
        </v-col>

        <v-col cols="6">
          <EditRelatedDatasets v-bind="editRelatedDatasetsProps" />
          <EditCustomFields v-bind="editCustomFieldsProps" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * EditMetadataHeader.vue shows the title, main contact email, main contact given name,
 * main contact surname, and metadata header preview.
 *
 *
 * @summary shows the title, main contact information, and header preview
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mapState } from 'vuex';

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
  name: 'EditMetadataHeader',
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
      return this.publicationsConfig?.useListResolving || true;
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
      const editingObject = this.$store
        ? this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](
            EDITMETADATA_RELATED_PUBLICATIONS,
          )
        : undefined;

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
      const editingObject = this.$store
        ? this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](
            EDITMETADATA_RELATED_DATASETS,
          )
        : undefined;

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
      const editingObject = this.$store
        ? this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](
            EDITMETADATA_CUSTOMFIELDS,
          )
        : undefined;

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
  data: () => ({
    relatedDatasets,
    labels: {
      title: 'Related Research',
      instructions:
        'Link related research and publications that support or reference your dataset.',
    },
  }),
  components: {
    EditRelatedPublicationsList,
    EditRelatedDatasets,
    EditRelatedPublications,
    EditCustomFields,
  },
};
</script>

<style scoped>
.compact-form {
  transform: scale(0.875);
  transform-origin: left;
}
</style>

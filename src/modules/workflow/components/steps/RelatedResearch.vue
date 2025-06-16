<template>
  <v-card id="EditRelatedResearch" class="pt-md-8 pt-0" elevation="0">
    <v-container fluid class="pa-4">
      <!-- Title box -->
      <v-row class="mb-0">
        <v-col class="text-h5 font-weight-bold" cols="8">
          {{ labels.title }}
        </v-col>
        <v-col cols="12" class="text-body-1">
          {{ labels.instructions }}
        </v-col>
      </v-row>

      <!-- Info Banner -->
      <v-row>
        <v-col class="mb-5 pt-0 pb-0">
          <v-alert type="info" closable :icon="false" class="rounded-lg">
            <v-alert-title>Information</v-alert-title>
            Lorem Ipsum
          </v-alert>
        </v-col>
      </v-row>

      <v-row>
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
        <v-col cols="12" xl="6">
          <EditRelatedPublicationsListWorkflow
            @save="save"
            @validate="validate"
            :validationErrors="validationErrors"
            v-bind="editRelatedPublicationsProps"
          />
        </v-col>

        <v-col cols="12" xl="6">
          <EditRelatedDatasetsWorkflow
            @save="save"
            @validate="validate"
            :validationErrors="validationErrors"
            v-bind="editRelatedDatasetsProps"
          />
          <!-- <EditCustomFieldsWorkflow
            @save="save"
            v-bind="editCustomFieldsProps"
          /> -->
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
  EDITMETADATA_RELATED_DATASETS,
  EDITMETADATA_RELATED_PUBLICATIONS,
  eventBus,
} from '@/factories/eventBus';

import relatedDatasets from '@/modules/user/assets/placeholders/relatedDatasets.jpg';
// import EditCustomFieldsWorkflow from '@/modules/user/components/EditCustomFieldsWorkflow.vue';
import EditRelatedDatasetsWorkflow from '@/modules/user/components/EditRelatedDatasetsWorkflow.vue';
import EditRelatedPublicationsListWorkflow from '@/modules/user/components/EditRelatedPublicationsListWorkflow.vue';
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
    validationErrors: { type: Object, default: () => ({}) },
  },
  methods: {
    save(payload) {
      this.$emit('save', payload);
    },
    validate(payload) {
      this.$emit('validate', payload);
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
    EditRelatedPublicationsListWorkflow,
    EditRelatedDatasetsWorkflow,
    // EditCustomFieldsWorkflow,
  },
};
</script>

<style scoped>
.compact-form {
  transform: scale(0.875);
  transform-origin: left;
}
</style>

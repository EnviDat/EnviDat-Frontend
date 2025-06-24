<template>
  <v-container id="EditRelatedResearch" fluid class="pa-4">
    <!-- Title box -->
    <v-row class="mb-0">
      <v-col class="text-h5 font-weight-bold" cols="12">
        {{ labels.title }}
      </v-col>
      <!-- <v-col cols="12" class="text-body-1">
        {{ labels.instructions }}
      </v-col> -->
    </v-row>

    <!-- Info Banner -->
    <v-row>
      <v-col class="mb-5 pt-0 pb-0">
        <v-alert
          type="info"
          closable
          :icon="false"
          class="rounded-lg info-banner"
        >
          <v-alert-title class="mb-2">Information</v-alert-title>

          <p>
            This section allows you to link your dataset to related research
            outputs such as scientific publications or other datasets. Although
            not required for publishing, this information significantly improves
            the discoverability and scientific value of your dataset.
          </p>

          <p><strong>Tips:</strong></p>
          <ol>
            <li>
              - Add links to publications by inserting
              <strong>DORA permanent IDs</strong> (e.g., <code>wsl:29664</code>)
              or DOIs. You can find DORA links at
              <a href="https://www.dora.lib4ri.ch" target="_blank"
                >dora.lib4ri.ch</a
              >.
            </li>
            <li>
              - If a publication doesn’t have a persistent identifier, you can
              enter the <strong>citation in plain text</strong>.
            </li>
            <li>
              - Related datasets can be linked by using either their
              <strong>EnviDat identifier</strong> or full URL. You can also use
              <a
                href="https://www.markdownguide.org/basic-syntax/#links"
                target="_blank"
                >Markdown</a
              >
              to create clickable links.
            </li>
            <li>
              - <b>This section can be updated later</b>, even after your
              dataset has been published.
            </li>
          </ol>

          <p class="mt-2">
            Adding related research helps users understand the context of your
            dataset and supports proper citation and reuse.
          </p>
        </v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" xl="6" data-field="relatedPublicationsText">
        <EditRelatedPublicationsListWorkflow
          @save="save"
          @validate="validate"
          :validationErrors="validationErrors"
          v-bind="editRelatedPublicationsProps"
        />
      </v-col>

      <v-col cols="12" xl="6" data-field="relatedDatasetsText">
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

// import EditCustomFieldsWorkflow from '@/modules/user/components/EditCustomFieldsWorkflow.vue';
import EditRelatedDatasetsWorkflow from '@/modules/workflow/components/steps/EditRelatedDatasetsWorkflow.vue';
import EditRelatedPublicationsListWorkflow from '@/modules/workflow/components/steps/EditRelatedPublicationsListWorkflow.vue';
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

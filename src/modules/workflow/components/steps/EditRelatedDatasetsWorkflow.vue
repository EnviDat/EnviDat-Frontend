<template>
  <v-card id="EditRelatedDatasets" class="pa-0" elevation="0" :loading="loadingColor">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col>
          <div class="font-weight-bold">
            {{ EDIT_METADATA_RELATED_DATASETS_TITLE }}
          </div>
          <div class="text-caption" v-html="labels.cardInstructions" />
        </v-col>
      </v-row>

      <v-row>
        <v-col v-if="message">
          <BaseStatusLabelView
            status="check"
            statusColor="success"
            :statusText="message"
            :expandedText="messageDetails"
          />
        </v-col>
        <v-col v-if="error">
          <BaseStatusLabelView status="error" statusColor="error" :statusText="error" :expandedText="errorDetails" />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <GenericTextareaPreviewLayout
            v-bind="genericTextAreaObject"
            :validationError="validationErrors.relatedDatasetsText"
            :readonly="isReadOnly(editingProperty)"
            :hint="readOnlyHint(editingProperty)"
            @inputedText="(event) => catchInputedText(event)"
            @changedText="(event) => catchChangedText(event.target.value)"
          >
            <MetadataRelatedDatasets v-bind="datasetObject" />
          </GenericTextareaPreviewLayout>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * EditRelatedDatasets.vue shows the Related Datasets textarea and Preview
 *
 * @summary shows the related datasets textarea and preview
 * @author Rebecca Kurup Buchholz
 *
 * Created        : 2021-11-08
 * Last modified  : 2021-11-08
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { EDITMETADATA_CLEAR_PREVIEW, eventBus } from '@/factories/eventBus.js';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';

import { EDIT_METADATA_RELATED_DATASETS_TITLE } from '@/factories/metadataConsts.js';

import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout.vue';
import MetadataRelatedDatasets from '@/modules/metadata/components/Metadata/MetadataRelatedDatasets.vue';

import { isFieldReadOnly, readOnlyHint } from '@/factories/globalMethods.js';

export default {
  name: 'EditRelatedDatasets',
  props: {
    relatedDatasetsText: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
    messageDetails: {
      type: String,
      default: null,
    },
    error: {
      type: String,
      default: '',
    },
    errorDetails: {
      type: String,
      default: null,
    },
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: '',
    },

    validationErrors: {
      type: Object,
      default: () => {},
    },
    allDatasets: {
      // this is only for testing & implementation via storybook
      type: Array,
      default: () => [],
    },
  },
  created() {
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  computed: {
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }

      return undefined;
    },
    genericTextAreaObject() {
      return {
        subtitlePreview: this.labels.subtitlePreview,
        labelTextarea: this.labels.labelTextarea,
        textareaContent: this.relatedDatasetsText,
        isVerticalLayout: true,
        placeholderTextarea: this.labels.placeholder,
      };
    },
    datasetObject() {
      return {
        text: this.previewRelatedDatasetsText,
        maxTextLength: 2000,
        allDatasets: this.allDatasets,
      };
    },

    previewRelatedDatasetsText() {
      return this.previewText || this.relatedDatasetsText;
    },
  },
  methods: {
    clearPreview() {
      this.previewText = null;
    },
    catchInputedText(value) {
      this.previewText = value;
      this.newDatasetInfo.relatedDatasetsText = this.previewText;
      this.$emit('validate', this.newDatasetInfo);
    },
    catchChangedText(value) {
      if (this.validationErrors.relatedDatasetsText === null) {
        this.setRelatedDatasetsText(value);
      }
    },
    setRelatedDatasetsText(value) {
      this.previewText = value;
      this.newDatasetInfo.relatedDatasetsText = this.previewText;
      this.$emit('save', this.newDatasetInfo);
    },
    isReadOnly(dateProperty) {
      return isFieldReadOnly(this.$props, dateProperty);
    },
    readOnlyHint(dateProperty) {
      return readOnlyHint(this.$props, dateProperty);
    },
  },
  data: () => ({
    previewText: null,
    editingProperty: 'relatedDatasetsText',
    EDIT_METADATA_RELATED_DATASETS_TITLE,
    labels: {
      labelTextarea: EDIT_METADATA_RELATED_DATASETS_TITLE,
      cardInstructions: `Add links to other EnviDat datasets that are relevant to this one. Or add others links and use <a href="https://www.markdownguide.org/basic-syntax/#links" target="_blank">markdown</a> to format link to make them clickable.
                            Click into the text area for examples.`,
      placeholder:
        'Example entries: \n * dataset-for-ogrs-2018-publication\n' +
        ' * https://www.envidat.ch/#/metadata/dataset-for-ogrs-2018-publication ',
      subtitlePreview: 'Related Datasets Preview',
    },
    newDatasetInfo: {},
  }),
  components: {
    MetadataRelatedDatasets,
    GenericTextareaPreviewLayout,
    BaseStatusLabelView,
  },
};
</script>

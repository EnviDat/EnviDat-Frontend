<template>

<v-card id="EditRelatedDatasets"
        class="pa-0"
        :loading="loading">

  <v-container fluid
                class="pa-4 fill-height" >

    <template slot="progress">
      <v-progress-linear color="primary"
                         indeterminate />
    </template>

    <v-row>
      <v-col cols="6" class="text-h5">
        {{ EDIT_METADATA_RELATED_DATASETS_TITLE }}
      </v-col>

      <v-col v-if="message" >
        <BaseStatusLabelView statusIcon="check"
                             statusColor="success"
                             :statusText="message"
                             :expandedText="messageDetails" />
      </v-col>
      <v-col v-if="error"  >

        <BaseStatusLabelView statusIcon="error"
                             statusColor="error"
                             :statusText="error"
                             :expandedText="errorDetails" />
      </v-col>

    </v-row>

    <v-row>
      <v-col >
        <div class="text-subtitle-1">{{ labels.cardInstructions }}</div>
      </v-col>
    </v-row>


    <v-row>
      <v-col >

        <GenericTextareaPreviewLayout v-bind="genericTextAreaObject"
                                      :validationError="validationErrors[editingProperty]"
                                      :readonly="mixinMethods_isFieldReadOnly(editingProperty)"
                                      :hint="mixinMethods_readOnlyHint(editingProperty)"
                                      @inputedText="catchInputedText($event)"
                                      @changedText="catchChangedText($event)">
          <MetadataRelatedDatasets :genericProps="datasetObject" />
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
import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_RELATED_DATASETS,
  eventBus,
} from '@/factories/eventBus';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView';

import { EDIT_METADATA_RELATED_DATASETS_TITLE } from '@/factories/metadataConsts';

import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout';
import MetadataRelatedDatasets from '@/modules/metadata/components/Metadata/MetadataRelatedDatasets';
import { getValidationMetadataEditingObject, isFieldValid } from '@/factories/userEditingFactory';

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
  },
  created() {
    eventBus.$on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  computed: {
    genericTextAreaObject() {
      return {
        subtitlePreview: this.labels.subtitlePreview,
        labelTextarea: this.labels.labelTextarea,
        textareaContent: this.relatedDatasetsText,
        isVerticalLayout: true,
      };
    },
    datasetObject() {
      return {
        datasets: {
          text: this.previewRelatedDatasetsText,
        },
      };
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_RELATED_DATASETS);
    },
    previewRelatedDatasetsText() {
      return this.previewText || this.relatedDatasetsText;
    },
  },
  methods: {
    clearPreview() {
      this.previewText = '';
    },
    validateProperty(property, value){
      return isFieldValid(property, value, this.validations, this.validationErrors)
    },
    catchInputedText(value) {
      this.previewText = value;
      this.validateProperty(this.editingProperty, value);
    },
    catchChangedText(value) {
      if (this.validateProperty(this.editingProperty, value)) {
        this.setRelatedDatasetsText(value);
      }
    },
    setRelatedDatasetsText(value) {

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_RELATED_DATASETS,
        data: { [this.editingProperty]: value },
      });
    },
  },
  data: () => ({
    previewText: '',
    editingProperty: 'relatedDatasetsText',
    EDIT_METADATA_RELATED_DATASETS_TITLE,
    labels: {
      labelTextarea: EDIT_METADATA_RELATED_DATASETS_TITLE,
      cardInstructions: 'Add references to other related datasets',
      subtitlePreview: 'Related Datasets Preview',
    },
    validationErrors: {
      relatedDatasetsText: null,
    },
  }),
  components: {
    MetadataRelatedDatasets,
    GenericTextareaPreviewLayout,
    BaseStatusLabelView,
  },
};


</script>
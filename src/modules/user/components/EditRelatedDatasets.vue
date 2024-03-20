<template>

<v-card id="EditRelatedDatasets"
        class="pa-0"
        :loading="loadingColor">

  <v-container fluid
                class="pa-4 fill-height" >

    <v-row>
      <v-col cols="6" class="text-h5">
        {{ EDIT_METADATA_RELATED_DATASETS_TITLE }}
      </v-col>

      <v-col v-if="message" >
        <BaseStatusLabelView status="check"
                             statusColor="success"
                             :statusText="message"
                             :expandedText="messageDetails" />
      </v-col>
      <v-col v-if="error"  >

        <BaseStatusLabelView status="error"
                             statusColor="error"
                             :statusText="error"
                             :expandedText="errorDetails" />
      </v-col>

    </v-row>

    <v-row>
      <v-col >
        <div class="text-subtitle-1"
             v-html="labels.cardInstructions">

        </div>
      </v-col>
    </v-row>


    <v-row>
      <v-col >

        <GenericTextareaPreviewLayout v-bind="genericTextAreaObject"
                                      :validationError="validationErrors[editingProperty]"
                                      :readonly="isReadOnly(editingProperty)"
                                      :hint="readOnlyHint(editingProperty)"
                                      @inputedText="catchInputedText($event)"
                                      @changedText="catchChangedText($event)">
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
import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_RELATED_DATASETS,
  eventBus,
} from '@/factories/eventBus';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';

import { EDIT_METADATA_RELATED_DATASETS_TITLE } from '@/factories/metadataConsts';

import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout.vue';
import MetadataRelatedDatasets from '@/modules/metadata/components/Metadata/MetadataRelatedDatasets.vue';
import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingValidations';

import { isFieldReadOnly, readOnlyHint } from '@/factories/globalMethods';

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
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_RELATED_DATASETS);
    },
    previewRelatedDatasetsText() {
      return this.previewText || this.relatedDatasetsText;
    },
  },
  methods: {
    clearPreview() {
      this.previewText = null;
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

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_RELATED_DATASETS,
        data: { [this.editingProperty]: value },
      });
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
      placeholder: 'Example entries: \n * dataset-for-ogrs-2018-publication\n' +
          ' * https://www.envidat.ch/#/metadata/dataset-for-ogrs-2018-publication ',
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

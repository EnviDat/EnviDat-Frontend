<template>

<v-card id="EditRelatedPublications"
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
        {{ EDIT_METADATA_RELATEDPUBLICATIONS_TITLE }}
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
                                      @inputedText="catchInputedText($event)"
                                      @changedText="catchChangedText($event)">
          <MetadataPublications :genericProps="publicationsObject" />
        </GenericTextareaPreviewLayout>

      </v-col>
    </v-row>

 </v-container>
</v-card>

</template>


<script>
/**
 * EditRelatedpublications.vue shows the Related Publications textarea and Preview,
 * main contact surname, and metadata header preview.
 *
 * @summary shows the related publications textarea and preview
 * @author Rebecca Kurup Buchholz
 *
 * Created        : 2019-08-19
 * Last modified  : 2021-08-19
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_RELATED_PUBLICATIONS,
  eventBus,
} from '@/factories/eventBus';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView';

import { EDIT_METADATA_RELATEDPUBLICATIONS_TITLE } from '@/factories/metadataConsts';

import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout';
import MetadataPublications from '@/modules/metadata/components/Metadata/MetadataPublications';
import { getValidationMetadataEditingObject, isFieldValid } from '@/factories/userEditingFactory';

export default {
  name: 'EditRelatedPublications',
  props: {
    relatedPublicationsText: {
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
  },
  computed: {
    genericTextAreaObject() {
      return {
        subtitlePreview: this.labels.subtitlePreview,
        labelTextarea: this.labels.labelTextarea,
        textareaContent: this.relatedPublicationsText,
        isVerticalLayout: true,
      };
    },
    publicationsObject() {
      return {
        publications: {
          text: this.previewPublicationsText,
        },
      };
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_RELATED_PUBLICATIONS);
    },
    previewPublicationsText() {
      return this.previewText || this.relatedPublicationsText;
    },
  },
  watch: {
    loading() {
      if (!this.loading && this.message) {
        this.previewText = '';
      }
    },
  },
  methods: {
    validateProperty(property, value){
      return isFieldValid(property, value, this.validations, this.validationErrors)
    },
    catchInputedText(value) {
      this.previewText = value;
      this.validateProperty(this.editingProperty, value);
    },
    catchChangedText(value) {
      if (this.validateProperty(this.editingProperty, value)) {
        this.setRelatedPublicationsText(value);
      }
    },
    setRelatedPublicationsText(value) {

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_RELATED_PUBLICATIONS,
        data: { [this.editingProperty]: value },
      });
    },
  },
  data: () => ({
    previewText: '',
    editingProperty: 'relatedPublicationsText',
    EDIT_METADATA_RELATEDPUBLICATIONS_TITLE,
    labels: {
      labelTextarea: EDIT_METADATA_RELATEDPUBLICATIONS_TITLE,
      cardInstructions: 'Add references to other related publications',
      subtitlePreview: 'Related Publications Preview',
    },
    validationErrors: {
      relatedPublicationsText: null,
    },
  }),
  components: {
    GenericTextareaPreviewLayout,
    MetadataPublications,
    BaseStatusLabelView,
  },
};


</script>

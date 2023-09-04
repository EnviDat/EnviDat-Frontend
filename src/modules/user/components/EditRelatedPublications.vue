<template>

<v-card id="EditRelatedPublications"
        class="pa-0"
        :loading="loading">

  <v-container fluid
                class="pa-4 fill-height" >

    <template v-slot:progress>
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
        <div class="text-subtitle-1"
              v-html="labels.cardInstructions">

        </div>
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
          <MetadataPublications v-bind="publicationsObject" />
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
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_RELATED_PUBLICATIONS,
  eventBus,
} from '@/factories/eventBus';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';

import { EDIT_METADATA_RELATEDPUBLICATIONS_TITLE } from '@/factories/metadataConsts';

import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout.vue';
import MetadataPublications from '@/modules/metadata/components/Metadata/MetadataPublications.vue';
import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingValidations';

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
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  computed: {
    genericTextAreaObject() {
      return {
        subtitlePreview: this.labels.subtitlePreview,
        labelTextarea: this.labels.labelTextarea,
        textareaContent: this.relatedPublicationsText,
        isVerticalLayout: true,
        placeholderTextarea: this.labels.placeholder,
      };
    },
    publicationsObject() {
      return {
        text: this.previewPublicationsText,
        maxTextLength: 2000,
      };
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_RELATED_PUBLICATIONS);
    },
    previewPublicationsText() {
      return this.previewText ? this.previewText : this.relatedPublicationsText;
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
        this.setRelatedPublicationsText(value);
      }
    },
    setRelatedPublicationsText(value) {

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_RELATED_PUBLICATIONS,
        data: { [this.editingProperty]: value },
      });
    },
  },
  data: () => ({
    previewText: null,
    editingProperty: 'relatedPublicationsText',
    EDIT_METADATA_RELATEDPUBLICATIONS_TITLE,
    labels: {
      labelTextarea: EDIT_METADATA_RELATEDPUBLICATIONS_TITLE,
      cardInstructions: 'Add DORA links to other publications, you can find them on <a href="https://www.dora.lib4ri.ch/wsl/" target="_blank">dora lib4ri</a> or directly enter DORA permanent IDs ex. wsl:29664). Click into the text arena for examples.',
      placeholder: 'Example entries: \n  * wsl:18753 \n' +
          ' * https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:18753 ',
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

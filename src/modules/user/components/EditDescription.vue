<template>
  <v-card id="EditDescription"
          class="pa-0"
          :loading="loadingColor">

    <v-container fluid
                  class="pa-4">

      <v-row>
        <v-col cols="8"
               class="text-h5">
          {{ labels.cardTitle }}
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
        <v-col cols="6">
          <div class="text-body-1" v-html="labels.descriptionInstructions"></div>
        </v-col>
        <v-col cols="6">
          <div class="text-subtitle-1">{{ labels.subtitlePreview }}</div>
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
            <MetadataDescription v-bind="descriptionObject" />
          </GenericTextareaPreviewLayout>

        </v-col>
      </v-row>

    </v-container>
  </v-card>

</template>

<script>
/**
 * @summary shows the description and description preview of a metadata entry
 * @author Rebecca Kurup Buchholz
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-08-03 15:22:03

 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_MAIN_DESCRIPTION,
  eventBus, EDITMETADATA_CLEAR_PREVIEW,
} from '@/factories/eventBus';

// eslint-disable-next-line import/no-cycle
import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingValidations';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout.vue';
import MetadataDescription from '@/modules/metadata/components/Metadata/MetadataDescription.vue';
import { EDIT_METADATA_DESCRIPTION_TITLE } from '@/factories/metadataConsts';

import { isFieldReadOnly, readOnlyHint } from '@/factories/globalMethods';
import { mdiText } from '@mdi/js';


export default {
  name: 'EditDescription',
  props: {
    description: {
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
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }

      return undefined;
    },
    genericTextAreaObject() {
      return {
        labelTextarea: this.labels.labelTextarea,
        textareaContent: this.description,
        isVerticalLayout: false,
        prependIcon: mdiText,
      };
    },
    descriptionObject() {
      return {
        text: this.previewDescription,
        maxTextLength: 5000,
      };
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_MAIN_DESCRIPTION);
    },
    previewDescription() {
      return this.previewText !== null ? this.previewText : this.description;
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
        this.setDescriptionText(value);
      }
    },
    setDescriptionText(value) {

      const newDescription = {
        [this.editingProperty]: value,
      };

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_MAIN_DESCRIPTION,
        data: newDescription,
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
    mdiText,
    editingProperty: 'description',
    previewText: null,
    labels: {
      cardTitle: EDIT_METADATA_DESCRIPTION_TITLE,
      labelTextarea: 'Research Data Description',
      descriptionInstructions: 'Enter a description which helps other researchers to understand your data. Use <a href="https://www.markdownguide.org/cheat-sheet" target="_blank">markdown </a> to format the description and make it easier to read.',
      subtitlePreview: 'Description Preview',
    },
    validationErrors: {
      description: null,
    },
  }),
  components: {
    MetadataDescription,
    GenericTextareaPreviewLayout,
    BaseStatusLabelView,
  },
};
</script>

<style scoped>

</style>

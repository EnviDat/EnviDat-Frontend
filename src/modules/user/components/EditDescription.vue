<template>
  <v-card id="EditDescription"
          class="pa-0"
          :loading="loading">

    <v-container fluid
                  class="pa-4">

      <template slot="progress">
        <v-progress-linear color="primary"
                           indeterminate />
      </template>

      <v-row>
        <v-col cols="8"
               class="text-h5">
          {{ labels.cardTitle }}
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
        <v-col cols="6">
          <div class="text-body-1">{{ labels.descriptionInstructions }}</div>
        </v-col>
        <v-col cols="6">
          <div class="text-subtitle-1">{{ labels.subtitlePreview }}</div>
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
            <MetadataBody :genericProps="descriptionObject" />
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
} from '@/factories/userEditingFactory';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView';

import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout';
import MetadataBody from '@/modules/metadata/components/Metadata/MetadataBody';


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
    eventBus.$on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  computed: {
    genericTextAreaObject() {
      return {
        labelTextarea: this.labels.labelTextarea,
        textareaContent: this.description,
        isVerticalLayout: false,
        prependIcon: 'description',
      };
    },
    descriptionObject() {
      return {
        body: {
          text: this.previewDescription,
        },
      };
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_MAIN_DESCRIPTION);
    },
    previewDescription() {
      return this.previewText || this.description;
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
        this.setDescriptionText(value);
      }
    },
    setDescriptionText(value) {

      const newDescription = {
        [this.editingProperty]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_MAIN_DESCRIPTION,
        data: newDescription,
      });
    },
  },
  data: () => ({
    editingProperty: 'description',
    previewText: '',
    labels: {
      cardTitle: 'Metadata Description',
      labelTextarea: 'Metadata Description',
      descriptionInstructions: 'Please enter a description for the research data.',
      subtitlePreview: 'Description Preview',
    },
    validationErrors: {
      description: null,
    },
  }),
  components: {
    MetadataBody,
    GenericTextareaPreviewLayout,
    BaseStatusLabelView,
  },
};
</script>

<style scoped>

</style>
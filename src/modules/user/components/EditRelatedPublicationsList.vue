<template>
  <v-card id="EditRelatedPublicationsList" class="pa-0" :loading="loadingColor">
    <v-container fluid class="pa-4">
      <v-row>
        <v-col cols="12" class="text-h5">
          {{ EDIT_METADATA_RELATEDPUBLICATIONS_TITLE }}
        </v-col>
        <v-col v-if="message">
          <BaseStatusLabelView
            statusIcon="check"
            statusColor="success"
            :statusText="message"
            :expandedText="messageDetails"
          />
        </v-col>
        <v-col v-if="error">
          <BaseStatusLabelView
            statusIcon="error"
            statusColor="error"
            :statusText="error"
            :expandedText="errorDetails"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <div class="text-subtitle-1" v-html="labels.cardInstructions"></div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <EditAddPublication
            :pid="previewPid"
            :doi="previewDoi"
            :selectedPlainText="selectedPlainText"
            :validationError="validationErrors[editingProperty]"
            @addClicked="catchAddPublication"
            @saveText="catchSaveText"
            @cancelText="catchCancelText"
          />
        </v-col>
      </v-row>

      <v-row no-gutters class="pt-4">
        <v-col>
          <div class="text-subtitle-1" v-html="labels.preview"></div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <MetadataPublicationList
            :isPreview="true"
            v-bind="publicationsObject"
            :updatedCitation="updatedCitation"
            :updatedCitationIndex="selectedTextIndex"
            @editItem="catchEditItem"
            @updateText="catchUpdateText"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * EditRelatedPublicationsList.vue shows the Related Publications textarea and Preview,
 * main contact surname, and metadata header preview.
 *
 * @summary shows the related publications textarea and preview
 * @author Dominik Haas-Artho
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
import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingValidations';

import EditAddPublication from '@/modules/user/components/EditAddPublication.vue';
import MetadataPublicationList from '@/modules/metadata/components/Metadata/MetadataPublicationList.vue';

export default {
  name: 'EditRelatedPublicationsList',
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
  mounted() {
    // if (this.relatedPublicationsText) {
    //   this.previewText = this.relatedPublicationsText;
    // }
  },
  computed: {
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }

      return undefined;
    },
    publicationsObject() {
      return {
        text: this.relatedPublicationsText,
        maxTextLength: 2000,
        showPlaceholder: this.loading,
      };
    },
    // previewPublicationsText() {
    //   return this.previewText ? this.previewText : this.relatedPublicationsText;
    // },
    validations() {
      return getValidationMetadataEditingObject(
        EDITMETADATA_RELATED_PUBLICATIONS,
      );
    },
  },
  methods: {
    catchUpdateText(newRelatedText) {
      this.catchChangedText(newRelatedText);
    },
    catchEditItem({ citationText, index }) {
      this.selectedPlainText = citationText;
      this.selectedTextIndex = index;
    },
    catchSaveText(citationText) {
      this.updatedCitation = citationText;
    },
    catchCancelText() {
      this.selectedPlainText = undefined;
      this.selectedTextIndex = undefined;
      this.updatedCitation = undefined;
    },
    catchAddPublication({ pid, doi, plainText }) {
      this.previewPid = pid;
      this.previewDoi = doi;

      let value = pid;
      if (doi) {
        value = doi;
      } else if (plainText) {
        value = plainText;
      }

      if (value) {
        if (!this.relatedPublicationsText?.includes(value)) {
          const newText = `${this.relatedPublicationsText}\n ${value}`;

          this.catchChangedText(newText);
        }
      }
    },
    catchChangedText(value) {
      if (this.validateProperty(this.editingProperty, value)) {
        this.setRelatedPublicationsText(value);
      }
    },
    validateProperty(property, value) {
      return isFieldValid(
        property,
        value,
        this.validations,
        this.validationErrors,
      );
    },
    setRelatedPublicationsText(value) {
      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_RELATED_PUBLICATIONS,
        data: { [this.editingProperty]: value },
      });
    },
    clearPreview() {
      // this.previewText = null;
      this.previewPid = null;
      this.previewDoi = null;
      this.selectedPlainText = undefined;
      this.selectedTextIndex = undefined;
      this.updatedCitation = undefined;
    },
  },
  data: () => ({
    editingProperty: 'relatedPublicationsText',
    EDIT_METADATA_RELATEDPUBLICATIONS_TITLE,
    labels: {
      cardInstructions:
        'Add DORA links to other publications, you can find them on <a href="https://www.dora.lib4ri.ch/wsl/" target="_blank">dora lib4ri</a> or directly enter DORA permanent IDs ex. wsl:29664). Click into the text arena for examples.',
      placeholder:
        'Example entries: \n  * wsl:18753 \n' +
        ' * https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:18753 ',
      preview: 'Preview of the Related Publications',
    },
    publicationsMap: null,
    // previewText: null,
    previewPid: null,
    previewDoi: null,
    validationErrors: {
      relatedPublicationsText: null,
    },
    selectedPlainText: undefined,
    updatedCitation: undefined,
    selectedTextIndex: undefined,
  }),
  components: {
    MetadataPublicationList,
    EditAddPublication,
    BaseStatusLabelView,
  },
};
</script>

<template>
  <v-card id="EditRelatedPublicationsList" class="pa-0" elevation="0" :loading="loadingColor">
    <v-container fluid class="pa-0">
      <v-row class="mb-5">
        <v-col>
          <div class="font-weight-bold">
            {{ EDIT_METADATA_RELATEDPUBLICATIONS_TITLE }}
          </div>
          <div class="text-caption" v-html="labels.cardInstructions" />
        </v-col>
      </v-row>
      <v-row>
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
          <EditAddPublicationWorkflow
            :pid="previewPid"
            :doi="previewDoi"
            :selectedPlainText="selectedPlainText"
            :validation-errors="validationErrors"
            @addClicked="catchAddPublication"
            @saveText="catchSaveText"
            @cancelText="catchCancelText"
            @validate="validate"
          />
        </v-col>
      </v-row>

      <v-row class="mt-5">
        <v-col>
          <div class="font-weight-bold" v-html="labels.preview"></div>
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
import { EDITMETADATA_CLEAR_PREVIEW, eventBus } from '@/factories/eventBus.js';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';

import { EDIT_METADATA_RELATEDPUBLICATIONS_TITLE } from '@/factories/metadataConsts.js';

import EditAddPublicationWorkflow from '@/modules/workflow/components/steps/EditAddPublicationWorkflow.vue';
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

    validationErrors: {
      type: Object,
      default: () => {},
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
        text:
          this.previewText !== null && this.previewText !== undefined ? this.previewText : this.relatedPublicationsText,
        maxTextLength: 2000,
        showPlaceholder: this.loading,
      };
    },
    // previewPublicationsText() {
    //   return {
    //     text: this.relatedPublicationsText,
    //     maxTextLength: 2000,
    //     showPlaceholder: this.loading,
    //   };
    // },
  },
  methods: {
    toLines(str = '') {
      return String(str)
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
    },
    mergeLines(existingStr = '', incomingStr = '') {
      const existing = this.toLines(existingStr);
      const incoming = this.toLines(incomingStr);
      const seen = new Set(existing);
      const merged = [...existing];
      for (const line of incoming) {
        if (!seen.has(line)) {
          merged.push(line);
          seen.add(line);
        }
      }
      return merged.join('\n');
    },
    catchUpdateText(newRelatedText) {
      this.catchChangedText(newRelatedText);
    },
    catchEditItem({ citationText, index }) {
      this.selectedPlainText = citationText;
      this.selectedTextIndex = index;
    },
    validate(payload) {
      this.$emit('validate', { field: 'relatedPublicationsText', value: payload });
    },
    catchSaveText(citationText) {
      const merged = this.mergeLines(this.relatedPublicationsText, this.previewText ?? citationText ?? '');
      this.newDatasetInfo.relatedPublicationsText = merged;
      this.$emit('save', this.newDatasetInfo);
      this.updatedCitation = citationText;
    },
    catchCancelText() {
      this.selectedPlainText = undefined;
      this.selectedTextIndex = undefined;
      this.updatedCitation = undefined;
    },
    catchAddPublication({ pid, doi, plainText }) {
      const value = doi || pid || plainText;
      if (!value) return;
      const merged = this.mergeLines(this.relatedPublicationsText, value);
      this.setRelatedPublicationsText(merged);
    },
    catchChangedText(value) {
      if (this.validationErrors.relatedPublicationsText === null) {
        this.setRelatedPublicationsText(value);
      }
    },

    setRelatedPublicationsText(value) {
      this.previewText = value;
      this.newDatasetInfo.relatedPublicationsText = this.previewText;
      this.$emit('save', this.newDatasetInfo);
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
        'Example entries: \n  * wsl:18753 \n' + ' * https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:18753 ',
      preview: 'Preview of the Related Publications',
    },
    newDatasetInfo: {},
    publicationsMap: null,
    previewText: null,
    previewPid: null,
    previewDoi: null,

    selectedPlainText: undefined,
    updatedCitation: undefined,
    selectedTextIndex: undefined,
  }),
  components: {
    MetadataPublicationList,
    EditAddPublicationWorkflow,
    BaseStatusLabelView,
  },
};
</script>

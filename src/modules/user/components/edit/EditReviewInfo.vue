<template>
  <v-card id="EditReviewInfo" class="pa-0" max-width="100%" :loading="loadingColor" :flat>
    <v-container fluid class="pa-4">
      <v-row>
        <v-col cols="6" class="text-h5">
          {{ labels.cardTitle }}
        </v-col>

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
          {{ labels.purpose }}
        </v-col>
      </v-row>

      <v-row v-if="!isBlindReviewValid">
        <v-col>
          <v-alert type="info">{{ labels.instructions }}</v-alert>
        </v-col>
      </v-row>

      <v-row class="pt-2">
        <v-col class="ml-sm-0 mr-3 flex-grow-0 d-flex align-center">
          <!-- Icon (Aligned to Match v-text-field) -->
          <v-icon :icon="mdiMessageDraw" class="mr-3" style="align-self: center" color="grey"></v-icon>
          <!-- Text -->
          <span class="mr-3 text-no-wrap">Blind review </span>

          <!-- BaseIconSwitch Component -->
          <BaseIconSwitch
            :tooltipText="`${isActive ? 'Disable' : 'Enable'} blind review`"
            :icon="mdiAccountCircle()"
            :active="isActive"
            :disabled="loading || !isBlindReviewValid"
            :loading="loading"
            @clicked="catchBlindReviewClick()"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col :cols="12" :md="6">
          <v-text-field
            :label="labels.blindUrl"
            :readonly="true"
            :hint="readOnlyHint('Blind Url of Dataset')"
            hide-details="auto"
            persistent-hint
            :disabled="!isBlindReviewValid"
            :prepend-icon="mdiLink"
            :model-value="urlField"
            :append-icon="mdiContentCopy"
            @click:append="catchClipboardCopy"
          />
        </v-col>
        <v-col :cols="12" :md="6">
          <BaseRectangleButton
            :button-text="labels.buttonText"
            :disabled="!isPreviewAvailable"
            :loading="loading"
            @clicked="previewClicked"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * @summary Shows Review Information (publication state, DOI, publisher, and funding information)
 * @author Rebecca Kurup Buchholz, Ranita Pal, Dominik Haas
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mapState } from 'vuex';
import { mdiMessageDraw, mdiLink, mdiContentCopy } from '@mdi/js';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import BaseIconSwitch from '@/components/BaseElements/BaseIconSwitch.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_REVIEW_INFO,
  eventBus,
} from '@/factories/eventBus';

import {
  EDIT_METADATA_DOI_LABEL,
  PUBLICATION_STATE_RESERVED,
  PUBLICATION_STATE_PENDING,
  BLIND_REVIEW_ON,
  BLIND_REVIEW_OFF,
} from '@/factories/metadataConsts';

import { readOnlyHint, isFieldReadOnly } from '@/factories/globalMethods';
import { METADATAREVIEW_PATH } from '@/router/routeConsts';

export default {
  name: 'EditReviewInfo',
  props: {
    publicationState: {
      type: String,
      default: '',
    },
    doi: {
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
    datasetId: {
      type: String,
      default: null,
    },
    isBlindReview: {
      type: Boolean,
      default: undefined, // can be kept null
    },
    flat: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearBlindReviewState);
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearBlindReviewState);
  },
  computed: {
    ...mapState(['config']),
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }
      return undefined;
    },
    urlField() {
      return this.isActive ? this.generateBlindReviewUrl() : '';
    },
    isActive() {
      return this.previewIsActive === null ? this.isBlindReview : this.previewIsActive;
    },
    isBlindReviewValid() {
      return this.doi && this.allowedPublicationStates.includes(this.publicationState);
    },
    isPreviewAvailable() {
      return this.isBlindReviewValid && this.urlField.length > 0;
    },
  },
  methods: {
    isReadOnly(dateProperty) {
      return isFieldReadOnly(this.$props, dateProperty);
    },
    readOnlyHint(dateProperty) {
      return readOnlyHint(this.$props, dateProperty);
    },
    catchBlindReviewClick() {
      if (this.isBlindReviewValid) {
        this.previewIsActive = !this.isBlindReview;
        const value = this.previewIsActive ? BLIND_REVIEW_ON : BLIND_REVIEW_OFF;
        this.changeBlindReviewStatus(value);
        this.generateBlindReviewUrl();
      }
    },
    generateBlindReviewUrl() {
      if (this.datasetId && this.isBlindReview) {
        this.blindUrl = `${this.envidatDomain}/#${METADATAREVIEW_PATH}/${this.datasetId}`;
      } else {
        this.blindUrl = '';
      }

      return this.blindUrl;
    },
    changeBlindReviewStatus(value) {
      const newBlindReviewInfo = {
        version: value,
      };
      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_REVIEW_INFO,
        data: newBlindReviewInfo,
      });
    },
    catchClipboardCopy() {
      navigator.clipboard.writeText(this.urlField);
    },
    clearBlindReviewState() {
      this.previewIsActive = null;
    },
    previewClicked() {
      window.open(this.blindUrl, '_blank');
    },
  },
  data: () => ({
    mdiLink,
    mdiMessageDraw,
    mdiContentCopy,
    previewPublisher: null,
    emptyEntry: {
      institution: '',
      grantNumber: '',
      institutionUrl: '',
    },
    labels: {
      cardTitle: 'Blind Review',
      reviewState: 'Dataset blind-review type',
      blindUrl: 'Url to view blind-review dataset',
      dataObjectIdentifier: EDIT_METADATA_DOI_LABEL,
      instructions: 'DOI needs to be reserved to enable this feature',
      buttonText: 'Preview',
      purpose:
        'Only activate the blind-review if you need to provide anonymized access to your research data files to reviewers for a scientific journal before the dataset has been published. Once enabled, copy the link below and provide it to the reviewers (the DOI is not be activate until the dataset is published).',
    },
    previewIsActive: null,
    allowedPublicationStates: [PUBLICATION_STATE_RESERVED, PUBLICATION_STATE_PENDING],
    envidatDomain: process.env.VITE_API_ROOT,
    buttonColor: '#269697',
    previewYear: null,
  }),
  components: {
    BaseStatusLabelView,
    BaseIconSwitch,
    BaseRectangleButton,
  },
};
</script>

<style scoped></style>

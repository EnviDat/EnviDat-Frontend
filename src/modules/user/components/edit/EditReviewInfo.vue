<template>
  <v-card
      id="EditReviewInfo"
      class="pa-0"
      max-width="100%"
      :loading="loadingColor"
  >
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
          <BaseStatusLabelView
              status="error"
              statusColor="error"
              :statusText="error"
              :expandedText="errorDetails"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-alert type="info" >{{ labels.instructions }}</v-alert>
        </v-col>
      </v-row>
      <v-row class="pt-2">
        <v-col class="ml-sm-0 mr-3 flex-grow-0 d-flex align-center">
          <!-- Icon (Aligned to Match v-text-field) -->
          <v-icon :icon="mdiMessageDraw" class="mr-3" style="align-self: center;" color="grey"></v-icon>
            <!-- Text -->
            <span class="mr-3 text-no-wrap">Blind review </span>

            <!-- BaseIconSwitch Component -->
            <BaseIconSwitch
                :tooltipText="'Click here to enable blind review'"
                :icon="mdiAccountCircle()"
                :active="isBlindReviewActive"
                :disabled="!isBlindReviewValid()"
                @clicked="catchBlindReviewClick()"
            />


        </v-col>
      </v-row>

      <v-row>
        <v-col :cols="12" :md="6">
          <v-text-field
              :label="labels.blindUrl"
              :readonly=true
              :hint="readOnlyHint('Blind Url of Dataset')"
              hide-details="auto"
              persistent-hint
              :error-messages="validationErrors.doi"
              :disabled="!isBlindReviewValid()"
              :prepend-icon="mdiLink"
              @input="validateProperty('blindUrl', $event)"
              :model-value="urlField"
              :append-icon="mdiContentCopy"
              @click:append="catchClipboardCopy"
          />

        </v-col>
        <v-col :cols="12" :md="6">
          <BaseRectangleButton
              :button-text=labels.buttonText
              :disabled="!isPreviewAvailable()"
              :loading="loading"
              @clicked="previewClicked" />
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
import {
  mdiEarth,
  mdiMessageDraw,
  mdiLink,
  mdiContentCopy,
  mdiCalendarRange,
  mdiArrowDownDropCircleOutline, mdiAccountCircle, mdiClose,
} from '@mdi/js';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import BaseIconSwitch from '@/components/BaseElements/BaseIconSwitch.vue'
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_PUBLICATION_INFO,
  eventBus,
} from '@/factories/eventBus';

import {
  getValidationMetadataEditingObject,
  isFieldValid, USER_ROLE_MEMBER,
} from '@/factories/userEditingValidations';

import {
  EDIT_METADATA_DOI_LABEL,
  PUBLICATION_STATE_RESERVED,
  PUBLICATION_STATE_PENDING,
  BLIND_REVIEW_ON, BLIND_REVIEW_OFF,
} from '@/factories/metadataConsts';


import { readOnlyHint, isFieldReadOnly } from '@/factories/globalMethods';
import {METADATAREVIEW_PATH} from '@/router/routeConsts';

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
    userRole: {
      type: String,
      default: USER_ROLE_MEMBER,
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
       default: undefined,// can be kept null
     },
  },
  mounted () {
    this.isBlindActive = this.isBlindReview;
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
      return this.isBlindReviewActive? this.generateBlindReviewUrl(): '';
    },
    isBlindReviewActive() {
      return this.isBlindActive === null? this.isBlindReview : this.isBlindActive;
    },

    validations() {
      return getValidationMetadataEditingObject(this.stepKey);
    },
    loadingBlindReview() {
      return false;
    },
  },
  watch: {
    isBlindReview(newVal) {
      this.isBlindActive = newVal;
    },
  },
  methods: {
    mdiClose() {
      return mdiClose
    },
    mdiAccountCircle() {
      return mdiAccountCircle
    },
    isReadOnly(dateProperty) {
      return isFieldReadOnly(this.$props, dateProperty);
    },
    readOnlyHint(dateProperty) {
      return readOnlyHint(this.$props, dateProperty);
    },
    validateProperty(property, value) {
      return isFieldValid(
          property,
          value,
          this.validations,
          this.validationErrors,
      );
    },
    isBlindReviewValid() {
      if (this.doi && this.allowedPublicationStates.includes(this.publicationState)) {
        return true;
      }
      return false;
    },
    isPreviewAvailable() {
      if (this.isBlindReviewValid() && this.urlField.length > 0) {
        return true;
      }
      return false;
    },
    catchBlindReviewClick() {
      if (this.isBlindReviewValid()) {
        this.isBlindActive = !this.isBlindActive;
        const value = this.isBlindActive? BLIND_REVIEW_ON : BLIND_REVIEW_OFF;
        this.changeBlindReviewStatus('version', value);
        this.generateBlindReviewUrl();
      }
    },
    generateBlindReviewUrl() {
      if (this.datasetId && this.isBlindReview) {
        this.blindUrl = `${this.ckanDomain}/#${METADATAREVIEW_PATH}/${this.datasetId}`;
      }
      else {
        this.blindUrl = '';
      }
      return this.blindUrl;
    },
    changeBlindReviewStatus(property, value) {
      const newBlindReviewInfo = {
        ...this.$props,
        [property]: value,
      };
      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_PUBLICATION_INFO,
        data: newBlindReviewInfo,
        property: property.toString(),
      });
    },
    catchClipboardCopy() {
      navigator.clipboard.writeText(this.urlField);
    },
    clearBlindReviewState() {
      this.isBlindActive = null;
    },
    previewClicked() {
      const url = this.blindUrl;
      window.open(url, '_blank');
    },
  },
  data: () => ({
    mdiLink,
    mdiEarth,
    mdiMessageDraw,
    mdiContentCopy,
    mdiCalendarRange,
    mdiArrowDownDropCircleOutline,
    previewPublisher: null,
    emptyEntry: {
      institution: '',
      grantNumber: '',
      institutionUrl: '',
    },
    labels: {
      cardTitle: 'Review Information',
      reviewState: 'Dataset blind-review type',
      blindUrl: 'Url to view blind-review dataset',
      dataObjectIdentifier: EDIT_METADATA_DOI_LABEL,
      instructions: 'DOI needs to be reserved to enable this feature',
      buttonText: 'Preview',
    },
    propertyValidationSuffix: 'Validation',
    // blindReviewMode: false,
    isBlindActive: null,
    // datasetId: null,
    allowedPublicationStates: [PUBLICATION_STATE_RESERVED, PUBLICATION_STATE_PENDING],
    ckanDomain: process.env.VITE_API_ROOT,

    validationErrors: {
      doi: null,
      blindUrl: null,
    },
    buttonColor: '#269697',
    previewYear: null,
    stepKey: EDITMETADATA_PUBLICATION_INFO,
  }),
  components: {
    BaseStatusLabelView,
    BaseIconSwitch,
    BaseRectangleButton,
  },
};
</script>

<style scoped></style>

<template>
  <v-card
    id="EditPublicationInfo"
    class="pa-0"
    max-width="100%"
    :loading="loading"
  >
    <v-container fluid class="pa-4">
      <template v-slot:progress>
        <v-progress-linear color="primary" indeterminate />
      </template>

      <v-row>
        <v-col cols="6" class="text-h5">
          {{ labels.cardTitle }}
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
        <v-col cols="6">
          {{ labels.visibilityState }}
        </v-col>

        <v-col cols="6">
          <MetadataStateChip :state="visibilityState" />
        </v-col>

      </v-row>

      <v-row class="pt-2">
        <v-col cols="4">
          <v-text-field
            :label="labels.dataObjectIdentifier"
            outlined
            :readonly="mixinMethods_isFieldReadOnly('doi')"
            :hint="mixinMethods_readOnlyHint('doi')"
            :error-messages="validationErrors.doi"
            prepend-icon="fingerprint"
            @change="doiField = $event"
            @input="validateProperty('doi', $event)"
            :value="doiField"
          />
        </v-col>

        <v-col class="flex-grow-0 pt-5">
          <BaseRectangleButton buttonText="Generate New DOI" :disabled="true" />
        </v-col>

        <v-col class="flex-grow-0 pt-6">
          <v-icon
            color="primary"
            style="animation: progress-circular-rotate 3s linear infinite"
            >settings</v-icon
          >
        </v-col>

        <v-col class=" pt-6">
          Generating DOI is under construction
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <v-text-field
            :label="labels.publisher"
            outlined
            :readonly="mixinMethods_isFieldReadOnly('publisher')"
            :hint="mixinMethods_readOnlyHint('publisher')"
            :error-messages="validationErrors.publisher"
            prepend-icon="public"
            @change="publisherField = $event"
            @input="validateProperty('publisher', $event)"
            :value="publisherField"
          />
        </v-col>

        <v-col cols="6">
          <v-select
            :items="yearList"
            outlined
            :label="labels.year"
            :error-messages="validationErrors.publicationYear"
            :readonly="mixinMethods_isFieldReadOnly('publicationYear')"
            :hint="mixinMethods_readOnlyHint('publicationYear')"
            prepend-icon="date_range"
            @change="publicationYearField = $event"
            @input="validateProperty('publicationYear', $event)"
            :value="publicationYearField"
          />
        </v-col>
      </v-row>

    </v-container>
  </v-card>
</template>

<script>
/**
 * @summary Shows Publication Information (publication state, DOI, publisher, and funding information)
 * @author Rebecca Kurup Buchholz
 * Created        : 2021-08-13
 * Last modified  : 2021-09-01 16:53:36
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mapState } from 'vuex';

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import MetadataStateChip from '@/components/Chips/MetadataStateChip.vue';

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_PUBLICATION_INFO,
  eventBus,
} from '@/factories/eventBus';

import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingValidations';

export default {
  name: 'EditPublicationInfo',
  created() {
    this.getCurrentYear();
    this.getYearList();
  },
  props: {
    publicationState: {
      type: String,
      default: '',
    },
    visibilityState: {
      type: String,
      default: '',
    },
    doi: {
      type: String,
      default: '',
    },
    publisher: {
      type: String,
      default: '',
    },
    publicationYear: {
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
  computed: {
    ...mapState(['config']),
    maxYears() {
      let maxYears = this.defaultUserEditMetadataConfig.publicationYearsList;

      if (this.$store) {
        maxYears =
          this.config?.userEditMetadataConfig?.publicationYearsList || maxYears;
      }

      return maxYears;
    },
    publicationStateField: {
      get() {
        return this.publicationState;
      },
      set(value) {
        const property = 'publicationState';

        if (this.validateProperty(property, value)) {
          this.setPublicationInfo(property, value);
        }
      },
    },
    doiField: {
      get() {
        return this.doi;
      },
      set(value) {
        const property = 'doi';

        if (this.validateProperty(property, value)) {
          this.setPublicationInfo(property, value);
        }
      },
    },
    publisherField: {
      get() {
        return this.previewPublisher !== null
          ? this.previewPublisher
          : this.publisher;
      },
      set(value) {
        this.previewPublisher = value;
        const property = 'publisher';

        if (this.validateProperty(property, value)) {
          this.setPublicationInfo(property, value);
        }
      },
    },
    publicationYearField: {
      get() {
        return this.publicationYear;
      },
      set(value) {
        const property = 'publicationYear';

        if (this.validateProperty(property, value)) {
          this.setPublicationInfo(property, value);
        }
      },
    },
    validations() {
      return getValidationMetadataEditingObject(this.stepKey);
    },
  },
  methods: {
    validateProperty(property, value) {
      return isFieldValid(
        property,
        value,
        this.validations,
        this.validationErrors,
      );
    },
    getCurrentYear() {
      const date = new Date();
      const year = date.getFullYear();
      this.currentYear = year.toString();
    },
    getYearList() {
      const date = new Date();
      let year = date.getFullYear();

      for (let i = 0; i < this.maxYears; i++) {
        this.yearList[i] = year.toString();
        year--;
      }
    },
    editEntry(array, index, property, value) {
      if (array.length <= index) {
        return;
      }

      const currentEntry = array[index];
      array[index] = {
        ...currentEntry,
        [property]: value,
      };
    },
    setPublicationInfo(property, value) {
      const newPublicationInfo = {
        ...this.$props,
        [property]: value,
      };

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: this.stepKey,
        data: newPublicationInfo,
        property: property.toString(),
      });
    },
  },
  data: () => ({
    previewPublisher: null,
    emptyEntry: {
      institution: '',
      grantNumber: '',
      institutionUrl: '',
    },
    labels: {
      cardTitle: 'Publication Information',
      publicationState: 'Publication State',
      visibilityState: 'Dataset visibility',
      dataObjectIdentifier: 'Data Object Identifier',
      publisher: 'Publisher',
      year: 'Year',
      fundingInformation: 'Funding Information',
      institution: 'Institution',
      grantNumber: 'Grant Number',
      institutionUrl: 'Link',
    },
    propertyValidationSuffix: 'Validation',
    validationErrors: {
      publicationState: null,
      doi: null,
      publisher: null,
      publicationYear: null,
    },
    dataIsValid: true,
    buttonColor: '#269697',
    currentYear: '',
    yearList: [],
    defaultUserEditMetadataConfig: {
      publicationYearsList: 30,
    },
    stepKey: EDITMETADATA_PUBLICATION_INFO,
  }),
  components: {
    BaseRectangleButton,
    BaseStatusLabelView,
    MetadataStateChip,
  },
};
</script>

<style scoped></style>

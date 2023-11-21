<template>
  <v-card
    id="EditPublicationInfo"
    class="pa-0"
    max-width="100%"
    :loading="loading"
  >
    <v-container fluid class="pa-4">
      <template slot="progress">
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


      <v-row class="pt-2">

        <v-col >
          <v-text-field
            :label="labels.dataObjectIdentifier"
            outlined
            dense
            readonly
            hint="DOI can be changed at the Dataset Publication Status"
            :error-messages="validationErrors.doi"
            prepend-icon="fingerprint"
            @change="doiField = $event"
            @input="validateProperty('doi', $event)"
            :value="doiField"
            append-icon="content_copy"  @click:append="catchClipboardCopy"
          />
<!--
          :hint="mixinMethods_readOnlyHint('doi')"
-->
        </v-col>

        <v-col>
          <v-autocomplete :value="visibilityState"
                          :items="[visibilityState]"
                          outlined
                          dense
                          chips
                          readonly
                          prepend-icon="remove_red_eye"
                          persistent-hint
                          :label="labels.visibilityState"
          >
            <template v-slot:selection="{ item }">
              <MetadataStateChip style="font-size: 12px;" :state="item" />
            </template>
          </v-autocomplete>

        </v-col>

      </v-row>

      <v-row>
        <v-col cols="6">
          <v-text-field
            :label="labels.publisher"
            outlined
            dense
            readonly
            hint="Publisher can't be changed"
            :error-messages="validationErrors.publisher"
            prepend-icon="public"
            @change="publisherField = $event"
            @input="validateProperty('publisher', $event)"
            :value="publisherField"
          />
<!--
          :readonly="mixinMethods_isFieldReadOnly('publisher')"
            :hint="mixinMethods_readOnlyHint('publisher')"
-->

        </v-col>

        <v-col cols="6">
          <v-select
            :items="yearList"
            outlined
            dense
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

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
// import MetadataStateChip from '@/components/Chips/MetadataStateChip.vue';

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_PUBLICATION_INFO,
  eventBus,
} from '@/factories/eventBus';

import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingValidations';
import { EDIT_METADATA_DOI_LABEL, EDIT_METADATA_PUBLICATION_YEAR_LABEL, PUBLICATION_STATE_PUBLISHED} from '@/factories/metadataConsts';

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
        return this.publicationState === PUBLICATION_STATE_PUBLISHED
          ? `https://www.doi.org/${this.doi}` : this.doi;
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
    catchClipboardCopy() {
      navigator.clipboard.writeText(this.doiField);
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
      dataObjectIdentifier: EDIT_METADATA_DOI_LABEL,
      publisher: 'Publisher',
      year: EDIT_METADATA_PUBLICATION_YEAR_LABEL,
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
    BaseStatusLabelView,
//    MetadataStateChip,
  },
};
</script>

<style scoped></style>

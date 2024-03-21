<template>
  <v-card
    id="EditPublicationInfo"
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


      <v-row class="pt-2">

        <v-col >
          <v-text-field
            :label="labels.dataObjectIdentifier"
            readonly
            hint="DOI can be changed at the Dataset Publication Status"
            :error-messages="validationErrors.doi"
            prepend-icon="fingerprint"
            @change="doiField = $event"
            @input="validateProperty('doi', $event)"
            :model-value="doiField"
            append-icon="content_copy"  @click:append="catchClipboardCopy"
          />

        </v-col>

        <v-col>
          <v-autocomplete :model-value="visibilityState"
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
            :model-value="publisherField"
          />

        </v-col>

        <v-col cols="6">
          <v-menu
              id="dateMenu"
              key="dateMenu"
              v-model="datePickerOpen"
              :close-on-content-click="true"
              transition="scale-transition"
              :left="$vuetify?.display?.smAndDown"
              :offset-y="$vuetify?.display?.mdAndUp"
              min-width="280px"
          >

            <template v-slot:activator="{ on }">
              <v-text-field
                  dense
                  outlined
                  prepend-icon="date_range"
                  v-on="on"
                  :model-value="publicationYearField"
              />
            </template>

            <v-date-picker
                ref="picker"
                :active-picker.sync="activePicker"
                next-icon="skip_next"
                prev-icon="skip_previous"
                no-title
                @click:year="saveYear"
                :model-value="formatToDatePickerDate(yearWithMonths)"
            >

            </v-date-picker>
          </v-menu>

        </v-col>
      </v-row>

    </v-container>
  </v-card>
</template>

<script>
/**
 * @summary Shows Publication Information (publication state, DOI, publisher, and funding information)
 * @author Rebecca Kurup Buchholz, Ranita Pal, Dominik Haas
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mapState } from 'vuex';

import {parse} from 'date-fns';
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
import {
  EDIT_METADATA_DOI_LABEL,
  EDIT_METADATA_PUBLICATION_YEAR_LABEL,
  PUBLICATION_STATE_PUBLISHED,
} from '@/factories/metadataConsts';
import { ckanDateFormat } from '@/factories/mappingFactory';

export default {
  name: 'EditPublicationInfo',
  created() {
    const date = new Date();
    const year = date.getFullYear();
    this.currentYear = this.formatToDatePickerDate(`${year}-12-31`);
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
  mounted () {
    if (this.publicationYearField) {
      const yearFullFormat = `${this.publicationYearField}-12-31`
      this.yearWithMonths = this.formatToDatePickerDate(yearFullFormat)
    } else {
      this.yearWithMonths = this.currentYear;
    }
  },
  computed: {
    ...mapState(['config']),
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }

      return undefined;
    },
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
        return this.previewYear !== null
            ? this.previewYear
            : this.publicationYear;
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
    saveYear(year) {
      this.previewYear = year.toString()
      this.publicationYearField = year.toString()
    },
    formatToDatePickerDate(dateString) {
      if (!dateString) {
        return '';
      }

      const dateTime = parse(dateString, ckanDateFormat, new Date());

      if (dateTime instanceof Date && !!dateTime.getTime()) {
        const date = new Date(dateTime - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10);
        return date;
      }

      return '';
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
    previewYear: null,
    datePickerOpen: false,
    yearWithMonths: null,
    defaultUserEditMetadataConfig: {
      publicationYearsList: 30,
    },
    stepKey: EDITMETADATA_PUBLICATION_INFO,
    activePicker: 'YEAR',
  }),
  watch: {
    datePickerOpen(val) {
      if (val) {
        // assign the activePicker after a delay so it goes into effect
        // when the datepicker is active
        setTimeout(() => {
          this.activePicker = 'YEAR';
        }, 100);
      }
    },
  },
  components: {
    BaseStatusLabelView,
    MetadataStateChip,
  },
};
</script>

<style scoped></style>

<script setup>
</script>

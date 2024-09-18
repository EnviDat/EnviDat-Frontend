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
            :prepend-icon="mdiFingerprint"
            @change="doiField = $event"
            @input="validateProperty('doi', $event)"
            :model-value="doiField"
            :append-icon="mdiContentCopy"
            @click:append="catchClipboardCopy"
          />

        </v-col>

        <v-col>
          <v-autocomplete :model-value="visibilityState"
                          :items="[possibleVisibilityStates]"
                          readonly
                          :prepend-icon="mdiEye"
                          :menu-icon="mdiArrowDownDropCircleOutline"
                          persistent-hint
                          :label="labels.visibilityState"
          >
            <template v-slot:selection="{ item }">
              <MetadataStateChip style="font-size: 12px;" :state="item.value" />
            </template>
          </v-autocomplete>

        </v-col>

      </v-row>

      <v-row>
        <v-col cols="6">
          <v-text-field
            :label="labels.publisher"
            readonly
            hint="Publisher can't be changed"
            :error-messages="validationErrors.publisher"
            :prepend-icon="mdiEarth"
            @change="publisherField = $event"
            @input="validateProperty('publisher', $event)"
            :model-value="publisherField"
          />

        </v-col>

        <v-col cols="6">
          <v-menu
              id="dateMenu"
              key="dateMenu"
              :close-on-content-click="true"
              transition="scale-transition"
              :left="$vuetify?.display?.smAndDown"
              :offset-y="$vuetify?.display?.mdAndUp"
              min-width="280px"
          >

            <template v-slot:activator="{ props }">
              <v-text-field
                  :prepend-icon="mdiCalendarRange"
                  v-bind="props"
                  :model-value="publicationYearField"
              />
            </template>

            <v-date-picker
                ref="picker"
                view-mode="year"
                color="secondary"
                no-title
                :year='publicationYearField'
                @update:year="saveYear"
            >
              <template #title
                        v-if="publicationYearField">
                {{ publicationYearField }}
              </template>
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

import {
  mdiEarth,
  mdiEye,
  mdiFingerprint,
  mdiContentCopy,
  mdiCalendarRange,
  mdiArrowDownDropCircleOutline,
} from '@mdi/js';

import {possibleVisibilityStates} from '@/factories/metaDataFactory';

export default {
  name: 'EditPublicationInfo',
  created() {
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
      default: undefined,
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

    if (this.publicationYear) {
      this.previewYear = this.publicationYear;
    } else {
      this.previewYear = null;
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
        const yearString = this.previewYear !== null ? this.previewYear : this.publicationYear;
        if (yearString) {
          return Number.parseInt(yearString, 10);
        }

        return undefined
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
      const yearString = year.toString();
      this.previewYear = yearString;
      this.publicationYearField = yearString;
    },
  },
  data: () => ({
    possibleVisibilityStates,
    mdiFingerprint,
    mdiEarth,
    mdiEye,
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
      cardTitle: 'Publication Information',
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
      doi: null,
      publisher: null,
      publicationYear: null,
    },
    buttonColor: '#269697',
    previewYear: null,
    stepKey: EDITMETADATA_PUBLICATION_INFO,
  }),
  components: {
    BaseStatusLabelView,
    MetadataStateChip,
  },
};
</script>

<style scoped></style>

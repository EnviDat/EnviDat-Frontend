<template>
  <v-card id="EditFunding" class="pa-0" max-width="100%" :loading="loading">

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
        <v-col cols="12">
          <div class="text-subtitle-1">{{ labels.fundingInformation }}</div>
        </v-col>
      </v-row>

      <v-card flat max-height="350px" max-width="1200px" class="overflow-auto">
        <v-row
          v-for="(item, index) in previewFundersAndEmpty"
          :key="`${item}_${index}`"
          :class="index === 0 ? 'mt-2' : 'py-0'"
          no-gutters
        >
          <v-col cols="4" class="pr-2">
            <v-text-field
              :label="labels.institution"
              :readonly="isFieldReadOnly(INSTITUTION)"
              :hint="readOnlyHint(INSTITUTION)"
              :model-value="item.institution"
              :error-messages="getValidationErrorMessage(INSTITUTION, index)"
              @keyup="onKeyUp"
              @change="onChange(index, INSTITUTION, $event.target.value)"
            />
          </v-col>

          <v-col cols="3" class="px-2">
            <v-text-field
              :label="labels.grantNumber"
              :readonly="isFieldReadOnly(GRANTNUMBER)"
              :hint="readOnlyHint(GRANTNUMBER)"
              :model-value="item.grantNumber"
              :error-messages="getValidationErrorMessage(GRANTNUMBER, index)"
              @keyup="onKeyUp"
              @change="onChange(index, GRANTNUMBER, $event.target.value)"
            />
          </v-col>

          <v-col class="flex-grow-1 pl-2">
            <v-text-field
              :label="labels.institutionUrl"
              :readonly="isFieldReadOnly(INSTITUTION_URL)"
              :hint="readOnlyHint(INSTITUTION_URL)"
              :model-value="item.institutionUrl"
              :error-messages="getValidationErrorMessage(INSTITUTION_URL, index)"
              @keyup="onKeyUp"
              @change="onChange(index, INSTITUTION_URL, $event.target.value)"
            />
          </v-col>

          <v-col class="flex-grow-0 px-1">
            <BaseIconButton
              :icon="mdiMinusCircleOutline"
              icon-color="red"
              :disabled="index >= previewFundersAndEmpty.length - 1"
              @clicked="deleteFundersEntry(index)"
            />
          </v-col>
        </v-row>
      </v-card>

      <v-row v-if="validationErrors.fundersArray" no-gutters>
        <v-col cols="12">
          <div class="text-subtitle-2">
            <span class="text-red">{{ validationErrors.fundersArray }}</span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * @summary Shows Funding Information
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_FUNDING_INFO,
  eventBus,
} from '@/factories/eventBus';
import { isObjectEmpty } from '@/factories/userEditingFactory';
import {
  getValidationMetadataEditingObject,
  isArrayContentValid,
  isFieldValid,
} from '@/factories/userEditingValidations';

import { isFieldReadOnly, readOnlyHint } from '@/factories/globalMethods';
import { mdiMinusCircleOutline } from '@mdi/js';

const INSTITUTION = 'institution';
const GRANTNUMBER = 'grantNumber';
const INSTITUTION_URL = 'institutionUrl';

export default {
  name: 'EditFunding',
  props: {
    funders: {
      type: Array,
      default: () => [],
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
  mounted() {
    if (this.funders.length > 0) {
      for (let i = 0; i < this.funders.length; i++) {
        this.validate(i, INSTITUTION);
        this.validate(i, GRANTNUMBER);
        this.validate(i, INSTITUTION_URL);
      }
    }
  },
  watch: {
    funders: {
      immediate: true,
      handler(newData) {
        this.previewFunders = newData;
      },
    },
  },
  computed: {
    previewFundersAndEmpty() {
      // Check if the last entry has an error and prevent the new entry to be shown
      const lastEntry = this.validationErrors.funders[
        this.validationErrors.funders.length - 1
      ];
      const entryIsValid = !Object.values(lastEntry ?? {}).find(
        i => i !== '' && i !== null && i !== undefined,
      );
      if (entryIsValid) {
        return [...this.previewFunders, this.emptyEntry];
      }
      return [...this.previewFunders];
    },
    validations() {
      return getValidationMetadataEditingObject(this.stepKey);
    },
  },
  methods: {
    isFieldReadOnly,
    setFundersInfo(property, value) {
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
    /** Validates all entries or a specific property */
    validate(index = undefined, property = undefined) {
      // Keep the validation object in sync
      const sizeDiff =
        this.previewFunders.length - this.validationErrors.funders.length;
      for (let i = 0; i < sizeDiff; i += 1) {
        this.validationErrors.funders.push({ ...this.emptyEntry });
      }
      // Validate entire array (cases like min/max entries)
      if (index === undefined && !property) {
        return isFieldValid(
          'funders',
          this.previewFunders,
          this.validations,
          this.validationErrors,
          'fundersArray',
        );
      }
      if (index >= 0 && property) {
        // Validate a single entry and prop
        const errorArray = this.validationErrors.funders;
        return isArrayContentValid(
          this.previewFunders,
          'funders',
          index,
          property,
          this.validations,
          errorArray,
        );
      }
      throw new Error('Unable to validate EditFunding');
    },
    deleteFundersEntry(index) {
      // If two entries with the same data exist, the UI does not update accordingly
      // This is due to the key in the v-for not being able to differentiate
      // and then it doesn't clean up correctly
      this.previewFunders.splice(index, 1);
      this.validationErrors.funders.splice(index, 1);
      if (this.validate()) {
        this.setFundersInfo('funders', this.previewFunders);
      }
    },
    onKeyUp(keyboardEvent) {
      if (keyboardEvent.key === 'Enter') {
        keyboardEvent.target.blur();
      }
    },
    onChange(index, property, value) {
      if (index === this.previewFunders.length) {
        // The last UI entry is a special case,
        // it does not exist in the data until the user enters something
        this.previewFunders.push({ ...this.emptyEntry, [property]: value });
      }
      const entry = this.previewFunders[index];
      entry[property] = value;

      if (isObjectEmpty(entry)) {
        // Remove entry since it's empty
        this.deleteFundersEntry(index);
      } else if (this.validate(index, property) && this.validate()) {
        this.setFundersInfo('funders', this.previewFunders);
      }
    },
    getValidationErrorMessage(property, index) {
      return this.validationErrors?.funders[index]?.[property] || '';
    },
    isReadOnly(dateProperty) {
      return isFieldReadOnly(this.$props, dateProperty);
    },
    readOnlyHint(dateProperty) {
      return readOnlyHint(this.$props, dateProperty);
    },
  },
  data: () => ({
    mdiMinusCircleOutline,
    INSTITUTION,
    GRANTNUMBER,
    INSTITUTION_URL,
    emptyEntry: {
      institution: '',
      grantNumber: '',
      institutionUrl: '',
    },
    previewFunders: [],
    labels: {
      cardTitle: 'Funding Information',
      fundingInformation:
        'Provide information about who funded the research efforts.',
      institution: 'Institution',
      grantNumber: 'Grant Number',
      institutionUrl: 'Link',
    },
    validationErrors: {
      funders: [
        {
          institution: '',
          grantNumber: '',
          institutionUrl: '',
        },
      ],
      fundersArray: null,
    },
    stepKey: EDITMETADATA_FUNDING_INFO,
  }),
  components: {
    BaseStatusLabelView,
    BaseIconButton,
  },
};
</script>

<style scoped></style>

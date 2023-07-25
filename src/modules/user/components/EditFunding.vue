<template>
  <v-card
    id="EditFunding"
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

      <v-row>
        <v-col cols="12">
          <div class="text-subtitle-1">{{ labels.fundingInformation }}</div>
        </v-col>
      </v-row>

      <v-row
        v-for="(item, index) in fundersField"
        :key="`${item}_${index}`"
        :class="index === 0 ? 'pt-4' : 'py-1'"
        no-gutters
      >
        <v-col cols="4" class="pr-2">
          <v-text-field
            :label="labels.institution"
            outlined
            dense
            :readonly="mixinMethods_isFieldReadOnly(INSTITUTION)"
            :hint="mixinMethods_readOnlyHint(INSTITUTION)"
            :value="item.institution"
            :error-messages="getValidationErrorMessage(INSTITUTION, index)"
            @change="notifyChange(index, INSTITUTION, $event)"
          />
        </v-col>

        <v-col cols="3" class="px-2">
          <v-text-field
            :label="labels.grantNumber"
            outlined
            dense
            :readonly="mixinMethods_isFieldReadOnly(GRANTNUMBER)"
            :hint="mixinMethods_readOnlyHint(GRANTNUMBER)"
            :value="item.grantNumber"
            :error-messages="getValidationErrorMessage(GRANTNUMBER, index)"
            @change="notifyChange(index, GRANTNUMBER, $event)"
          />
        </v-col>

        <v-col class="grow pl-2">
          <v-text-field
            :label="labels.institutionUrl"
            outlined
            dense
            :readonly="mixinMethods_isFieldReadOnly(INSTITUTION_URL)"
            :hint="mixinMethods_readOnlyHint(INSTITUTION_URL)"
            :value="item.institutionUrl"
            :error-messages="getValidationErrorMessage(INSTITUTION_URL, index)"
            @change="notifyChange(index, INSTITUTION_URL, $event)"
          />
        </v-col>

        <v-col class="shrink px-1">
          <BaseIconButton
            material-icon-name="clear"
            icon-color="red"
            :disabled="index >= fundersField.length - 1"
            @clicked="deleteFundersEntry(index)"
          />
        </v-col>
      </v-row>

      <v-row v-if="validationErrors.fundersArray" no-gutters>
        <v-col cols="12">
          <div class="text-subtitle-2">
            <span class="red--text">{{ validationErrors.fundersArray }}</span>
          </div>
        </v-col>
      </v-row>

      <!--
      <v-row >

        <v-col cols="3">
          <div :style="`border-radius: 50%; width: 30px; height: 30px; background-color: ${ dataIsValid ? 'green' : 'red' };`"
                />
        </v-col>
        <v-col cols="3">
          <v-btn @click="saveData()">save</v-btn>
        </v-col>

      </v-row>
-->
    </v-container>
  </v-card>
</template>

<script>
/**
 * @summary Shows Funding Information
 * @author Dominik Haas-Artho
 * Created        : 2023-01-17
 * Last modified  : 2023-01-17 16:53:36
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mapState } from 'vuex';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_FUNDING_INFO,
  eventBus,
} from '@/factories/eventBus';
import {
  deleteEmptyObject,
  isMaxLength,
  isObjectEmpty,
} from '@/factories/userEditingFactory';
import {
  getValidationMetadataEditingObject,
  isArrayContentValid,
  isFieldValid,
} from '@/factories/userEditingValidations';

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
  computed: {
    ...mapState(['config']),
    maxFunders() {
      let max = this.defaultUserEditMetadataConfig.publicationMaxFunders;

      if (this.$store) {
        max = this.config?.userEditMetadataConfig?.publicationMaxFunders || max;
      }

      return max;
    },
    fundersField: {
      get() {
        let funders = [...this.funders];

        if (funders.length <= 0) {
          // const emptyCopy = {...this.emptyEntry};
          funders = [{ ...this.emptyEntry }];

          // const errorsEmptyCopy = {...this.emptyEntry};
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.validationErrors.funders = [{ ...this.emptyEntry }];
        } else {
          this.addFunderObj(funders);
        }

        return funders;
      },
    },
    maxFundersMessage() {
      return `Maximum number of funders: ${this.maxFunders}. Please contact the EnviDat support team if you have additional funders.`;
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
    addFunderObj(localfunders) {
      // Assign lastFunder to last item in this.funderArray
      const lastFunder = localfunders[localfunders.length - 1];

      // Assign lastFunderInstitution to value of institution key in lastFunder
      const lastFunderInstitution = lastFunder.institution;

      // If lastFunderInstitution is an empty string then assign addFunder to false
      let addFunder = true;
      if (lastFunderInstitution === '') {
        addFunder = false;
      }

      // If addFunder is true and length of funderArray is less than maxFunders then push new funder object to funderArray
      // Else if funderArray is greater than or equal to maxFunders then assign maxFundersReached to true
      // Else it funderArray is less than maxFunders then assign maxFundersReached to false
      if (addFunder && localfunders.length < this.maxFunders) {
        localfunders.push({ ...this.emptyEntry });

        const sizeDiff =
          localfunders.length - this.validationErrors.funders.length;

        for (let i = 0; i < sizeDiff; i++) {
          this.validationErrors.funders.push({ ...this.emptyEntry });
        }
      }
    },
    removeUnusedFundersEntry(localfunders) {
      const lastFunder = localfunders[localfunders.length - 1];

      // Assign isEmpty to true if all values in lastFunder are null or empty strings, else assign isEmpty to false
      const isEmpty = isObjectEmpty(lastFunder);

      // If isEmpty is true and localfunders has at least one item then remove last element of array
      if (isEmpty && localfunders.length > 0) {
        localfunders.pop();
      }
    },
    editFundersEntry(array, index, property, value) {
      if (array.length <= index) {
        return;
      }

      const currentEntry = array[index];
      array[index] = {
        ...currentEntry,
        [property]: value,
      };
    },
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
    deleteFundersEntry(index) {
      const localCopy = [...this.fundersField];
      const errorArray = this.validationErrors.funders;

      if (localCopy.length > 1) {
        localCopy.splice(index, 1);
      }

      // the last entry is always unused, removed it before saving
      this.removeUnusedFundersEntry(localCopy);

      const arrayIsValid = isFieldValid(
        'funders',
        localCopy,
        this.validations,
        this.validationErrors,
        'fundersArray',
      );

      if (arrayIsValid) {
        //        if (deleted || !deleted && isArrayValid(localCopy, 'funders', index, property, this.validations, errorArray)) {
        this.setFundersInfo('funders', localCopy);

        if (errorArray.length > 1) {
          errorArray.splice(index, 1);
        }
      }
    },
    notifyChange(index, property, value) {
      const localCopy = [...this.fundersField];
      const errorArray = this.validationErrors.funders;

      this.editFundersEntry(localCopy, index, property, value);

      const deleted = deleteEmptyObject(index, localCopy);

      // the last entry is always unused, removed it before saving
      this.removeUnusedFundersEntry(localCopy);

      let arrayIsValid = false;
      if (deleted) {
        arrayIsValid = isFieldValid(
          'funders',
          localCopy,
          this.validations,
          this.validationErrors,
          'fundersArray',
        );
      } else {
        arrayIsValid = isArrayContentValid(
          localCopy,
          'funders',
          index,
          property,
          this.validations,
          errorArray,
        );
      }

      if (arrayIsValid) {
        this.setFundersInfo('funders', localCopy);

        if (deleted) {
          // delete also from the errorArray to keep the arrays in sync
          if (errorArray.length > 1) {
            errorArray.splice(index, 1);
          }
        }
      }

      if (isMaxLength(this.maxFunders, localCopy)) {
        this.validationErrors.fundersArray = this.maxFundersMessage;
      }
    },
    getValidationErrorMessage(property, index) {
      return this.validationErrors?.funders[index][property] || '';
    },
  },
  data: () => ({
    INSTITUTION,
    GRANTNUMBER,
    INSTITUTION_URL,
    emptyEntry: {
      institution: '',
      grantNumber: '',
      institutionUrl: '',
    },
    labels: {
      cardTitle: 'Funding Information',
      fundingInformation: 'Provide information about who funded the research efforts.',
      institution: 'Institution',
      grantNumber: 'Grant Number',
      institutionUrl: 'Link',
    },
    fundersValidation: '',
    propertyValidationSuffix: 'Validation',
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
    dataIsValid: true,
    buttonColor: '#269697',
    defaultUserEditMetadataConfig: {
      publicationMaxFunders: 5,
    },
    stepKey: EDITMETADATA_FUNDING_INFO,
  }),
  components: {
    BaseStatusLabelView,
  },
};
</script>

<style scoped></style>

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

      <v-card flat max-height="350px" class="overflow-auto">
        <v-row
          v-for="(item, index) in previewFundersAndEmpty"
          :key="`${item}_${index}`"
          :class="index === 0 ? 'pt-2' : 'py-0'"
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
              @keyup="blurOnEnterKey"
              @change="onChange(index, INSTITUTION, $event)"
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
              @keyup="blurOnEnterKey"
              @change="onChange(index, GRANTNUMBER, $event)"
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
              @keyup="blurOnEnterKey"
              @change="onChange(index, INSTITUTION_URL, $event)"
            />
          </v-col>

          <v-col class="shrink px-1">
            <BaseIconButton
              material-icon-name="clear"
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
            <span class="red--text">{{ validationErrors.fundersArray }}</span>
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
 * Created        : 2023-01-17
 * Last modified  : 2023-01-17 16:53:36
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_FUNDING_INFO,
  eventBus,
} from '@/factories/eventBus';
import {
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
  watch: {
    funders: {
      immediate: true,
      handler(newData, oldData) {
        this.previewFunders = [...newData] ?? [];
        // Clean slate since the state would not be synced otherwise
        this.validationErrors.funders = [];
        this.validationErrors.fundersArray = null;
        for(let i = 0; i < this.previewFunders.length + 1; i += 1) {
          this.validationErrors.funders.push({ ...this.emptyEntry });
        }
      },
    },
  },
  computed: {
    previewFundersAndEmpty() {
      return [...this.previewFunders, this.emptyEntry];
    },
    validations() {
      return getValidationMetadataEditingObject(this.stepKey);
    },
  },
  methods: {
    blurOnEnterKey(keyboardEvent) {
      if (keyboardEvent.key === 'Enter') {
        keyboardEvent.target.blur();
      }
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
    /** Validates all entries or a specific property */
    validate(index = undefined, property = undefined) {
      // Validate entire array (cases like min/max entries)
      if(index === undefined && !property) {
        return isFieldValid(
          'funders',
          this.previewFunders,
          this.validations,
          this.validationErrors,
          'fundersArray',
        );
      } 
      if(index >= 0 && property) {
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
      if (this.previewFunders.length <= 1) {
        return;
      }

      const errorArray = this.validationErrors.funders;
      this.previewFunders.splice(index, 1);
      errorArray.splice(index, 1);
      
      if (this.validate()) {
        this.setFundersInfo('funders', this.previewFunders);
      }
    },
    onChange(index, property, value) {

      if(index === this.previewFunders.length){
        // The last UI entry is a special case,
        // it does not exist in the data until the user enters something
        this.previewFunders.push({...this.emptyEntry, [property]: value});
        this.validationErrors.funders.push({...this.emptyEntry});
      }

      const entry = this.previewFunders[index];
      // TODO: Bind this properly no need for custom code
      entry[property] = value;

      if(isObjectEmpty(entry)) {
        // Remove entry since it's empty
        this.deleteFundersEntry(index);
      } else if ( this.validate(index, property)) {
        this.setFundersInfo('funders', this.previewFunders);
      }
    },
    getValidationErrorMessage(property, index) {
      return this.validationErrors?.funders[index]?.[property] || '';
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
    previewFunders: [],
    labels: {
      cardTitle: 'Funding Information',
      fundingInformation: 'Provide information about who funded the research efforts.',
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
  },
};
</script>

<style scoped></style>

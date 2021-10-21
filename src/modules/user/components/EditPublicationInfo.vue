<template>
  <v-card id="EditPublicationInfo"
          class="pa-4"
          max-width="100%">

    <v-container fluid
                  class="pa-0" >

      <v-row>

        <v-col cols="12">
          <div class="text-h5">{{ labels.cardTitle }}</div>
        </v-col>

      </v-row>


      <v-row>

        <v-col cols="6">
          <v-text-field :label="labels.publicationState"
                        outlined
                        readonly
                        :error-messages="validationErrors.publicationState"
                        v-model="publicationStateField" />
        </v-col>

      </v-row>


      <v-row>

        <v-col cols="6">
          <v-text-field :label="labels.dataObjectIdentifier"
                        outlined
                        :error-messages="validationErrors.doi"
                        prepend-icon="fingerprint"
                        v-model="doiField" />
        </v-col>

        <v-col cols="6">
          <v-btn        :label="labels.dataObjectIdentifier"
                        elevation="2"
                        depressed
                        class="text-none"
                        :color="buttonColor"
                        disabled
                        v-on:click="generateNewDoi"
                       >
          Generate New DOI
          </v-btn>
        </v-col>

      </v-row>


      <v-row>

        <v-col cols="6">
          <v-text-field :label="labels.publisher"
                        outlined
                        required
                        :error-messages="validationErrors.publisher"
                        prepend-icon="public"
                        v-model="publisherField" />
        </v-col>

        <v-col cols="6">
          <v-select :items="yearList"
                    outlined
                    :label="labels.year"
                    :error-messages="validationErrors.publicationYear"
                    required
                    prepend-icon="date_range"
                    v-model="publicationYearField"
                    />
        </v-col>

      </v-row>


      <v-row>

        <v-col cols="12">
          <div class="text-subtitle-1">{{ labels.fundingInformation }}</div>
        </v-col>

      </v-row>


      <v-row v-for="(item, index) in fundersField"
            :key="`${item}_${index}`">

            <v-col cols="4" >
              <v-text-field :label="labels.organization"
                            outlined
                            :value="item.organization"
                            :error-messages="validationErrors.funders[index].organization"
                            @input="notifyChange(index, 'organization', $event)" />

            </v-col>
            <v-col cols="4" >
              <v-text-field :label="labels.grantNumber"
                            outlined
                            :value="item.grantNumber"
                            :error-messages="validationErrors.funders[index].grantNumber"
                            @input="notifyChange(index, 'grantNumber', $event)" />
            </v-col>
            <v-col cols="4">
              <v-text-field :label="labels.link"
                            outlined
                            :value="item.link"
                            :error-messages="validationErrors.funders[index].link"
                            @input="notifyChange(index, 'link', $event)" />
            </v-col>

      </v-row>


      <v-row v-if="validationErrors.fundersArray">

        <v-col cols="12">
          <div class="text-subtitle-2"><span class="red--text">{{ validationErrors.fundersArray }}</span></div>
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
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_PUBLICATION_INFO,
  eventBus,
} from '@/factories/eventBus';

import {
  isObjectEmpty,
  deleteEmptyObject,
  isMaxLength,
} from '@/factories/userEditingFactory';

import { validationMixin } from 'vuelidate';
import {
  required,
  minLength,
  url,
} from 'vuelidate/lib/validators';

import { mapState } from 'vuex';


export default {
  name: 'EditPublicationInfo',
  created() {
    this.getCurrentYear();
    this.getYearslist();
  },
  props: {
    publicationState: {
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
    funders: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState([
      'config',
    ]),
    maxFunders() {
      return this.config?.userEditMetadataConfig.publicationMaxFunders || this.defaultUserEditMetadataConfig.publicationMaxFunders;
    },
    maxYears() {
      return this.config?.userEditMetadataConfig.publicationYearsList || this.defaultUserEditMetadataConfig.publicationYearsList;
    },
    publicationStateField: {
      get() {
        return this.publicationState;
      },
      set(value) {
        this.setPublicationInfo('publicationState', value);
      },
    },
    doiField: {
      get() {
        return this.doi;
      },
      set(value) {
        const property = 'doi';

        if (!this.isFieldValid(property, value, this.propertyValidationSuffix)) {
          if (this.$v[`${property}${this.propertyValidationSuffix}`].minLength === false) {
            this.validationErrors[property] = `${property} must have at least ${this.$v[`${property}${this.propertyValidationSuffix}`].$params.minLength.min}`;
          }
          return;
        }

        this.validationErrors[property] = '';

        this.setPublicationInfo(property, value);
      },
    },
    publisherField: {
      get() {
        return this.publisher;
      },
      set(value) {
        const property = 'publisher';

        if (!this.isFieldValid(property, value, this.propertyValidationSuffix)) {
          if (!this.$v[`${property}${this.propertyValidationSuffix}`].minLength === false) {
            this.validationErrors[property] = `${property} must have at least ${this.$v[`${property}${this.propertyValidationSuffix}`].$params.minLength.min}`;
          }
          return;
        }

        this.validationErrors[property] = '';

        this.setPublicationInfo(property, value);
      },
    },
    publicationYearField: {
      get() {
        // TODO get this.currentYear to display in publicationYear dropdown
        // TODO maybe implement rules to make publicationYear required
        return this.publicationYear;
      },
      set(value) {
        this.setPublicationInfo('publicationYear', value);
      },
    },
    fundersField: {
      get() {
        let funders = [...this.funders];

        if (funders.length <= 0) {
          funders = [{
            organization: '',
            grantNumber: '',
            link: '',
          }];
        } else {
          this.addFunderObj(funders);
        }

        return funders;
        // return this.mixinMethods_getGenericProp('funders', this.funderArray);
      },
      // set(value) {
      //   this.setPublicationInfo('funders', value);
      // },
    },
    maxFundersMessage() {
      return `Maximum number of funders: ${this.maxFunders}. Please contact the EnviDat support team if you have additional funders.`;
    },
  },
  methods: {
    generateNewDoi() {
      // TODO write or import code to generate new DOI
    },
    getCurrentYear() {
      const date = new Date();
      const year = date.getFullYear();
      this.currentYear = year.toString();
    },
    getYearslist() {

      const date = new Date();
      let year = date.getFullYear();

      for (let i = 0; i < 30; i++) {
        this.yearList[i] = year.toString();
        year--;
      }
    },
    addFunderObj(localFunders) {

      // Assign lastFunder to last item in this.funderArray
      const lastFunder = localFunders[localFunders.length - 1];

      // Assign lastFunderOrganization to value of organization key in lastFunder
      const lastFunderOrganization = lastFunder.organization;

      // If lastFunderOrganization is an empty string then assign addFunder to false
      let addFunder = true;
      if (lastFunderOrganization === '') {
        addFunder = false;
      }

      // If addFunder is true and length of funderArray is less than maxFunders then push new funder object to funderArray
      // Else if funderArray is greater than or equal to maxFunders then assign maxFundersReached to true
      // Else it funderArray is less than maxFunders then assign maxFundersReached to false
      if (addFunder && localFunders.length < this.maxFunders) {
        localFunders.push(
          {
            organization: '',
            grantNumber: '',
            link: '',
          },
        );
        this.validationErrors.funders.push(
          {
            organization: '',
            grantNumber: '',
            link: '',
          },
        );
      }
    },
    // Assign localFunders to a copy of funderArray with last empty funder object removed
    removeUsedEntry(localFunders) {

      const lastFunder = localFunders[localFunders.length - 1];

       // Assign isEmpty to true if all values in lastFunder are null or empty strings, else assign isEmpty to false
      const isEmpty = isObjectEmpty(lastFunder);

      // If isEmpty is true and localFunders has at least one item then remove last element of array
      if (isEmpty && localFunders.length > 0) {
        localFunders.pop();
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
    isArrayValid(array, arrayProperty, index, valueProptery, propertyValidationSuffix = 'Validation') {
      const propertyString = `${arrayProperty}${propertyValidationSuffix}`;

      this.$set(this, propertyString, array);

      const vuelidateObj = this.$v[propertyString];

      vuelidateObj.$touch();

      if (vuelidateObj.$error && !vuelidateObj.minLength) {
        this.validationErrors.fundersArray = `At least ${this.$v[`${arrayProperty}${this.propertyValidationSuffix}`].$params.minLength.min} of funders has to be defined`;
        return false;
      }

      this.validationErrors.fundersArray = null;

      const vuelidateValueObj = this.$v[propertyString].$each[index][valueProptery];

      let errorMsg = '';
      if (vuelidateValueObj.$error) {
        if (vuelidateValueObj.required === false) {
        errorMsg = `${valueProptery} is required`;
        }

        if (vuelidateValueObj.minLength === false) {
          errorMsg = `${valueProptery} must have at least ${vuelidateValueObj.$params.minLength.min}`;
        }

        if (vuelidateValueObj.url === false) {
          errorMsg = `${valueProptery} must be a url`;
        }
      }

      const errorArray = this.validationErrors[arrayProperty];
      if (errorArray[index] !== null){
        errorArray[index][valueProptery] = errorMsg;
      }

      this.$set(this.validationErrors, arrayProperty, errorArray);

      return !vuelidateObj.$invalid;
    },
    isFieldValid(property, value, propertyValidationSuffix = 'Validation', checkRequired = true) {
      const propertyString = `${property}${propertyValidationSuffix}`;
      this[propertyString] = value;
      this.$v[propertyString].$touch();

      if (checkRequired && this.$v[propertyString].$error && !this.$v[propertyString].required) {
        this.validationErrors[property] = `${property} is required`;
      }

      return !this.$v[propertyString].$invalid;
    },
    setPublicationInfo(property, value) {

      const newPublicationInfo = {
        ...this.$props,
        [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_PUBLICATION_INFO,
        data: newPublicationInfo,
      });
    },
    notifyChange(index, property, value) {

      const localyCopy = [...this.fundersField];

      this.editEntry(localyCopy, index, property, value);

      deleteEmptyObject(index, localyCopy);

      this.removeUsedEntry(localyCopy);

      if (this.isArrayValid(localyCopy, 'funders', index, property)) {
        this.setPublicationInfo('funders', localyCopy);
      }

      if (isMaxLength(this.maxFunders, localyCopy)) {
        this.validationErrors.fundersArray = this.maxFundersMessage;
      }
    },
  },
  validations: {
    publicationStateValidation: {
      required,
    },
    doiValidation: {
      required,
      minLength: minLength(3),
    },
    publisherValidation: {
      required,
      minLength: minLength(3),
    },
    publicationYearValidation: {
      required,
    },
    fundersValidation: {
      required,
      minLength: minLength(1),
      $each: {
        organization: {
          required,
          minLength: minLength(3),
        },
        grantNumber: {
          minLength: minLength(3),
        },
        link: {
          url,
        },
      },
    },
  },
  data: () => ({
    labels: {
      cardTitle: 'Publication Info',
      publicationState: 'Publication State',
      dataObjectIdentifier: 'Data Object Identifier',
      publisher: 'Publisher',
      year: 'Year',
      fundingInformation: 'Funding Information',
      organization: 'Organization',
      grantNumber: 'Grant Number',
      link: 'Link',
    },
    publicationStateValidation: '',
    doiValidation: '',
    publisherValidation: '',
    publicationYearValidation: '',
    fundersValidation: '',
    propertyValidationSuffix: 'Validation',
    validationErrors: {
      publicationState: null,
      doi: null,
      publisher: null,
      publicationYear: null,
      funders: [{
        organization: '',
        grantNumber: '',
        link: '',
      }],
      fundersArray: null,
    },
    buttonColor: '#269697',
    rulesPublisher: [v => !!v || 'Publisher is required'],
    currentYear: '',
    yearList: [],
    defaultUserEditMetadataConfig: {
      publicationMaxFunders: 5,
      publicationYearsList: 30,
    },
  }),
  mixins: [validationMixin],
  components: {
  },
};

</script>

<style scoped>
</style>

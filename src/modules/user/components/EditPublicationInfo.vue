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
          <BaseRectangleButton buttonText="Generate New DOI"
                               :disabled="true" />
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
            :key="`${item}_${index}`"
             :class="index === 0 ? 'pt-4' : 'py-1'"
            no-gutters>

            <v-col cols="4"
                   class="pr-2" >
              <v-text-field :label="labels.institution"
                            outlined
                            dense
                            :value="item.institution"
                            :error-messages="validationErrors.funders[index].institution"
                            @input="notifyChange(index, 'institution', $event)" />

            </v-col>
            <v-col cols="4"
                   class="px-2" >
              <v-text-field :label="labels.grantNumber"
                            outlined
                            dense
                            :value="item.grantNumber"
                            :error-messages="validationErrors.funders[index].grantNumber"
                            @input="notifyChange(index, 'grantNumber', $event)" />
            </v-col>
            <v-col cols="4"
                   class="pl-2">
              <v-text-field :label="labels.institutionUrl"
                            outlined
                            dense
                            :value="item.institutionUrl"
                            :error-messages="validationErrors.funders[index].institutionUrl"
                            @input="notifyChange(index, 'institutionUrl', $event)" />
            </v-col>

      </v-row>


      <v-row v-if="validationErrors.fundersArray">

        <v-col cols="12">
          <div class="text-subtitle-2"><span class="red--text">{{ validationErrors.fundersArray }}</span></div>
        </v-col>

      </v-row>

<!--
      <v-row >

        <v-col cols="3">
          <div :style="`border-radius: 50%; width: 30px; height: 30px; background-color: ${ dataIsValid ? 'green' : 'red' };`"
                />
        </v-col>
        <v-col cols="3">
          <v-btn @click="validateData()">validate</v-btn>
        </v-col>

      </v-row>
-->


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
  isArrayValid,
  isFieldValid,
  getValidationMetadataEditingObject,
} from '@/factories/userEditingFactory';

import { mapState } from 'vuex';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';

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

        if (isFieldValid(property, value, this.validations, this.validationErrors)) {
          this.setPublicationInfo(property, value);
        }

      },
    },
    publisherField: {
      get() {
        return this.publisher;
      },
      set(value) {
        const property = 'publisher';

        if (isFieldValid(property, value, this.validations, this.validationErrors)) {
          this.setPublicationInfo(property, value);
        }
      },
    },
    publicationYearField: {
      get() {
        // TODO get this.currentYear to display in publicationYear dropdown
        // TODO maybe implement rules to make publicationYear required
        return this.publicationYear;
      },
      set(value) {
        const property = 'publicationYear';

        if (isFieldValid(property, value, this.validations, this.validationErrors)) {
          this.setPublicationInfo(property, value);
        }
      },
    },
    fundersField: {
      get() {
        let funders = [...this.funders];

        if (funders.length <= 0) {
          // const emptyCopy = {...this.emptyEntry};
          funders = [{...this.emptyEntry}];

          // const errorsEmptyCopy = {...this.emptyEntry};
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.validationErrors.funders = [{...this.emptyEntry}];
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
      return getValidationMetadataEditingObject(EDITMETADATA_PUBLICATION_INFO);
    },
  },
  methods: {
/*
    validateData() {
      try {

        const validateData = this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_PUBLICATION_INFO);

        this.validations.validateSync(validateData);

      } catch (e) {
        console.error(`Got validation Error ${e}`);

        this.validationErrors[e.params.path] = e.message;
        this.dataIsValid = false;
        return;
      }

      this.dataIsValid = true;
    },
*/
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
      if (addFunder && localFunders.length < this.maxFunders) {
        localFunders.push({...this.emptyEntry});

        const sizeDiff = localFunders.length - this.validationErrors.funders.length;

        for (let i = 0; i < sizeDiff; i++) {
          this.validationErrors.funders.push({...this.emptyEntry});
        }
      }
    },
    removeUnusedEntry(localFunders) {

      const lastFunder = localFunders[localFunders.length - 1];

       // Assign isEmpty to true if all values in lastFunder are null or empty strings, else assign isEmpty to false
      const isEmpty = isObjectEmpty(lastFunder);

      // If isEmpty is true and localFunders has at least one item then remove last element of array
      if (isEmpty && localFunders.length > 0) {
        localFunders.pop();
        this.validationErrors.funders.pop();
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

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_PUBLICATION_INFO,
        data: newPublicationInfo,
      });
    },
    notifyChange(index, property, value) {

      const localyCopy = [...this.fundersField];
      const errorArray = this.validationErrors.funders;

      this.editEntry(localyCopy, index, property, value);

      const deleted = deleteEmptyObject(index, localyCopy);
      if (deleted) {
        // delete also from the errorArray to keep the arrays in sync
        deleteEmptyObject(index, errorArray);
      }

      // the last entry is always unused, removed it before saving
      this.removeUnusedEntry(localyCopy);

      if (deleted || !deleted && isArrayValid(localyCopy, 'funders', index, property, this.validations, errorArray)) {
        this.setPublicationInfo('funders', localyCopy);
      }

      if (isMaxLength(this.maxFunders, localyCopy)) {
        this.validationErrors.fundersArray = this.maxFundersMessage;
      }
    },
  },
  data: () => ({
    emptyEntry: {
      institution: '',
      grantNumber: '',
      institutionUrl: '',
    },
    labels: {
      cardTitle: 'Publication Info',
      publicationState: 'Publication State',
      dataObjectIdentifier: 'Data Object Identifier',
      publisher: 'Publisher',
      year: 'Year',
      fundingInformation: 'Funding Information',
      institution: 'Institution',
      grantNumber: 'Grant Number',
      institutionUrl: 'Link',
    },
    fundersValidation: '',
    propertyValidationSuffix: 'Validation',
    validationErrors: {
      publicationState: null,
      doi: null,
      publisher: null,
      publicationYear: null,
      funders: [{
        institution: '',
        grantNumber: '',
        institutionUrl: '',
      }],
      fundersArray: null,
    },
    dataIsValid: true,
    buttonColor: '#269697',
    currentYear: '',
    yearList: [],
    defaultUserEditMetadataConfig: {
      publicationMaxFunders: 5,
      publicationYearsList: 30,
    },
  }),
  components: {
    BaseRectangleButton,
  },
};

</script>

<style scoped>
</style>

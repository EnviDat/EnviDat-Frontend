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
                        required
                        readonly
                        v-model="publicationState" />
        </v-col>

      </v-row>


      <v-row>

        <v-col cols="6">
          <v-text-field :label="labels.dataObjectIdentifier"
                        outlined
                        prepend-icon="fingerprint"
                        v-model="doi" />
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
                        :rules="rulesPublisher"
                        v-model="publisher" />
        </v-col>

        <v-col cols="6">
          <v-select :items="yearList"
                    outlined
                    :label="labels.year"
                    required
                    v-model="publicationYear"
                    />
        </v-col>

      </v-row>


      <v-row>

        <v-col cols="12">
          <div class="text-subtitle-1">{{ labels.fundingInformation }}</div>
        </v-col>

      </v-row>


      <v-row v-for="(item, index) in funders"
            :key="`${item}_${index}`">

            <v-col cols="4" >
              <v-text-field :label="labels.organization"
                            outlined
                            v-model="item.organization"
                           @input="notifyChange(index)" >
              </v-text-field>
            </v-col>
            <v-col cols="4" >
              <v-text-field :label="labels.grantNumber"
                            outlined
                            v-model="item.grantNumber"
                            @input="notifyChange(index)"
                            />
            </v-col>
            <v-col cols="4">
              <v-text-field :label="labels.link"
                            outlined
                            v-model="item.link"
                            @input="notifyChange(index)"
                            />
            </v-col>

      </v-row>


      <v-row v-if="maxFundersReached">

        <v-col cols="12">
          <div class="text-subtitle-2"><span class="red--text">{{ this.maxFundersMessage }}</span></div>
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

export default {
  name: 'EditPublicationInfo',
  created() {
    this.getCurrentYear();
    this.getYearslist();
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
    buttonColor: '#269697',
    rulesPublisher: [v => !!v || 'Publisher is required'],
    currentYear: '',
    yearList: [],
    maxFunders: 5,
    maxFundersReached: false,
  }),
  props: {
    genericProps: Object,
  },
  computed: {
    publicationState: {
      get() {
        return this.mixinMethods_getGenericProp('publicationState', 'Draft');
      },
      set(value) {
        this.setPublicationInfo('publicationState', value);
      },
    },
    doi: {
      get() {
        return this.mixinMethods_getGenericProp('doi', '');
      },
      set(value) {
        this.setPublicationInfo('doi', value);
      },
    },
    publisher: {
      get() {
        return this.mixinMethods_getGenericProp('publisher', '');
      },
      set(value) {
        this.setPublicationInfo('publisher', value);
      },
    },
    publicationYear: {
      get() {
        // TODO get this.currentYear to display in publicationYear dropdown
        // TODO maybe implement rules to make publicationYear required
        return this.mixinMethods_getGenericProp('publicationYear', this.currentYear);
      },
      set(value) {
        this.setPublicationInfo('publicationYear', value);
      },
    },
    funders: {
      get() {
        let funders = this.mixinMethods_getGenericProp('funders', []);

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
        this.yearList[i] = year;
        this.yearList[i].toString();
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
      } else if (addFunder && localFunders.length >= this.maxFunders) {
          this.maxFundersReached = true;
      } else if (localFunders.length < this.maxFunders) {
          this.maxFundersReached = false;
      }
    },
    deleteEmptyFunderObj(index, localFunders) {

      // Assign funderObj to object currently receiving input in localFunders
      const funderObj = localFunders[index];

      // TODO extract isEmpty to another function
      // Assign isEmpty to true if all values in funderObj are null or empty strings
      const isEmpty = Object.values(funderObj).every(x => (x === null || x === ''));

      // If isEmpty is true and localFunders has more than one item then remove item at current index
      if (isEmpty && localFunders.length > 1) {
        localFunders.splice(index, 1);
      }

    },
    // Assign localFunders to a copy of funderArray with last empty funder object removed
    copyFunderArray(localFunders) {

      const lastFunder = localFunders[localFunders.length - 1];

       // Assign isEmpty to true if all values in lastFunder are null or empty strings
      const isEmpty = Object.values(lastFunder).every(x => (x === null || x === ''));

      // If isEmpty is true and localFunders has at least one item then remove last element of array
      if (isEmpty && localFunders.length > 0) {
        localFunders.pop();
      }

      // Emit localFunders to eventBus
      this.setPublicationInfo('funders', localFunders);

    },
    setPublicationInfo(property, value) {
      const newPublicationInfo = {
        ...this.genericProps,
        [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_PUBLICATION_INFO,
        data: newPublicationInfo,
      });
    },
    notifyChange(index) {
      const localyCopy = [...this.funders];

      this.deleteEmptyFunderObj(index, localyCopy);

      this.copyFunderArray(localyCopy);
    },
  },
  components: {
  },
};
</script>

<style scoped>
</style>

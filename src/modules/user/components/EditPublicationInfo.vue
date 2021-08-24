<template>
  <v-card id="EditPublicationInfo"
          class="pa-4"
          max-width="50%">

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
                        v-model="dataObectIdentifier" />                        
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
          <v-select
            :items="yearList"
            outlined
            :label="labels.year"
            required
            v-model="publicationYear"
          ></v-select>              
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
 >
              </v-text-field>
            </v-col>
            <v-col cols="4"> 
              <v-text-field :label="labels.link" 
                            outlined 
                            v-model="item.link"
                            @input="notifyChange(index)"
 >
              </v-text-field>
            </v-col>
       
      </v-row>   

    </v-container>
  </v-card>  

</template>

<script>

/**
 * @summary Shows the Publication Information (publication state, DOI, publisher, and funding information)
 * @author Rebecca Kurup Buchholz
 * Created        : 2021-08-13
 * Last modified  : 2021-08-16
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
    funderArray: [
      {
        organization: '', 
        grantNumber: '',
        link: '',
      },
    ],
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
    dataObectIdentifier: {
      get() {
        return this.mixinMethods_getGenericProp('dataObectIdentifier', '');
      },
      set(value) {
        this.setPublicationInfo('dataObectIdentifier', value);
      },
    },
    publisher: {
      get() {
        return this.mixinMethods_getGenericProp('publisher', 'WSL');
      },
      set(value) {
        this.setPublicationInfo('publisher', value);
      },
    },
    publicationYear: {
      get() {
        // TODO get this.currentYear to display in publicationYear dropdown
        // TODO implement rules to make publicationYear required
        return this.mixinMethods_getGenericProp('publicationYear', this.currentYear);
      },
      set(value) {
        this.setPublicationInfo('publicationYear', value);
      },
    },  
    funders: {
      get() {
        return this.mixinMethods_getGenericProp('funders', this.funderArray);
      },
      set(value) {
        this.setPublicationInfo('funders', value);
      },
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
    addFunderObj() {
      
      // Assign lastFunder to last item in this.funderArray 
      const lastFunder = this.funderArray[this.funderArray.length - 1];
      
      // Assign lastFunderValue to values in lastFunder object
      // const lastFunderValues = Object.values(lastFunder);
           
      // If lastFunderValues has any empty strings then assign addFunder to false
      // let addFunder = true;
      // for (let i = 0; i < lastFunderValues.length; i++) {
      //   if (lastFunderValues[i] === '') {
      //     addFunder = false;
      //     break;
      //   } 
      // }

      // Assign lastFunderOrganization to value of organization key in lastFunder
      const lastFunderOrganization = lastFunder.organization;

      // If lastFunderOrganization is an empty string then assign addFunder to false
      let addFunder = true;
      if (lastFunderOrganization === '') {
        addFunder = false;
      }

      // If addFunder is true and length of funderArray is less than this.maxFunders then push new funder object to funderArray
      if (addFunder && this.funderArray.length < this.maxFunders) {
        this.funderArray.push(
          {
            organization: '', 
            grantNumber: '',
            link: '',
          },
        );
      }
            
    },
    deleteEmptyFunderObj(index) {

      // Assign funderObj to object currently receiving input in this.funderArray
      const funderObj = this.funderArray[index];
      
      // Assign isEmpty to true if all values in funderObj are null or empty strings
      const isEmpty = Object.values(funderObj).every(x => (x === null || x === ''));
      
      // If isEmpty is true and this.funderArray has more than one item then remove item at current index
      if (isEmpty && this.funderArray.length > 1) {
        this.funderArray.splice(index, 1);
      }

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
      // TODO 
      // 1. move funderArray to data
      // 2. initial funderArray with one empty funder object
      // 3. @notifyChange check if all properties filled out then add a new empty funder object to funderArray
      // 4. check if index is smaller than funder maximum 5 (make sure to define as property) 
      // 5. check if empty content at the end then add new row
      // 6. only delete last row if empty
      
      this.addFunderObj();
            
      this.deleteEmptyFunderObj(index);
      
      this.addFunderObj();


      // TODO check if eventBus needs to be updated
      // TODO send to eventBus a copy of this.funderArray that has at least a value for 'organization' key
      // eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
      //   object: EDITMETADATA_PUBLICATION_INFO,
      //   data: this.funderArray,
      // });
    },
  },
  components: {
  },  
};
</script>

<style scoped>
</style>

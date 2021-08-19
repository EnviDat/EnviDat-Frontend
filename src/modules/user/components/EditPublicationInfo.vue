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


      <v-row v-for="(item, index) in customFundersList" 
            :key="`${item}_${index}`">

        <!-- <div v-if="showFunderRow(index)"> -->

          <!-- <v-row v-for="(item, itemIndex) in funder"
                  :key="`${item}_${itemIndex}`"> -->

            <v-col cols="4" >
              <v-text-field :label="labels.organization"
                            outlined
                            v-model="item.organization"
                           @input="notifyChange($event, 'organization', index)" >
              </v-text-field>
            </v-col>
            <v-col cols="4" > 
              <v-text-field :label="labels.grantNumber" 
                            outlined 
                            v-model="item.grantNumber"
                            @input="notifyChange($event, 'grantNumber', index)"
 >
              </v-text-field>
            </v-col>
            <v-col cols="4"> 
              <v-text-field :label="labels.link" 
                            outlined 
                            v-model="item.link"
                            @input="notifyChange($event, 'link', index)"
 >
              </v-text-field>
            </v-col>
          <!-- </v-row> -->
        <!-- </div> -->

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
  EDITMETADATA_CUSTOMFIELDS,
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
  }),
  props: {
    genericProps: Object, 
    // funderList: {
    //   type: Array,
    //   default: () => [
    //       { 
    //         funder0: { 
    //           organization: '', 
    //           grantNumber: '',
    //           link: '',
    //         },
    //       },
    //       {
    //         funder1: {
    //           organization: '',
    //           grantNumber: '',
    //           link: '',
    //         },
    //       },
    //       { 
    //         funder2: { 
    //           organization: '', 
    //           grantNumber: '',
    //           link: '',
    //         },
    //       },
    //       {
    //         funder3: {
    //           organization: '',
    //           grantNumber: '',
    //           link: '',
    //         },
    //       },
    //        { 
    //         funder4: { 
    //           organization: '', 
    //           grantNumber: '',
    //           link: '',
    //         },
    //       },
    //       {
    //         funder5: {
    //           organization: '',
    //           grantNumber: '',
    //           link: '',
    //         },
    //       },
    //     ],
    // },
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
    funderList: {
      get() { 
        return this.mixinMethods_getGenericProp('funderList', this.funderListEmpty);
      },
      set(value) {
        this.setPublicationInfo('funderList', value);
      },
    },
    funderListEmpty() {
      return [
         { 
            // funder0: { 
              organization: '', 
              grantNumber: '',
              link: '',
            // },
          },
          {
            // funder1: {
              organization: '',
              grantNumber: '',
              link: '',
            // },
          },
          {
            // funder1: {
              organization: '',
              grantNumber: '',
              link: '',
            // },
          },
          // { 
          //   funder2: { 
          //     organization: '', 
          //     grantNumber: '',
          //     link: '',
          //   },
          // },
          // {
          //   funder3: {
          //     organization: '',
          //     grantNumber: '',
          //     link: '',
          //   },
          // },
          //  { 
          //   funder4: { 
          //     organization: '', 
          //     grantNumber: '',
          //     link: '',
          //   },
          // },
          // {
          //   funder5: {
          //     organization: '',
          //     grantNumber: '',
          //     link: '',
          //   },
          // },
      ];
    },
    customFundersList() {
      if (this.funderList?.length === 0) {
        return [
          { 
            field0: { 
              fieldName: '', 
              content: '',
            },
          },
          {
            field1: {
              fieldName: '',
              content: '',
            },
          },
        ];
      }

      return this.funderList;
    },
  },
  methods: {
    setPublicationInfo(property, value) {
      const newPublicationInfo = {
          ...this.funderList,
          [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
          object: EDITMETADATA_PUBLICATION_INFO,
          data: newPublicationInfo,
        });
    },
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
      
      for (let i = 0; i < 10; i++) {
        this.yearList[i] = year;
        this.yearList[i].toString();
        year--;
      }
    },
    showFunderRow(index) {
      
      // Show first two field rows      
      if (index < 2) {
        return true;
      }

      // Assign funderObj with values for one funder before current iteration in this.customFundersList if index is not less than 2
      const previousIndex = index - 1;
      const funderObj = Object.values(this.customFundersList[previousIndex]);
      
      // Assign funderObj values to variables
      const funderObjOrganization = funderObj[0].organization;
      const funderObjGrantNum = funderObj[0].grantNumber;
      const funderObjLink = funderObj[0].link;
     
      // If one funder row before current iteration is not empty show next funder row
      if (funderObjOrganization !== '' && funderObjGrantNum !== '' && funderObjLink !== '') {
        return true;
      }

      // Else do not show field
      return false;
    },
    notifyChange(value, property, index) {
      // TODO 
      // 1. move funderArray to data
      // 2. initial funderList with one empty funder object
      // 3. @notifyChange check if all properties filled out then add a new empty funder object to funderArray
      // 4. check if index is smaller than funder maximum 5 (make sure to define as property) 
      // 5. check if empty content at the end then add new row
      // 6. only delete last row if empty
      console.log(value);
      console.log(property);
      console.log(index);
      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_CUSTOMFIELDS,
        data: this.funderList,
      });
    },
  },
  components: {
  },  
};
</script>

<style scoped>
</style>

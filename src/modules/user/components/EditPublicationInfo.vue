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
          ></v-select>              
        </v-col>

      </v-row>


      <div v-for="(field, index) in customFieldsList" 
            :key="`${field}_${index}`">

        <div v-if="showFieldRow(index)">

          <v-row v-for="(item, itemIndex) in field"
                  :key="`${item}_${itemIndex}`">

            <v-col cols="6" >
              <v-text-field :label="labelFieldName"
                            outlined
                            v-model="item.fieldName"
                            @input="notifyChange" >
              </v-text-field>
            </v-col>
            <v-col cols="6" > 
              <v-text-field :label="labelContent" 
                            outlined 
                            v-model="item.content"
                            @input="notifyChange" >
              </v-text-field>
            </v-col>
          </v-row>
        </div>
      </div>   

    </v-container>
  </v-card>  

</template>

<script>

/**
 * @summary Shows the Publication Info (publication state, DOI, publisher, and funding information)
 * @author Rebecca Kurup Buchholz
 * Created at     : 2021-08-13
 * Last modified  : 2021-08-13
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
    this.getYearslist();
  },
  data: () => ({
    labels: {
      cardTitle: 'Publication Info',
      publicationState: 'Publication State',
      dataObjectIdentifier: 'Data Object Identifier',
      publisher: 'Publisher',
      year: 'Year',
    },
    buttonColor: '#269697',   
    rulesPublisher: [v => !!v || 'Publisher is required'], 
    yearList: [],
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
   

    customFieldsList() {
      if (this.genericProps?.length === 0) {
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

      return this.genericProps;
    },
  },
  methods: {
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
    generateNewDoi() {
      // TODO write code to generate new DOI
    },
    // getYearList() {
    //   this.yearList[0] = '2020';
    //   this.yearList[1] = '2018';
    // },
    getYearslist() {
      this.yearList[0] = '2021';
      this.yearList[1] = '20211';
      console.log(this.yearList);
    },


    showFieldRow(index) {

      // Show first two field rows      
      if (index < 2) {
        return true;
      }

      // Assign field object with values for one field before current iteration in this.customFieldsList if index is not less than 2
      const previousIndex = index - 1;
      const fieldObj = Object.values(this.customFieldsList[previousIndex]);
      
      // Assign field object's fieldName and content to variables
      const fieldObjName = fieldObj[0].fieldName;
      const fieldObjContent = fieldObj[0].content;
     
      // If one field before current iteration is not empty show next field
      if (fieldObjName !== '' && fieldObjContent !== '') {
        return true;
      }

      // Else do not show field
      return false;
    },
    notifyChange() {
      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_CUSTOMFIELDS,
        data: this.genericProps,
      });
    },
  },
  components: {
  },  
};
</script>

<style scoped>
</style>

<template>
  <v-card id="EditCustomFields"
          class="pa-4"
          max-width="50%">

    <v-container fluid
                  class="pa-0" >

      <v-row>

        <v-col cols="12"> 
          <div class="text-h5">{{ cardTitle }}</div>
        </v-col>

      </v-row>  


      <v-row>

        <v-col cols="12"> 
          <div class="text-body-1">{{ cardInstructions }}</div>
        </v-col>

      </v-row>


      <v-row v-for="(item, index) in customFields"  
          :key="`${item}_${index}`">

        <v-col cols="6" >
          <v-text-field :label="labelFieldName"
                        outlined
                        v-model="item.fieldName"
                        @input="notifyChange(index)" >
          </v-text-field>
        </v-col>
        <v-col cols="6" > 
          <v-text-field :label="labelContent" 
                        outlined 
                        v-model="item.content"
                        @input="notifyChange(index)" >
          </v-text-field>
        </v-col>
      </v-row>


      <v-row v-if="maxCustomFieldsReached">

        <v-col cols="12"> 
          <div class="text-subtitle-2"><span class="red--text">{{ this.maxCustomFieldsMessage }}</span></div>
        </v-col>

      </v-row>


    </v-container>
  </v-card>  

</template>

<script>

/**
 * @summary shows the custom field names and contents
 * @author Rebecca Kurup Buchholz
 * Created at     : 2021-07-05
 * Last modified  : 2021-08-31
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_CUSTOMFIELDS,
  eventBus,
} from '@/factories/eventBus';

export default {
  name: 'EditCustomFields',
  data: () => ({
    maxCustomFields: 10,
    maxCustomFieldsReached: false,
    customFieldsArray: [
      {
        fieldName: '', 
        content: '',
      },
    ],
    filledCustomFieldsArray: [],
  }),
  props: {  
    genericProps: Object,  
  },
  computed: {
    cardTitle: {
      get() {
        return this.mixinMethods_getGenericProp('cardTitle', 'Custom Fields');
      },
      set(value) {
        this.setCustomFields('publicationState', value);
      },
    },
    cardInstructions: {
      get() {
        return this.mixinMethods_getGenericProp('cardInstructions', 'Advance custom data fields (optional)');
      },
      set(value) {
        this.setCustomFields('cardInstructions', value);
      },
    },
    labelFieldName: {
      get() {
        return this.mixinMethods_getGenericProp('labelFieldName', 'Field Name');
      },
      set(value) {
        this.setCustomFields('labelFieldName', value);
      },
    },
    labelContent: {
      get() {
        return this.mixinMethods_getGenericProp('labelContent', 'Content');
      },
      set(value) {
        this.setCustomFields('labelContent', value);
      },
    },
    customFields: {
      get() {
        return this.mixinMethods_getGenericProp('customFields', this.customFieldsArray);
      },
      set(value) {
        this.setCustomFields('customFields', value);
      },
    },
    maxCustomFieldsMessage() {
      return `Maximum number of custom fields: ${this.maxCustomFields}. Please contact the EnviDat support team if you need additional custom fields.`; 
    },
  },
  methods: {
     addCustomFieldObj() {
      
      // Assign lastCustomField to last item in customFieldsArray
      const lastCustomFieldObj = this.customFieldsArray[this.customFieldsArray.length - 1];

      // Assign variables to lastCustomFieldObj properties
      const lastCustomFieldName = lastCustomFieldObj.fieldName;
      const lastCustomFieldContent = lastCustomFieldObj.content;
     
      // If fieldName or content of lastCustomFieldObj are empty strings then assign addCustomField to false
      let addCustomField = true;
      if (lastCustomFieldName === '' || lastCustomFieldContent === '') {
        addCustomField = false;
      }
      
      // If addCustomField is true and length of customFieldsArray is less than maxCustomFields then push new custom field object to customFieldsArray
      // Else if addCustomField is true and customFieldsArray is greater than or equal to maxCustomFields then assign maxCustomFieldsReached to true
      // Else if customFieldsArray is less than maxCustomFields then assign maxCustomFieldsReached to false
      if (addCustomField && this.customFieldsArray.length < this.maxCustomFields) {
        this.customFieldsArray.push(
          {
            fieldName: '', 
            content: '',
          },
        );
      } else if (addCustomField && this.customFieldsArray.length >= this.maxCustomFields) {
          this.maxCustomFieldsReached = true;
      } else if (this.customFieldsArray.length < this.maxCustomFields) {
          this.maxCustomFieldsReached = false;
      }        
    },
    deleteEmptyCustomFieldObj(index) {

      // Assign customFieldObj to object currently receiving input in customFieldsArray
      const customFieldObj = this.customFieldsArray[index];
      
      // Assign isEmpty to true if all values in customFieldObj are null or empty strings
      const isEmpty = Object.values(customFieldObj).every(x => (x === null || x === ''));
      
      // If isEmpty is true and customFieldsArray has more than one item then remove item at current index
      if (isEmpty && this.customFieldsArray.length > 1) {
        this.customFieldsArray.splice(index, 1);
      }

    },
     // Assign filledCustomFieldsArray to a copy of customFieldsArray with last empty custom field object removed
     // Emit filledCustomFieldsArray to eventBus
    copyCustomFieldsArray() {

       // Assign filledCustomFieldsArray to a copy of customFieldsArray
      this.filledCustomFieldsArray = [...this.customFieldsArray];

      const lastCustomField = this.filledCustomFieldsArray[this.filledCustomFieldsArray.length - 1];

       // Assign isEmpty to true if all values in lastCustomField are null or empty strings
      const isEmpty = Object.values(lastCustomField).every(x => (x === null || x === ''));

      // If isEmpty is true and filledCustomFieldsArray has at least one item then remove last element of array
      if (isEmpty && this.filledCustomFieldsArray.length > 0) {
        this.filledCustomFieldsArray.pop();
      }

      this.setCustomFields('filledCustomFields', this.filledCustomFieldsArray);

    },
    setCustomFields(property, value) {
      const newCustomFields = {
          ...this.genericProps,
          [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
          object: EDITMETADATA_CUSTOMFIELDS,
          data: newCustomFields,
        });
    },
    notifyChange(index) {
    
      this.addCustomFieldObj();
          
      this.deleteEmptyCustomFieldObj(index);
    
      this.addCustomFieldObj();

      this.copyCustomFieldsArray();

    },
  },
  components: {
  },  
};
</script>

<style scoped>
</style>

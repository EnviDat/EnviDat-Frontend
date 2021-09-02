<template>
  <v-card id="EditCustomFields"
          class="pa-4" >

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
                        hide-details
                        v-model="item.fieldName"
                        @input="notifyChange(index)" >
          </v-text-field>
        </v-col>
        <v-col cols="6" > 
          <v-text-field :label="labelContent" 
                        outlined 
                        hide-details
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
 * Last modified  : 2021-09-01 17:52:29
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
  }),
  props: {  
    genericProps: Object,
  },
  computed: {
    cardTitle: {
      get() {
        return this.mixinMethods_getGenericProp('cardTitle', 'Custom Fields');
      },
    },
    cardInstructions: {
      get() {
        return this.mixinMethods_getGenericProp('cardInstructions', 'Advance custom data fields (optional)');
      },
    },
    labelFieldName: {
      get() {
        return this.mixinMethods_getGenericProp('labelFieldName', 'Field Name');
      },
    },
    labelContent: {
      get() {
        return this.mixinMethods_getGenericProp('labelContent', 'Content');
      },
    },
    customFields: {
      get() {
        let fields = this.mixinMethods_getGenericProp('customFields', []);

        if (fields.length <= 0) {
          fields = [{
            fieldName: '', 
            content: '',
          }];
        } else {
          this.addCustomFieldObj(fields);
        }

        return fields;
      },
    },
    maxCustomFieldsMessage() {
      return `Maximum number of custom fields: ${this.maxCustomFields}. Please contact the EnviDat support team if you need additional custom fields.`; 
    },
  },
  methods: {
     addCustomFieldObj(localFields) {
      
      // Assign lastCustomField to last item in localFields
      const lastCustomFieldObj = localFields[localFields.length - 1];

      // Assign variables to lastCustomFieldObj properties
      const lastCustomFieldName = lastCustomFieldObj.fieldName;
      const lastCustomFieldContent = lastCustomFieldObj.content;
     
      // If fieldName or content of lastCustomFieldObj are empty strings then assign addCustomField to false
      let addCustomField = true;
      if (lastCustomFieldName === '' || lastCustomFieldContent === '') {
        addCustomField = false;
      }
      
      // If addCustomField is true and length of localFields is less than maxCustomFields then push new custom field object to customFieldsArray
      // Else if addCustomField is true and localFields is greater than or equal to maxCustomFields then assign maxCustomFieldsReached to true
      // Else if localFields is less than maxCustomFields then assign maxCustomFieldsReached to false
      if (addCustomField && localFields.length < this.maxCustomFields) {
        localFields.push({
          fieldName: '', 
          content: '',
        });
      } else if (addCustomField && localFields.length >= this.maxCustomFields) {
          this.maxCustomFieldsReached = true;
      } else if (localFields.length < this.maxCustomFields) {
          this.maxCustomFieldsReached = false;
      }        
    },
    deleteEmptyCustomFieldObj(index, localFields) {

      // Assign customFieldObj to object currently receiving input in customFieldsArray
      const customFieldObj = localFields[index];
      
      // Assign isEmpty to true if all values in customFieldObj are null or empty strings
      const isEmpty = Object.values(customFieldObj).every(x => (x === null || x === ''));
      
      // If isEmpty is true and customFieldsArray has more than one item then remove item at current index
      if (isEmpty && localFields.length > 1) {
        localFields.splice(index, 1);
      }

    },
     // Assign filledCustomFieldsArray to a copy of customFieldsArray with last empty custom field object removed
     // Emit filledCustomFieldsArray to eventBus
    copyCustomFieldsArray(localFields) {

      const lastCustomField = localFields[localFields.length - 1];

       // Assign isEmpty to true if all values in lastCustomField are null or empty strings
      const isEmpty = Object.values(lastCustomField).every(x => (x === null || x === ''));

      // If isEmpty is true and filledCustomFieldsArray has at least one item then remove last element of array
      if (isEmpty && localFields.length > 0) {
        localFields.pop();
      }

      this.setCustomFields(localFields);

    },
    setCustomFields(value) {
      const newCustomFields = {
          ...this.genericProps,
          customFields: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_CUSTOMFIELDS,
        data: newCustomFields,
      });
    },
    notifyChange(index) {
      const localyCopy = [...this.customFields];
    
      this.deleteEmptyCustomFieldObj(index, localyCopy);
    
      this.copyCustomFieldsArray(localyCopy);
    },
  },
  components: {
  },  
};
</script>

<style scoped>
</style>

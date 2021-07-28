<template>
  <v-card id="EditCustomFields" max-width="25%">

    <v-container fluid >

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
 * @summary shows the custom field names and contents
 * @author Rebecca Kurup Buchholz
 * Created at     : 2021-07-05
 * Last modified  : 2021-07-28 10:35:28
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
  props: {  
    cardTitle: { 
      type: String, 
      default: 'Custom Fields',
    },  
    cardInstructions: { 
      type: String, 
      default: 'Advance custom data fields',
    },
    labelFieldName: { 
      type: String, 
      default: 'Field Name',
    },
    labelContent: {
      type: String,
      default: 'Content',
    },
    genericProps: {
      type: Array,
      default: () => [
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
        {
          field2: {
            fieldName: '',
            content: '',
          },
        },
        {
          field3: {
            fieldName: '',
            content: '',
          },
        },
        {
          field4: {
            fieldName: '',
            content: '',
          },
        },
      ],
    },
  },
  computed: {
    customFieldsList() {
      return this.genericProps;
    },
  },
  methods: {
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
  data: () => ({
   }),
  components: {
  },  
};
</script>

<style scoped>
</style>

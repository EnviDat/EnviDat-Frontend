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


      <!-- <div v-for="(field, index) in customFields" 
            :key="`${field}_${index}`"> -->

        <!-- <div v-if="showFieldRow(index)"> -->
<!-- 
          TODO make customFields appear again -->

          <v-row v-for="(item, index) in customFields"  
              :key="`${item}_${index}`">

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
        <!-- </div> -->
      <!-- </div>    -->

    </v-container>
  </v-card>  

</template>

<script>

/**
 * @summary shows the custom field names and contents
 * @author Rebecca Kurup Buchholz
 * Created at     : 2021-07-05
 * Last modified  : 2021-08-03 16:39:05
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
    customFieldsArray: [
      {
        fieldName: '', 
        content: '',
      },
    ],
  }),
  props: {  
    genericProps: Object,  
    // genericProps: {
    //   type: Array,
    //   default: () => [
    //     { 
    //       field0: { 
    //         fieldName: '', 
    //         content: '',
    //       },
    //     },
    //     {
    //       field1: {
    //         fieldName: '',
    //         content: '',
    //       },
    //     },
    //     {
    //       field2: {
    //         fieldName: '',
    //         content: '',
    //       },
    //     },
    //     {
    //       field3: {
    //         fieldName: '',
    //         content: '',
    //       },
    //     },
    //     {
    //       field4: {
    //         fieldName: '',
    //         content: '',
    //       },
    //     },
    //   ],
    // },
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
        return this.mixinMethods_getGenericProp('cardInstructions', 'Advance custom data fields');
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
    // TODO test that this is really emitting to eventBus
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
    // TODO look at notifyChabge
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

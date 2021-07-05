<template>
  <v-card id="EditCustomFields" max-width="20%">

 <v-container fluid >

   <v-row>

      <v-col cols="12"> 
        <v-text class="text-h5">{{ cardTitle }}</v-text>
      </v-col>

    </v-row>  


    <v-row>

      <v-col cols="12"> 
        <v-text class="text-body-1">{{ cardInstructions }}</v-text>
      </v-col>

    </v-row>


    <v-row>

     <v-col cols="6">     
        <v-text-field   
                      :label="labelFieldName"
                      outlined
                      v-model="inputFieldName" >
        </v-text-field>
      </v-col>

      <v-col cols="6">     
        <v-text-field   
                      :label="labelContent"
                      outlined
                      v-model="inputContent" >
        </v-text-field>
      </v-col>

    </v-row>

    <v-container v-for="field in customFieldsList">
      <v-row v-for="(item) in field">
        <v-col cols="6" >     
          <v-text-field 
                        :label="item.fieldName"
                        outlined
                        v-model="inputFieldName" >
          </v-text-field>
        </v-col>
         <v-col cols="6" > 
          <v-text-field :label="item.content" 
                        outlined 
                        v-model="inputFieldName">
          </v-text-field>

        </v-col>
      </v-row>
    </v-container>


    <v-container v-for="(field) in customFields" >
      <v-row v-if="field.fieldName && field.content" >
        <v-col cols="6" v-for="(item) in field" >     
          <v-text-field 
                        :label="item"
                        outlined
                        v-model="inputFieldName" >
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
    

  </v-container>
    </v-card>  

</template>

<script>
/**

 * @summary shows the custom field names and contents
 * @author Rebecca Kurup Buchholz
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-06-28 15:55:22

 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/


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
    inputFieldName: {
      type: String,
      default: '',
    },
    labelContent: {
      type: String,
      default: 'Content',
    },
    inputContent: {
      type: String,
      default: '',
    },
    customFieldsList: {
      type: Array,
      default: () => [
        { 
          field1: { 
            fieldName: 'blah4', 
            content: 'value4',
          },
        },
        {
          field2: {
            fieldName: 'blah5',
            content: 'value5',
          },
        },
        {
          field3: {
            fieldName: 'blah6',
            content: 'value6',
          },
        },
      ],
    },
    customFields: { 
      type: Object, 
      default() { 
        return { 
          field1: {
            fieldName: 'blah',
            content: 'value',
          },
          field2: {
            fieldName: 'blah2', 
            content: 'value2', 
          },
          field3: {
            fieldName: 'blah3',
            content: 'value3',
          },
        }; 
      },
     }, 
  },
  computed: {
  },
  methods: {
  },
  data: () => ({
    formFields: ['passenger_name', 
                 'ticket_no', 
                 'flight_no', 
                 'departure_date',
                 'sector'],
   }),
  components: {
  },  
};
</script>

<style scoped>
</style>

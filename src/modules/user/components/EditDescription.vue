<template>
  <v-card id="EditDescription">

 <v-container fluid>

   <v-row>

      <v-col cols="12"> 
        <v-text class="text-h5">Metadata Description</v-text>
      </v-col>

    </v-row>  


    <v-row>

      <v-col cols="12"> 
        <v-text class="text-body-1">Please enter a description for the research data.</v-text>
      </v-col>

    </v-row>


    <v-row>

      <v-col cols="6">     
        <v-textarea 
                      label="Description"
                      outlined
                      :rules="descriptionRules"
                      required
                      auto-grow
                      v-model="inputDescription"
                      placeholder="Enter your metadata description here">
        </v-textarea>
      </v-col>

      <v-col cols="6">     
        <v-textarea class="preview"
                      label="Preview Description"
                      outlined
                      disabled
                      auto-grow
                      v-model="inputDescription">
        </v-textarea>
      </v-col>


    </v-row>
    

  </v-container>
    </v-card>  

</template>

<script>
/**

 * @summary shows the main infos the a metadata entry
 * @author Rebecca Kurup Buchholz
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-06-28 15:55:22

 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/


export default {
  name: 'EditDescription',
  props: {    
  },
  computed: {
  },
  methods: {
  },
  data: () => ({
    inputDescription: '',
    descriptionRules: [v => !!v || 'Description is required'],
   }),
  components: {
  },  
};
</script>

<style scoped>

.preview >>> fieldset {border-width: thick; border-color: #E7E7E7 }

</style>

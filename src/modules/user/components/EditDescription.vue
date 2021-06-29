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
                      v-model="bodyObject.body.text"
                    >
        </v-textarea>
      </v-col>

      <v-col cols="6">     
        <MetadataBody
          :genericProps="bodyObject"
          :showPlaceholder="showPreviewPlaceholder"
        />

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

import MetadataBody from '@/modules/metadata/components/Metadata/MetadataBody';



export default {
  name: 'EditDescription',
  props: {    
  },
  computed: {
  },
  methods: {
  },
  data: () => ({
    previewTitle: 'Preview Description',
    showPreviewPlaceholder: false,
    descriptionRules: [v => !!v || 'Description is required'],
    bodyObject: { 
                  body: 
                    { text: 
                    
`# Why user stories?                     

User Stories can help you to constantly improve the value of
your product, estimate development efforts in an appropriate way and prioritize
feature development during the MVP and post-MVP stages. 

# How user stories 

## 1. Step think about "Who" - type of user 

Try to omit using such a role as simply
“the user”. It can be applied to any person - from your customers to admins -
and, therefore, it doesn’t reflect the personality of particular target groups,
the way they interact with the application. You can create personas. 

## 2. Step think about the "What" - function, UI & UX 

Define what functionality each user expects. How she’s going to interact with the app. 

## 3. Step think about the "Why" - added value 

It should either improve the UX, increase retention rates,
shorten users’ journey to the issue solution or whatever. Each Story should
contribute something to the general goal of your product.
` },
                },     
   }),
  components: {
    MetadataBody,
  },  
};
</script>

<style scoped>

.preview >>> fieldset {border-width: thick; border-color: #E7E7E7 }

</style>

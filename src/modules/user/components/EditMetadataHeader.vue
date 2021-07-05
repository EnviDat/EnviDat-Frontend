<template>
  <v-card id="EditMetadataHeader">

 <v-container fluid>

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
                      :label="labelTitle"
                      outlined
                      :rules="rulesTitle"
                      required
                      :placeholder="placeholderTitle"
                      v-model="inputTitle" >
        </v-text-field>
      </v-col>

      <v-col cols="6"> 
        <v-text-field 
                      :label="labelContactEmail"
                      outlined
                      :rules="rulesEmail"
                      required
                      :placeholder="placeholderContactEmail" 
                      v-model="inputContactEmail">
        </v-text-field>
      </v-col>

    </v-row>


    <v-row>

      <v-col cols="6"> 
        <v-text-field 
                      :label="labelContactGivenName"
                      outlined
                      :rules="rulesGivenName"
                      required
                      :placeholder="placeholderContactGivenName"
                      v-model="inputContactGivenName">
        </v-text-field>
      </v-col>

      <v-col cols="6"> 
        <v-text-field 
                      :label="labelContactSurname"
                      outlined
                      :rules="rulesSurname"
                      required
                      :placeholder="placeholderContactSurname"
                      v-model="inputContactSurname">
        </v-text-field>
      </v-col>



    </v-row>


    <v-row>

      <v-col cols="12"> 
        <v-text class="text-body-1">{{ previewText }}</v-text>
      </v-col>

      <v-col cols="12"> 
        <v-text class="text-body-1"></v-text>
      </v-col>


    </v-row>


    <v-row no-gutters dense>

      <v-col cols="12">   
            <MetadataHeader 
              :metadataTitle="inputTitle || placeholderHeaderTitle" 
              :contactName="inputContactFullName" 
              :contactIcon="iconName"
              :contactEmail="inputContactEmail"
              :mailIcon="iconMail" />    
      </v-col>       

    </v-row>
    

  </v-container>
    </v-card>  

</template>

<script>
/**
 * EditMetadataHeader.vue shows the title, main contact email, main contact given name, 
 * main contact surname, and metadata header preview.
 *
 * @summary shows the title, main contact information, and header preview
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-06-28 15:55:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

// import TagChip from '@/components/Cards/TagChip';
import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader';

// import { getAuthorName } from '@/factories/authorFactory';
// import TagChipAuthor from '../TagChipAuthor';

import imageContact from '@/assets/icons/contact.png';
import imageMail from '@/assets/icons/mail.png';


export default {
  name: 'EditMetadataHeader',
  props: {
    cardTitle: { 
      type: String, 
      default: 'Metadata Basic Information',
    },
    cardInstructions: { 
      type: String, 
      default: 'Enter research data title and authors. Please make sure that title is meaningful and specific.', 
    },
    labelTitle: { 
      type: String, 
      default: 'Title',
    },
    placeholderTitle: {
      type: String,
      default: 'Enter the title for your metadata entry here',
    },     
    placeholderHeaderTitle: { 
      type: String, 
      default: 'Metadata Title',
    },
    inputTitle: {
      type: String,
      default: '',
    },
    labelContactEmail: { 
      type: String, 
      default: 'Main Contact Email',
    },
    placeholderContactEmail: { 
      type: String, 
      default: 'Enter main contact email address here',
    },
    inputContactEmail: {
      type: String,
      default: '',
    },
    inputContactGivenName: {
      type: String,
      default: '',
    },  
    labelContactGivenName: {
      type: String,
      default: 'Main Contact Given Name',
    },
    placeholderContactGivenName: {
      type: String,
      default: 'Enter Main Contact given (first) name here',
    },
    labelContactSurname: {
      type: String,
      default: 'Main Contact Surname',
    },
    placeholderContactSurname: {
      type: String,
      default: 'Enter main contact surname name here',
    },
    inputContactSurname: {
      type: String,
      default: '',
    },
    previewText: {
      type: String,
      default: 'Metadata Header Preview',
    },
  },  
  computed: {
    inputContactFullName() {
      return `${this.inputContactGivenName.trim()} ${this.inputContactSurname.trim()}`; 
    },
  },
  methods: {
  },
  data: () => ({
    rulesTitle: [v => !!v || 'Title is required'],
    rulesGivenName: [v => !!v || 'Main Contact given (first) name is required'],
    rulesSurname: [v => !!v || 'Main Contact surname is required'],
    rulesEmail: [
       v => !!v || 'Main Contact Email is required',
       v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Please enter valid email address',
      ],
    iconName: imageContact,
    iconMail: imageMail,
   }),
  components: {
    MetadataHeader,
  },  
};
</script>

<style scoped>
</style>

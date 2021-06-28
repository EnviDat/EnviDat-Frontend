<template>
  <v-card id="EditMetadataHeader">

 <v-container fluid>

   <v-row>

      <v-col cols="12"> 
        <v-text class="text-h5">Metadata Basic Information</v-text>
      </v-col>

    </v-row>  


    <v-row>

      <v-col cols="12"> 
        <v-text class="text-body-1">Enter research data title and authors. Please make sure that title is meaningful and specific.</v-text>
      </v-col>

    </v-row>


    <v-row>

      <v-col cols="6">     
        <v-text-field   
                      label="Title"
                      outlined
                      :rules="titleRules"
                      required
                      v-model="inputTitle"
                      :placeholder="prefilledTitle">
        </v-text-field>
      </v-col>

      <!-- <v-col cols="6">   
        <v-text-field 
                      label="Authors"
                      outlined
                      :placeholder="placeholderAuthor">
        </v-text-field>
      </v-col> -->

    </v-row>


    <v-row>

      <v-col cols="6"> 
        <v-text-field 
                      label="Main Contact Name"
                      outlined
                      :rules="nameRules"
                      required
                      placeholder="Enter main contact given and surname here"
                      v-model="inputContactName">
        </v-text-field>
      </v-col>

      <v-col cols="6"> 
        <v-text-field 
                      label="Main Contact Email"
                      outlined
                      :rules="emailRules"
                      required
                      placeholder="Enter main contact email address here"
                      v-model="inputContactEmail">
        </v-text-field>
      </v-col>


      <!-- <v-col cols="2"> 
        <v-btn 
          text
          elevation="2" 
          outlined 
          raised 
          color="#30B9BA"
          rounded>
          I am the Main Contact
        </v-btn>
      </v-col> -->


    </v-row>


    <v-row>

      <v-col cols="12"> 
        <v-text class="text-body-1">Metadata Header Preview</v-text>
      </v-col>

      <v-col cols="12"> 
        <v-text class="text-body-1"></v-text>
      </v-col>


    </v-row>


    <v-row no-gutters dense>

      <v-col cols="12">   
            <MetadataHeader 
              :metadataTitle="inputTitle || prefilledHeaderTitle" 
              :contactName="inputContactName" 
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
 * MetadataHeader.vue shows the title, authors, keywords,
 * main contact, doi and license of a metadata entry.
 *
 * @summary shows the main infos the a metadata entry
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
    prefilledTitle: String,    
    prefilledHeaderTitle: String,
    prefilledAuthor: String,
    placeholderAuthor: String,
    },
  computed: {
  },
  methods: {
  },
  data: () => ({
    inputTitle: '',
    titleRules: [v => !!v || 'Title is required'],
    inputContactName: '',
    nameRules: [v => !!v || 'Main Contact Name is required'],
    inputContactEmail: '',
    emailRules: [
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

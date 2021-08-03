<template>
<v-card id="EditMetadataHeader" class="pa-4">

  <v-container fluid 
                class="pa-0 fill-height" >

    <v-row>

      <v-col cols="12"> 
        <div class="text-h5">{{ lables.cardTitle }}</div>
      </v-col>

    </v-row>  


    <v-row>

      <v-col cols="12"> 
        <div class="text-body-1">{{ lables.instructions }}</div>
      </v-col>

    </v-row>

    <v-row>
      <v-col cols="6">     
        <v-text-field :label="lables.labelTitle"
                      outlined
                      :rules="rulesTitle"
                      required
                      :placeholder="lables.placeholderTitle"
                      v-model="metadataTitle" />
                      
      </v-col>

      <v-col cols="6"> 
        <v-text-field 
                      :label="lables.labelContactEmail"
                      outlined
                      :rules="rulesEmail"
                      required
                      :placeholder="lables.placeholderContactEmail" 
                      v-model="contactEmail" />

      </v-col>

    </v-row>

    <v-row>
      <v-col cols="6"> 
        <v-text-field :label="lables.labelContactGivenName"
                      outlined
                      :rules="rulesGivenName"
                      required
                      :placeholder="lables.placeholderContactGivenName"
                      v-model="contactGivenName" />

      </v-col>

      <v-col cols="6"> 
        <v-text-field :label="lables.labelContactSurname"
                      outlined
                      :rules="rulesSurname"
                      required
                      :placeholder="lables.placeholderContactSurname"
                      v-model="contactSurname" />

      </v-col>
    </v-row>


    <v-row>
      <v-col cols="12"> 
        <div class="text-body-1">{{ lables.previewText }}</div>
      </v-col>
    </v-row>

    <v-row dense >
      <v-col cols="12">   
        <MetadataHeader :metadataTitle="metadataTitle || lables.placeholderHeaderTitle" 
                        :mailIcon="iconMail"
                        :showCloseButton="false"
                        :contactName="inputContactFullName" 
                        :contactIcon="iconName"
                        :contactEmail="contactEmail"
                         />
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
 * Last modified  : 2021-08-03 14:17:27
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_MAIN_HEADER,
  eventBus,
} from '@/factories/eventBus';

// import TagChip from '@/components/Cards/TagChip';
import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader';

// import { getAuthorName } from '@/factories/authorFactory';
// import TagChipAuthor from '../TagChipAuthor';

import imageContact from '@/assets/icons/contact.png';
import imageMail from '@/assets/icons/mail.png';


export default {
  name: 'EditMetadataHeader',
  props: {
    genericProps: {
      type: Object,
      default: () => ({
        metadataTitle: '',
        contactEmail: '',
        contactGivenName: '',
        contactSurname: '',
      }),
    },
    // genericProps: Object,
  },  
  computed: {
    metadataTitle: {
      get() {
        return this.mixinMethods_getGenericProp('metadataTitle', '');
      },
      set(value) {
        this.setHeaderInfo('metadataTitle', value);
      },
    },
    contactEmail: {
      get() {
        return this.mixinMethods_getGenericProp('contactEmail', '');
      },
      set(value) {
        this.setHeaderInfo('contactEmail', value);
      },
    },
    contactGivenName: {
      get() {
        return this.mixinMethods_getGenericProp('contactGivenName', '');
      },
      set(value) {
        this.setHeaderInfo('contactGivenName', value);
      },
    },
    contactSurname: {
      get() {
        return this.mixinMethods_getGenericProp('contactSurname', '');
      },
      set(value) {
        this.setHeaderInfo('contactSurname', value);
      },
    },
    inputContactFullName() {
      return `${this.contactGivenName.trim()} ${this.contactSurname.trim()}`; 
    },
  },
  methods: {
    setHeaderInfo(property, value) {
      const newHeaderInfo = {
        ...this.genericProps,
        [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_MAIN_HEADER,
        data: newHeaderInfo,
      });
    },
  },
  data: () => ({
    lables: {
      cardTitle: 'Metadata Basic Information',
      labelTitle: 'Metadata Entry Title',
      labelContactEmail: 'Contact Email',
      labelContactGivenName: 'Contact Given Name',
      labelContactSurname: 'Contact Surname',
      instructions: 'Enter research data title and authors. Please make sure that title is meaningful and specific.',
      placeholderTitle: 'Enter the title for your metadata entry here',
      placeholderHeaderTitle: 'Your Metadata Title',
      placeholderContactEmail: 'Enter contact email address here',
      placeholderContactGivenName: 'Enter contact given (first) name here',
      placeholderContactSurname: 'Enter contact surname name here',
      previewText: 'Metadata Header Preview',
    },    
    rulesTitle: [v => !!v || 'Title is required'],
    rulesGivenName: [v => !!v || 'Contact given (first) name is required'],
    rulesSurname: [v => !!v || 'Contact surname is required'],
    rulesEmail: [
       v => !!v || 'Contact Email is required',
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

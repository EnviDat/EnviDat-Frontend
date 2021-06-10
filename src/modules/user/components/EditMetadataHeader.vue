<template>
  <v-card id="EditMetadataHeader">

 <v-container fluid>
    
    <v-row no-gutters
           dense>

      <v-col cols="12">   
            <MetadataHeader :metadataTitle="inputTitle || prefilledTitle" />    
      </v-col>       

    </v-row>


    <v-row>

      <v-col cols="6">     
        <v-text-field label="Title"
                      outlined
                      v-model="inputTitle"
                      :placeholder="prefilledTitle">
        </v-text-field>
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
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-01-05 15:55:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

// import TagChip from '@/components/Cards/TagChip';
import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader';

// import { getAuthorName } from '@/factories/authorFactory';
// import TagChipAuthor from '../TagChipAuthor';

export default {
  name: 'EditMetadataHeader',
  props: {
    prefilledTitle: String,    
  },
  computed: {
  },
  methods: {
  },
  data: () => ({
    inputTitle: ''
  }),
  components: {
    MetadataHeader,
  },  
};
</script>

<style scoped>


</style>

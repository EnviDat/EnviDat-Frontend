<template>
  <v-card id="EditMetadataHeader" >

    <v-card-title >
      <MetadataHeader />
    </v-card-title>

    <v-card-text>
      
      <input type="text" />

    </v-card-text>

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
  },
  computed: {
  },
  methods: {
  },
  data: () => ({
  }),
  components: {
    MetadataHeader,
  },  
};
</script>

<style scoped>


</style>

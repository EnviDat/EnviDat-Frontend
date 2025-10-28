<template>
  <v-container id="MetadataHeaderPlaceholder" fluid class="pa-4">
    <v-row no-gutters style="position: relative; z-index: 1">
      <v-col cols="12">
        <v-skeleton-loader type="article" color="transparent"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row no-gutters class="mt-4">
      <v-col v-for="n in 5" :key="n" class="flex-grow-0 mr-1">
        <TagChipPlaceholder />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * MetadataHeaderPlaceholder.vue shows placeholder skeleton loaders
 *
 * @summary shows skeleton loaders for the header
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import TagChipPlaceholder from '@/components/Chips/TagChipPlaceholder.vue';

export default {
  name: 'MetadataHeaderPlaceholder',
  components: {
    TagChipPlaceholder,
  },
};
</script>

<template>
  <v-row 
             >
    <v-col class="my-2"
      v-for="(info, index) in textArray"
      :key="index"
      cols="12"
      
      v-html="markdownText(info)" >
    </v-col>
  </v-row>
</template>

<script>
/**
 * GenericTextLayout.vue renders a list of markdown objects
 *
 * @summary renders a list of markdown objects
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-01-05 15:11:14
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import { renderMarkdown } from '@/factories/stringFactory';

export default {
  components: {
  },
  props: {
    textArray: Array,
  },
  methods: {
    markdownText(markdown) {
      return renderMarkdown(markdown);
    },
  },
};
</script>

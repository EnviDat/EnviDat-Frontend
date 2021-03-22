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
 * Last modified  : 2019-10-23 14:54:16
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import remark from 'remark';
import html from 'remark-html';

export default {
  components: {
  },
  props: {
    textArray: Array,
  },
  methods: {
    markdownText(markdown) {
      return remark().use(html).processSync(markdown);
    },
  },
};
</script>

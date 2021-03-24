<template>
  <v-card id="TextPreviewCard" >

    <v-card-text >
      {{ enableMarkdown ? markdownText : fileContent }}
    </v-card-text>

  </v-card>
</template>

<script>
/**
 * TextPreviewCard.vue a card which previews a text resource
 *
 * @summary renders text 
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-01-05 15:33:05
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import axios from 'axios';
import { renderMarkdown } from '@/factories/stringFactory';

export default {
  props: {
    url: String,
    enableMarkdown: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.getFileContent();
  },
  computed: {
    markdownText() {
      return renderMarkdown(this.fileContent.trim());
    },
  },
  methods: {
    getFileContent() {
      axios.get(this.url)
      .then((response) => {
        this.fileContent = response.data;
      })
      .catch((reason) => {
        this.fileError = reason;
      });

    },
  },
  data: () => ({
    fileContent: '',
    fileError: '',
  }),
};
</script>

<style scoped>

</style>

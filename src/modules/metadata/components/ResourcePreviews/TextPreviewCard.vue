<template>
  <v-card id="TextPreviewCard" >

    <v-card-title class="title">
      {{ title }}
    </v-card-title>

    <v-card-text class="pt-0" >
      {{ enableMarkdown ? markdownText : text }}
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
import { renderMarkdown } from '@/factories/stringFactory';

import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import BaseIconLabelView from '@/components/BaseElements/BaseIconLabelView';

export default {
  components: {
    BaseIconLabelView,
    BaseIconButton,
  },
  props: {
    title: String,
    text: String,
    enableMarkdown: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
  }),
  computed: {
    markdownText() {
      return renderMarkdown(this.description.trim());
    },
  },
  methods: {
  },
};
</script>

<style scoped>

</style>

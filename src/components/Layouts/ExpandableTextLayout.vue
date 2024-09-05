<template>
  <v-card :class="cardClass">
    <v-card-title v-if="title" class="metadata_title text-h6 pa-4">
      {{ title }}
    </v-card-title>

    <v-card-title v-if="showPlaceholder && !title" class="pa-4 pt-0">
      <v-skeleton-loader type='paragraph' color='gray' />
    </v-card-title>

    <v-card-text v-if="showPlaceholder" class="pa-4 pt-0">
      <v-skeleton-loader type='paragraph' color='gray' />
    </v-card-text>

    <v-card-text
      v-if="!showPlaceholder && fullText"
      ref="text"
      :usedMaxTextLength="maxTextLength"
      class="pa-4 pt-0 heightAndScroll readableText"
      :style="`scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack}`"
    >
      <div v-html="markdownText"></div>
    </v-card-text>

    <v-card-text
      v-if="!showPlaceholder && !fullText"
      class="pa-4 pt-0 readableText"
      :style="`color: ${emptyTextColor};`"
    >
      {{ emptyText }}
    </v-card-text>

    <v-card-text v-if="statusText"> {{ statusText }} </v-card-text>

    <v-card-actions
      v-if="maxTextLengthReached"
      class="ma-0 pa-2"
      :style="`position: absolute; bottom: 0px; right: ${rightPos()};`"
    >
      <BaseIconButton
        :icon="mdiChevronDown"
        :icon-color="showFullText ? 'secondary' : 'white'"
        :color="showFullText ? 'transparent' : 'secondary'"
        :outlined="!!showFullText"
        outline-color="secondary"
        :rotated="showFullText"
        :tooltip-text="showFullText ? 'Collaspe text' : 'Show full text'"
        @clicked="readMore"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
/**
 * ExpandableTextLayout.vue renders markdown showing the text of the metadatas.
 * Long text is cropped and a expand button is shown.
 *
 * @summary shows the markdown text in an expanable card
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2020-12-09 12:01:54
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import { renderMarkdown } from '@/factories/stringFactory';
import { mdiChevronDown } from '@mdi/js';

export default {
  name: 'ExpandableTextLayout',
  components: {
    BaseIconButton,
  },
  props: {
    title: String,
    text: String,
    showPlaceholder: Boolean,
    maxTextLength: {
      type: Number,
      default: 800,
    },
    emptyText: {
      type: String,
      default: 'No text found for dataset.',
    },
    emptyTextColor: {
      type: String,
      default: 'red',
    },
    cardClass: String,
    sanitizeHTML: {
      type: Boolean,
      default: true,
    },
    statusText: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    markdownText() {
      return renderMarkdown(this.fullText, this.sanitizeHTML);
    },
    fullText() {
      if (this.text) {
        if (this.maxTextLengthReached && !this.showFullText) {
          return `${this.text.trim().substring(0, this.maxTextLength)}...`;
        }

        return this.text.trim();
      }

      return '';
    },
    maxTextLengthReached() {
      return (
        this.text && this.maxTextLength && this.text.length > this.maxTextLength
      );
    },
    scrollbarColorFront() {
      return this.$vuetify
        ? this.$vuetify.theme.themes.light.colors.highlight
        : 'auto';
    },
    scrollbarColorBack() {
      return this.$vuetify ? '#F0F0F0' : 'auto';
    },
  },
  methods: {
    readMore() {
      this.showFullText = !this.showFullText;
    },
    rightPos() {
      return this.$refs.text && this.$refs.text.clientHeight >= 500
        ? '0px'
        : '10px';
    },
  },
  data: () => ({
    mdiChevronDown,
    showFullText: false,
  }),
};
</script>

<style scoped>
.heightAndScroll {
  max-height: 500px;
  overflow-y: auto !important;
  overflow-x: hidden;
  scrollbar-width: thin;
}
</style>

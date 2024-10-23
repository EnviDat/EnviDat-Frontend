<template>
  <v-card :flat="isFlat"
          :class="cardClass">

    <v-card-title v-if="title"
                  class="metadata_title text-h6"
                  :class="isFlat ? 'pa-0' : 'pa-4'">
      {{ title }}
    </v-card-title>

    <v-card-title v-if="showPlaceholder && !title"
                  class="pa-4 pt-0">
      <v-skeleton-loader type="header" />
    </v-card-title>

    <v-card-text v-if="showPlaceholder"
                 class="pa-4 pt-0">
      <v-skeleton-loader type="paragraph" />
    </v-card-text>

    <v-card-text v-if="statusText"
                 class="readableText"
                 :class="isFlat ? 'pa-0' : 'pa-5'"
                 @click="readMore"
                  style="cursor: pointer;" >
      <v-row no-gutters
             align="center">
        <v-col>
          {{ swapStatusTextWithSoltText && expanded ? $slots.default()[0].text : statusText }}
        </v-col>

        <v-col class="flex-grow-0">
          <base-icon-button
                  :icon="mdiChevronDown"
                  small
                  icon-color="black"
                  :color="highlighted ? 'highlight' : ''"
                  :outlined="!highlighted"
                  outlineColor="primary"
                  :rotated="expanded"
                  :tooltipText="expanded ? 'Close' : 'Expand'"
                  @clicked="readMore"
          />
        </v-col>
      </v-row>

      <v-row v-if="!swapStatusTextWithSoltText && $slots.default && expanded"
              no-gutters>
        <v-col class="pt-2">
          <slot name="default"></slot>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
/**
 * ExpandableLayout.vue renders markdown showing the text of the metadatas.
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
import { mdiChevronDown } from '@mdi/js';

export default {
  name: 'ExpandableLayout',
  components: {
    BaseIconButton,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    statusText: {
      type: String,
      default: '',
    },
    isFlat: {
      type: Boolean,
      default: false,
    },
    cardClass: String,
    showPlaceholder: {
      type: Boolean,
      default: false,
    },
    swapStatusTextWithSoltText: {
      type: Boolean,
      default: false,
    },
    startExpanded: {
      type: Boolean,
      default: false,
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.expanded = this.startExpanded;
  },
  methods: {
    readMore() {
      this.expanded = !this.expanded;
    },
  },
  data: () => ({
    expanded: false,
    mdiChevronDown,
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

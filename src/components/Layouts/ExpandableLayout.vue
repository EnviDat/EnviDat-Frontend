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
      <div
        class="skeleton skeleton-size-normal skeleton-color-concrete skeleton-animation-shimmer"
        style="width: 100%;"
      >
        <div class="bone bone-type-heading" />
      </div>
    </v-card-title>

    <v-card-text v-if="showPlaceholder"
                 class="pa-4 pt-0">
      <div class="skeleton skeleton-size-normal skeleton-color-concrete skeleton-animation-shimmer" >
        <div class="bone bone-type-multiline bone-style-paragraph" />
      </div>
    </v-card-text>

    <v-card-text v-if="statusText"
                 class="readableText"
                 :class="isFlat ? 'pa-0' : 'pa-5'"
                 @click="readMore"
                  style="cursor: pointer;" >
      <v-row no-gutters
             align="center">
        <v-col>
          {{ swapStatusTextWithSoltText && expanded ? $slots.default[0].text : statusText }}
        </v-col>

        <v-col class="flex-grow-0">
          <base-icon-button
                  material-icon-name="expand_more"
                  isSmall
                  iconColor="black"
                  color="secondary"
                  outlined
                  :rotateOnClick="true"
                  :rotateToggle="expanded"
                  :tooltipText="expanded ? 'Close' : 'Expand'"
                  @clicked="readMore"
          />
        </v-col>
      </v-row>

      <v-row v-if="!swapStatusTextWithSoltText && $slots.default && expanded"
              no-gutters>
        <v-col>
          <slot name="default"></slot>
        </v-col>
      </v-row>
    </v-card-text>

<!--    <v-card-text v-if="$slots.default && expanded"
                 :class="isFlat ? 'pa-0' : 'pa-4'"
                  class="pt-0">
      <slot name="default"></slot>
    </v-card-text>-->

<!--
    <v-card-actions
      class="ma-0"
      :class="isFlat ? 'pa-0' : 'pa-2'"
      :style="`position: absolute; bottom: 0; right: 0;`"
    >
      <base-icon-button
        material-icon-name="expand_more"
        isSmall
        iconColor="black"
        color="secondary"
        outlined
        :rotateOnClick="true"
        :rotateToggle="expanded"
        :tooltipText="expanded ? 'Close' : 'Expand'"
        @clicked="readMore"
      />
    </v-card-actions>
-->
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
  },
  computed: {
  },
  methods: {
    readMore() {
      this.expanded = !this.expanded;
    },
    rightPos() {
      return this.$refs.text && this.$refs.text.clientHeight >= 500
        ? '0px'
        : '10px';
    },
  },
  data: () => ({
    expanded: false,
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

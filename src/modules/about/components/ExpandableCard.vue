<template>
  <v-card :expanded="expanded"
          max-width='500px'>
    <v-container class="pa-0"
                 @click="toggleExpand">

      <v-row no-gutters class="pa-0">
        <v-col cols="5">
          <v-img
            class="imagezoom"
            :cover="!contain"
            :height="
              $vuetify.display.xs ? minHeight + 'px' : maxHeight + 'px'
            "
            :style="
              `border-bottom-left-radius: ${
                expanded ? 0 : 4
              }px; border-top-left-radius: 4px;`
            "
            :src="img"
          />
        </v-col>

        <v-col cols="7" class="text-h5 px-4" align-self="center">
          {{ title }}
        </v-col>
      </v-row>

      <v-card-actions
        class="ma-0 pa-2"
        style="position: absolute; bottom: 5px; right: 5px;"
      >
        <base-icon-button
          :icon="mdiChevronDown"
          outlined
          :icon-color="expanded ? 'accent' : 'primary'"
          :rotated="expanded"
          :tooltip-text="expanded ? 'Hide info' : 'Show info'"
          @clicked="toggleExpand"
        />
      </v-card-actions>
    </v-container>

    <v-slide-y-transition>
      <v-card-text
        v-if="expanded"
        class="py-4 readableText"
      >
        <div v-html="markdownText"></div>
      </v-card-text>
    </v-slide-y-transition>
  </v-card>
</template>

<script>
/**
 * ExpandableCard.vue creates a card with a header image, title, and preview text.
 * When clicked it expands to show the full text in markdown.
 *
 * @summary card with img, title and expandable markdown text
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2021-01-05 15:14:33
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import { renderMarkdown } from '@/factories/stringFactory';
import { mdiChevronDown } from '@mdi/js';

export default {
  name: 'ExpandableCard',
  components: {
    BaseIconButton,
  },
  props: {
    title: String,
    img: String,
    contain: Boolean,
    text: String,
    minHeight: Number,
    maxHeight: Number,
  },
  data: () => ({
    expanded: false,
    mdiChevronDown,
  }),
  computed: {
    markdownText() {
      return renderMarkdown(this.text.trim(), false);
    },
  },
  methods: {
    toggleExpand() {
      this.expanded = !this.expanded;
    },
  },
};
</script>

<style scoped>

.v-card__media img {
  width: inherit !important;
}
</style>

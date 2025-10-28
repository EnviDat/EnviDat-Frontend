<template>
  <v-card :expanded="expanded">
    <v-container class="pa-0" @click="toggleExpand">
      <v-row no-gutters class="pa-0">
        <v-col cols="5">
          <v-img
            class="imagezoom"
            :cover="!contain"
            :height="$vuetify.display.xs ? minHeight + 'px' : maxHeight + 'px'"
            :style="`border-bottom-left-radius: ${expanded ? 0 : 4}px; border-top-left-radius: 4px;`"
            :src="imgResolved"
          />
        </v-col>

        <v-col cols="7" class="text-h5 px-4" align-self="center">
          {{ title }}
        </v-col>
      </v-row>

      <v-slide-y-transition>
        <v-card-text v-if="expanded" class="pb-1 readableText">
          <div v-html="markdownText"></div>
        </v-card-text>
      </v-slide-y-transition>

      <v-card-actions :style="expanded ? undefined : 'position: absolute; right: 0; bottom: 0;'">
        <v-spacer></v-spacer>
        <base-icon-button
          :icon="mdiChevronDown"
          :icon-color="expanded ? 'accent' : 'primary'"
          :rotated="expanded"
          :tooltip-text="expanded ? 'Hide info' : 'Show info'"
          @clicked="toggleExpand"
        />
      </v-card-actions>
    </v-container>
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
import { mdiChevronDown } from '@mdi/js';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import { renderMarkdown } from '@/factories/stringFactory';
import { getImage } from '@/factories/imageFactory.js';

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
  async mounted() {
    if (this.img) {
      this.imgResolved = await getImage(this.img);
    }
  },
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
  data: () => ({
    expanded: false,
    mdiChevronDown,
    imgResolved: undefined,
  }),
};
</script>

<template>
  <v-card ripple
          hover
          :expanded="expanded">

    <v-container class="pa-0"
                  @click="toggleExpand">

      <v-row no-gutters class="pa-0">

        <v-col cols="5">
          <v-img class="imagezoom"
                  :contain="contain"
                  :height=" $vuetify.breakpoint.xsOnly ? minHeight + 'px' : maxHeight + 'px' "
                  :style="`border-bottom-left-radius: ${expanded ? 0 : 4}px; border-top-left-radius: 4px;`"
                  :src="img" />
        </v-col>

        <v-col cols="7" class="headline cardTitle px-4"
               align-self="center" >
          {{ title }}
        </v-col>
      </v-row>

      <v-card-actions class="ma-0 pa-2"
                      style="position: absolute; bottom: 5px; right: 5px;">

        <base-icon-button materialIconName="expand_more"
                          :outlined="true"
                          color="transparent"
                          :iconColor="expanded ? 'accent' : 'primary'"
                          :rotateOnClick="true"
                          :rotateToggle="expanded"
                          :tooltipText="expanded ? 'Hide info' : 'Show info'"
                          @clicked="toggleExpand" />
      </v-card-actions>
    </v-container>

    <v-slide-y-transition>
      <v-card-text v-if="expanded"
                    class="py-4 readableText"
                    v-html="markdownText">
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
import { renderMarkdown } from '@/factories/stringFactory';
import BaseIconButton from '@/components/BaseElements/BaseIconButton';

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
  }),
  computed: {
    markdownText() {
      return renderMarkdown(this.text.trim());
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

  .cardTitle {
    font-family: "Baskervville", serif !important;
  }

  .compactTitle {
    font-size: 15px !important;
    line-height: 1.3em !important;
  }

  .v-card__media img {
    width: inherit !important;
  }
</style>

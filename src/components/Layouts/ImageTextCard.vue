<template>
  <v-card :minHeight="height"
          >
    <v-container v-if="imageTopLayout"
                 :style="`min-height: ${height}px; `"
                 class="fill-height"
                 fluid >

      <v-row no-gutters>
        <v-col cols="12" >

          <v-img :height="imageHeight"
                 contain
                 :lazy-src="loadingImg"
                 :src="image"  />

<!--          style="border-top-left-radius: 4px; border-top-right-radius: 4px;"-->

          <!--        class="imagezoom"-->

        </v-col>
      </v-row>

      <v-row no-gutters
              class="pt-4">
        <v-col cols="12" >
          <div :class="titleCssClass"
          >
            {{ title }}
          </div>

          <div v-if="text"
               :class="subtitleCssClass"
               v-html="text">

          </div>
        </v-col>
      </v-row>

    </v-container>

    <v-container v-if="!imageTopLayout"
                 fluid
                  class="pa-0">

      <v-row no-gutters
             class="pa-0">

        <v-col cols="5"
               class="pa-0">

          <v-img class="imagezoom"
                 :aspect-ratio="1"
                 style="height: 100%; border-bottom-left-radius: 4px; border-top-left-radius: 4px;"
                 :lazy-src="loadingImg"
                 :src="image"  />

        </v-col>

        <v-col cols="7"
               class="px-3"
               align-self="center" >
          <div :class="titleCssClass"
            >
            {{ title }}
          </div>

          <div v-if="text"
               :class="subtitleCssClass"
                v-html="textIsMarkdown ? markdownText(text) : text">

          </div>
        </v-col>

      </v-row>
    </v-container>

  </v-card>

</template>

<script>
import { renderMarkdown } from '@/factories/stringFactory';

/**
 * ImageTextCard shows the content the title of a post
 *
 * @summary ImageTextCard shows the content the title of a post
 * @author Dominik Haas-Artho
 *
 * Created at     : 2022-02-17
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'ImageTextCard',
  props: {
    title: String,
    text: String,
    textIsMarkdown: {
      type: Boolean,
      default: false,
    },
    image: String,
    height: Number,
    imageTopLayout: {
      type: Boolean,
      default: false,
    },
    loadingImg: {
      type: String,
      default: undefined,
    },
    titleCssClass: {
      type: String,
      default: undefined,
    },
    subtitleCssClass: {
      type: String,
      default: undefined,
    },
  },
  methods: {
    markdownText(text) {
      return renderMarkdown(text);
    },
  },
  computed: {
    imageHeight() {
      return this.height * 0.3;
    },
  },
};
</script>

<style scoped>

</style>

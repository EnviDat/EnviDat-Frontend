<template>
  <v-card :minHeight="height"
          >
    <v-container v-if="imageTopLayout"
                 :style="`min-height: ${height}px; `"
                 fluid >

      <v-row no-gutters>
        <v-col cols="12" >

          <v-img :height="imageHeight"
                 contain
                 :lazy-src="loadingImgResolved"
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
                  class="pa-0"
                  :style="`min-height: ${height}px`">

      <v-row no-gutters
             class="pa-0"
             :style="`min-height: ${height}px`">

        <v-col cols="5"
               class="pa-0">

          <v-img class="imagezoom"
                 :aspect-ratio="1"
                 cover
                 style="height: 100%; border-bottom-left-radius: 4px; border-top-left-radius: 4px;"
                 :lazy-src="loadingImgResolved"
                 :src="image"  />

        </v-col>

        <v-col cols="7"
               class="pa-3" >
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
import { getImage } from '@/factories/imageFactory.js';

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
  async beforeMount() {
    // don't load image it's a external url

    if (this.loadingImg) {
      this.loadingImgResolved = await getImage(this.loadingImg);
    }
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
  data: () => ({
    loadingImgResolved: undefined,
  }),
};
</script>

<style scoped>

</style>

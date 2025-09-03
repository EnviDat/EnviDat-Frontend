<template>
  <v-card
    max-width="500px"
    :height="height"
    :disabled="disabled"
    link
    hover
    @click="clicked"
  >
    <v-container class="pa-0">
      <v-row align="center" no-gutters>
        <!-- Image -->
        <v-col class="py-0" cols="4" sm="5">
          <v-img
            class="imagezoom"
            :aspect-ratio="$vuetify.display.smAndUp ? undefined : 1"
            :cover="!contain"
            :height="height"
            style="border-bottom-left-radius: 4px; border-top-left-radius: 4px"
            :src="imgResolved"
          />
        </v-col>

        <!-- Text -->
        <v-col class="px-0" cols="8" sm="7">
          <div
            class="px-1 baseClickCardTitle"
            :class="{ compactTitle: $vuetify.display.xl }"
          >
            {{ title }}
          </div>

          <div
            v-if="color"
            class="py-0 my-0"
            :style="`height: 5px; background-color: ${color};`"
          ></div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>/**
 * BaseClickCard.vue creates a small card with a title and an image, it emits the
 * 'clicked' event with the title a parameter.
 *
 * @summary Card with title & img, emits a 'clicked' event
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2020-11-17 13:45:56
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { getImage } from '@/factories/imageFactory.js';

// un blurry zooming
// https://stackoverflow.com/questions/36143337/how-to-prevent-blur-from-css-transform

export default {
  name: 'BaseClickCard',
  props: {
    title: String,
    img: String,
    color: String,
    contain: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: '65',
    },
  },
  async mounted() {
    if (this.img) {
      this.imgResolved = await getImage(this.img);
    }
  },
  methods: {
    clicked() {
      this.$emit('click', this.title.toLowerCase());
    },
  },
  data: () => ({
    imgResolved: undefined,
  }),
};
</script>

<style scoped>
.baseClickCardTitle {
  font-size: 1rem !important;
  overflow: inherit !important;
  text-overflow: inherit !important;
  max-height: inherit !important;
  line-height: 1.1em !important;
}

@media screen and (max-width: 1920px) {
  .compactTitle {
    font-size: 1rem !important;
    line-height: 1.3em !important;
  }
}

@media screen and (min-width: 1921px) {
  .compactTitle {
    font-size: 1.1rem !important;
    line-height: 1.1em !important;
  }
}

.v-card__media img {
  width: inherit !important;
}
</style>

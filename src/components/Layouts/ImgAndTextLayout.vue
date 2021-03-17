<template>
      <v-col cols="12" class="pa-0" style="position: relative;">
        <v-row
          class="text-container"
          align="center"
          justify="center"
        >
          <v-col class="text-center text" cols="12"
                 :class="{ 'display-3' : $vuetify.breakpoint.mdAndUp,
                                'display-1' : $vuetify.breakpoint.smAndDown }">
            {{ title }}
          </v-col>
        </v-row>

        <!-- Using img instead of parallax, because parallax has problems loading src dynamically -->
        <v-img :height="height"
               :src="img"
               class="blurred">
        </v-img>
      </v-col>
</template>

<script>
/**
 * ImgAndTextLayout.vue is a placeholder to show the placement any tag while the page is loading.
 *
 * @summary Title Layout
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2020-09-02 20:57:32
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

export default {
  name: 'ImgAndTextLayout',
  props: {
    height: Number,
    title: String,
    img: String,
  },
  watch: {
    img() {
      // console.log(this.img);
    },
  },
};
</script>

<style scoped>
  .text {
    font-family: "Baskervville", serif !important;
    letter-spacing: 0em !important;
    text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.7);
  }
  .text-container {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: 999;
  }

  .blurred {
    opacity: 0.8;
    filter: blur(2px);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

</style>

<template>
  <v-col cols="12" class="pa-0" style="position: relative;">
    <v-row class="text-container" align="center" justify="center">
      <v-col
        class="text-center text-md-h2 text-h4 headerTitle titleLayout"
        cols="12"
      >
        {{ title }}
      </v-col>
    </v-row>

    <!-- Using img instead of parallax, because parallax has problems loading src dynamically -->
    <v-img :height="height" :src="img" class="blurred" cover> </v-img>
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
.titleLayout {
  letter-spacing: 0 !important;
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

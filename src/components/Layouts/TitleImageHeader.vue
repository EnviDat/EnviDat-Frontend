<template>
  <div id="TitleImageHeader"
       style="position: relative;">

    <ImgAndTextLayout style="position: relative; z-index: 0;"
                      :title="title"
                      :img="titleImage"
                      :height="height" />

  </div>
</template>

<script>
/**
 * TitleImageHeader.vue show the header of the BlogPage
 *
 * @summary
 * @author Dominik Haas-Artho
 *
 * Created at     : 2022-02-17
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import ImgAndTextLayout from '@/components/Layouts/ImgAndTextLayout';

export default {
  name: 'TitleImageHeader',
  props: {
    title: String,
    titleImage: String,
    height: Number,
    showCloseButton: Boolean,
  },
  components: {
    ImgAndTextLayout,
  },
};
</script>

<style scoped>

</style>

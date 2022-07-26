<template>
  <div id="BlogHeader" style="position: relative;">
    <BaseIconButton
      v-if="showCloseButton"
      id="BlogHeaderCloseButton"
      class="ma-2"
      :class="{ 'mx-1': $vuetify.breakpoint.smAndDown }"
      style="position: absolute; top: 0; right: 0; z-index: 2;"
      material-icon-name="close"
      icon-color="white"
      color="white"
      outlined
      tool-tip-text="Close Metadata"
      :tool-tip-bottom="true"
      @clicked="$emit('clickedBack')"
    />

    <ImgAndTextLayout
      style="position: relative; z-index: 0;"
      :title="title"
      :img="titleImage"
      :height="height"
    />
  </div>
</template>

<script>
/**
 * BlogHeader.vue show the header of the BlogPage
 *
 * @summary
 * @author Dominik Haas-Artho
 *
 * Created at     : 2022-02-17
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import ImgAndTextLayout from '@/components/Layouts/ImgAndTextLayout.vue';

export default {
  name: 'BlogHeader',
  props: {
    title: String,
    titleImage: String,
    height: Number,
    showCloseButton: Boolean,
  },
  components: {
    ImgAndTextLayout,
    BaseIconButton,
  },
};
</script>

<style scoped></style>

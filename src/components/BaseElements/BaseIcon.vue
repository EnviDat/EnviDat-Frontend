<template>
  <div class="baseIcon" @click="onClick">

    <img
      v-if="customIcon" 
      :style="imgStyle" 
      class="envidatIcon"
      :alt="`${customIcon} icon`" 
      :src="customIcon"
    />
    <v-icon
      v-if="materialIcon"
      :style="iconStyle"
      :color="iconColor"
      :icon="materialIcon"
    />

  </div>
</template>

<script>
/**
 * The @class BaseIcon wraps v-icon or <i /> to make icons visible
 * With the possibility of icon font and custom icons
 *
 * @summary Full width image with a title and subtitle, image can have parallax effect and/or blur
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'BaseIcon',
  props: {
    icon: String,
    color: String,
    rotateOnClick: Boolean,
  },
  data: ()=>({
    isRotated: false,
  }),
  methods: {
    onClick() {
      if(this.rotateOnClick){
        this.isRotated = !this.isRotated;
      }
    },
    getThemeColor(colorName){
      const theme = this.$vuetify.theme.themes.light.colors;
      const themeColors = Object.keys(theme);
      if (themeColors.includes(colorName)) {
        return theme[colorName];
      }
      return null;
    },
  },
  computed: {
    imgStyle() {
      const color = this.getThemeColor(this.iconColor ?? 'primary');
      return  {
        ...this.iconStyle,
        filter: `opacity(.5) drop-shadow(0 0 0 ${color})'`,
      }
    },
    iconStyle() {
      return {
        transform: this.isRotated ? 'transform: rotate(-180deg);' : '',
      }
    },
  },
};
</script>

<style lang="scss" scoped>

  .baseIcon {
    transition: 0.3s all ease-in-out;
  }

</style>

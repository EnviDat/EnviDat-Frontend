<template>
  <div style="width: 24px; height: 24px;">

    <img v-show="customIcon"
         class="envidatIcon"
        :alt="`${customIcon} icon`"
        :src="customIcon"
        />

    <i v-show="materialIcon"
       class='material-icons'
       :style="colorStyle"
    >{{ materialIcon }}</i>

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
    customIcon: String,
    materialIcon: String,
    iconColor: String,
  },
  computed: {
    colorStyle() {
      let color = this.iconColor ? this.iconColor : 'primary';
      const keys = Object.keys(this.$vuetify.theme.themes.light.colors);

      if (keys.includes(color)) {
        color = this.$vuetify.theme.themes.light.colors[color];
      }

      return `color: ${ color };`;
    },
  },
};
</script>

<style scoped>

</style>

<template>
  <div class="baseIconButton">
    <v-btn
      style="margin: 0 !important;"
      :elevation="elevated ? 5 : undefined"
      icon
      :variant="outlined ? 'outlined' : 'text'"
      density="comfortable"
      :size="large ? 'large' : small ? 'small' : undefined"
      :color="color"
      :href="url"
      :class="buttonClass"
      @click.stop="onClick"
      v-bind="$props"
    >
      <base-icon 
        :icon="icon"
        :large="large"
        :small="small"
        :rotated="rotated"
        :color="iconColor"
      ></base-icon>
    </v-btn>

    <v-badge
      v-if="count > 0"
      :overlap="!small"
      :left="small"
      :style="small ? 'position: relative; bottom: 10px;' : ''"
      :content="count"
      color="highlight"
      :class="{ envidatBadgeBigNumber: count > 9, envidatBadge: count <= 9 }"
      @click.stop="onClick"
    />

  </div>
</template>

<script>/**
 * BaseIconButton.vue creates a round button with an icon, either a custom icon or a material (material design libery) icon.
 * Similar to @class RectangleButton
 * React on the 'clicked' event or pass an @prop url to create a href-link.
 *
 * Fill the @prop tooltipText for a tooltip when hovering over the Button.
 * Use the @prop tooltipBottom to set it to appear beneath the button.
 *
 * The @prop iconColor only works for material icons.
 *
 * Set the @prop rotateOnClick to true for the icon to rotate 180° once clicked
 *
 * If @prop count is > 0 a little Circle with the number is appear in the bottom left of the icon Button.
 *
 * The @prop isElevated creates a FAB button with high elevation (box-shadows) if true.
 *
 * When @prop disabled is true clicks won't do anything.
 *
 * @summary a clickable icon button which emits 'clicked' event
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:32:12
 * Last modified  : 2019-11-01 14:04:34
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseIcon from './BaseIcon.vue';

export default {
  name: 'BaseIconButton',
  components: {BaseIcon},
  props: {
    color: { type: String, default: undefined },
    tooltipText: { type: String, default: undefined },
    tooltipBottom: { type: Boolean, default: false },
    icon: { type: String, default: undefined, required: true },
    iconColor: { type: String, default: undefined },
    rotated: { type: Boolean, default: false },
    url: { type: String, default: undefined },
    elevated: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    large: { type: Boolean, default: false },
    count: { type: Number, default: undefined },
    outlined: {type: Boolean, default: undefined },
    fancy: { type:Boolean, default: false },
    glowing: { type:Boolean, default: false },
  },
  computed: {
    buttonClass() {
      return {
        fancyButton: this.fancy,
        glowingButton: this.glowing,
      }
    },
  },
  methods: {
    onClick() {
      this.$emit('clicked');
    },
  },
};
</script>

<style scoped>
.fancyButton {
  background-color: #00BFAD;
  background-image:
    linear-gradient(
      to right bottom,
      #E2F27C,
      #00BFAD
    );
}

.fancyButton:hover {
  background-image:
    linear-gradient(
      to right bottom,
      #E2F27C 20%,
      #00BFAD
    );
}

.glowingButton {
  animation-name: glowing;
  animation-duration: 2.5s;
  animation-iteration-count: infinite;
}

@keyframes glowing {
  0% {
    box-shadow: 0 0 10px 0 yellow;
  }

  50% {
    box-shadow: 0 0 10px 10px yellow;
  }

  100% {
    box-shadow: 0 0 10px 0 yellow;
  }
}

</style>

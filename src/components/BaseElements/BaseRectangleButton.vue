<template>
  <v-tooltip
    v-bind="{ [tooltipPosition]: true }"
    :disabled="$vuetify.breakpoint.smAndDown || !tooltipText"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        :small="isSmall"
        :x-small="isXsSmall"
        :class="marginClass"
        :outlined="isOutlined"
        :text="isFlat"
        :color="color"
        :disabled="disabled"
        :href="url"
        :loading="loading"
        rel="noopener noreferrer"
        target="_blank"
        @click.stop="onClick"
      >
        <div v-if="customIcon"
             :class="customIconSpace ? 'iconCentering pr-4' : 'iconCentering'">
          <img
            class="envidatIcon"
            :src="customIcon"
            :style="customIconWhiten ? 'filter: brightness(0) invert(1);' : ''"
          />
        </div>

        <v-icon v-if="materialIconName" left :color="iconColor">
          {{ materialIconName }}
        </v-icon>

        {{ buttonText }}
      </v-btn>
    </template>

    <span>{{ tooltipText }}</span>
  </v-tooltip>
</template>

<script>
/**
 * BaseRectangleButton.vue creates a rectangle button with an icon, either a custom icon or a material (material design libery) icon.
 * Similar to @class IconButton
 * React on the 'clicked' event or pass an @prop url to create a href-link.
 *
 * Use the @prop isSmall to make a the button smaller.
 * Fill the @prop tooltipText for a toolTip when hovering over the Button.
 *
 * If @prop outlined is true the button only has an outline in the @prop color.
 * Otherwise the whole button as that color.
 * The @prop iconColor only works for material icons.
 *
 * Set the @prop rotateOnClick to true for the icon to rotate 180° once clicked
 *
 * Use @prop marginClass to apply any css-class to the button, because it's wrapped in the tooltip element.
 *
 * When @prop disabled is true clicks won't do anything.
 *
 * @summary the base EnviDat rectangle button
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2021-08-18 10:26:45
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'BaseRectangleButton',
  props: {
    customIcon: String,
    customIconWhiten: Boolean,
    customIconSpace: Boolean,
    materialIconName: String,
    buttonText: String,
    tooltipText: String,
    isOutlined: Boolean,
    isFlat: Boolean,
    color: {
      type: String,
      default: 'primary',
    },
    iconColor: {
      type: String,
      default: 'primary',
    },
    isSmall: Boolean,
    isXsSmall: Boolean,
    url: String,
    marginClass: String,
    disabled: Boolean,
    loading: Boolean,
    tooltipPosition: {
      type: String,
      default: 'bottom',
    },
  },
  methods: {
    onClick() {
      this.$emit('clicked');
    },
  },
};
</script>

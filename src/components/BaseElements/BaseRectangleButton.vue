<template>
  <v-tooltip v-bind="{ tooltipPosition: true }" :disabled="$vuetify.display.smAndDown || !tooltipText">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" :size="buttonSize" :class="marginClass" :color="color" :variant='buttonStyle'
        :disabled="disabled" :href="url" :loading="loading" :elevation="elevation" rel="noopener noreferrer"
        target="_blank" @click.stop="onClick">

        <BaseIcon v-if="icon" :icon="icon" class='mr-1' />

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
 * Use @prop marginClass to apply any css-class to the button, because it's wrapped in the tooltip element.
 *
 * When @prop disabled is true clicks won't do anything.
 *
 * @summary the base EnviDat rectangle button
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';

export default {
  name: 'BaseRectangleButton',
  props: {
    icon: String,
    buttonText: String,
    tooltipText: String,
    isOutlined: Boolean,
    isFlat: Boolean,
    color: { type: String, default: 'primary' },
    iconColor: { type: String, default: undefined },
    isSmall: Boolean,
    isXsSmall: Boolean,
    url: String,
    marginClass: String,
    disabled: Boolean,
    loading: Boolean,
    tooltipPosition: { type: String, default: 'bottom' },
    elevation: { type: Number, default: undefined },
  },
  computed: {
    buttonSize() {
      if (this.isSmall) {
        return 'small';
      }
      if (this.isXsSmall) {
        return 'xs-small';
      }
      return 'default';
    },
    buttonStyle() {
      if (this.isFlat) return 'plain';

      if (this.isOutlined) return 'outlined';

      return 'elevated';
    },
  },
  methods: {
    onClick() {
      this.$emit('clicked');
    },
  },
  components: { BaseIcon },
};
</script>

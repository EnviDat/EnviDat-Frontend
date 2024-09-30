<template>
  <div class="baseIcon" :class="classList">
    <v-badge
      :model-value="badgeDot ? '' : count >= 0"
      :location="badgeDot ? 'right top' : 'left center'"
      :content="count"
      :color="badgeColor"
      class="envidatBadge"
      :dot="badgeDot"
      :floating="small"
      :class="{
        bigNumber: count > 9
      }"
    >
      <div
        v-if="customIcon"
        role="img"
        :aria-label="`${icon} icon`"
        class="baseIconCustomIcon"
        :style="customIconStyle"
        :class="{ ['bg-' + color]: true }"
        >
      </div>
      <v-icon
        v-else
        class="baseIconFontIcon"
        :size="large ? 'x-large' : small ? 'small' : undefined"
        :color="color"
        :icon="icon" />

    </v-badge>
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
    icon: { type: String, default: undefined, required: true },
    color: { type: String, default: 'primary' },
    small: { type: Boolean, default: false },
    large: { type: Boolean, default: false },
    rotated: { type: Boolean, default: false },
    left: { type: Boolean, default: false },
    right: { type: Boolean, default: false },
    dark: { type: Boolean, default: false },
    light: { type: Boolean, default: false },
    count: { type: Number, default: undefined },
    badgeDot: { type: Boolean, default: false },
    badgeColor: { type: String, default: 'highlight' },
  },
  data: () => ({
  }),
  computed: {
    customIconStyle() {
      return {
        'background-color': this.color,
        '-webkit-mask': `url("${this.customIcon}") center/contain`,
        'mask': `url("${this.customIcon}") center/contain`,
      }
    },
    classList() {
      return {
        'rotated': this.rotated,
        'small': this.small,
        'large': this.large,
        'left': this.left,
        'right': this.right,
        'dark': this.dark,
        'light': this.light,
        [`text-${this.color}`]: this.color,
      }
    },
    customIcon() {
      if (this.icon?.includes('/')){
        return this.icon;
      }
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
.baseIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .baseIconCustomIcon,
  .baseIconFontIcon {
    // The vuetify-3 default is smaller than the old one
    // To keep it consistent force it to be the same size
    height: 24px; // Based on the old v-icon size
    width: 24px; // Based on the old v-icon size
    font-size: 24px;
  }

  &.small {
    .baseIconCustomIcon,
    .baseIconFontIcon {
      height: 15px;
      width: 15px;
      font-size: 15px;
    }
  }

  &.large {
    .baseIconCustomIcon,
    .baseIconFontIcon {
      height: 32px;
      width: 32px;
      font-size: 32px;
    }
  }

  &.rotated {
    transform: rotate(-180deg);
  }

  &.left {
    margin-right: 12px;
  }

  &.right {
    margin-left: 12px;
  }

  &.dark {
    // Make the icon white (to be used in the dark theme)
    filter: brightness(0) invert(1);
  }

  &.light {
    // Make the icon black (to be used in the light theme)
    filter: brightness(0);
  }
}
</style>

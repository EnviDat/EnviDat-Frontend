<template>
  <div class="baseIcon" :class="classList" @click="onClick">
    <div
      v-if="customIcon"
      role="img"
      :aria-label="`${icon} icon`"
      class="baseIconCustomIcon"
      :style="customIconStyle"
      :class="{['bg-' + color]: true}"
    ></div>
    <v-icon
      v-else
      :size="large ? 'x-large' : small ? 'small' : undefined"
      :style="iconStyle"
      :color="color"
      :icon="icon"
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
import {getIcon} from '@/factories/imageFactory';

export default {
  name: 'BaseIcon',
  props: {
    icon: {type: String, default: undefined, required: true },
    color: {type: String, default: 'primary' },
    small: {type: Boolean, default: false },
    large: {type: Boolean, default: false },
    rotated: {type: Boolean, default: false },
    left: {type: Boolean, default: false },
    right: {type: Boolean, default: false },
  },
  data: ()=>({
  }),
  computed: {
    customIconStyle(){
      return {
        '-webkit-mask': `url("${this.customIcon}") center/contain`,
        'mask': `url("${this.customIcon}") center/contain`,
      }
    },
    classList(){
      return {
        'rotated': this.rotated,
        'small': this.small,
        'large': this.large,
        'left': this.left,
        'right': this.right,
        [`text-${this.color}`]: this.color,
      }
    },
    customIcon() {
      if(typeof this.icon === 'string'){
        return getIcon(this.icon);
      }
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>

  .baseIcon {
    transition: 0.3s all ease-in-out;
    height: 24px; // Based on the v-icon size
    width: 24px; // Based on the v-icon size
    display: flex;
    align-items: center;
    justify-items: center;
    position: relative;

    .baseIconCustomIcon {
      height: 100%;
      width: 100%;
    }

    &.small {
      height: 15px; // Based on the v-icon size
      width: 15px; // Based on the v-icon size
    }
    &.large {
      height: 32px; // Based on the v-icon size
      width: 32px; // Based on the v-icon size
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
  }

</style>

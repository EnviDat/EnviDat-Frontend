<template>
  <div class="baseIcon" :class="classList" @click="onClick">

    <img
      v-if="customIcon" 
      :style="imgStyle" 
      class="envidatIcon"
      :alt="`${customIcon} icon`" 
      :src="customIcon"
    />
    <v-icon
      v-else
      :style="iconStyle"
      :color="iconColor"
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
    color: {type: String, default: undefined },
    small: {type: Boolean, default: false },
    big: {type: Boolean, default: false },
    rotated: {type: Boolean, default: false },
    left: {type: Boolean, default: false },
    right: {type: Boolean, default: false },
  },
  data: ()=>({
  }),
  computed: {
    classList(){
      return {
        'rotated': this.rotated,
        'small': this.dense,
        'big': this.spacious,
        'left': this.left,
        'right': this.right,
        [`${this.color}--text`]: this.color,
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
    // TODO: Height should be normalized through sass vars/config for all components
    height: 36px;
    &.rotated {
      transform: rotate(-180deg);
    }
    &.small {
      height: 24px;
      img { height: 24px; }
    }
    &.big {
      height: 48px;
      img { height: 48px; }
    }
    &.left {
      margin-right: 12px;
    }
    &.right {
      margin-left: 12px;
    }

    img {
      height: 36px;
      filter: opacity(.5) drop-shadow(0 0 0 currentColor);
    }
  }

</style>

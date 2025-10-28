<template>
  <div class="baseIconLabelView">
    <v-tooltip location="bottom" :disabled="$vuetify.display.xs || !iconTooltip">
      <template v-slot:activator="{ props }">
        <div
          v-bind="props"
          class="baseIconLabelViewWrapper"
          :class="{
            dark,
            'text-white': dark,
            'text-black': !dark,
          }"
        >
          <div class="baseIconLabelViewIcon">
            <BaseIcon :icon="icon" :dark="dark" :light="light" :color="iconColor" />
          </div>

          <div :style="textStyle">
            <a v-if="url" :href="url" target="_blank" rel="noopener noreferrer">
              {{ text ? text : url }}
            </a>
            <span v-else>
              {{ text }}
            </span>
          </div>
        </div>
      </template>

      <span>{{ iconTooltip }}</span>
    </v-tooltip>
  </div>
</template>

<script>
import BaseIcon from './BaseIcon.vue';

/**
 * BaseIconLabelView.vue creates a field with a label (text or icon) with the given
 * text as well a tooltip.
 *
 * @summary icon as label and text or text as label and text
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2021-08-18 15:45:47
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'BaseIconLabelView',
  components: { BaseIcon },
  props: {
    icon: String,
    iconColor: String,
    iconTooltip: String,
    text: String,
    url: String,
    dark: Boolean,
    light: Boolean,
  },
  computed: {
    iconAlt() {
      return this.iconTooltip ?? this.label ?? `${this.icon} + icon`;
    },
    textStyle() {
      return {
        'font-size': this.$vuetify.display.smAndDown ? 'font-size: 0.85rem;' : undefined,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
$icon-size: 24px;

.baseIconLabelViewWrapper {
  display: inline-flex;
  align-items: center;
}

.baseIconLabelViewIcon {
  height: $icon-size;
  width: $icon-size;
  margin-right: 12px;

  /*
=======
.BaseIconLabelViewIcon {
  &.dark {
    // Make the icon white
    filter: brightness(0) invert(1);
  }
  height: $icon-size;
  width: $icon-size;
  margin-right: 12px;
>>>>>>> develop
*/

  img {
    user-select: none;
    object-fit: contain;
    height: $icon-size;
    width: $icon-size;
  }
}
</style>

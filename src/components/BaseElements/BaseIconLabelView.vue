<template>
  <div class="BaseIconLabelView">
    <v-tooltip bottom :disabled="$vuetify.breakpoint.xsOnly || !iconTooltip">
      <template v-slot:activator="{ on }">
        <div v-on="on" class="BaseIconLabelViewWrapper">
          <div class="BaseIconLabelViewIcon" :class="{dark}">
            <img
              v-if="icon"
              :class="compactLayout ? 'small' : ''"
              :src="icon"
              :alt="iconAlt"
            />
            <v-icon v-else :dark="dark">{{ materialIconName }}</v-icon>
          </div>
          
          <div class="BaseIconLabelViewText" :style="textStyle">
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
  props: {
    icon: String,
    materialIconName: String,
    iconTooltip: String,
    text: String,
    url: String,
    dark: Boolean,
  },
  computed: {
    iconAlt() {
      return this.iconTooltip ?? this.label ?? `${this.icon} + icon`;
    },
    textStyle() {
      return {
        'font-size': this.$vuetify.breakpoint.smAndDown ? 'font-size: 0.85rem;' : undefined,
      }
    },
  },
};
</script>

<style lang="scss">

$icon-size: 24px;

.BaseIconLabelViewWrapper {
  display: inline-flex;
  align-items: center;
}

.BaseIconLabelViewText {
  // TODO: Remove this once a sensible default font was chosen
  font-family: sans-serif !important;
}

.BaseIconLabelViewIcon {
  &.dark {
    filter: brightness(0) invert(1);
  }
  height: $icon-size;
  width: $icon-size;
  margin-right: 12px;
  img {
    object-fit: contain;
    height: $icon-size;
    width: $icon-size;
  }
}

</style>

<template>
  <div>
    <v-tooltip bottom :disabled="$vuetify.breakpoint.xsOnly || !iconTooltip">
      <template v-slot:activator="{ on }">
        <v-row
          v-on="on"
          class="BaseIconLabelView"
          no-gutters
          align="center"
        >
          <v-col v-if="icon" :class="alignClass">
            <img
              class="envidatIcon"
              :class="compactLayout ? 'small' : ''"
              :src="icon"
              :alt="iconAlt"
            />
          </v-col>
          <v-col v-else-if="materialIconName">
            <v-icon :dark="dark">{{ materialIconName }}</v-icon>
          </v-col>

          <v-col v-if="text && !url" :style="textStyle">
            <a v-if="url" :href="url" target="_blank" rel="noopener noreferrer">
              {{ text ? text : url }}
            </a>
            <span v-else>
              {{ text }}
            </span>
          </v-col>
          <v-col v-if="!text && usePlaceholder">
            <div
              class="pr-1 skeleton skeleton-size-normal skeleton-color-concrete skeleton-animation-shimmer"
            >
              <div class="bone bone-type-text bone-style-steps" />
            </div>
          </v-col>
        </v-row>
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
    alignLeft: Boolean,
    bold: Boolean,
    usePlaceholder: Boolean,
    wordBreak: Boolean,
    compactLayout: Boolean,
    dark: Boolean,
  },
  computed: {
    iconAlt() {
      return this.iconTooltip ?? this.label ?? `${this.icon} + icon`;
    },
    textStyle() {
      let style = '';

      if (this.bold) {
        style = 'font-weight: 700 !important;';
      }

      if (this.wordBreak) {
        style += 'word-break: break-word;';
      }

      if (this.$vuetify.breakpoint.smAndDown) {
        style += 'font-size: 0.85rem;';
      }

      return style;
    },
  },
};
</script>

<style>
.iconCentering {
  position: relative;
  top: 2px;
}
</style>

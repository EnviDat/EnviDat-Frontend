<template>
  <v-tooltip bottom
              id="BaseIconLabelView"
              :disabled="$vuetify.breakpoint.xsOnly || !iconTooltip" >

    <template v-slot:activator="{ on }">
    <v-row v-on="on"
          no-gutters
          align="center" >

      <v-col v-if="icon && iconTooltip"
            :class="alignClass"
            class="iconCentering shrink"
            style="position: relative: top: 2px; max-width: 100%" >

        <img class="envidatIcon"
              :class="compactLayout ? 'small' : ''"
              :src="icon"
              :alt="`${icon} icon`" >
      </v-col>

      <v-col v-if="icon && !iconTooltip"
              cols="2"
              style="max-width: 100%" >

        <div class="iconCentering">
          <img class="envidatIcon"
                :class="compactLayout ? 'small' : ''"
                :src="icon"
                :alt="`${icon} icon`" >
        </div>
      </v-col>

      <v-col v-if="label"
              cols="4"
              :style="textStyle" >
        {{ label }}
      </v-col>

      <v-col v-if="text && !url"
              :style="textStyle" >
        {{ text }}
      </v-col>

      <v-col v-if="url"
              :style="textStyle" >
        <a :href="url" target="_blank" rel="noopener noreferrer">{{ text ? text : url }}</a>
      </v-col>

      <v-col v-if="!text && usePlaceholder">
        <div class="pr-1 skeleton skeleton-size-normal skeleton-color-concrete skeleton-animation-shimmer" >
          <div class="bone bone-type-text bone-style-steps" />
        </div>
      </v-col>
    </v-row>
    </template>

    <span>{{ iconTooltip }}</span>
  </v-tooltip>
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
 * Last modified  : 2019-11-28 16:15:58
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'BaseIconLabelView',
  props: {
    icon: String,
    iconTooltip: String,
    label: String,
    text: String,
    url: String,
    alignLeft: Boolean,
    bold: Boolean,
    usePlaceholder: Boolean,
    wordBreak: Boolean,
    compactLayout: Boolean,
  },
  computed: {
    alignClass() {
      return {
        'col-2': !this.alignLeft,
        'pl-1': !this.alignLeft,
        'px-1': this.alignLeft,
      };
    },
    textStyle() {
      let style = '';

      if (this.bold) {
        style = 'font-weight: 700 !important;';
      }

      if (this.wordBreak) {
        style += 'word-break: break-all;';
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

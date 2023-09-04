<template>
  <v-chip
    class="stateChip"
    :class="{
        stateChipHover: !this.showContent,
        'px-3': true,
      }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :color="stateColor"
    :style="!showContent ? 'font-size: 0.9rem;' : ''"
  >
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-row v-on="on"
               align="center"
                no-gutters>
          <v-col >{{ showContent ? stateText : stateText.substring(0, 1) }}</v-col>
          <v-col v-show="showContent" class="pl-1"><v-icon>{{ stateIcon }}</v-icon></v-col>
        </v-row>
      </template>

      <span>{{ stateTooltip }}</span>
    </v-tooltip>
  </v-chip>
</template>

<script>
/**
 * MetadataStateChip.vue show the publication state of a metadata entry
 *
 * @summary show the publication state
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-12-14 14:19:00
 * Last modified  : 2021-12-14 14:19:00
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'MetadataStateChip',
  props: {
    state: {
      type: String,
      default: 'draft',
    },
    tooltipMap: {
      type: Object,
      default: () => ({
        draft: 'Draft datasets are only visible to you',
        unpublished:
          'Unpublished datasets are visible for you and your organization',
        published: 'Published datasets are visible for everyone',
      }),
    },
    colorMap: {
      type: Object,
      default: () => ({
        draft: 'gray',
        unpublished: 'warning',
        published: 'green',
      }),
    },
    iconMap: {
      type: Object,
      default: () => ({
        draft: 'edit_note',
        unpublished: 'public_off',
        published: 'public',
      }),
    },
    showOnHover: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    stateText() {
      return this.state?.toUpperCase() || 'DRAFT';
    },
    stateLowerCase() {
      return this.state.toLowerCase();
    },
    stateTooltip() {
      return this.tooltipMap[this.stateLowerCase];
    },
    stateColor() {
      return this.colorMap[this.stateLowerCase];
    },
    stateIcon() {
      return this.iconMap[this.stateLowerCase];
    },
    showContent() {
      return !this.showOnHover || (this.showOnHover && this.hover);
    },
  },
  data: () => ({
    hover: false,
  }),
};
</script>

<style scoped>
.stateChip {
  height: 1.65rem;
  font-size: 0.75rem;
}

.stateChipHover > .v-chip__content > div:nth-child(1) {
  font-weight: 700;
}
</style>

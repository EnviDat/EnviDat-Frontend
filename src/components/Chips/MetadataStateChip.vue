<template>
  <v-chip
    class="stateChip"
    :class="cssClasses"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :color="stateColor"
    :style="!showContent ? 'font-size: 0.9rem;' : ''"
  >
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <div v-on="on">
          {{ showContent ? stateText : stateText.substring(0, 1) }}
        </div>
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
      default: '',
    },
    tooltipMap: {
      type: Object,
      default: () => ({
        draft: 'Draft datasets are only visible to you',
        unpublished:
          'Unpublished datasets are visible for you and your organization',
        pending: 'Publication request received, dataset is not yet visible for everyone',
        published: 'Published datasets are visible for everyone',
      }),
    },
    colorMap: {
      type: Object,
      default: () => ({
        draft: 'gray',
        unpublished: 'warning',
        pending: 'blue',
        published: 'green',
      }),
    },
    showOnHover: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cssClasses() {
      const classes = {
        stateChipHover: !this.showContent,
      };

      classes['px-3'] = (this.showOnHover && this.hover) || !this.showOnHover;
      classes['px-2'] = this.showOnHover && !this.hover;

      return classes;
    },
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
  height: 1.5rem;
  font-size: 0.75rem;
}

.stateChipHover > .v-chip__content > div:nth-child(1) {
  font-weight: 700;
}
</style>

<template>
  <v-chip
    class="stateChip"
    :class="{
        stateChipHover: !this.showContent,
        'px-2': true,
      }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :color="stateColor"
    :style="!showContent ? 'font-size: 0.9rem;' : ''"
  >
    <v-tooltip bottom>
      <template v-slot:activator="{ on, props }">
        <v-row v-on="on"
               v-bind="props"
               align="center"
                no-gutters>
          <v-col ><v-icon :icon="stateIcon" /></v-col>
          <v-col :class="showContent ? 'pl-1' : ''" >
            {{ showContent ? stateText : ''  }}
          </v-col>
        </v-row>
      </template>

      <span>{{ stateTooltip }}</span>
    </v-tooltip>
  </v-chip>
</template>

<script>/**
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
import {
  METADATA_STATE_DRAFT,
  METADATA_STATE_INVISILBE,
  METADATA_STATE_VISILBE,
} from '@/factories/metadataConsts';

export default {
  name: 'MetadataStateChip',
  props: {
    state: {
      type: String,
      default: METADATA_STATE_DRAFT,
    },
    tooltipMap: {
      type: Object,
      default: () => ({
        [METADATA_STATE_DRAFT]: 'Draft datasets are only visible to you',
        [METADATA_STATE_INVISILBE]:
          'Dataset is hidden, only you and members from your organization can see it',
        [METADATA_STATE_VISILBE]: 'Visible datasets are publicly visible for everyone',
      }),
    },
    colorMap: {
      type: Object,
      default: () => ({
        [METADATA_STATE_DRAFT]: 'gray',
        [METADATA_STATE_INVISILBE]: 'warning',
        [METADATA_STATE_VISILBE]: 'green',
      }),
    },
    iconMap: {
      type: Object,
      default: () => ({
        [METADATA_STATE_DRAFT]: 'edit_note',
        [METADATA_STATE_INVISILBE]: 'visibility_off',
        [METADATA_STATE_VISILBE]: 'visibility',
      }),
    },
    showOnHover: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    stateText() {
      return this.state?.toUpperCase() || METADATA_STATE_DRAFT.toUpperCase();
    },
    stateLowerCase() {
      return this.stateText.toLowerCase();
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

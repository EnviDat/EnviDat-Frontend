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
    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <v-row v-bind="props" align="center" no-gutters class="flex-nowrap">
          <v-col>
            <v-icon :icon="stateIcon" />
          </v-col>
          <v-col :class="showContent ? 'px-1' : ''">
            {{ showContent ? stateText : '' }}
          </v-col>
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
import { mdiEye, mdiEyeOff, mdiPlaylistEdit } from '@mdi/js';
import { METADATA_STATE_DRAFT, METADATA_STATE_INVISIBLE, METADATA_STATE_VISIBLE } from '@/factories/metadataConsts';

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
        [METADATA_STATE_INVISIBLE]: 'Dataset is hidden, only you and members from your organization can see it',
        [METADATA_STATE_VISIBLE]: 'Visible datasets are publicly visible for everyone',
      }),
    },
    colorMap: {
      type: Object,
      default: () => ({
        [METADATA_STATE_DRAFT]: '#e0e0e0',
        [METADATA_STATE_INVISIBLE]: '#f3dd93',
        [METADATA_STATE_VISIBLE]: 'green',
      }),
    },
    iconMap: {
      type: Object,
      default: () => ({
        [METADATA_STATE_DRAFT]: mdiPlaylistEdit,
        [METADATA_STATE_INVISIBLE]: mdiEyeOff,
        [METADATA_STATE_VISIBLE]: mdiEye,
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
  width: auto;
}

.stateChipHover > .v-chip__content > div:nth-child(1) {
  font-weight: 700;
}
</style>

<template>
  <v-card id="resourceDescription" flat class="pa-4 rounded-lg" color="transparent">
    <v-card-text class="pa-0">
      <v-row no-gutters>
        <v-col
          v-if="showFullDescription || (!showFullDescription && !maxDescriptionLengthReached)"
          class="heightAndScroll"
          :style="`scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack}`"
        >
          <div class="resourceCardText" v-html="markdownText" />
        </v-col>

        <v-col v-if="!showFullDescription && maxDescriptionLengthReached" class="resourceCardText">
          {{ markdownTextTruncated }}
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="ma-0" style="position: absolute; bottom: 0; right: 0; width: 52px; z-index: 2">
      <v-row no-gutters>
        <v-col v-if="maxDescriptionLengthReached" class="pa-0">
          <BaseIconButton
            :icon="mdiChevronDown"
            :icon-color="showFullDescription ? 'secondary' : 'white'"
            :color="showFullDescription ? 'transparent' : 'secondary'"
            :outlined="!!showFullDescription"
            outline-color="secondary"
            :rotated="showFullDescription"
            :tooltipText="showFullDescription ? 'Hide full description' : 'Show full description'"
            @clicked="showFullDescription = !showFullDescription"
          />
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
/**
 * ResourceCard.vue create a card with a download link to a specific resource of a dataset.
 *
 * @summary card with download link of file or link to another downlaod
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-08-18 10:46:54
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mdiChevronDown } from '@mdi/js';

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

import { renderMarkdown, stripMarkdown } from '@/factories/stringFactory';

export default {
  name: 'ResourceDescription',
  components: {
    BaseIconButton,
  },
  props: {
    description: String,
    deprecated: Boolean,
    cardColor: {
      type: String,
      default: 'primary',
    },
    maxDescriptionLength: {
      type: Number,
      default: 475,
    },
  },
  mounted() {},
  beforeUnmount() {
    // reset store before unmount the component
  },
  computed: {
    computedCardColor() {
      return this.deprecated ? 'grey' : this.$vuetify.theme.themes.light.colors[this.cardColor];
    },
    scrollbarColorFront() {
      return this.$vuetify ? this.$vuetify.theme.themes.light.colors.highlight : 'auto';
    },
    scrollbarColorBack() {
      return this.$vuetify ? '#F0F0F0' : 'auto';
    },
    markdownText() {
      if (!this.description) {
        return 'No description available.';
      }

      return renderMarkdown(this.description.trim());
    },
    markdownTextTruncated() {
      if (!this.description) {
        return '';
      }

      if (this.maxDescriptionLengthReached) {
        const strippedMarkdown = stripMarkdown(this.description.trim());

        return strippedMarkdown ? `${strippedMarkdown.substring(0, this.maxDescriptionLength)}...` : '';
      }

      return this.description.trim();
    },
    maxDescriptionLengthReached() {
      return this.description && this.description.length > this.maxDescriptionLength;
    },
  },
  methods: {},
  data: () => ({
    mdiChevronDown,
    showFullDescription: false,
  }),
};
</script>

<style lang="scss" scoped>
.fabPosition {
  position: absolute;
  bottom: 0;
  right: 0;
}

.fabMenu {
  width: 48px;
  height: 48px;
  background-color: #ffd740;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fabMenuDisabled {
  opacity: 0.5;
  background-color: grey !important;
}

.fabMenuHover:hover,
.fabMenuHover:active {
  background: #fff;
  color: black !important;
  min-width: 160px;
  min-height: 160px;
  width: 100%;
  height: 100%;
  border-radius: 3px 3px;
  display: inherit;
  padding: 8px;

  a {
    color: rgb(var(--v-theme-primary)) !important;
  }

  .lockedText {
    display: inherit;
    opacity: 1;
  }
}
</style>

<style>
.resourceCardText p a {
  color: #ffd740 !important;
}
.resourceCardText,
.resourceCardText p {
  margin: 0;
  font-size: 1rem;
}
</style>

<style scoped>
.resourceHeadline {
  line-height: 1.5rem;
}

.black_title {
  color: rgba(0, 0, 0, 0.87) !important;
}

.white_title {
  color: rgba(255, 255, 255, 0.9) !important;
}

.heightAndScroll {
  max-height: 400px;
  overflow-y: auto !important;
  scrollbar-width: thin;
}

.lockedText {
  display: none;
  opacity: 0;
}

.resourceInfo {
  font-size: 12px !important;
  line-height: 0.8rem !important;
  opacity: 0.9;
}

.protectedLink {
  font-size: 12px;
  overflow: hidden;
}

.highlighted {
  box-shadow: #ffd740 0 0 5px 5px !important;
}
</style>

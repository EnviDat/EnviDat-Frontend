<template>
  <v-card id="MetadataDetails"
  >
    <v-card-title class="text-h6 metadata_title py-4">
      {{ METADATA_DETAILS_TITLE }}
    </v-card-title>

    <v-card-text
      v-if="details && details.length > 0"
      class="pa-4 pt-0 readableText"
    >
      <v-form>
        <div v-for="val in details" :key="val.label" class="mt-2">
          <v-text-field
            v-if="isSingleText(val.text)"
            :id="val.label"
            :label="val.label"
            :name="val.label"
            :model-value="replaceAuthorDeadInfo(val.text)"
            hide-details
            readonly
          />

          <v-textarea
            v-if="!isSingleText(val.text)"
            :id="val.label"
            :label="val.label"
            :name="val.label"
            :model-value="replaceAuthorDeadInfo(val.text)"
            hide-details
            readonly
          />
        </div>
      </v-form>
    </v-card-text>

    <v-card-text
      v-if="!showPlaceholder && (!details || details.length <= 0)"
      :style="`color: ${emptyTextColor};`"
      class="pa-4 pt-0 readableText"
    >
      {{ emptyText }}
    </v-card-text>

    <v-card-text v-if="showPlaceholder" class="pa-4 pt-0">
      <v-row v-for="n in 5" :key="n + 'label'" no-gutters>
        <div
          class="flex xs2 pr-2 skeleton skeleton-size-normal skeleton-color-concrete skeleton-animation-shimmer"
        >
          <div class="bone bone-type-text " />
        </div>

        <div
          class="flex xs10 pl-2 skeleton skeleton-size-normal skeleton-color-concrete skeleton-animation-shimmer"
        >
          <div class="bone bone-type-text " />
        </div>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
/**
 * MetadataDetails.vue shows the detailed information about the
 * metadata entry in a form.
 *
 * @summary shows the detail infos of a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2020-10-22 15:24:52
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { METADATA_DETAILS_TITLE } from '@/factories/metadataConsts';
import { AUTHOR_ASCII_DEAD } from '@/store/mainMutationsConsts';

export default {
  name: 'MetadataDetails',
  components: {},
  props: {
    details: {
      type: Array,
      default: () => [],
    },
    emptyTextColor: {
      type: String,
      default: 'red',
    },
    emptyText: {
      type: String,
      default: 'No details found for this dataset.',
    },
    showPlaceholder: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    maxSingleTextLengthLg: 80,
    maxSingleTextLengthMd: 80,
    maxSingleTextLengthXs: 70,
    METADATA_DETAILS_TITLE,
  }),
  computed: {
  },
  methods: {
    replaceAuthorDeadInfo(text) {
      if (!text) {
        return '';
      }

      return text
        .replace(`(${AUTHOR_ASCII_DEAD})`, '')
        .trim();
    },
    isSingleText: function isSingleText(text) {
      if (!text || text.length <= 0) {
        return true;
      }

      if (this.$vuetify.display.xs) {
        return text.length <= this.maxSingleTextLengthXs;
      }

      if (this.$vuetify.display.mdAndDown) {
        return text.length <= this.maxSingleTextLengthMd;
      }

      return text.length <= this.maxSingleTextLengthLg;
    },
  },
};
</script>

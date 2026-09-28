<template id="MetadataRenku">
  <v-card v-if="loading">
    <v-skeleton-loader type="heading, paragraph, actions" />
  </v-card>

  <v-card v-else>
    <v-card-title class="pl-4 pr-4">
      <div class="d-flex align-center justify-space-between ga-2">
        <span>{{ METADATA_RENKU_TITLE }}</span>

        <v-img :src="renkuLogo" width="80" height="80" max-width="80" class="flex-grow-0" />
      </div>
    </v-card-title>

    <v-card-text>
      <p class="mb-4 pb-4">{{ description }}</p>

      <div class="d-flex flex-wrap align-center pa-4 justify-end ga-2">
        <BaseRectangleButton
          v-for="link in data"
          :key="link.id"
          margin-class="citationButton"
          color="highlight"
          :button-text="link.title"
          :tooltip-text="link.tooltipText"
          :icon="mdiClipboardText"
          :is-small="true"
          icon-color="white"
          :url="link.url"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
/**
 * MetadataDescription.vue renders markdown showing the description of the metadatas.
 *
 * @summary shows the description of a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2020-10-15 19:10:50
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mdiClipboardText } from '@mdi/js';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import { METADATA_RENKU_TITLE } from '@/factories/metadataConsts';
import renkuLogo from '@/assets/externalLogo/renkuLogo.svg';

export default {
  name: 'MetadataRenku',
  components: {
    BaseRectangleButton,
  },
  props: {
    description: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    METADATA_RENKU_TITLE,
    mdiClipboardText,
    renkuLogo,
  }),
};
</script>

<style scoped></style>

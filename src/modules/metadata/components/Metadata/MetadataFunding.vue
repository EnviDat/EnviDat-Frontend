<template>
  <v-card id="MetadataFunding" >

    <v-card-title class="metadata_title text-h6">
      {{ METADATA_FUNDING_TITLE }}
    </v-card-title>

    <v-card-title v-if="showPlaceholder" >
      <v-skeleton-loader type='paragraph' color='gray' />
    </v-card-title>

    <v-card-text v-if="fundingField"
                  ref="funding"
                  :style="`overflow-x: hidden; scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack}`"
                  class="pa-4 pt-0 readableText heightAndScroll" >

      <v-row >
        <v-col cols="12" >
          {{ preText }}
        </v-col>
      </v-row>

      <v-row >
        <v-col v-for="(item, index) in fundingItems"
                :key="index"
                cols="12"
                sm="6"
                xl="4"
                class="flex-grow-0">

          <v-row v-if="showFundingItem(item)"
                  no-gutters >
            <v-col v-if="item.institutionUrl" >
              <a :href="item.institutionUrl"
                  rel="noopener noreferrer"
                  target="_blank">
                <strong>{{ item.institution }}</strong>
              </a>
            </v-col>

            <v-col v-else >
              <strong>{{ item.institution }}</strong>
            </v-col>
          </v-row>

          <v-row v-if="showFundingItem(item) && item.grantNumber"
                  no-gutters
                  class="pt-2">
            <v-col>Grant/Award: {{ item.grantNumber }}</v-col>
          </v-row>

        </v-col>
      </v-row>

    </v-card-text>

    <v-card-text v-if="showPlaceholder && !funding"
                  class="pa-4 pt-0" >
      <v-skeleton-loader type='paragraph' color='gray' />
    </v-card-text>

    <v-card-text v-if="!showPlaceholder && !funding"
                  class="pa-4 pt-0 readableText"
                  :style="`color: ${emptyTextColor};`" >
      {{ emptyText }}
    </v-card-text>

  </v-card>
</template>

<script>
/**
 * MetadataFunding.vue renders markdown showing the Related Funding of the metadatas.
 *
 * @summary shows the Related Funding of a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-01-06 16:34:12
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import { METADATA_FUNDING_TITLE } from '@/factories/metadataConsts';

export default {
  name: 'MetadataFunding',
  components: {
  },
  props: {
    funding: {
      type: Array,
      default: undefined, // () => [],
    },
    emptyTextColor: {
      type: String,
      default: 'grey',
    },
    emptyText: {
      type: String,
      default: 'No information about funding available for this dataset.',
    },
    showPlaceholder: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    fundingField() {
      const funding = this.funding;

      if (funding) {
        let notAvailable = 0;

        for (let i = 0; i < funding.length; i++) {
          const item = funding[i];
          if (!this.showFundingItem(item)) {
            notAvailable++;
          }
        }

        if (notAvailable === funding.length) {
          return null;
        }
      }

      return funding;
    },
    fundingItems() {
      if (!this.fundingField) return null;

      return Object.values(this.fundingField);
    },
    scrollbarColorFront() {
      return this.$vuetify ? this.$vuetify.theme.themes.light.colors.highlight : 'auto';
    },
    scrollbarColorBack() {
      return this.$vuetify ? '#F0F0F0' : 'auto';
    },
  },
  methods: {
    showFundingItem(item) {
      // console.log('item.institution ' + item.institution);
      return item.institution && !item.institution.includes('not available');
    },
  },
  data: () => ({
    METADATA_FUNDING_TITLE,
    preText: 'This work was supported by:',
  }),
};
</script>

<style scoped>

  .heightAndScroll {
    max-height: 750px;
    overflow-y: auto !important;
    scrollbar-width: thin;
  }

</style>

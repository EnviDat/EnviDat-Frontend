<template>
  <v-card id="MetadataFunding" >

    <v-card-title class="metadata_title title">
      {{ METADATA_FUNDING_TITLE }}
    </v-card-title>
    
    <v-card-title v-if="showPlaceholder" >
      <div class="skeleton skeleton-size-normal skeleton-color-concrete skeleton-animation-shimmer"
            style="width: 100%;">
        <div class="bone bone-type-heading" />
      </div>
    </v-card-title>

    <v-card-text v-if="fundingItems"
                  ref="funding"
                  style="overflow-x: hidden;"
                  class="pa-4 pt-0 readableText heightAndScroll" >

      <v-row >
        <v-col cols="12" >
          {{ preText }}
        </v-col>
      </v-row>
      
      <v-row >
        <v-col v-for="(item, index) in fundingItems"
                :key="index"
                cols="6" md="4">

          <v-row v-if="showFundingItem(item)"
                  no-gutters >
            <v-col v-if="item.institution_url" >
              <a :href="item.institution_url"
                  rel="noopener noreferrer"
                  target="_blank">
                <strong>{{ item.institution }}</strong>
              </a>
            </v-col>

            <v-col v-else >
              <strong>{{ item.institution }}</strong>
            </v-col>
          </v-row>

          <v-row v-if="showFundingItem(item) && item.grant_number"
                  no-gutters
                  class="pt-2">
            <v-col>(Grant/Award:{{ item.grant_number }})</v-col>
          </v-row>

        </v-col>
      </v-row>

    </v-card-text>

    <v-card-text v-if="showPlaceholder && !funding"
                  class="pa-4 pt-0" >
      <div class="skeleton skeleton-size-normal skeleton-color-concrete skeleton-animation-shimmer">
        <div class="bone bone-type-multiline bone-style-paragraph" />
      </div>
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
    genericProps: Object,
    showPlaceholder: Boolean,
  },
  computed: {
    funding() {
      const funding = this.mixinMethods_getGenericProp('funding');

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
      if (!this.funding) return null;

      return Object.values(this.funding);
    },
    emptyTextColor() {
      return this.mixinMethods_getGenericProp('emptyTextColor', 'grey');
    },
    emptyText() {
      return this.mixinMethods_getGenericProp('emptyText', 'No information about funding available for this dataset.');
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

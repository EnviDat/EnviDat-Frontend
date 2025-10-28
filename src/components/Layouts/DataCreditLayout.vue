<template>
  <v-container id="DataCreditLayout"
               class="px-0 py-1 readableText"
               fluid
               style="min-height: 67px;">

    <v-row no-gutters>
      <v-col cols="12"
              :class="dark ? 'text-white' : 'text-black'" >
        {{ badgesLabel }}
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col v-if="!hasDataCreditCounts"
              cols="12"
              class="pt-1"
              :class="dark ? 'text-white' : 'text-black'"
              style="opacity: 0.65">
        {{ noCreditslabel }}
      </v-col>

      <v-col v-show="showZero || (!showZero && dataCreditCounts[index] > 0)"
              v-for="(creditName, index) in dataCreditNames"
              :key="index"
              class="flex-grow-0 pt-3 pt-md-4 px-1" >

      <v-hover v-slot="{ props }" >
        <v-badge v-bind="props"
                 class="dataCreditIcon"
                 bordered
                 :color="badgeColor"
                 :content="dataCreditCounts[index]"
        >
<!--
          :overlap="!isHovering"
-->

          <v-tooltip location='bottom' >
            <template v-slot:activator="{ props }">
              <BaseIcon v-bind="props"
                        class="pa-1"
                        :icon="iconLookup(creditName)"
                        :color="iconColor"
              />
            </template >

            {{ `Author made ${dataCreditCounts[index]} ${creditName} contribution${ dataCreditCounts[index] > 1 ? 's': ''}` }}
          </v-tooltip>
        </v-badge>
      </v-hover>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { getDataCreditIcon } from '@/factories/authorFactory';
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';

export default {
  name: 'DataCreditLayout',
  components: {
    BaseIcon,
  },
  props: {
    totalDataCredits: Object,
    iconColor: String,
    badgeColor: String,
    dark: Boolean,
    showZero: {
      type: Boolean,
      default: false,
    },
    badgesLabel: {
      type: String,
      default: 'Overall Data Credit Contributions',
    },
    noCreditslabel: {
      type: String,
      default: 'No data credit declarations',
    },
  },
  computed: {
    dataCreditNames() {
      let names = [];

      if (this.totalDataCredits) {
        names = Object.keys(this.totalDataCredits);
      }

      return names;
    },
    dataCreditCounts() {
      let counts = [];

      if (this.totalDataCredits) {
        counts = Object.values(this.totalDataCredits);
      }

      return counts;
    },
    hasDataCreditCounts() {
      for (let i = 0; i < this.dataCreditCounts.length; i++) {
        const count = this.dataCreditCounts[i];
        if (count > 0) {
          return true;
        }
      }

      return false;
    },
  },
  methods: {
    iconLookup(creditName) {
      return getDataCreditIcon(creditName);
    },
  },
};
</script>

<style >

 .dataCreditIcon {
   opacity: 0.75;
 }

 .dataCreditBadge > span {
    bottom: -25px !important;
    right: 0 !important;
  }

  .dataCreditBadge.text-black > span > span {
    color: #000 !important;
    caret-color: #000 !important;
  }

  .dataCreditBadge.text-white > span > span {
    color: #fff !important;
    caret-color: #fff !important;
  }

</style>

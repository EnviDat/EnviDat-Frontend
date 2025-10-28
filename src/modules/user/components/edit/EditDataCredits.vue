<template>
  <v-container id="EditDataCredits" class="px-0 py-1 readableText" fluid style="min-height: 67px">
    <v-row no-gutters>
      <v-col cols="12" :class="dark ? 'text-white' : 'text-black'">
        {{ instruction }}
      </v-col>
    </v-row>

    <v-row no-gutters justify="start">
      <v-col v-for="(creditName, index) in allDataCredits" :key="index" class="flex-grow-0 mt-3 mt-md-4 mx-md-1">
        <BaseIconToggleButton
          :active="isActive(creditName)"
          :icon="iconLookup(creditName)"
          :value="creditName"
          :tooltip="iconTooltip(creditName)"
          :disabled="readOnly"
          :dark="dark"
          @clicked="catchCreditClick"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiCheck } from '@mdi/js';
import { getDataCreditIcon } from '@/factories/authorFactory';
import BaseIconToggleButton from '@/components/BaseElements/BaseIconToggleButton.vue';

/**
 * @summary Component to edit the data credits of an author
 * @author Dominik Haas-Artho
 *
 * Created at     : 2022-04-14 18:19:22
 * Last modified  : 2022-04-14 18:19:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'EditDataCredits',
  props: {
    instruction: {
      type: String,
      default: 'Choose the Data Credits for this dataset',
    },
    dataCredit: {
      type: Array,
      default: () => [],
    },
    allDataCredits: {
      type: Array,
      default: () => ['software', 'supervision', 'curation', 'collection', 'validation', 'publication'],
    },
    authorName: {
      type: String,
      default: '',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    creditIconColor(creditName) {
      const active = this.isActive(creditName);

      if (this.dark) {
        if (active) {
          return 'black';
        }
        return 'white';
      }

      if (active) {
        return 'white';
      }

      return 'black';
    },
    iconTooltip(creditName) {
      const active = this.isActive(creditName);

      if (!active) {
        return `No <b>${creditName}</b> contribution`;
      }

      return `${this.authorName ? this.authorName : 'Author'} has <b>${creditName}</b> contribution for this dataset`;
    },
    catchCreditClick(creditName) {
      this.$emit('creditClick', creditName);
    },
    isActive(creditName) {
      return this.dataCredit?.includes(creditName) || false;
    },
    iconLookup(creditName) {
      return getDataCreditIcon(creditName);
    },
  },
  data: () => ({
    mdiCheck,
  }),
  components: {
    BaseIconToggleButton,
  },
};
</script>

<style scoped>
.dataCreditIcon {
  opacity: 0.75;
}
</style>

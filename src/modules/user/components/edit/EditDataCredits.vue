<template>
  <v-container id="EditDataCredits"
               class="px-0 py-1 readableText"
               fluid
               style="min-height: 67px;">

    <v-row no-gutters>
      <v-col cols="12"
             :class="dark ? 'white--text' : 'black--text'" >
        {{ instruction }}
      </v-col>
    </v-row>

    <v-row no-gutters>

      <v-col v-for="(creditName, index) in allDataCredits"
             :key="index"
             class="shrink pt-3 pt-md-4 px-md-1" >

        <v-hover v-slot:default="{ hover }" >

          <v-badge :value="isActive(creditName)"
                   class="dataCreditIcon"
                   :disabled="readOnly"
                   :overlap="!hover"
                   style="width: 28px; height: 28px;"
                   @click="catchCreditClick(creditName)"
                   :color="dark ? 'white' : 'black'" >

            <v-icon :color="dark ? 'black' : 'white'"
                    size="14px"
                    style="left: 14px; bottom: 1px;">
              checked
            </v-icon>

            <v-tooltip bottom >
              <template v-slot:activator="{ on }">
                <v-icon v-on="on"
                        class="pa-1"
                        :color="creditIconColor(creditName)"
                        :disabled="readOnly"
                        @click="catchCreditClick(creditName)" >
                  {{ iconLookup(creditName) }}
                </v-icon>
              </template >

              <div v-html="iconTooltip(creditName)" />

            </v-tooltip>
          </v-badge>
        </v-hover>


      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getDataCreditIcon } from '@/factories/authorFactory';

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
    allDataCredits:  {
      type: Array,
      default: () => [
        'software',
        'supervision',
        'curation',
        'collection',
        'validation',
        'publication',
      ],
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
  mounted() {
  },
  computed: {
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
    catchCreditClick(creditName){
      this.$emit('creditClick', creditName)
    },
    isActive(creditName){
      return this.dataCredit?.includes(creditName) || false;
    },
    iconLookup(creditName) {
      return getDataCreditIcon(creditName);
    },
  },
  data: () => ({
  }),
  components: {
  },
};
</script>

<style scoped>

.dataCreditIcon {
  opacity: 0.75;
}
</style>

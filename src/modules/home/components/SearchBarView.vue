<template>
  <v-card hover raised style="width: 100%;">
    <v-container fluid style="width: 100%;">
      <v-row align="center"
              justify="space-between"
              class="grow"
              no-gutters >

        <v-col class="grow py-1 pr-4 " >
          <v-text-field class="ma-0"
                        v-model="searchText"
                        prepend-icon="search"
                        hide-details
                        dense
                        :label="labelText"
                        @click:prepend="clicked"
                        @keyup.enter="clicked" />
        </v-col>

        <v-col class="shrink py-0" >
          <base-rectangle-button :button-text="buttonText"
                                  :is-small="true"
                                  @clicked="clicked" />
        </v-col>

      </v-row>
    </v-container>

  </v-card>
</template>

<script>
/**
 * SearchBarView.vue is a broad search bar to jump to the browsepage.
 *
 * @summary textfield with icon and button
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2021-01-06 18:23:11
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';

export default {
  components: {
    BaseRectangleButton,
  },
  props: {
    labelText: String,
    buttonText: String,
    hasButton: Boolean,
  },
  data: () => ({
    searchText: '',
  }),
  updated() {
    if (!this.searchText) {
      this.$emit('searchEmpty');
    }
  },
  methods: {
    clicked() {
      this.$emit('clicked', this.searchText);
    },
  },
};
</script>

<style>
/* .adjustIconSearchbar > .v-input__prepend-outer {
  margin-top: 16px !important;
} */
.adjustIconSearchbar {
  margin-top: 0px;
}
</style>

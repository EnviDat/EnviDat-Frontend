<template>
  <v-card style="width: 100%;" >
    <v-container
      class=" fill-height"
      fluid
      :class="{
        'pa-0': compactLayout,
        'pa-2': !compactLayout,
      }"
    >
      <v-row
        align="center"
        justify="space-between"
        no-gutters
        class="fill-height"
      >
        <v-col
          v-if="loading"
          class="flex-grow-0 py-0 mx-sm-2"
          style="min-width: 45px; text-align: center;"
        >
          <v-progress-circular
            indeterminate
            size="20"
            width="2"
            color="primary"
          />
        </v-col>

        <v-col
          v-if="showSearchCount && !loading"
          class="flex-grow-0 py-0 mx-sm-2"
          style="min-width: 45px; text-align: center;"
        >
          <v-tooltip bottom :disabled="$vuetify.display.xs">
            <template v-slot:activator="{ on, props }">
              <tag-chip
                v-on="on"
                v-bind="props"
                :style="`font-size: ${$vuetify.display.xs ? '0.65rem' : '0.8rem'} !important;`"
                :name="searchCount ? searchCount.toString() : '0'"
                :selectable="false"
                :highlighted="searchCount > 0"
                :closeable="false"
              />
            </template>

            <span>{{ searchCount }} metadata entries found</span>
          </v-tooltip>
        </v-col>

        <v-col v-if="showSearch && !hasButton" class="flex-grow-0 pa-0 hidden-xs-only">
          <base-icon-button
            :icon="mdiMagnify"
            small
            color="transparent"
            :outlined="!searchTerm"
            @clicked="clicked"
          />
        </v-col>

        <v-col v-if="showSearch"
               class="grow py-0 mr-sm-2"
              :class="hasButton ? 'ml-4 ' : 'ml-2 ml-xs-0'"
        >
          <v-tooltip
            bottom
            :disabled="$vuetify.display.xs || !searchToolTipText"
          >
            <template v-slot:activator="{ on, props }">
              <v-text-field
                v-on="on"
                v-bind="props"
                class="envidatSmallSearch"
                style="align-items: center;"
                :class="{ small: compactLayout }"
                v-model="searchText"
                single-line
                hide-details
                primary
                variant="underlined"
                :clearable="$vuetify.display.smAndUp && searchText && searchText.length > 0"
                :flat="isFlat"
                :placeholder="labelText"
                @keyup.enter="clicked"
                :append-icon="$vuetify.display.smAndUp ? 'clear' : ''"
                @click:append="clearClicked"
              />
            </template>

            <span>{{ searchToolTipText }}</span>
          </v-tooltip>
        </v-col>

        <v-col v-if="showSearch && hasButton" class="flex-grow-0">
          <base-rectangle-button
            :button-text="buttonText"
            :is-small="!compactLayout"
            :isXsSmall="compactLayout"
            @clicked="clicked"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * SmallSearchBarView.vue is a compact search bar to jump to the browsepage.
 *
 * @summary compatct textfield with icon and button
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2020-07-15 09:32:19
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import TagChip from '@/components/Chips/TagChip.vue';
import { mdiMagnify } from '@mdi/js';

export default {
  components: {
    TagChip,
    BaseRectangleButton,
    BaseIconButton,
  },
  props: {
    labelText: String,
    showSearch: {
      type: Boolean,
      default: true,
    },
    searchTerm: String,
    showSearchCount: Boolean,
    searchCount: Number,
    hasButton: Boolean,
    buttonText: String,
    compactLayout: Boolean,
    isFlat: Boolean,
    fixedHeight: Number,
    loading: Boolean,
  },
  beforeMount() {
    this.searchText = this.searchTerm;
  },
  data: () => ({
    searchText: '',
    lastSearch: '',
    placeHolderText: 'Enter research term, topic or author',
    searchToolTipText:
      'The full text search works for research terms, topics or authors',
  }),
  computed: {
    height() {
      let height = this.fixedHeight;

      if (this.fixedHeight) {
        return height;
      }

      if (this.compactLayout) {
        height = this.$vuetify.display.sm ? 38 : 32;
      } else {
        height = 40;
      }

      return height;
    },
  },
  watch: {
    searchTerm(val) {
      // watcher to overtake the property value to the v-model value
      this.searchText = val;
    },
  },
  methods: {
    clicked() {
      this.$emit('clicked', this.searchText);
      this.lastSearch = this.searchText;
    },
    clearClicked() {
      this.searchText = '';
      this.$emit('searchCleared');
    },
    focusChanged() {
      if (!this.searchText) {
        this.clearClicked();
        this.lastSearch = '';
      } else {
        this.$emit('clicked', this.searchText);
        this.lastSearch = this.searchText;
      }
    },
  },
};
</script>

<style>
.smallSearchBar > label {
  top: inherit !important;
}

.smallSearchBar .input-group__details {
  min-height: 0 !important;
}

.envidatSmallSearch {
  padding: 0 !important;
  margin: 0 !important;
}

.envidatSmallSearch > .v-input__control {
  max-height: 40px !important;
  margin-bottom: 2px !important;
}

.envidatSmallSearch > .v-input__control > .v-input__slot > .v-text-field__slot > input {
  padding: 0;
}

.envidatSmallSearch.small .v-text-field__slot > input {
  font-size: 14px !important;
}

.envidatSmallSearch > .v-input__append-outer {
  margin: auto !important;
}
</style>

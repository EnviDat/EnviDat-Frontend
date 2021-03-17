<template>
  <v-card style="width: 100%;">
    <v-container class="pa-0 fill-height"
                  fluid
                  :class="{'py-2' : !compactLayout }" >

    <v-row align="center"
            justify="space-between"
            no-gutters
            class="fill-height" >

      <v-col v-if="loading"
              class="shrink py-0"
              style="min-width: 60px; text-align: center;" >
        <v-progress-circular indeterminate
                              size="20"
                              width="2"
                              color="primary" />
      </v-col>

      <v-col v-if="showSearchCount && !loading"
              class="shrink py-0"
              style="min-width: 60px; text-align: center;" >

        <v-tooltip bottom
                    :disabled="$vuetify.breakpoint.xsOnly">
          <template v-slot:activator="{ on }">
            <tag-chip v-on="on"
                      :style="$vuetify.breakpoint.xsOnly ? 'font-size: 0.65rem !important;' : 'font-size: 0.8rem !important;'"
                      :name="searchCount ? searchCount.toString() : '0'"
                      :selectable="false"
                      :highlighted="searchCount > 0"
                      :closeable="false" />
          </template>

          <span>{{ searchCount }} metadata entries found</span>
        </v-tooltip>
      </v-col>

      <v-col v-if="showSearch && !hasButton"
              class="shrink pa-0" >
        <base-icon-button materialIconName="search"
                          marginClass="ma-0"
                          color="transparent"
                          :outlined="!searchTerm"
                          @clicked="clicked" />
      </v-col>

        <v-col v-if="showSearch" class="grow py-0 mr-2" >

          <v-tooltip bottom
                     :disabled="$vuetify.breakpoint.xsOnly || !searchToolTipText">
            <template v-slot:activator="{ on }">

              <v-text-field v-on="on"
                            class="envidatSmallSearch"
                            style="align-items: center;"
                            :class="{'small': compactLayout}"
                            v-model="searchText"
                            single-line
                            hide-details
                            primary
                            :clearable="searchText && searchText.length > 0"
                            :flat="isFlat"
                            :placeholder="labelText"
                            @keyup.enter="clicked"
                            append-icon="clear"
                            @click:append="clearClicked" />
            </template>

          <span>{{ searchToolTipText }}</span>
        </v-tooltip>
      </v-col>

      <v-col v-if="showSearch && hasButton"
              class="shrink" >
        <base-rectangle-button :button-text="buttonText"
                                :is-small="!compactLayout"
                                :isXsSmall="compactLayout"
                                @clicked="clicked" />
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

import TagChip from '@/components/Cards/TagChip';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';
import BaseIconButton from '@/components/BaseElements/BaseIconButton';

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
        height = this.$vuetify.breakpoint.sm ? 38 : 32;
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
    min-height: 0px !important;
  }

  .envidatSmallSearch {
    padding: 0px !important;
    margin: 0px !important;
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

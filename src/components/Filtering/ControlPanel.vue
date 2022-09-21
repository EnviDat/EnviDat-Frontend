<template>
  <v-card :style="`height: ${fixedHeight}px;`"
            id="controlPanel" >

    <v-container class="px-2 py-0 fill-height"
                    fluid> 
      <v-row align="center"
              justify="space-between"
              no-gutters>

        <v-col class="py-0"
              cols="12" sm="10" md="8" lg="8">
          <small-search-bar-view class="elevation-0"
                                  :compactLayout="compactLayout"
                                  :searchTerm="searchTerm"
                                  :showSearch="showSearch"
                                  :showSearchCount="true"
                                  :searchCount="searchCount"
                                  :isFlat="true"
                                  :fixedHeight="fixedHeight"
                                  :labelText="searchBarPlaceholder"
                                  :loading="loading"
                                  @clicked="catchSearchClicked"
                                  @searchCleared="catchSearchCleared" />
        </v-col>

        <v-col class="py-0 shrink"
                id="shareSearchResult" >

          <BaseIconButton style="opacity: 0.8;"
                          materialIconName="share"
                          iconColor="black"
                          isSmall
                          tooltipBottom
                          tooltipText="Copy the url to this view to the clipboard to share it."
                          @clicked="catchShareClick"
                          />

        </v-col>

        <v-col v-if="showSearch"
               class="py-0 ml-4 shrink">

          <BaseIconSwitch :active="isAuthorSearch"
                          :tooltipText="`Author search is ${isAuthorSearch ? 'active' : 'inactive'}`"
                          materialIconName="account_circle"
                          @click="catchAuthorSearchClick" />

        </v-col>

        <v-col class="hidden-xs-only py-0 fill-height" >
          <list-control-toggle :style="`height: ${controlsHeight}px;`"
                                :controls="controlsActive"
                                :enabledControls="enabledControls"
                                :flat="true"
                                @controlsChanged="catchControlClick" />
        </v-col>
      </v-row>


    </v-container>
  </v-card>
</template>

<script>
/**
 * MetadataList.vue uses the FilterKeywordView, FilterMapView and the ControlPanelView
 * to create a List of metadata cards which can be filtered via the mentioned
 * filtering components.
 *
 * @summary filterable list of metadata cards
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-07 11:40:00
 * Last modified  : 2020-07-07 11:44:32
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import SmallSearchBarView from '@/components/Filtering/SmallSearchBarView';
import ListControlToggle from '@/components/Filtering/ListControlToggle';
import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import BaseIconSwitch from '@/components/BaseElements/BaseIconSwitch'

export default {
  name: 'ControlPanel',
  props: {
    compactLayout: Boolean,
    fixedHeight: {
      type: Number,
      default: undefined,
    },
    controlsActive: Array,
    enabledControls: Array,
    loading: Boolean,
    showSearch: Boolean,
    isAuthorSearch: {
      type: Boolean,
      default: false,
    },
    searchTerm: String,
    searchCount: Number,
    searchBarPlaceholder: String,
  },
  components: {
    SmallSearchBarView,
    ListControlToggle,
    BaseIconButton,
    BaseIconSwitch,
  },
  methods: {
    catchSearchClicked(search) {
      this.$emit('searchClick', search);
    },
    catchAuthorSearchClick() {
      this.$emit('authorSearchClick');
    },
    catchSearchCleared() {
      this.$emit('searchCleared');
    },
    catchControlClick(number) {
      this.$emit('controlsChanged', number);
    },
    catchShareClick() {
      // const routeData = this.$router.resolve({ path: this.$route.fullPath });

      navigator.clipboard.writeText(window.location);
    },
  },
  computed: {
    controlsHeight() {
      if (this.compactLayout && !this.fixedHeight) {
        return 36;
      }

      return this.fixedHeight;
    },
  },
};

</script>

<style>

.switchSmallFont label {
  font-size: 10px !important;
}

</style>

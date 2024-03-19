<template>
  <v-card :style="`height: ${fixedHeight}px;`" class="controlPanel">

    <v-container class="px-1 px-sm-2 py-0 fill-height" fluid>
      <v-row align="center" justify="space-between" no-gutters>

        <v-col class="py-0" cols="8" :sm="hasEnabledControls ? 8 : 10" md="8" lg="8">
          <small-search-bar-view class="elevation-0" :compactLayout="compactLayout" :searchTerm="searchTerm"
            :showSearch="showSearch" :showSearchCount="true" :searchCount="searchCount" :isFlat="true"
            :fixedHeight="fixedHeight" :labelText="searchBarPlaceholder" :loading="loading" @clicked="catchSearchClicked"
            @searchCleared="catchSearchCleared" />
        </v-col>

        <v-col v-if="showSearch" class="py-0 px-sm-1 flex-grow-0" id="shareSearchResult">

          <BaseIconButton
            style="opacity: 0.8;"
            :icon="mdiShareVariant"
            iconColor="black"
            small
            tooltip-bottom
            tooltip-text="Copy the url to this view to the clipboard to share it." @clicked="catchShareClick" />

        </v-col>

        <v-col v-if="showSearch && mode !== EDNA_MODE" class="py-0 ml-sm-4 flex-grow-0">

          <BaseIconSwitch
            :active="isAuthorSearch"
            :tooltipText="`Author search is ${isAuthorSearch ? 'active' : 'inactive'}`"
            :icon="mdiAccountCircle"
            @clicked="catchAuthorSearchClick" />

        </v-col>

        <v-col v-if="showSearch && mode === EDNA_MODE" class="py-0 ml-sm-4 shrink">

          <BaseIconSwitch
            :active="isShallow"
            :tooltipText="`Type of dataset is ${isShallow ? 'Shallow' : 'Real'}`"
            :icon="mdiLayers" @clicked="catchShallowRealClick" />

        </v-col>

        <v-col class="hidden-xs py-0 fill-height">
          <list-control-toggle :style="`height: ${controlsHeight};`" :controls="controlsActive"
            :enabledControls="enabledControls" :flat="true" @controlsChanged="catchControlClick" />
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
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import SmallSearchBarView from '@/components/Filtering/SmallSearchBarView.vue';
import ListControlToggle from '@/components/Filtering/ListControlToggle.vue';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseIconSwitch from '@/components/BaseElements/BaseIconSwitch.vue'
import { EDNA_MODE } from '@/store/metadataMutationsConsts';
import { mdiAccountCircle, mdiLayers, mdiShareVariant } from '@mdi/js';

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
    isShallow: {
      type: Boolean,
      default: false,
    },
    mode: String,
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
    catchShallowRealClick() {
      this.$emit('shallowRealClick');
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
    hasEnabledControls() {
      return this.enabledControls?.length > 0;
    },
    controlsHeight() {
      if (this.compactLayout || !this.fixedHeight) {
        return '36px';
      }

      return `${this.fixedHeight}px`;
    },
  },
  data: () => ({
    EDNA_MODE,
    mdiAccountCircle,
    mdiLayers,
    mdiShareVariant,
  }),
};

</script>

<style>
.switchSmallFont label {
  font-size: 10px !important;
}
</style>

<template>
  <metadata-list-layout ref="metadataListLayoutComponent" :topFilteringLayout="topFilteringLayout"
    :minMapHeight="minMapHeight" :useDynamicHeight="useDynamicHeight" :showMapFilter="showMapFilter"
    :mapFilteringPossible="mapFilteringPossible" @onScroll="onScroll">

    <template v-slot:filterKeywords>
      <filter-keywords-view :compactLayout="$vuetify.display.smAndDown" :allTags="allTags"
        :selectedTagNames="selectedTagNames" :showPlaceholder="loading || updatingTags" @clickedTag="catchTagClicked"
        @clickedTagClose="catchTagCloseClicked" @clickedClear="catchTagCleared" />
    </template>

    <template #controlPanel>
      <control-panel :compactLayout="true" :searchTerm="searchTerm" :showSearch="showSearch" :searchCount="searchCount"
        :isAuthorSearch="isAuthorSearch" :isShallow="isShallow" :mode="modeData?.name" :fixedHeight="36"
        :searchBarPlaceholder="searchBarPlaceholder" :loading="loading" :controlsActive="controlsActive"
        :enabledControls="enabledControls" @searchClick="catchSearchClicked" @searchCleared="catchSearchCleared"
        @controlsChanged="controlsChanged" @authorSearchClick="catchAuthorSearchClick"
        @shallowRealClick="catchShallowRealClick" />

    </template>

    <template v-slot:filterMap>
      <filter-map-view :content="listContent" :minMapHeight="minMapHeight" :pinnedIds="pinnedIds"
        :topLayout="mapTopLayout" :modeData="modeData" @pointClicked="catchPointClicked"
        @clearButtonClicked="catchClearButtonClick" />

    </template>

    <template v-slot:metadataListPlaceholder>
      <v-container v-show="loading" class="px-0 px-sm-2" fluid>
        <!-- don't use class with paddings here, it's being used in the MetadataListLayout component -->
        <v-row id="metadataListPlaceholder" ref="metadataListPlaceholder">

          <v-col v-for="(n, index) in placeHolderAmount" :key="'placeHolder_' + index" :class="cardGridClass"
            class="pa-2">

            <metadata-card-placeholder :dark="false" />
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template v-slot:metadataListLayout>
      <v-container v-if="!loading" class="px-0 px-sm-2" fluid>
        <!-- don't use class with paddings here, it's being used in the MetadataListLayout component -->

        <v-row id="metadataListLayout" ref="metadataListLayout">

          <v-col v-for="(pinnedId, index) in pinnedIds" :key="'pinned_' + index" :class="cardGridClass" class="pa-2">

            <metadata-card class="highlighted" :id="pinnedId" :ref="pinnedId" :title="metadatasContent[pinnedId].title"
              :name="metadatasContent[pinnedId].name" :subtitle="metadatasContent[pinnedId].notes"
              :tags="!isCompactLayout ? metadatasContent[pinnedId].tags : null"
              :titleImg="metadatasContent[pinnedId].titleImg"
              :restricted="hasRestrictedResources(metadatasContent[pinnedId])"
              :resourceCount="metadatasContent[pinnedId].num_resources" :modeData="modeData" :flatLayout="listView"
              :compactLayout="isCompactLayout" :fileIconString="fileIconString" :lockedIconString="lockedIconString"
              :unlockedIconString="unlockedIconString" :geoJSONIcon="getGeoJSONIcon(metadatasContent[pinnedId].location)"
              :categoryColor="metadatasContent[pinnedId].categoryColor"
              :state="getMetadataState(metadatasContent[pinnedId])"
              :organization="metadatasContent[pinnedId].organization?.name"
              :organizationTooltip="metadatasContent[pinnedId].organization?.title"
              :showOrganizationOnHover="showOrganizationOnHover" @clickedEvent="metaDataClicked"
              @clickedTag="catchTagClicked" />
          </v-col>

          <v-col v-for="(metadata, index) in unpinnedFilteredList" :key="'filtered_' + index" :class="cardGridClass"
            class="pa-2">

            <metadata-card :id="metadata.id" :ref="metadata.id" :title="metadata.title" :name="metadata.name"
              :subtitle="metadata.notes" :tags="!isCompactLayout ? metadata.tags : null" :titleImg="metadata.titleImg"
              :restricted="hasRestrictedResources(metadata)" :resourceCount="metadata.num_resources" :modeData="modeData"
              :flatLayout="listView" :compactLayout="isCompactLayout" :fileIconString="fileIconString"
              :lockedIconString="lockedIconString" :unlockedIconString="unlockedIconString"
              :geoJSONIcon="getGeoJSONIcon(metadata.location)" :categoryColor="metadata.categoryColor"
              :state="getMetadataState(metadata)" :organization="metadata.organization?.name"
              :organizationTooltip="metadata.organization?.title" :showOrganizationOnHover="showOrganizationOnHover"
              @organizationClicked="$emit('organizationClicked', metadata.organization)" @clickedEvent="metaDataClicked"
              @clickedTag="catchTagClicked" :showGenericOpenButton="!!metadata.openEvent"
              :openButtonTooltip="metadata.openButtonTooltip" :openButtonIcon="metadata.openButtonIcon"
              @openButtonClicked="catchOpenClick(metadata.openEvent, metadata.openProperty)" />
          </v-col>

          <v-col :class="showScrollTopButton ? 'mx-2' : ''" key="infiniteLoader" cols="12"></v-col>

          <v-col v-if="!loading && contentSize <= 0" class="mx-2" key="noSearchResultsView" cols="12">
            <no-search-results-view :categoryCards="categoryCards" @clicked="catchCategoryClicked" />
          </v-col>

        </v-row>
      </v-container>

    </template>

  </metadata-list-layout>
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
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-09-06 15:29:46
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

// import Vue from 'vue';
// import InfiniteLoading from 'vue-infinite-loading';
// Vue.use(InfiniteLoading /* , { options } */);

import { BROWSE_PATH } from '@/router/routeConsts';
import FilterKeywordsView from '@/components/Filtering/FilterKeywordsView.vue';
import FilterMapView from '@/components/Filtering/FilterMapView.vue';
import ControlPanel from '@/components/Filtering/ControlPanel.vue';

import MetadataCard from '@/components/Cards/MetadataCard.vue';
import MetadataCardPlaceholder from '@/components/Cards/MetadataCardPlaceholder.vue';
import NoSearchResultsView from '@/components/Filtering/NoSearchResultsView.vue';
import {
  LISTCONTROL_LIST_ACTIVE,
  LISTCONTROL_MAP_ACTIVE,
  LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
} from '@/store/metadataMutationsConsts';

import MetadataListLayout from '@/components/MetadataListLayout.vue';
import { eventBus } from '@/factories/eventBus';
import { getMetadataVisibilityState } from '@/factories/metaDataFactory';
import { getGeoJSONIcon, getIcon } from '@/factories/imageFactory';
import { convertArrayToUrlString } from '@/factories/stringFactory';

// check filtering in detail https://www.npmjs.com/package/vue2-filters

export default {
  name: 'MetadataList',
  props: {
    listContent: Array,
    prePinnedIds: Array,
    mapFilteringPossible: Boolean,
    placeHolderAmount: {
      type: Number,
      default: 4,
    },
    selectedTagNames: Array,
    allTags: Array,
    mapTopLayout: {
      type: Boolean,
      default: false,
    },
    defaultListControls: Array,
    enabledControls: Array,
    useDynamicHeight: Boolean,
    minMapHeight: Number,
    topFilteringLayout: {
      type: Boolean,
      default: false,
    },
    modeData: Object,
    showSearch: Boolean,
    searchTerm: String,
    searchCount: Number,
    isAuthorSearch: {
      type: Boolean,
      default: false,
    },
    isShallow: {
      type: Boolean,
      default: false,
    },
    searchBarPlaceholder: String,
    mainScrollClass: {
      type: String,
      default: undefined,
    },
    showPublicationState: {
      type: Boolean,
      default: false,
    },
    showScrollTopButton: {
      type: Boolean,
      default: false,
    },
    reloadAmount: {
      type: Number,
      default: 16,
    },
    reloadDelay: {
      type: Number,
      default: 350,
    },
    preloadingDistance: {
      type: Number,
      default: 150,
    },
    showOrganizationOnHover: {
      type: Boolean,
      default: undefined,
    },
    updatingTags: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    metadatasContent: {
      type: Object,
      default: () => { },
    },
    categoryCards: {
      type: Array,
      default: () => [],
    },
  },
  beforeMount() {
    this.fileIconString = getIcon('file');
    this.lockedIconString = getIcon('lock2Closed');
    this.unlockedIconString = getIcon('lock2Open');
    this.pinIcon = getIcon('marker');
    this.multiPinIcon = getIcon('markerMulti');
    this.polygonIcon = getIcon('polygons');
  },
  mounted() {
    if (this.defaultListControls && this.defaultListControls.length) {
      this.defaultListControls.forEach((n) => {
        this.controlsChanged(n);
      });
    }

    this.infiniteHandler();
  },
  computed: {
    showPinnedElements() {
      return !this.loading && this.showMapFilter && this.prePinnedIds?.length > 0;
    },
    unpinnedFilteredList() {
      const listWithoutPins = [];

      for (let i = 0; i < this.virtualListContent.length; i++) {
        const metadata = this.virtualListContent[i];
        if (!this.isPinned(metadata.id)) {
          listWithoutPins.push(metadata);
        }
      }

      return listWithoutPins;
    },
    pinnedIds() {
      if (!this.showPinnedElements) {
        return [];
      }

      return this.prePinnedIds;
    },
    cardGridClass() {
      const mapActive = this.isActiveControl(LISTCONTROL_MAP_ACTIVE);

      if (this.isActiveControl(LISTCONTROL_LIST_ACTIVE)) {
        return {
          'col-12': true,
          'col-lg-6': !mapActive,
          'col-xl-6': true,
        };
      }

      const compactLayout = this.isCompactLayout;

      return {
        'col-12': true,
        'col-sm-6': true,
        'col-md-4': true,
        'col-lg-3': compactLayout || !mapActive,
        'col-lg-4': mapActive && !compactLayout,
        'col-xl-2': !mapActive,
        'col-xl-3': mapActive,
      };
    },
    contentSize() {
      return this.listContent ? Object.keys(this.listContent).length : 0;
    },
    isCompactLayout() {
      return this.isActiveControl(LISTCONTROL_COMPACT_LAYOUT_ACTIVE);
    },
    mapLayout() {
      return !this.topFilteringLayout && this.showMapFilter && this.$vuetify.display.mdAndUp;
    },
    dynamicMainScrollClass() {
      if (this.mainScrollClass) {
        return this.mainScrollClass;
      }

      return this.mapLayout ? '.mapLayoutContainers' : '.noMapLayoutContainers';
    },
  },
  methods: {
    getMetadataState(metadata) {
      if (!this.showPublicationState) {
        return null;
      }

      return getMetadataVisibilityState(metadata);
    },
    catchOpenClick(event, eventProperty) {
      eventBus.emit(event, eventProperty);
    },
    getGeoJSONIcon(location) {
      return getGeoJSONIcon(location?.geoJSON?.type);
    },
    infiniteHandler($state) {
      const that = this;
      that.vLoading = true;

      if (that.contentSize <= 0 && $state) {
        $state.complete();
        return;
      }

      // use a small timeout to show the loading?
      setTimeout(() => {
        let i = 0;

        if (that.virtualListContent.length > 0) {
          // use the current index only if the virtualList has already elements
          i = that.vIndex;
        }

        for (; i < that.vIndex + that.reloadAmount && i < that.contentSize; i++) {
          that.virtualListContent.push(that.listContent[i]);
        }

        if ($state) {
          if (that.virtualListContent.length >= that.contentSize) {
            $state.complete();
          } else {
            $state.loaded();
          }
        }

        that.vIndex = i;

        that.vLoading = false;
      }, this.reloadDelay);
    },
    catchTagClicked(tagName) {
      this.$emit('clickedTag', tagName);
    },
    catchTagCloseClicked(tagId) {
      this.$emit('clickedTagClose', tagId);
    },
    catchTagCleared() {
      this.$emit('clickedClear');
    },
    catchCategoryClicked(cardType) {
      if (cardType.includes('login')) {
        this.catchLoginclick();
        return;
      }

      if (cardType.includes('mode')) {
        const splits = cardType.split('_');
        const modeName = splits[1];
        this.catchModeClicked(modeName);
        return;
      }

      const stringTags = convertArrayToUrlString([cardType]);
      this.$router.options.additiveChangeRoute(this.$route, this.$router, BROWSE_PATH, '', stringTags);
    },
    catchModeClicked(mode) {
      this.$router.push({
        path: BROWSE_PATH,
        query: { mode },
      });
    },
    catchLoginclick() {
      this.redirectToDashboard();
    },
    redirectToDashboard() {
      window.open('https://www.envidat.ch/user/reset', '_blank');
    },
    metaDataClicked(datasetName) {
      this.$emit('clickedCard', datasetName);
    },
    catchOrganizationClicked(organization) {
      this.$emit('clickedOrganization', organization);
    },
    catchPointClicked(id) {
      // bring to top
      // highlight entry
      let newPins = this.pinnedIds;

      if (this.pinnedIds.includes(id)) {
        newPins = this.pinnedIds.filter(i => i !== id);
      } else {
        newPins.push(id);
      }

      // this.pinnedIds = newPins;

      this.$emit('pinnedIds', newPins);
      // this.$store.commit(`${METADATA_NAMESPACE}/${PIN_METADATA}`, id);
    },
    catchClearButtonClick() {
      this.$emit('pinnedIds', []);
    },
    hasRestrictedResources(metadata) {
      if (!metadata || !metadata.resources || metadata.resources.length <= 0) {
        return false;
      }

      for (let i = 0; i < metadata.resources.length; i++) {
        const res = metadata.resources[i];

        if (res.restricted !== undefined
          && (res.restricted.allowed_users !== undefined
            || res.restricted.level !== 'public')) {
          return true;
        }
      }

      return false;
    },
    isPinned(id) {
      return this.pinnedIds.includes(id);
    },
    mapFilterHeight() {
      const sHeight = document.documentElement.clientHeight;

      let height = this.maxMapFilterHeight;

      if (sHeight < this.maxMapFilterHeight) {
        height = sHeight - 165;
      }

      return height;
    },
    isActiveControl(number) {
      return this.controlsActive ? this.controlsActive.includes(number) : false;
    },
    controlsChanged(number) {
      // 0-entry: listView, 1-entry: mapActive, 2-entry compact metadata
      let controlsActive = this.controlsActive;

      if (this.isActiveControl(number)) {
        controlsActive = controlsActive.filter(n => n !== number);
      } else {
        controlsActive.push(number);
      }

      if (number === LISTCONTROL_LIST_ACTIVE) {
        controlsActive = controlsActive.filter(n => n !== LISTCONTROL_COMPACT_LAYOUT_ACTIVE);
      }

      if (number === LISTCONTROL_COMPACT_LAYOUT_ACTIVE) {
        controlsActive = controlsActive.filter(n => n !== LISTCONTROL_LIST_ACTIVE);
      }

      let listActive = false;
      let mapToggled = false;

      for (let index = 0; index < controlsActive.length; index++) {
        const el = controlsActive[index];

        if (el === LISTCONTROL_LIST_ACTIVE) {
          listActive = true;
        }
        if (el === LISTCONTROL_MAP_ACTIVE) {
          mapToggled = true;
        }
      }

      this.listView = listActive;
      this.showMapFilter = mapToggled;

      this.controlsActive = controlsActive;

      this.resetVirtualContent();
    },
    setScrollPos(toPos) {
      if (this.useDynamicHeight) {
        if (this.$refs && this.$refs.metadataListLayoutComponent) {
          this.$refs.metadataListLayoutComponent.setScrollPos(toPos);
        }
      } else {
        this.$emit('setScroll', toPos);
      }
    },
    onScroll(pos) {
      if (pos) {
        this.$emit('onScroll', pos);
      }
    },
    catchSearchClicked(search) {
      this.$emit('searchClick', search);
    },
    catchSearchCleared() {
      this.$emit('searchCleared');
    },
    catchAuthorSearchClick() {
      this.$emit('authorSearchClick');
    },
    catchShallowRealClick() {
      this.$emit('shallowRealClick');
    },
    resetVirtualContent() {
      // this.$store.commit(`${METADATA_NAMESPACE}/${SET_VIRTUAL_LIST_INDEX}`, 0);
      this.vIndex = 0;
      this.virtualListContent = [];
      this.infiniteId += 1;
      this.infiniteHandler();
    },
  },
  watch: {
    listContent() {
      this.resetVirtualContent();
    },
  },
  data: () => ({
    noResultText: 'Nothing found for these search criterias.',
    suggestionText: 'Change the criterias or try one of these categories',
    fileIconString: null,
    lockedIconString: null,
    unlockedIconString: null,
    pinIcon: null,
    multiPinIcon: null,
    polygonIcon: null,
    localTags: [],
    virtualListContent: [],
    vLoading: false,
    vIndex: 0,
    infiniteId: +new Date(),
    scrollTopButtonText: 'Scroll to the top',
    controlsLabel: 'List controls',
    controlsActive: [],
    listView: false,
    showMapFilter: false,
    LISTCONTROL_LIST_ACTIVE,
    LISTCONTROL_MAP_ACTIVE,
    LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
  }),
  components: {
    FilterKeywordsView,
    FilterMapView,
    ControlPanel,
    NoSearchResultsView,
    MetadataCard,
    MetadataCardPlaceholder,
    // BaseRectangleButton,
    MetadataListLayout,
  },
};
</script>

<style scoped>
.itemfade-enter-active,
.itemfade-leave-active {
  transition: opacity 0.1s;
  transition-timing-function: linear;
}

.itemfade-enter,
.itemfade-leave-to {
  opacity: 0;
}

.highlighted {
  box-shadow: #4db6ac 0 0 5px 5px !important;
}
</style>

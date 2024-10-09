<template>
  <MetadataListLayout
      ref="metadataListLayoutComponent"
      :topFilteringLayout="topFilteringLayout"
      :minMapHeight="minMapHeight"
      :useDynamicHeight="useDynamicHeight"
      :showMapFilter="showMapFilter"
      :mapFilteringPossible="mapFilteringPossible"
      @onScroll="onScroll"
      :layoutRecalcTrigger="layoutRecalcTrigger"
  >

    <template v-slot:filterKeywords>

      <FilterKeywordsSingleView
        :compactLayout="$vuetify.display.smAndDown"
        :allTags="allTags"
        :selectedTagNames="selectedTagNames"
        :showPlaceholder="loading || updatingTags"
        @clickedTag="catchTagClicked"
        @clickedTagClose="catchTagCloseClicked"
        @clickedClear="catchTagCleared" />

    </template>

    <template #controlPanel>
      <ControlPanel :compactLayout="true" :searchTerm="searchTerm" :showSearch="showSearch" :searchCount="searchCount"
        :isAuthorSearch="isAuthorSearch" :isShallow="isShallow" :mode="modeData?.name" :fixedHeight="36"
        :searchBarPlaceholder="searchBarPlaceholder" :loading="loading" :controlsActive="controlsActive"
        :enabledControls="enabledControls" @searchClick="catchSearchClicked" @searchCleared="catchSearchCleared"
        @controlsChanged="controlsChanged" @authorSearchClick="catchAuthorSearchClick"
        @shallowRealClick="catchShallowRealClick" />

    </template>

    <template v-slot:filterMap>
      <FilterMapView :content="listContent" :minMapHeight="minMapHeight" :pinnedIds="pinnedIds"
        :topLayout="mapTopLayout" :modeData="modeData" @pointClicked="catchPointClicked"
        @clearButtonClicked="catchClearButtonClick" />

    </template>

    <template v-slot:metadataListPlaceholder>
      <v-container v-show="loading" class="px-0 pt-0 px-sm-1" fluid>
        <!-- don't use class with paddings here, it's being used in the MetadataListLayout component -->
        <v-row id="metadataListPlaceholder" ref="metadataListPlaceholder">

          <v-col
              v-for="(n, index) in placeHolderAmount"
              :key="'placeHolder_' + index"
              cols="12"
              sm="3"
              class="pa-2">

            <MetadataCardPlaceholder :dark="false" />
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template v-slot:metadataListLayout="{ metadataListHeight }">
      <v-container
        fluid
        class="pa-0"
       :style="`height: ${metadataListHeight}px;`"
      >
      <v-row no-gutters>

        <Grid
          id="virtualScroller"
          :length="contentSize"
          :pageSize="virtualPageSize"
          :pageProvider="pageProvider"
          :pageProviderDebounceTime="100"
          :respectScrollToOnResize="true"
          class="virtualGrid"
          :style="`
          grid-template-columns: repeat(${this.amountOfRowsItems}, 1fr);
          grid-template-rows: ${fixedCardHeight}px;
          `"
        >
<!--
          <template v-slot:probe>
            <MetadataCardPlaceholder :dark="false" />
          </template>
-->

          <!-- When the item is not loaded, a placeholder is rendered -->
          <template v-slot:placeholder="{ style }">
            <MetadataCardPlaceholder
              :dark="false"
              :style="style"
            />
          </template>

          <!-- Render a loaded item -->
          <template v-slot:default="{ item: metadata, style }">
            <MetadataCard
              :style="style"
              :class="metadata.isPinned ? 'highlighted' : ''"
              :id="metadata.id"
              :ref="metadata.id"
              :title="metadata.title"
              :name="metadata.name"
              :subtitle="metadata.notes"
              :tags="!isCompactLayout ? metadata.tags : null"
              :titleImg="isCompactLayout ? undefined : metadata.titleImg"
              :restricted="hasRestrictedResources(metadata)"
              :resourceCount="metadata.num_resources"
              :modeData="modeData"
              :flatLayout="listView"
              :compactLayout="isCompactLayout"
              :geoJSONIcon="getGeoJSONIcon(metadata.location)"
              :categoryColor="metadata.categoryColor"
              :state="getMetadataState(metadata)"
              :organization="metadata.organization?.name"
              :organizationTooltip="metadata.organization?.title"
              :showOrganizationOnHover="showOrganizationOnHover"
              @organizationClicked="$emit('organizationClicked', metadata.organization)"
              @clickedEvent="metaDataClicked"
              @clickedTag="catchTagClicked"
              :showGenericOpenButton="!!metadata.openEvent"
              :openButtonTooltip="metadata.openButtonTooltip"
              :openButtonIcon="metadata.openButtonIcon"
              @openButtonClicked="catchOpenClick(metadata.openEvent, metadata.openProperty)"
            />
          </template>
        </Grid>
      </v-row>


      <v-row>
        <v-col
            v-if="!loading && contentSize <= 0"
            class="mx-2"
            key="noSearchResultsView"
            cols="12">
          <no-search-results-view :categoryCards="categoryCards" @clicked="catchCategoryClicked" />
        </v-col>

      </v-row>
      </v-container>

    </template>

  </MetadataListLayout>
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

import Grid from 'vue-virtual-scroll-grid';
import { BROWSE_PATH } from '@/router/routeConsts';
import FilterKeywordsSingleView from '@/components/Filtering/FilterKeywordsSingleView.vue';
import FilterMapView from '@/components/Filtering/FilterMapView.vue';
import ControlPanel from '@/components/Filtering/ControlPanel.vue';

import MetadataListLayout from '@/components/MetadataListLayout.vue';
import MetadataCard from '@/components/Cards/MetadataCard.vue';
import MetadataCardPlaceholder from '@/components/Cards/MetadataCardPlaceholder.vue';
import NoSearchResultsView from '@/components/Filtering/NoSearchResultsView.vue';
import {
  LISTCONTROL_LIST_ACTIVE,
  LISTCONTROL_MAP_ACTIVE,
  LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
} from '@/store/metadataMutationsConsts';

import { eventBus } from '@/factories/eventBus';

import { getMetadataVisibilityState } from '@/factories/metaDataFactory';
import { getGeoJSONIcon, getIcon } from '@/factories/imageFactory';
import { convertArrayToUrlString } from '@/factories/stringFactory';


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
  },
  computed: {
    hasMetadatasContent() {
      return this.metadatasContent ? Object.keys(this.metadatasContent)?.length > 0 : false;
    },
    hasPinnedContent() {
      if (this.prePinnedIds?.length <= 0) {
        return false;
      }

      for (let i = 0; i < this.prePinnedIds.length; i++) {
        const pin = this.prePinnedIds[i];

        if (this.metadatasContent[pin] === undefined) {
          return false;
        }
      }

      return true;
    },
    showPinnedElements() {
      return !this.loading && this.showMapFilter && this.prePinnedIds?.length > 0;
    },
    virtualPageSize() {
      const mapActive = this.isActiveControl(LISTCONTROL_MAP_ACTIVE);
      const compactLayout = this.isCompactLayout;
      const listLayout = this.isActiveControl(LISTCONTROL_LIST_ACTIVE);

      if (this.$vuetify.display.lgAndUp) {
        if (compactLayout) {
          return 54; // 36 is about a fits on a screen, use 1,5 as much
        }

        if (listLayout) {
          return mapActive ? 12 : 16;
        }
      }

      return 16;
    },
    amountOfRowsItems()  {
      const mapActive = this.isActiveControl(LISTCONTROL_MAP_ACTIVE);
      const compactLayout = this.isCompactLayout;
      const listLayout = this.isActiveControl(LISTCONTROL_LIST_ACTIVE);

      if (listLayout) {
        if (this.$vuetify.display.xlAndUp) {
          return 2;
        }

        return mapActive ? 1 : 2;
      }

      if (compactLayout) {
        if (this.$vuetify.display.xlAndUp) {
          return mapActive ? 6 : 8;
        }

        if (this.$vuetify.display.lgAndUp) {
          return mapActive ? 4 : 6;
        }
      }

      if (this.$vuetify.display.smAndDown) {
        return 1;
      }

      if (this.$vuetify.display.xlAndUp) {
        return 4;
      }

      return mapActive ? 3 : 4;
    },
    fixedCardHeight() {
      const compactLayout = this.isCompactLayout;
      const listLayout = this.isActiveControl(LISTCONTROL_LIST_ACTIVE);

      if (compactLayout) {
        return 115;
      }

      if (listLayout) {
        return 197;
      }

      return 330;
    },
/*
    cardGridClass() {
      const mapActive = this.isActiveControl(LISTCONTROL_MAP_ACTIVE);
      const compactLayout = this.isCompactLayout;

      if (this.isActiveControl(LISTCONTROL_LIST_ACTIVE)) {
        return {
          'v-col-12': true,
          'v-col-lg-6': !mapActive,
          'v-col-xl-6': true,
        };
      }

      return {
        'v-col-12': true,
        'v-col-sm-6': true,
        'v-col-md-4': true,
        'v-col-lg-2': compactLayout && !mapActive,
        'v-col-lg-3': compactLayout && mapActive,
        'v-col-lg-4': mapActive && !compactLayout,
        'v-col-xl-2': compactLayout,
        'v-col-xl-3': !compactLayout,
      };
    },
*/
    pinnedIds() {
      if (!this.showPinnedElements) {
        return [];
      }

      if (this.hasMetadatasContent && this.hasPinnedContent) {
        return this.prePinnedIds
      }

      return [];
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
  },
  methods: {
    async pageProvider(pageNumber, pageSize) {
      const start = pageNumber * pageSize;
      const end = start + pageSize;
      const sublist = this.listContent.slice(start, end);
      console.log(`subList start ${start} end ${end} length ${sublist.length}`);
      return sublist;
    },
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
      return location?.geoJSON?.type ? getGeoJSONIcon(location.geoJSON.type) : null;
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
  },
  watch: {
    controlsActive: {
      handler() {
        // when the controls change, trigger a recalc of the layout specific height
        this.layoutRecalcTrigger += 1;
      },
      deep: true,
    },
  },
  data: () => ({
    layoutRecalcTrigger: 0,
    // groupedContent: [],
    noResultText: 'Nothing found for these search criterias.',
    suggestionText: 'Change the criterias or try one of these categories',
    pinIcon: null,
    multiPinIcon: null,
    polygonIcon: null,
    localTags: [],
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
    FilterKeywordsSingleView,
    FilterMapView,
    ControlPanel,
    NoSearchResultsView,
    MetadataCard,
    MetadataCardPlaceholder,
    // BaseRectangleButton,
    MetadataListLayout,
    Grid,
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

.virtualGrid {
  display: grid;
  grid-gap: 15px;
}
</style>

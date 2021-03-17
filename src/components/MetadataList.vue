<template>

  <metadata-list-layout ref="metadataListLayoutComponent"
                        :topFilteringLayout="topFilteringLayout"
                        :minMapHeight="minMapHeight"
                        :useDynamicHeight="useDynamicHeight"
                        :showMapFilter="showMapFilter"
                        :mapFilteringPossible="mapFilteringPossible"
                        @onScroll="onScroll" >

    <template v-slot:filterKeywords>
      <filter-keywords-view :compactLayout="$vuetify.breakpoint.smAndDown"
                            :allTags="allTags"
                            :selectedTagNames="selectedTagNames"
                            :showPlaceholder="loading || updatingTags"
                            @clickedTag="catchTagClicked"
                            @clickedTagClose="catchTagCloseClicked"
                            @clickedClear="catchTagCleared" />
    </template>

    <template v-slot:controlPanel>
      <control-panel :compactLayout="true"
                      :searchTerm="searchTerm"
                      :showSearch="showSearch"
                      :showSearchCount="true"
                      :searchCount="searchCount"
                      :fixedHeight="36"
                      :searchBarPlaceholder="searchBarPlaceholder"
                      :loading="loading"
                      :controlsActive="controlsActive"
                      :enabledControls="enabledControls"
                      @searchClick="catchSearchClicked"
                      @searchCleared="catchSearchCleared"
                      @controlsChanged="controlsChanged" />

    </template>

    <template v-slot:filterMap>
      <filter-map-view :content="listContent"
                        :minMapHeight="minMapHeight" 
                        :pinnedIds="pinnedIds"
                        :topLayout="mapTopLayout"
                        :mode="mode"
                        @pointClicked="catchPointClicked"
                        @clearButtonClicked="catchClearButtonClick" />

    </template>

    <template v-slot:metadataListPlaceholder>
      <v-container v-show="loading"
                    fluid >
      <!-- don't use class with paddings here, it's being used in the MetadataListLayout component -->

      <v-row id="metadataListPlaceholder"
              ref="metadataListPlaceholder" >

        <v-col v-for="(n, index) in placeHolderAmount"
                :key="'placeHolder_' + index"
                :class="cardGridClass"
                class="pa-2" >

          <metadata-card-placeholder :dark="false" />
        </v-col>
      </v-row>
      </v-container>
    </template>

    <template v-slot:metadataListLayout >
      <v-container v-if="!loading"
                  fluid >
      <!-- don't use class with paddings here, it's being used in the MetadataListLayout component -->

      <v-row id="metadataListLayout"
              ref="metadataListLayout" >

        <v-col v-for="(pinnedId, index) in pinnedList"
                :key="'pinned_' + index"
                :class="cardGridClass"
                class="pa-2" >

          <metadata-card class="highlighted"
                          :id="pinnedId"
                          :ref="pinnedId"
                          :title="metadatasContent[pinnedId].title"
                          :name="metadatasContent[pinnedId].name"
                          :subtitle="metadatasContent[pinnedId].notes"
                          :tags="metadatasContent[pinnedId].tags"
                          :titleImg="metadatasContent[pinnedId].titleImg"
                          :restricted="hasRestrictedResources(metadatasContent[pinnedId])"
                          :resourceCount="metadatasContent[pinnedId].num_resources"
                          :mode="mode"
                          :flatLayout="listView"
                          :compactLayout="isActiveControl(LISTCONTROL_COMPACT_LAYOUT_ACTIVE)"
                          :fileIconString="fileIconString"
                          :lockedIconString="lockedIconString"
                          :unlockedIconString="unlockedIconString"
                          :categoryColor="metadatasContent[pinnedId].categoryColor"
                          @clickedEvent="metaDataClicked"
                          @clickedTag="catchTagClicked" />
        </v-col>

        <v-col v-for="(metadata, index) in unpinnedFilteredList"
                :key="'filtered_' + index"
                :class="cardGridClass"
                class="pa-2" >

          <metadata-card :id="metadata.id"
                        :ref="metadata.id"
                        :title="metadata.title"
                        :name="metadata.name"
                        :subtitle="metadata.notes"
                        :tags="metadata.tags"
                        :titleImg="metadata.titleImg"
                        :restricted="hasRestrictedResources(metadata)"
                        :resourceCount="metadata.num_resources"
                        :mode="mode"
                        :flatLayout="listView"
                        :compactLayout="isActiveControl(LISTCONTROL_COMPACT_LAYOUT_ACTIVE)"
                        :fileIconString="fileIconString"
                        :lockedIconString="lockedIconString"
                        :unlockedIconString="unlockedIconString"
                        :geoJSONIcon="getGeoJSONIcon(metadata)"
                        :categoryColor="metadata.categoryColor"
                        @clickedEvent="metaDataClicked"
                        @clickedTag="catchTagClicked" />
        </v-col>

        <v-col class="mx-2"
                key="infiniteLoader"
                cols="12" >
          <infinite-loading spinner="waveDots"
                            :identifier="infiniteId"
                            :distance="preloadingDistance"
                            @infinite="infiniteHandler" >
            <div slot="no-results">
              <BaseRectangleButton v-if="vIndex > 0 && vIndex > reloadAmount"
                                    :buttonText="scrollTopButtonText"
                                    :isSmall="true"
                                    :isFlat="true"
                                    @clicked="setScrollPos(0)" />
            </div>
            <div slot="no-more">
              <BaseRectangleButton :buttonText="scrollTopButtonText"
                                  :isSmall="true"
                                  :isFlat="true"
                                  @clicked="setScrollPos(0)" />
            </div>
          </infinite-loading>
        </v-col>

        <v-col v-if="!loading && contentSize <= 0"
                class="mx-2"
                key="noSearchResultsView"
                cols="12" >
          <no-search-results-view :categoryCards="categoryCards"
                                  @clicked="catchCategoryClicked" />
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
 * Last modified  : 2021-01-06 16:14:05
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import {
  mapState,
  mapGetters,
} from 'vuex';
import { BROWSE_PATH, METADATADETAIL_PAGENAME } from '@/router/routeConsts';
import FilterKeywordsView from '@/components/Filtering/FilterKeywordsView';
import FilterMapView from '@/components/Filtering/FilterMapView';
import ControlPanel from '@/components/Filtering/ControlPanel';

import MetadataCard from '@/components/Cards/MetadataCard';
import MetadataCardPlaceholder from '@/components/Cards/MetadataCardPlaceholder';
import NoSearchResultsView from '@/components/Filtering/NoSearchResultsView';
import {
  SET_DETAIL_PAGE_BACK_URL,
  SET_VIRTUAL_LIST_INDEX,
  METADATA_NAMESPACE,
  LISTCONTROL_LIST_ACTIVE,
  LISTCONTROL_MAP_ACTIVE,
  LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
} from '@/store/metadataMutationsConsts';

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';
import MetadataListLayout from '@/components/MetadataListLayout';
// check filtering in detail https://www.npmjs.com/package/vue2-filters

export default {
  name: 'MetadataList',
  props: {
    listContent: Array,
    mapFilteringPossible: Boolean,
    placeHolderAmount: Number,
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
    mode: String,
    showSearch: Boolean,
    searchTerm: String,
    searchCount: Number,
    searchBarPlaceholder: String,
  },
  beforeMount() {
    this.fileIconString = this.mixinMethods_getIcon('file');
    this.lockedIconString = this.mixinMethods_getIcon('lock2Closed');
    this.unlockedIconString = this.mixinMethods_getIcon('lock2Open');
    this.pinIcon = this.mixinMethods_getIcon('marker');
    this.multiPinIcon = this.mixinMethods_getIcon('markerMulti');
    this.polygonIcon = this.mixinMethods_getIcon('polygons');
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
    ...mapState([
      'categoryCards',
    ]),
    ...mapGetters({
      metadataIds: `${METADATA_NAMESPACE}/metadataIds`,
      metadatasContent: `${METADATA_NAMESPACE}/metadatasContent`,
      searchedMetadatasContent: `${METADATA_NAMESPACE}/searchedMetadatasContent`,
      searchingMetadatasContent: `${METADATA_NAMESPACE}/searchingMetadatasContent`,
      searchingMetadatasContentOK: `${METADATA_NAMESPACE}/searchingMetadatasContentOK`,
      loadingMetadatasContent: `${METADATA_NAMESPACE}/loadingMetadatasContent`,
      updatingTags: `${METADATA_NAMESPACE}/updatingTags`,
      vIndex: `${METADATA_NAMESPACE}/vIndex`,
      vReloadAmount: `${METADATA_NAMESPACE}/vReloadAmount`,
      vReloadAmountMobile: `${METADATA_NAMESPACE}/vReloadAmountMobile`,
      vReloadDelay: `${METADATA_NAMESPACE}/vReloadDelay`,
      isFilteringContent: `${METADATA_NAMESPACE}/isFilteringContent`,
    }),
    reloadAmount() {
      return this.$vuetify.breakpoint.smAndUp ? this.vReloadAmount : this.vReloadAmountMobile;
    },
    showPinnedElements() {
      return !this.loading && this.showMapFilter && this.pinnedIds.length > 0;
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
    pinnedList() {
      if (!this.showPinnedElements) {
        return [];
      }

      return this.pinnedIds;
    },
    mergePinnedAndFiltered() {
      const pinnedContent = [];

      this.pinnedIds.forEach((pinId) => {
        pinnedContent.push(this.metadatasContent[pinId]);
      });

      return [...pinnedContent, ...this.listContent];
    },
    loading() {
      return (this.loadingMetadatasContent
            || this.isFilteringContent
            || this.searchingMetadatasContent
      );
    },
    cardGridClass() {
      const fullSize = {
        'col-12': true,
        'col-sm-6': true,
        'col-md-4': true,
        'col-lg-3': true,
        'col-xl-2': !this.isActiveControl(LISTCONTROL_MAP_ACTIVE)
                    && this.isActiveControl(LISTCONTROL_COMPACT_LAYOUT_ACTIVE),
      };

      return fullSize;
    },
    contentSize() {
      return this.listContent !== undefined ? Object.keys(this.listContent).length : 0;
    },
  },
  methods: {
    getGeoJSONIcon(metadata) {
      if (!metadata.location) {
        return null;
      }

      const location = metadata.location;

      if (location.isPoint) {
        return this.pinIcon;
      }

      if (location.isMultiPoint) {
        return this.multiPinIcon;
      }
      
      if (location.isPolygon) {
        return this.polygonIcon;
      }

      return null;
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
          // use the current index only if the virutalList has already elements
          i = that.vIndex;
        }

        for (;i < that.vIndex + that.reloadAmount && i < that.contentSize; i++) {
          that.virtualListContent.push(that.listContent[i]);
        }

        if ($state) {
          if (that.virtualListContent.length >= that.contentSize) {
            $state.complete();
          } else {
            $state.loaded();
          }
        }

        that.$store.commit(`metadata/${SET_VIRTUAL_LIST_INDEX}`, i);

        that.vLoading = false;
        // console.log('loaded to ' + that.vIndex );
      }, this.vReloadDelay);
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

      const tagsEncoded = this.mixinMethods_encodeTagForUrl([cardType.toUpperCase()]);
      this.mixinMethods_additiveChangeRoute(BROWSE_PATH, '', tagsEncoded);
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
    metaDataClicked(datasetname) {
      this.$store.commit(`${METADATA_NAMESPACE}/${SET_DETAIL_PAGE_BACK_URL}`, this.$route);

      this.$router.push({
        name: METADATADETAIL_PAGENAME,
        params: {
          metadataid: datasetname,
        },
      });
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

      this.pinnedIds = newPins;

      // this.$store.commit(`${METADATA_NAMESPACE}/${PIN_METADATA}`, id);
    },
    catchClearButtonClick() {
      this.pinnedIds = [];
      // this.$store.commit(`${METADATA_NAMESPACE}/${CLEAR_PINNED_METADATA}`);
    },
    hasRestrictedResources(metadata) {
      if (!metadata || !metadata.resources || metadata.resources.length <= 0) {
        return false;
      }

      for (let i = 0; i < metadata.resources.length; i++) {
        const res = metadata.resources[i];

        if (res.restricted !== undefined
        && (res.restricted.allowed_users !== undefined
            || (res.restricted.level !== undefined
                && res.restricted.level !== 'public'))) {
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
  },
  watch: {
    contentSize: function resetVirtualContent() {
      this.$store.commit(`${METADATA_NAMESPACE}/${SET_VIRTUAL_LIST_INDEX}`, 0);
      this.virtualListContent = [];
      this.infiniteId += 1;
      this.infiniteHandler();
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
    infiniteId: +new Date(),
    preloadingDistance: 150,
    scrollTopButtonText: 'Scroll to the top',
    controlsLabel: 'List controls',
    controlsActive: [],
    listView: false,
    showMapFilter: false,
    pinnedIds: [],
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
    BaseRectangleButton,
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
    box-shadow: #4db6ac 0px 0px 5px 5px !important;
  }

</style>

<template>
  <article class="ma-0 pa-0 fill-height" id="BrowsePage" key="BrowsePage">
    <MetadataList
      ref="metadataList"
      :listContent="filteredDatasets"
      :mapFilteringPossible="mapFilteringPossible"
      @clickedTag="catchTagClicked"
      :selectedTagNames="selectedTagNames"
      :allTags="tagsFromDatasets"
      @clickedExpand="catchFilterExpandClicked"
      @clickedTagClose="catchTagCloseClicked"
      @clickedClear="catchTagCleared"
      @clickedCard="catchMetadataClicked"
      :prePinnedIds="selectedPins"
      @pinnedIds="catchPinnedIds"
      :modeData="modeData"
      :defaultListControls="defaultControls"
      :enabledControls="enabledControls"
      :useDynamicHeight="true"
      :minMapHeight="310"
      :mapTopLayout="$vuetify.display.lgAndUp"
      :topFilteringLayout="$vuetify.display.mdAndDown"
      @onScroll="storeScroll"
      :showSearch="true"
      :isAuthorSearch="isAuthorSearch"
      :isShallow="showShallowData"
      :searchTerm="currentSearchTerm"
      :searchCount="searchCount"
      :searchBarPlaceholder="searchBarPlaceholder"
      @searchClick="catchSearchClicked"
      @searchCleared="catchSearchCleared"
      @authorSearchClick="catchAuthorSearchClick"
      @shallowRealClick="catchShallowRealClick"
      @organizationClicked="catchOrganizationClicked"
      :showScrollTopButton="true"
      :updatingTags="updatingTags"
      :loading="loading"
      :loadingDetailSwitch="loadingDetailSwitch"
      :metadatasContent="allDatasets"
      :categoryCards="categoryCards"
    >
    </MetadataList>
  </article>
</template>

<script>
/**
 * The browse page of EnviDat. It consists of metadataList
 * but only all the logic for the interaction with the list.
 *
 * @summary browse page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2020-11-04 11:33:31
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mapGetters, mapState } from 'vuex';

import { BROWSE_PATH, METADATADETAIL_PAGENAME } from '@/router/routeConsts';

import {
  CLEAR_SEARCH_METADATA,
  EDNA_MODE,
  FILTER_METADATA,
  LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
  LISTCONTROL_LIST_ACTIVE,
  LISTCONTROL_MAP_ACTIVE,
  METADATA_NAMESPACE,
  SEARCH_METADATA,
  SET_DETAIL_PAGE_BACK_URL,
} from '@/store/metadataMutationsConsts';

import { SET_BROWSE_SCROLL_POSITION } from '@/store/mainMutationsConsts';

import MetadataList from '@/components/MetadataList.vue';
import { useModeStore } from '@/modules/browse/store/modeStore';
import {
  areArraysIdentical,
  convertArrayToUrlString,
  convertUrlStringToArray,
} from '@/factories/stringFactory';
import { isTagSelected } from '@/factories/metaDataFactory';
import categoryCards from '@/store/categoryCards';

export default {
  name: 'BrowsePage',
  created() {
    this.modeStore = useModeStore();
    this.modeStore.init();
  },
  async mounted() {
    this.oldIsAuthorSearch = this.isAuthorSearch;

    if (this.mode) {
      await this.loadModeDatasets();
    }

    this.checkRouteChanges(null);
  },
  methods: {
    /**
     * @param {array} datasets
     * return {object} dictionary
     */
    getContentDictionary(datasets) {
      if (!datasets) return {};

      const dictionary = {};

      for (let i = 0; i < datasets.length; i++) {
        const dataset = datasets[i];
        dictionary[dataset.id] = dataset;
      }

      return dictionary;
    },
    routeKeyworsChanged() {
      let tags = this.$route.query.tags || '';

      if (!areArraysIdentical(this.selectedTagNames, tags)) {
        tags = convertUrlStringToArray(tags);
        this.selectedTagNames = tags;
        return true;
      }

      return false;
    },
    loadRoutePins() {
      let pins = this.$route.query.pins || '';

      if (pins.length > 0) {
        pins = convertUrlStringToArray(pins, false, true);

        this.selectedPins = pins;
        return true;
      }

      return false;
    },
    async loadModeDatasets() {
      const datasets = await this.modeStore.loadModeDatasets(this.mode);

      const contentDictionary = {};
      for (let i = 0; i < datasets.length; i++) {
        const dataset = datasets[i];
        contentDictionary[dataset.id] = dataset;
      }

      this.modeContent = contentDictionary;
    },
    catchMetadataClicked(datasetname) {
      this.$store.commit(
        `${METADATA_NAMESPACE}/${SET_DETAIL_PAGE_BACK_URL}`,
        this.$route,
      );

      this.$router.push({
        name: METADATADETAIL_PAGENAME,
        query: this.$route.query,
        params: {
          metadataid: datasetname,
        },
      });
    },
    catchTagClicked(tagName) {
      if (!isTagSelected(tagName, this.selectedTagNames)) {
        const newTags = [...this.selectedTagNames, tagName];

        const stringTags = convertArrayToUrlString(newTags);

        this.$router.options.additiveChangeRoute(
          this.$route,
          this.$router,
          BROWSE_PATH,
          undefined,
          stringTags,
          undefined,
          undefined,
          this.isAuthorSearch,
        );
      }
    },
    catchTagCloseClicked(tagId) {
      if (this.selectedTagNames === undefined) {
        return;
      }

      const newTags = this.selectedTagNames.filter((tag) => tag !== tagId);
      const stringTags = convertArrayToUrlString(newTags);

      this.$router.options.additiveChangeRoute(
        this.$route,
        this.$router,
        BROWSE_PATH,
        undefined,
        stringTags,
        undefined,
        undefined,
        this.isAuthorSearch,
      );
    },
    catchTagCleared() {
      this.selectedTagNames = [];
      this.filterContent();
    },
    catchPinnedIds(pins) {
      this.selectedPins = pins;

      const stringPins = convertArrayToUrlString(this.selectedPins);

      this.$router.options.additiveChangeRoute(
        this.$route,
        this.$router,
        BROWSE_PATH,
        undefined,
        undefined,
        undefined,
        stringPins,
        this.isAuthorSearch,
      );
    },
    catchMapFilterChanged(visibleIds) {
      this.mapFilterVisibleIds = visibleIds;
    },
    catchFilterExpandClicked() {
      this.filterExpanded = !this.filterExpanded;
    },
    toggleMapExpand() {
      this.showMapFilter = !this.showMapFilter;
    },
    contentFilterMapIds(contentList) {
      const visibleContent = [];

      for (let i = 0; i < contentList.length; i++) {
        const el = contentList[i];

        if (this.mapFilterVisibleIds.includes(el.id)) {
          visibleContent.push(el);
        }
      }

      return visibleContent;
    },
    filterContent() {
      if (this.mode) {
        this.filteredModeContent = this.modeStore.getFilteredDatasets(
          this.selectedTagNames,
          this.mode,
        );

        this.modeTags = this.modeStore.getModeKeywords(this.mode);

        return;
      }

      this.$store.dispatch(`${METADATA_NAMESPACE}/${FILTER_METADATA}`, {
        selectedTagNames: this.selectedTagNames,
      });
    },
    checkRouteChanges(fromRoute) {
      let triggerClearSearch = false;
      let triggerScrollReset = false;

      if (!fromRoute) {
        if (this.detailPageBackRoute) {
          fromRoute = this.detailPageBackRoute;
        } else if (this.currentSearchTerm) {
          triggerClearSearch = true;
        }
      }

      const isBackNavigation = this.$router.options.isSameRoute(
        this.$route,
        fromRoute,
      );
      const tagsChanged = this.routeKeyworsChanged();

      const pinsChanged = this.loadRoutePins();

      // Assign searchParameter so that it can be checked for full text searches
      const searchParameter = this.$route.query.search || '';

      // True is searchParameter does not equal currentSearchTerm, else False
      const searchChanged =
        searchParameter !== this.currentSearchTerm ||
        this.isAuthorSearch !== this.oldIsAuthorSearch;

      if (!searchChanged) {
        // use the search parameter from the url in any case
        // if it's a back navigation it has to be set that is will appear in the searchBar component
        triggerClearSearch =
          this.currentSearchTerm !== '' &&
          !searchParameter &&
          this.filteredDatasetsSize !== this.allDatasetsSize;
      }

      if (isBackNavigation) {
        // use a delayed scroll position setup because the list as to be loaded first
        setTimeout(() => {
          this.setScrollPos(this.browseScrollPosition);
        }, this.scrollPositionDelay);
      }

      if (searchChanged) {
        if (searchParameter && searchParameter.length > 0) {
          if (this.mode) {
            this.filteredModeContent = this.modeStore.searchModeDatasets(
              searchParameter,
              this.mode,
            );
          } else {
            this.metadataSearch(searchParameter, this.metadataConfig);
          }

          this.resetScrollPos();

          // prevent immediately filtering, the search results
          // will be filtered via searchingMetadatasContentOK watch
          return;
        }

        // the searchTerm was changed to empty -> clear the search results
        triggerClearSearch = true;
        triggerScrollReset = true;
      }

      if (tagsChanged) {
        // in case the tags have changed the scroll needs to be reset
        triggerScrollReset = true;
      }

      if (triggerScrollReset && !isBackNavigation) {
        // and manually reset the scrolling
        this.resetScrollPos();
      }

      if (triggerClearSearch) {
        this.clearSearchResults();
      }

      if (pinsChanged && !tagsChanged && fromRoute) {
        // don't filter in case only pinsChanged and we aren't in the initial check
        return;
      }

      // always filter changes of the url except a change of the search term
      // because due to navigation the initial filter might be needed
      this.filterContent();
    },
    setScrollPos(toPos) {
      if (this.$refs && this.$refs.metadataList) {
        this.$refs.metadataList.setScrollPos(toPos);
      }
    },
    storeScroll(scrollY) {
      this.$store.commit(SET_BROWSE_SCROLL_POSITION, scrollY);
    },
    resetScrollPos() {
      this.storeScroll(0);
      this.setScrollPos(0);
    },
    clearSearchResults() {
      this.$store.commit(`${METADATA_NAMESPACE}/${CLEAR_SEARCH_METADATA}`);
    },
    metadataSearch(searchTerm, metadataConfig) {
      this.$store.dispatch(`${METADATA_NAMESPACE}/${SEARCH_METADATA}`, {
        searchTerm,
        metadataConfig,
        isAuthorSearch: this.isAuthorSearch,
        mode: this.mode,
      });
    },
    catchSearchClicked(search) {
      this.$router.options.additiveChangeRoute(
        this.$route,
        this.$router,
        BROWSE_PATH,
        search,
        undefined,
        this.mode,
        undefined,
        this.isAuthorSearch,
      );
    },
    catchSearchCleared() {
      this.$router.options.additiveChangeRoute(
        this.$route,
        this.$router,
        BROWSE_PATH,
        '',
        undefined,
        this.mode,
        undefined,
        this.isAuthorSearch,
      );
    },
    catchAuthorSearchClick() {
      this.oldIsAuthorSearch = this.isAuthorSearch;
      const newIsAuthorSearchParameter = this.isAuthorSearch ? 'false' : 'true';

      this.$router.options.additiveChangeRoute(
        this.$route,
        this.$router,
        BROWSE_PATH,
        this.currentSearchTerm,
        undefined,
        undefined,
        undefined,
        newIsAuthorSearchParameter,
      );
    },
    catchShallowRealClick() {
      this.showShallowData = !this.showShallowData;
    },
    // eslint-disable-next-line no-unused-vars
    catchOrganizationClicked(organization) {
      // console.log(`clicked on ${organization}`);
    },
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters({
      metadatasContent: `${METADATA_NAMESPACE}/metadatasContent`,
      searchedMetadatasContent: `${METADATA_NAMESPACE}/searchedMetadatasContent`,
      searchingMetadatasContent: `${METADATA_NAMESPACE}/searchingMetadatasContent`,
      searchingMetadatasContentOK: `${METADATA_NAMESPACE}/searchingMetadatasContentOK`,
      loadingMetadataIds: `${METADATA_NAMESPACE}/loadingMetadataIds`,
      loadingMetadatasContent: `${METADATA_NAMESPACE}/loadingMetadatasContent`,
      filteredContent: `${METADATA_NAMESPACE}/filteredContent`,
      isFilteringContent: `${METADATA_NAMESPACE}/isFilteringContent`,
      // tag Object structure: { tag: tagName, count: tagCount }
      allTags: `${METADATA_NAMESPACE}/allTags`,
      detailPageBackRoute: `${METADATA_NAMESPACE}/detailPageBackRoute`,
      updatingTags: `${METADATA_NAMESPACE}/updatingTags`,
      scrollPositionDelay: `${METADATA_NAMESPACE}/scrollPositionDelay`,
      browseScrollPosition: 'browseScrollPosition',
      defaultControls: 'defaultControls',
      currentSearchTerm: `${METADATA_NAMESPACE}/currentSearchTerm`,
    }),
    loading() {
      return (
        this.loadingMetadatasContent ||
        this.isFilteringContent ||
        this.searchingMetadatasContent
      );
    },
    metadataConfig() {
      return this.config?.metadataConfig || {};
    },
    isAuthorSearch() {
      return this.$route?.query?.isAuthorSearch === 'true' || false;
    },
    enabledControls() {
      let enableds = this.preenabledControls;

      if (this.$vuetify.display.smAndDown) {
        enableds = enableds.filter(
          (i) => i !== LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
        );
      }

      return enableds;
    },
    searchBarPlaceholder() {
      if (this.$vuetify.display.smAndDown) {
        return this.searchPlaceholderTextSmall;
      }

      return this.isAuthorSearch
        ? this.authorSearchPlaceholderText
        : this.searchPlaceholderText;
    },
    mapFilteringPossible() {
      return this.$vuetify.display.smAndUp;
    },
    searchCount() {
      return this.filteredDatasets?.length > 0
        ? Object.keys(this.filteredDatasets).length
        : 0;
    },
    mode() {
      return this.$route.query.mode
        ? this.$route.query.mode.toLowerCase()
        : undefined;
    },
    modeData() {
      return this.modeStore.getModeMetadata(this.mode);
    },
    filteredDatasets() {
      if (this.mode) {
        return this.filteredModeContent;
      }

      return this.filteredContent;
    },
    filteredDatasetsSize() {
      return this.filteredDatasets?.length;
    },
    allDatasets() {
      if (this.mode) {
        return this.modeContent;
      }

      return this.metadatasContent;
    },
    allDatasetsSize() {
      return this.allDatasets !== undefined
        ? Object.keys(this.allDatasets).length
        : 0;
    },
    tagsFromDatasets() {
      if (this.mode) {
        return this.modeTags;
      }

      return this.allTags;
    },
    showShallowData: {
      get() {
        if (this.mode === EDNA_MODE) {
          const modeMetadata = this.modeStore.getModeMetadata(EDNA_MODE);
          return modeMetadata.isShallow;
        }

        return false;
      },
      async set(showShallow) {
        this.loadingDetailSwitch = true;
        if (this.mode === EDNA_MODE) {
          const modeMetadata = this.modeStore.getModeMetadata(EDNA_MODE);
          modeMetadata.isShallow = showShallow;

          // reload the datasets again because there is a different behavior
          // based on the isShallow property
          await this.loadModeDatasets();
          this.filterContent();
          this.loadingDetailSwitch = false;
        }
      },
    },
  },
  watch: {
    async metadatasContent() {
      if (this.mode) {
        await this.loadModeDatasets();
      }

      this.filterContent();
    },
    /* eslint-disable no-unused-vars */
    $route: async function watchRouteChanges(to, from) {
      // react on changes of the route (browser back / forward click)

      if (this.mode) {
        await this.loadModeDatasets();
      }

      this.checkRouteChanges(from);
    },
    isFilteringContent() {
      if (!this.isFilteringContent) {
        this.setScrollPos(this.browseScrollPosition);
      }
    },
    searchedMetadatasContent() {
      if (!this.searchingMetadatasContent && this.searchingMetadatasContentOK) {
        this.filterContent();
      }
    },
  },
  components: {
    MetadataList,
  },
  data: () => ({
    categoryCards,
    EDNA_MODE,
    modeStore: null,
    modeContent: {},
    filteredModeContent: [],
    modeTags: [],
    suggestionText: 'Try one of these categories',
    searchPlaceholderTextSmall: 'Enter research search term',
    searchPlaceholderText: 'Enter research term or topic ',
    authorSearchPlaceholderText: 'Enter a name of an author',
    selectedTagNames: [],
    selectedPins: [],
    popularTagAmount: 10,
    showMapFilter: false,
    smallMapHeight: 250,
    largeMapHeight: 325,
    mapFilterVisibleIds: [],
    preenabledControls: [
      LISTCONTROL_LIST_ACTIVE,
      LISTCONTROL_MAP_ACTIVE,
      LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
    ],
    oldIsAuthorSearch: false,
    loadingDetailSwitch: false,
  }),
};
</script>

<style scoped>
.stickyFilterBar {
  position: sticky;
  top: 50px;
  z-index: 1000;
}
</style>

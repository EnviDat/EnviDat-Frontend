<template>
  <article class="ma-0 pa-0 fill-height"
            id="BrowsePage"
            key="BrowsePage">

    <metadata-list ref="metadataList"
                    :listContent="filteredContent"
                    :mapFilteringPossible="mapFilteringPossible"
                    :placeHolderAmount="placeHolderAmount"
                    @clickedTag="catchTagClicked"
                    :selectedTagNames="selectedTagNames"
                    :allTags="allTags"
                    @clickedExpand="catchFilterExpandClicked"
                    @clickedTagClose="catchTagCloseClicked"
                    @clickedClear="catchTagCleared"
                    @clickedCard="catchMetadataClicked"
                   :prePinnedIds="selectedPins"
                    @pinnedIds="catchPinnedIds"
                    :mode="mode"
                    :defaultListControls="defaultControls"
                    :enabledControls="enabledControls"
                    :useDynamicHeight="true"
                    :minMapHeight="310"
                    :mapTopLayout="$vuetify.breakpoint.lgAndUp"
                    :topFilteringLayout="$vuetify.breakpoint.mdAndDown"
                    @onScroll="storeScroll"
                    :showSearch="true"
                    :isAuthorSearch="isAuthorSearch"
                    :searchTerm="currentSearchTerm"
                    :searchCount="searchCount"
                    :searchBarPlaceholder="searchBarPlaceholder"
                    @searchClick="catchSearchClicked"
                    @searchCleared="catchSearchCleared"
                    @authorSearchClick="catchAuthorSearchClick"
                    @organizationClicked="catchOrganizationClicked"
                    :showScrollTopButton="true"
                    :reloadAmount="reloadAmount"
                    :reloadDelay="vReloadDelay"
    />

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

import {
  mapGetters,
  mapState,
} from 'vuex';
import {
  BROWSE_PAGENAME,
  BROWSE_PATH,
  METADATADETAIL_PAGENAME,
} from '@/router/routeConsts';
import {
  CLEAR_SEARCH_METADATA,
  FILTER_METADATA,
  LISTCONTROL_COMPACT_LAYOUT_ACTIVE,
  LISTCONTROL_LIST_ACTIVE,
  LISTCONTROL_MAP_ACTIVE,
  METADATA_NAMESPACE,
  SEARCH_METADATA,
  SET_DETAIL_PAGE_BACK_URL,
} from '@/store/metadataMutationsConsts';

import {
  SET_APP_BACKGROUND,
  SET_BROWSE_SCROLL_POSITION,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import MetadataList from '@/components/MetadataList';

export default {
  name: 'BrowsePage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, BROWSE_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
  mounted() {
    this.oldIsAuthorSearch = this.isAuthorSearch;

    this.checkRouteChanges(null);

    const getit = window.something.something;
    console.log(getit);

  },
  methods: {
    loadRouteTags() {
      let tags = this.$route.query.tags || '';

      if (!this.mixinMethods_areArraysIdentical(this.selectedTagNames, tags)) {

        tags = this.mixinMethods_convertUrlStringToArray(tags);
        this.selectedTagNames = tags;
        return true;
      }

      return false;
    },
    loadRoutePins() {
      let pins = this.$route.query.pins || '';

      if (pins.length > 0) {
        pins = this.mixinMethods_convertUrlStringToArray(pins, false, true);

        this.selectedPins = pins;
      }
    },
    catchMetadataClicked(datasetname) {
      this.$store.commit(`${METADATA_NAMESPACE}/${SET_DETAIL_PAGE_BACK_URL}`, this.$route);

      this.$router.push({
        name: METADATADETAIL_PAGENAME,
        params: {
          metadataid: datasetname,
        },
      });
    },
    catchTagClicked(tagName) {
      if (!this.mixinMethods_isTagSelected(tagName)) {
        const newTags = [...this.selectedTagNames, tagName];

        const stringTags = this.mixinMethods_convertArrayToUrlString(newTags);

        this.mixinMethods_additiveChangeRoute(BROWSE_PATH, undefined,
            stringTags, undefined, undefined, this.isAuthorSearch);
      }
    },
    catchTagCloseClicked(tagId) {
      if (this.selectedTagNames === undefined) {
        return;
      }

      const newTags = this.selectedTagNames.filter(tag => tag !== tagId);
      const stringTags = this.mixinMethods_convertArrayToUrlString(newTags);

      this.mixinMethods_additiveChangeRoute(BROWSE_PATH, undefined,
          stringTags, undefined, undefined, this.isAuthorSearch);
    },
    catchTagCleared() {
      this.selectedTagNames = [];
      this.filterContent();
    },
    catchPinnedIds(pins) {

      this.selectedPins = pins;

      const stringPins = this.mixinMethods_convertArrayToUrlString(this.selectedPins);

      this.mixinMethods_additiveChangeRoute(BROWSE_PATH, undefined, undefined,
          undefined, stringPins,
          this.isAuthorSearch);
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
      const mode = this.$route.query.mode ? this.$route.query.mode.toLowerCase() : null;
      this.$store.dispatch(`${METADATA_NAMESPACE}/${FILTER_METADATA}`,
        {
          selectedTagNames: this.selectedTagNames,
          mode,
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

      const isBackNavigation = this.$router.options.isSameRoute(this.$route, fromRoute);
      const tagsChanged = this.loadRouteTags();

      this.loadRoutePins();

      // Assign searchParameter so that it can be checked for full text searches
      const searchParameter = this.$route.query.search || '';

      // True is searchParameter does not equal currentSearchTerm, else False
      const checkSearchTriggering = searchParameter !== this.currentSearchTerm || this.isAuthorSearch !== this.oldIsAuthorSearch;

      if (!checkSearchTriggering) {
        // use the search parameter from the url in any case
        // if it's a back navigation it has to be set that is will appear in the searchBar component
        triggerClearSearch = (this.currentSearchTerm !== '' && !searchParameter) && (this.filteredContentSize !== this.metadatasContentSize);
      }

      if (isBackNavigation) {
        // use a delayed scroll position setup because the list as to be loaded first
        setTimeout(() => {
          this.setScrollPos(this.browseScrollPosition);
        }, this.scrollPositionDelay);
      }

      if (checkSearchTriggering) {

        if (searchParameter && searchParameter.length > 0) {

          this.metadataSearch(searchParameter, this.metadataConfig);
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
      });
    },
    catchSearchClicked(search) {
      // this.mixinMethods_additiveChangeRoute(BROWSE_PATH, search);
      if (this.currentSearchTerm.trim() !== search) {
        // the search parameter needs to be '' to clear it

        this.mixinMethods_additiveChangeRoute(BROWSE_PATH, search,
          undefined, undefined, undefined,
            this.isAuthorSearch);
      }
    },
    catchSearchCleared() {
      // Only change route if state currentSearchTrim is not equal to an empty string
      // to avoid redundant navigation when there are no search terms
      if (this.currentSearchTerm.trim() !== '') {

        // the search parameter needs to be '' to clear it
        this.mixinMethods_additiveChangeRoute(BROWSE_PATH, '',
        undefined, undefined, undefined,
          this.isAuthorSearch);
      }
    },
    catchAuthorSearchClick() {
      this.oldIsAuthorSearch = this.isAuthorSearch;
      const newIsAuthorSearchParameter = this.isAuthorSearch ? 'false' : 'true';

      this.mixinMethods_additiveChangeRoute(BROWSE_PATH,
          this.currentSearchTerm,
          undefined, undefined, undefined,
          newIsAuthorSearchParameter);

    },
    // eslint-disable-next-line no-unused-vars
    catchOrganizationClicked(organization) {
      // console.log(`clicked on ${organization}`);
    },
  },
  computed: {
    ...mapState([
      'config',
    ]),
    ...mapGetters({
      metadatasContent: `${METADATA_NAMESPACE}/metadatasContent`,
      metadatasContentSize: `${METADATA_NAMESPACE}/metadatasContentSize`,
      filteredContentSize: `${METADATA_NAMESPACE}/filteredContentSize`,
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
      vReloadAmount: `${METADATA_NAMESPACE}/vReloadAmount`,
      vReloadAmountMobile: `${METADATA_NAMESPACE}/vReloadAmountMobile`,
      vReloadDelay: `${METADATA_NAMESPACE}/vReloadDelay`,
    }),
    reloadAmount() {
      return this.$vuetify.breakpoint.smAndUp ? this.vReloadAmount : this.vReloadAmountMobile;
    },
    metadataConfig() {
      return this.config?.metadataConfig || {};
    },
    isAuthorSearch() {
      return this.$route?.query?.isAuthorSearch === 'true' || false;
    },
    enabledControls() {
      let enableds = this.preenabledControls;

      if (this.$vuetify.breakpoint.smAndDown) {
        enableds = enableds.filter(i => i !== LISTCONTROL_COMPACT_LAYOUT_ACTIVE);
      }

      return enableds;
    },
    searchBarPlaceholder() {
      if (this.$vuetify.breakpoint.smAndDown) {
        return this.searchPlaceholderTextSmall;
      }

      return this.isAuthorSearch ? this.authorSearchPlaceholderText : this.searchPlaceholderText;
    },
    // keywordsPlaceholder() {
    //   return this.searchingMetadatasContent || this.updatingTags;
    // },
    searchMetadatasContentSize() {
      return this.searchedMetadatasContent !== undefined ? Object.keys(this.searchedMetadatasContent).length : 0;
    },
    mapFilterHeight() {
      const sHeight = document.documentElement.clientHeight;

      let height = this.maxMapFilterHeight;

      if (sHeight < this.maxMapFilterHeight) {
        height = sHeight - 165;
      }

      return height;
    },
    metadataListStyling() {
      return {
        xs8: this.mapFilteringPossible && this.showMapFilter,
        xs12: this.mapFilteringPossible && !this.showMapFilter,
        'mt-2': !this.showMapFilter,
        // style: this.showMapFilter ? `margin-top: -${this.mapFilterHeight}px;` : '',
      };
    },
    mapFilteringPossible() {
      return this.$vuetify.breakpoint.smAndUp;
    },
    searchCount() {
      return this.filteredContent !== undefined ? Object.keys(this.filteredContent).length : 0;
    },
    mode() {
      return this.$route.query.mode ? this.$route.query.mode.toLowerCase() : null;
    },
  },
  watch: {
    /* eslint-disable no-unused-vars */
    $route: function watchRouteChanges(to, from) {
      // react on changes of the route (browser back / forward click)
      this.checkRouteChanges(from);
    },
    isFilteringContent() {
      if (!this.isFilteringContent) {
        this.setScrollPos(this.browseScrollPosition);
      }
    },
    metadatasContent() {
      this.filterContent();
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
    PageBGImage: 'app_b_browsepage',
    placeHolderAmount: 4,
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
  }),
};
</script>


<style scoped>

  .stickyFilterBar {
    position: -webkit-sticky;
    position: sticky;
    top: 50px;
    z-index: 1000;
  }

</style>

/**
 * metadata store module
 *
 * @summary metadata store
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { getCitationList } from '@/factories/citationFactory';
import categoryCards from '@/store/categoryCards';
import { getTagColor } from '@/factories/keywordsFactory';
import actions from './metadataActions';
import mutations from './metadataMutations';
import tags from './metadataTags';

for (let i = 0; i < tags.length; i++) {
  const tag = tags[i];
  tag.color = getTagColor(categoryCards, tag.name);
}

const initialState = {
  /**
   * metadataIds properties are used for step by step loading all the metadata
   */
  loadingMetadataIds: false,
  metadataIdsOK: false,
  metadataIds: [],
  /**
   * metadatasContent properties are used for "bulk" loading all the metadata when the app starts up
   */
  loadingMetadatasContent: false,
  loadingCurrentMetadataContent: false,
  metadatasContentOK: false,
  // map with key: metadata.id and value datasets object
  metadatasContent: {},
  /**
   * authorsMap property holds the  for "bulk" loading all the metadata when the app starts up
   */
  authorsMap: {},
  /**
   * the Search properties used when the users makes a full text search
   */
  searchedMetadatasContent: {},
  searchingMetadatasContent: false,
  searchingMetadatasContentOK: false,
  currentSearchTerm: '',
  /**
   * filteredContent is the Metadata which is actually shown on the BrowsePage
   */
  isFilteringContent: false,
  filteredContent: [],
  /**
   * currentMetadataContent is set when clicking on a MetadataCard / entry
   * it's used by the MetadataDetailPage
   */
  currentMetadataContent: null,
  /**
   * virtual List properties for MetaDataCards of the BrowsePage via MetadataListLayout
   */
  // scrollPositionDelay has to be more than the vReloadDelay
  scrollPositionDelay: 100,
  /**
   * Pinned Elements from the MapFilter
   */
  pinnedIds: [],
  /**
   * FilterBar properties
   */
  allTags: tags,
  loadingAllTags: false,
  updatingTags: false,
  /**
   * Route properties
   */
  detailPageBackRoute: null,
  aboutPageBackRoute: null,
  existingAuthors: [],
  existingKeywords: [],
  titleEditing: null,
};

export const metadata = {
  namespaced: true,
  state: initialState,
  getters: {
    loadingMetadataIds: (state) => state.loadingMetadataIds,
    loadingMetadatasContent: (state) => state.loadingMetadatasContent,
    metadataIds: (state) => state.metadataIds,
    metadatasContent: (state) => state.metadatasContent,
    recentMetadata: (state, getters) => {
      if (
        state.loadingMetadatasContent ||
        (!state.loadingMetadatasContent && !state.metadatasContentOK)
      ) {
        return [];
      }
      return getters.allMetadatas.slice(0, 4);
    },
    allMetadatas: (state) => Object.values(state.metadatasContent),
    metadatasContentSize: (state) =>
      state.metadatasContent !== undefined
        ? Object.keys(state.metadatasContent).length
        : 0,
    authorsMap: (state) => state.authorsMap,
    searchedMetadatasContent: (state) => state.searchedMetadatasContent,
    searchingMetadatasContent: (state) => state.searchingMetadatasContent,
    searchingMetadatasContentOK: (state) => state.searchingMetadatasContentOK,
    currentSearchTerm: (state) => state.currentSearchTerm,
    loadingCurrentMetadataContent: (state) =>
      state.loadingCurrentMetadataContent,
    currentMetadataContent: (state) => state.currentMetadataContent,
    isFilteringContent: (state) => state.isFilteringContent,
    filteredContent: (state) => state.filteredContent,
    scrollPositionDelay: (state) => state.scrollPositionDelay,
    pinnedIds: (state) => state.pinnedIds,
    allTags: (state) => state.allTags,
    loadingAllTags: (state) => state.loadingAllTags,
    updatingTags: (state) => state.updatingTags,
    detailPageBackRoute: (state) => state.detailPageBackRoute,
    titleEditing: (state) => state.titleEditing,
    aboutPageBackRoute: (state) => state.aboutPageBackRoute,
    existingAuthors: (state) => state.existingAuthors,
    existingKeywords: (state) => state.existingKeywords,
    getCitationListFromIds: (state) => (datasetIds) => {
      const datasets = Object.values(state.metadatasContent);

      return getCitationList(datasets, datasetIds);
    },
  },
  mutations,
  actions,
};

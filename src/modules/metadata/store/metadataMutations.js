/**
 * metadata store mutations
 *
 * @summary metadata store mutations
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-08-26 14:58:32
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  LOAD_METADATA_CONTENT_BY_ID,
  LOAD_METADATA_CONTENT_BY_ID_SUCCESS,
  LOAD_METADATA_CONTENT_BY_ID_ERROR,
  CLEAN_CURRENT_METADATA,
  SEARCH_METADATA,
  SEARCH_METADATA_SUCCESS,
  SEARCH_METADATA_ERROR,
  CLEAR_SEARCH_METADATA,
  BULK_LOAD_METADATAS_CONTENT,
  BULK_LOAD_METADATAS_CONTENT_SUCCESS,
  BULK_LOAD_METADATAS_CONTENT_ERROR,
  UPDATE_TAGS,
  UPDATE_TAGS_SUCCESS,
  UPDATE_TAGS_ERROR,
  FILTER_METADATA,
  FILTER_METADATA_SUCCESS,
  FILTER_METADATA_ERROR,
  PIN_METADATA,
  CLEAR_PINNED_METADATA,
  SET_DETAIL_PAGE_BACK_URL,
  SET_ABOUT_PAGE_BACK_URL,
  SET_VIRTUAL_LIST_INDEX,
  METADATA_NAMESPACE,
  SWISSFL_MODE,
} from '@/store/metadataMutationsConsts';

import {
  warningMessage,
  getSpecificApiError,
} from '@/factories/notificationFactory';

import { ADD_USER_NOTIFICATION } from '@/store/mainMutationsConsts';

import {
  enhanceMetadataEntry,
  enhanceTags,
  createLocation,
} from '@/factories/metaDataFactory';
import { extractAuthorsMap } from '@/factories/authorFactory';
import { solrResultToCKANJSON } from '@/factories/apiFactory';

import { enhanceMetadataFromExtras } from '@/factories/modeFactory';


function enhanceMetadataContent(store, datasets) {
  if (!(datasets instanceof Array)) {
    throw new Error(`enhanceMetadataContent() expects an array of datasets got ${typeof datasets}`);
  }
  const { cardBGImages } = store.getters;
  const categoryCards = store.getters[`${METADATA_NAMESPACE}/categoryCards`];
  const enhancedContent = {};

  for (let i = 0; i < datasets.length; i++) {
    let dataset = datasets[i];

    dataset = enhanceMetadataEntry(dataset, cardBGImages, categoryCards);
    dataset = enhanceMetadataFromExtras(SWISSFL_MODE, dataset);
    dataset = enhanceTags(dataset, categoryCards);
    dataset.location = createLocation(dataset);

    enhancedContent[dataset.id] = dataset;
  }

  return enhancedContent;
}


export default {
  [SEARCH_METADATA](state) {
    state.searchingMetadatasContent = true;
    state.searchingMetadatasContentOK = false;
    state.searchedMetadatasContent = {};
  },
  [SEARCH_METADATA_SUCCESS](state, payload) {

    const convertedPayload = [];
    for (let i = 0; i < payload.length; i++) {
      const convertedEntry = solrResultToCKANJSON(payload[i]);
      convertedPayload.push(convertedEntry);
    }

    state.searchedMetadatasContent = enhanceMetadataContent(this, convertedPayload);

    state.searchingMetadatasContentOK = true;
    state.searchingMetadatasContent = false;
  },
  [SEARCH_METADATA_ERROR](state, reason) {
    state.searchingMetadatasContent = false;
    state.searchingMetadatasContentOK = false;

    const errObj = getSpecificApiError('The searching cause an error. Try again or use Keywords for filtering. Please report if the error persists!', reason);

    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
  [CLEAR_SEARCH_METADATA](state) {
    state.searchingMetadatasContent = false;
    state.searchingMetadatasContentOK = false;
    state.searchedMetadatasContent = {};
  },
  [LOAD_METADATA_CONTENT_BY_ID](state) {
    state.loadingCurrentMetadataContent = true;
    state.currentMetadataContent = {};
    // this._vm.$set(state.currentMetadataContent, {});
  },
  [LOAD_METADATA_CONTENT_BY_ID_SUCCESS](state, payload) {
    state.loadingCurrentMetadataContent = false;
    const enhancedPayload = enhanceMetadataContent(this, [payload]);
    state.currentMetadataContent = Object.values(enhancedPayload)[0];
  },
  [LOAD_METADATA_CONTENT_BY_ID_ERROR](state, reason) {
    state.loadingCurrentMetadataContent = false;

    const errObj = getSpecificApiError('For this entry no Metadata cloud not be loaded, please report if the error persists!', reason);

    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
  [CLEAN_CURRENT_METADATA](state) {
    state.loadingCurrentMetadataContent = false;
    state.currentMetadataContent = {};
  },
  [BULK_LOAD_METADATAS_CONTENT](state) {
    state.loadingMetadatasContent = true;
    state.metadatasContent = {};
  },
  [BULK_LOAD_METADATAS_CONTENT_SUCCESS](state, payload) {
    state.metadatasContent = enhanceMetadataContent(this, payload);
    state.authorsMap = extractAuthorsMap(payload);

    state.metadatasContentOK = true;
    state.loadingMetadatasContent = false;
  },
  [BULK_LOAD_METADATAS_CONTENT_ERROR](state, reason) {
    state.loadingMetadatasContent = false;
    state.metadatasContentOK = false;

    const errObj = getSpecificApiError('Metadata can not be loaded, please report if the error persists!', reason);

    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
  [UPDATE_TAGS](state) {
    state.updatingTags = true;
  },
  [UPDATE_TAGS_SUCCESS](state, payload) {
    state.updatingTags = false;
    state.allTags = payload;
  },
  [UPDATE_TAGS_ERROR](state, reason) {
    state.updatingTags = false;

    const errObj = warningMessage('Keyword update error', `Error: ${reason.message}. \n Filtering might not work properly try reloading the page`, reason.stack);
    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
  [FILTER_METADATA](state) {
    state.isFilteringContent = true;
  },
  [FILTER_METADATA_SUCCESS](state, payload) {
    state.isFilteringContent = false;
    state.filteredContent = payload;
  },
  [FILTER_METADATA_ERROR](state, reason) {
    state.isFilteringContent = false;
    const errObj = warningMessage('Filtering error', `Error: ${reason.message}. \n Filtering might not work properly try reloading the page`, reason.stack);
    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
  [PIN_METADATA](state, payload) {
    if (state.pinnedIds.includes(payload)) {
      state.pinnedIds = state.pinnedIds.filter(el => el !== payload);
    } else {
      state.pinnedIds.push(payload);
    }
  },
  [CLEAR_PINNED_METADATA](state) {
    state.pinnedIds = [];
  },
  [SET_DETAIL_PAGE_BACK_URL](state, payload) {
    state.detailPageBackRoute = payload;
  },
  [SET_ABOUT_PAGE_BACK_URL](state, payload) {
    state.aboutPageBackRoute = payload;
  },
  [SET_VIRTUAL_LIST_INDEX](state, payload) {
    state.vIndex = payload;
  },
};

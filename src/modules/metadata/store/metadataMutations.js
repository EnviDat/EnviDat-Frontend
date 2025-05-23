/* eslint-disable no-underscore-dangle */
/**
 * metadata store mutations
 *
 * @summary metadata store mutations
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-11-04 11:34:42
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
  METADATA_UPDATE_EXISTING_AUTHORS,
  METADATA_UPDATE_EXISTING_KEYWORDS,
  METADATA_UPDATE_EXISTING_KEYWORDS_SUCCESS,
  METADATA_UPDATE_EXISTING_KEYWORDS_ERROR,
  METADATA_UPDATE_AN_EXISTING_AUTHOR,
  METADATA_NAMESPACE,
  METADATA_UPDATE_EXISTING_TITLE,
} from '@/store/metadataMutationsConsts';

import {
  warningMessage,
  getSpecificApiError,
} from '@/factories/notificationFactory';

import { ADD_USER_NOTIFICATION } from '@/store/mainMutationsConsts';

import { METADATA_KEYWORDS_TITLE } from '@/factories/metadataConsts';

import { extractAuthorsMap } from '@/factories/authorFactory';
import { solrResultToCKANJSON } from '@/factories/apiFactory';
import { enhanceMetadatas } from '@/factories/metaDataFactory';


export default {
  [SEARCH_METADATA](state, searchTerm) {
    state.searchingMetadatasContent = true;
    state.searchingMetadatasContentOK = false;
    state.searchedMetadatasContent = {};
    state.currentSearchTerm = searchTerm;
  },
  [SEARCH_METADATA_SUCCESS](
    state,
    { payload, isLocalSearch = false, mode = undefined },
  ) {
    let convertedPayload = [];
    if (isLocalSearch) {
      convertedPayload = payload;
    } else {
      for (let i = 0; i < payload.length; i++) {
        const convertedEntry = solrResultToCKANJSON(payload[i]);
        convertedPayload.push(convertedEntry);
      }
    }

    state.searchedMetadatasContent = enhanceMetadatas(convertedPayload, mode);

    state.searchingMetadatasContentOK = true;
    state.searchingMetadatasContent = false;
  },
  [SEARCH_METADATA_ERROR](state, reason) {
    state.searchingMetadatasContent = false;
    state.searchingMetadatasContentOK = false;

    const errObj = getSpecificApiError(
      'The searching cause an error. Try again or use Keywords for filtering. Please report if the error persists!',
      reason,
    );

    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
  [CLEAR_SEARCH_METADATA](state) {
    state.searchingMetadatasContent = false;
    state.searchingMetadatasContentOK = false;
    state.searchedMetadatasContent = {};
    state.currentSearchTerm = '';
  },
  [LOAD_METADATA_CONTENT_BY_ID](state) {
    state.loadingCurrentMetadataContent = true;
    state.currentMetadataContent = null;
  },
  [LOAD_METADATA_CONTENT_BY_ID_SUCCESS](state, payload) {
    state.loadingCurrentMetadataContent = false;

    const enhancedPayload = enhanceMetadatas([payload]);

    state.currentMetadataContent = Object.values(enhancedPayload)[0];
  },
  [LOAD_METADATA_CONTENT_BY_ID_ERROR](state, reason) {
    state.loadingCurrentMetadataContent = false;

    const errObj = getSpecificApiError(
      'For this entry no Metadata could be loaded, please report if the error persists!',
      reason,
    );

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

    state.metadatasContent = enhanceMetadatas(payload);
    state.authorsMap = extractAuthorsMap(payload);

    state.metadatasContentOK = true;
    state.loadingMetadatasContent = false;
  },
  [BULK_LOAD_METADATAS_CONTENT_ERROR](state, reason) {
    state.loadingMetadatasContent = false;
    state.metadatasContentOK = false;

    const errObj = getSpecificApiError(
      'Metadata could not be loaded, please report if the error persists!',
      reason,
    );

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

    const errObj = warningMessage(
      'Keyword update error',
      `Error: ${reason.message}. \n Filtering might not work properly try reloading the page`,
      reason.stack,
    );
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
    const errObj = warningMessage(
      'Filtering error',
      `Error: ${reason.message}. \n Filtering might not work properly try reloading the page`,
      reason.stack,
    );
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
    // make a copy to avoid using a reactive object, otherwise with every navigation the backRoute is also updated!
    state.detailPageBackRoute = { ...payload };
  },
  [SET_ABOUT_PAGE_BACK_URL](state, payload) {
    // make a copy to avoid using a reactive object, otherwise with every navigation the backRoute is also updated!
    state.aboutPageBackRoute = { ...payload };
  },
  /*
  [METADATA_CREATE_NEW_AUTHOR](state, newAuthor) {

  },
*/
  [METADATA_UPDATE_AN_EXISTING_AUTHOR](state, modifiedAuthor) {
    let authorToUpdate = {};
    const authorsMap = this.getters[`${METADATA_NAMESPACE}/authorsMap`];

    let key = modifiedAuthor.email;

    if (key) {
      authorToUpdate = authorsMap[key];
    }

    if (!authorToUpdate) {
      const existingAuthors = Object.values(authorsMap);
      const subSelection = existingAuthors.filter(
        a => a.fullName === modifiedAuthor.fullName,
      );

      if (subSelection.length > 0) {
        key = modifiedAuthor.email;
        authorToUpdate = subSelection[0];

        // if the key isn't correct, the old one needs to be deleted on the map object
        delete authorsMap[authorToUpdate.email];
      }
    }

    if (authorToUpdate) {
      this.authorsMap[key] = {
        ...authorToUpdate,
        ...modifiedAuthor,
      };
    }
  },
  [METADATA_UPDATE_EXISTING_AUTHORS](state, existingAuthors) {
    state.existingAuthors = existingAuthors;
  },
  [METADATA_UPDATE_EXISTING_KEYWORDS](state) {
    state.existingKeywords = [];
  },
  [METADATA_UPDATE_EXISTING_KEYWORDS_SUCCESS](state, payload) {
    state.existingKeywords = payload;
  },
  [METADATA_UPDATE_EXISTING_TITLE](state, payload) {
    state.titleEditing = payload;
  },
  [METADATA_UPDATE_EXISTING_KEYWORDS_ERROR](state, reason) {
    const errObj = warningMessage(
      `${METADATA_KEYWORDS_TITLE} Error`,
      `Error while processing keywords: ${reason.message}.`,
      reason.stack,
    );
    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
};

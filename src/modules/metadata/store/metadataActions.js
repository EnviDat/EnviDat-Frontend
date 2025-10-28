/* eslint-disable no-useless-escape */
/**
 * metadata store actions
 *
 * @summary metadata store actions
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-11-03 22:18:15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import axios from 'axios';

import {
  LOAD_METADATA_CONTENT_BY_ID,
  // LOAD_METADATA_CONTENT_BY_ID_SUCCESS,
  // LOAD_METADATA_CONTENT_BY_ID_ERROR,
  SEARCH_METADATA,
  SEARCH_METADATA_SUCCESS,
  SEARCH_METADATA_ERROR,
  BULK_LOAD_METADATAS_CONTENT,
  BULK_LOAD_METADATAS_CONTENT_SUCCESS,
  BULK_LOAD_METADATAS_CONTENT_ERROR,
  UPDATE_TAGS,
  UPDATE_TAGS_ERROR,
  UPDATE_TAGS_SUCCESS,
  FILTER_METADATA,
  FILTER_METADATA_SUCCESS,
  FILTER_METADATA_ERROR,
  METADATA_NAMESPACE,
  METADATA_UPDATE_EXISTING_AUTHORS,
  METADATA_UPDATE_EXISTING_KEYWORDS,
  METADATA_UPDATE_EXISTING_KEYWORDS_SUCCESS,
  METADATA_UPDATE_EXISTING_KEYWORDS_ERROR,
  ACTION_BULK_LOAD_METADATAS_CONTENT,
  ACTION_LOAD_METADATA_CONTENT_BY_ID,
  ACTION_METADATA_UPDATE_EXISTING_KEYWORDS,
  ACTION_SEARCH_METADATA,
} from '@/store/metadataMutationsConsts';

import { urlRewrite } from '@/factories/apiFactory';
import { localSearch, sortObjectArray } from '@/factories/metaDataFactory';

import { getKeywordsForFiltering, getTagColor, tagsIncludedInSelectedTags } from '@/factories/keywordsFactory';

import categoryCards from '@/store/categoryCards';

/* eslint-disable no-unused-vars  */
let API_BASE = '';
let API_ROOT = '';

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = import.meta.env?.VITE_API_BASE_URL;
  API_ROOT = import.meta.env?.VITE_API_ROOT;
}

function contentFilteredByTags(value, selectedTagNames) {
  return value.tags && tagsIncludedInSelectedTags(value.tags, selectedTagNames);
}

function createSolrQuery(searchTerm) {
  return `title:"*${searchTerm}*"~2 OR notes:"*${searchTerm}*"~2`;
  /*
  const splits = searchTerm.split(' ');
  if (splits.length <= 0) {
    return overallSearchString;
  }

  let solrQuery = overallSearchString;

  for (let i = 0; i < splits.length; i++) {
    const searchSplit = splits[i];

    solrQuery += ` OR title: "*${searchSplit}*" OR notes: "*${searchSplit}*"`;
  }

  // https://www.envidat.ch/query?ident=on&q=author:%22Marcia%20Phillips%22~2
  // %20OR%20author:%22*Marcia*%22%20OR%20author:%22*Phillips*%22&wt=json&rows=1000&fq=capacity:public&fq=state:active

  return solrQuery;
*/
}

// Returns array with strings that are both only maxWords or less and do not start with a number
function getfilteredArray(arr, maxWords) {
  return arr?.filter((item) => item.trim().split(' ').length <= maxWords && !/^\d/.test(item));
}

// Return array with each element converted to object with name and assigned color
function getKeywordObjects(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = {
      name: arr[i],
      color: getTagColor(categoryCards, arr[i]),
    };
  }
  return arr;
}

// Returns solr query string for author key
// Adds anglicized umlaut characters for authors whose names include umlauts
// to broaden search and return more search results
function getAuthorSolrQuery(author) {
  // Trim author string
  const authorTrimmed = author.trim();

  const authorSpecialChars = authorTrimmed.replace('ü', 'ue').replace('ä', 'ae').replace('ö', 'oe');

  if (authorTrimmed === authorSpecialChars) {
    return `author:"*${authorTrimmed}*"~1000`;
  }

  return `author:"*${authorTrimmed}*"OR"*${authorSpecialChars}*"~1000`;
}

// Returns array of objects in ascending order by 'name' key
// Name values converted to upper case so that comparisons are case insensitive

export default {
  async [SEARCH_METADATA]({ commit }, { searchTerm, metadataConfig = {}, isAuthorSearch = false, mode = undefined }) {
    const originalTerm = searchTerm.trim();

    commit(SEARCH_METADATA, searchTerm);

    const loadLocalFile = metadataConfig.loadLocalFile;

    if (loadLocalFile) {
      const datasets = this.getters[`${METADATA_NAMESPACE}/allMetadatas`];
      const localSearchResult = localSearch(searchTerm, datasets);

      commit(SEARCH_METADATA_SUCCESS, {
        payload: localSearchResult,
        isLocalSearch: true,
        mode,
      });
      return;
    }

    const solrQuery = isAuthorSearch ? getAuthorSolrQuery(originalTerm) : createSolrQuery(originalTerm);
    const query = `${ACTION_SEARCH_METADATA()}?q=${solrQuery}`;
    const queryAdditions = '&wt=json&rows=1000';
    const publicOnlyQuery = `${query}${queryAdditions}&fq=capacity:public&fq=state:active`;
    const url = urlRewrite(publicOnlyQuery, '/', API_ROOT);

    await axios
      .get(url)
      .then((response) => {
        commit(SEARCH_METADATA_SUCCESS, {
          payload: response.data.response.docs,
          mode,
        });
      })
      .catch((reason) => {
        commit(SEARCH_METADATA_ERROR, reason);
      });
  },
  async [LOAD_METADATA_CONTENT_BY_ID]({ commit }, { metadataId, commitMethod, forceBackendReload = false }) {
    // commitMethod can be given from the caller of the action to direct
    // the output to a different store mutation then one from this module (metadataMutations)
    const commitMethodPrefix = commitMethod || LOAD_METADATA_CONTENT_BY_ID;

    commit(commitMethodPrefix, null, {
      root: !!commitMethod,
    });

    if (!forceBackendReload) {
      const metadatasContent = this.getters[`${METADATA_NAMESPACE}/metadatasContent`];
      const contents = Object.values(metadatasContent);

      // needs to be compared with the name of the dataset!
      const localEntry = contents.filter((entry) => entry.name === metadataId || entry.id === metadataId)[0];
      if (localEntry) {
        // filter() always return an array
        commit(`${commitMethodPrefix}_SUCCESS`, localEntry, {
          root: !!commitMethod,
        });
        return;
      }
    }

    const actionUrl = ACTION_LOAD_METADATA_CONTENT_BY_ID();
    const url = urlRewrite(`${actionUrl}?id=${metadataId}`, API_BASE, API_ROOT);

    await axios
      .get(url)
      .then((response) => {
        commit(`${commitMethodPrefix}_SUCCESS`, response.data.result, {
          root: !!commitMethod,
        });
      })
      .catch((reason) => {
        commit(`${commitMethodPrefix}_ERROR`, reason, {
          root: !!commitMethod,
        });
      });
  },
  // ENRICO - 'master' call for all data
  async [BULK_LOAD_METADATAS_CONTENT]({ dispatch, commit }, config = {}) {
    commit(BULK_LOAD_METADATAS_CONTENT);

    const metadataConfig = config.metadataConfig || {};

    const actionUrl = ACTION_BULK_LOAD_METADATAS_CONTENT();
    let url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    const localFileUrl = metadataConfig.localFileUrl;
    const loadLocalFile = metadataConfig.loadLocalFile;

    if (loadLocalFile && localFileUrl) {
      url = localFileUrl;
    }

    await axios
      .get(url)
      .then((response) => {
        // commit(BULK_LOAD_METADATAS_CONTENT_SUCCESS, response.data.response.docs, showRestrictedContent);
        commit(BULK_LOAD_METADATAS_CONTENT_SUCCESS, response.data.result);

        // make sure the existingAuthors list is up-2-date
        dispatch(METADATA_UPDATE_EXISTING_AUTHORS);

        // make sure the existingKeywords list is up-2-date
        return dispatch(METADATA_UPDATE_EXISTING_KEYWORDS, config.userEditMetadataConfig);
      })
      .catch((reason) => {
        commit(BULK_LOAD_METADATAS_CONTENT_ERROR, reason);
      });
  },
  [UPDATE_TAGS]({ commit }) {
    // if (this.getters[`${METADATA_NAMESPACE}/updatingTags`]) {
    //   return;
    // }

    const filteredDatasets = this.getters[`${METADATA_NAMESPACE}/filteredContent`];
    const allTags = this.getters[`${METADATA_NAMESPACE}/allTags`];

    if (!filteredDatasets || !allTags) {
      return;
    }

    commit(UPDATE_TAGS);

    try {
      const updatedTags = getKeywordsForFiltering(filteredDatasets, undefined, 35);

      commit(UPDATE_TAGS_SUCCESS, updatedTags);
    } catch (error) {
      commit(UPDATE_TAGS_ERROR, error);
    }
  },
  // eslint-disable-next-line consistent-return
  [FILTER_METADATA]({ dispatch, commit }, { selectedTagNames = [] }) {
    commit(FILTER_METADATA);

    const isSearchResultContent = this.getters[`${METADATA_NAMESPACE}/searchingMetadatasContentOK`];

    try {
      let datasets = this.getters[`${METADATA_NAMESPACE}/allMetadatas`];

      if (isSearchResultContent) {
        const searchContent = this.getters[`${METADATA_NAMESPACE}/searchedMetadatasContent`];

        // always overwrite the values also when nothing was found, so the "search not fount" can show up
        datasets = Object.values(searchContent);
      }

      let filteredDatasets = [];

      if (selectedTagNames.length > 0) {
        for (let i = 0; i < datasets.length; i++) {
          const dataset = datasets[i];

          if (contentFilteredByTags(dataset, selectedTagNames)) {
            filteredDatasets.push(dataset);
          }
        }
      } else {
        filteredDatasets = datasets;
      }

      commit(FILTER_METADATA_SUCCESS, filteredDatasets);

      return dispatch(UPDATE_TAGS);
    } catch (error) {
      commit(FILTER_METADATA_ERROR, error);
    }
  },
  async [METADATA_UPDATE_EXISTING_AUTHORS]({ commit }) {
    const authorsMap = this.getters[`${METADATA_NAMESPACE}/authorsMap`];
    let existingAuthors = Object.values(authorsMap);

    existingAuthors = sortObjectArray(existingAuthors, 'lastName');

    // enhance the entries that the selection button shows up on the authorCard
    // don't do it for now to disable Author Editing
    // enhanceElementsWithStrategyEvents(existingAuthors, SELECT_EDITING_AUTHOR_PROPERTY);

    commit(METADATA_UPDATE_EXISTING_AUTHORS, existingAuthors);
  },
  async [METADATA_UPDATE_EXISTING_KEYWORDS]({ commit }, userEditMetadataConfig = {}) {
    commit(METADATA_UPDATE_EXISTING_KEYWORDS);

    const existingKeywords = this.getters[`${METADATA_NAMESPACE}/allTags`];
    // commit(METADATA_UPDATE_EXISTING_KEYWORDS, existingKeywords);

    const actionUrl = ACTION_METADATA_UPDATE_EXISTING_KEYWORDS();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    await axios
      .get(url)
      .then((response) => {
        const tags = response.data.result;

        if (tags) {
          const keywordsListWordMax = userEditMetadataConfig?.keywordsListWordMax || 2;
          const filteredTags = getfilteredArray(tags, keywordsListWordMax);

          const keywordObjects = getKeywordObjects(filteredTags);

          const mergedKeywords = existingKeywords.concat(keywordObjects);

          const sortedKeywords = sortObjectArray(mergedKeywords, 'name');

          commit(METADATA_UPDATE_EXISTING_KEYWORDS_SUCCESS, sortedKeywords);
        }
      })
      .catch((reason) => {
        commit(METADATA_UPDATE_EXISTING_KEYWORDS_ERROR, reason);
      });
  },
};

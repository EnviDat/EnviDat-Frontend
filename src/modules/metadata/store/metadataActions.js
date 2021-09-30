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
  LOAD_METADATA_CONTENT_BY_ID_SUCCESS,
  LOAD_METADATA_CONTENT_BY_ID_ERROR,
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
  PUBLICATIONS_RESOLVE_IDS,
  PUBLICATIONS_RESOLVE_IDS_SUCCESS,
  PUBLICATIONS_RESOLVE_IDS_ERROR,
  EXTRACT_IDS_FROM_TEXT,
  EXTRACT_IDS_FROM_TEXT_SUCCESS,
  EXTRACT_IDS_FROM_TEXT_ERROR,
  METADATA_UPDATE_EXISTING_AUTHORS,
  METADATA_UPDATE_EXISTING_KEYWORDS,
  METADATA_UPDATE_EXISTING_KEYWORDS_SUCCESS,
  METADATA_UPDATE_EXISTING_KEYWORDS_ERROR,
} from '@/store/metadataMutationsConsts';

import catCards from '@/store/categoryCards';

import {
  tagsIncludedInSelectedTags,
  getEnabledTags,
  getPopularTags,
} from '@/factories/metadataFilterMethods';
import {
  getTagsMergedWithExtras,
  getSelectedTagsMergedWithHidden,
} from '@/factories/modeFactory';
import { urlRewrite } from '@/factories/apiFactory';
import { getTagColor } from '@/factories/metaDataFactory';

import metadataTags from '@/modules/metadata/store/metadataTags';
/*
import { enhanceElementsWithStrategyEvents } from '@/factories/strategyFactory';
import { SELECT_EDITING_AUTHOR_PROPERTY } from '@/factories/eventBus';
*/

/* eslint-disable no-unused-vars  */
const PROXY = process.env.VUE_APP_ENVIDAT_PROXY;
const API_BASE = process.env.VUE_APP_API_BASE_URL || '/api/action/';

const useTestdata = process.env.VUE_APP_USE_TESTDATA === 'true';

function contentSize(content) {
  return content !== undefined ? Object.keys(content).length : 0;
}

function contentFilterAccessibility(value) {
  // don't make a check for now
  return true;

  // if (value.capacity && value.capacity !== 'public') {
  //   // unpublished entries have 'private'
  //   return false;
  // } else if (value.private && value.private === true) {
  //   return false;
  // }

  // return true;
}

function contentFilteredByTags(value, selectedTagNames) {
  if (value.tags && tagsIncludedInSelectedTags(value.tags, selectedTagNames)) {
    return true;
  }

  return false;
}

function createSolrQuery(searchTerm) {

  const overallSearchString = `title:"*${searchTerm}*"~2 OR notes:"*${searchTerm}*"~2 OR author:"*${searchTerm}*"~2`;

  const splits = searchTerm.split(' ');
  if (splits.length <= 0) {
    return overallSearchString;
  }

  let solrQuery = overallSearchString;

  for (let i = 0; i < splits.length; i++) {
    const searchSplit = splits[i];

    solrQuery += ` OR author: "*${searchSplit}*" OR title: "*${searchSplit}*" OR notes: "*${searchSplit}*"`;
  }

  // https://www.envidat.ch/query?ident=on&q=author:%22Marcia%20Phillips%22~2
  // %20OR%20author:%22*Marcia*%22%20OR%20author:%22*Phillips*%22&wt=json&rows=1000&fq=capacity:public&fq=state:active

  return solrQuery;
}

function localSearch(searchTerm, datasets) {
  const foundDatasets = [];

  let term1 = searchTerm;
  let term2 = '';
  const check2Terms = searchTerm.includes(' ');

  if (check2Terms) {
    const splits = searchTerm.split(' ');
    term1 = splits[0];
    term2 = splits[1];
  }

  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];

    const match1 = dataset.title.includes(term1)
      || dataset.author.includes(term1)
      || dataset.notes.includes(term1);

    let match2 = true;
    if (check2Terms) {
      match2 = dataset.title.includes(term2)
        || dataset.author.includes(term2)
        || dataset.notes.includes(term2);
    }

    if (match1 && match2) {
      foundDatasets.push(dataset);
    }
  }

  return foundDatasets;
}

// Returns array with strings that are both only maxWords or less and do not start with a number
function getfilteredArray(arr, maxWords) {
  return arr.filter(item => item.trim().split(' ').length <= maxWords && !/^\d/.test(item));
}

// Return array with each element converted to object with name and assigned color
function getKeywordObjects(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = {
              name: arr[i],
              color: getTagColor(catCards, arr[i]),
            };
  }
  return arr;
}

// Returns array of objects in ascending order by 'name' key
// Name values converted to upper case so that comparisons are case insensitive
function sortArrayObjectsAsending(arrObjects) {
  return arrObjects.sort((a, b) => ((a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : -1));
}

export default {
  async [SEARCH_METADATA]({ commit }, {
    searchTerm,
    metadataConfig = {},
  }) {
    const originalTerm = searchTerm.trim();

    commit(SEARCH_METADATA, searchTerm);

    const loadLocalFile = metadataConfig.loadLocalFile;

    if (loadLocalFile) {
      const datasets = this.getters[`${METADATA_NAMESPACE}/allMetadatas`];
      const localSearchResult = localSearch(searchTerm, datasets);
      commit(SEARCH_METADATA_SUCCESS, {
        payload: localSearchResult,
        isLocalSearch: true,
      });
      return;
    }

    const solrQuery = createSolrQuery(originalTerm);

    // using the envidat "query" action for performance boost (ckan package_search isn't performant)
    // const queryAuthor = `query?q=title:"${searchTerm}" OR notes:"${searchTerm}" OR author:"${searchTerm}"~2&wt=json&rows=1000`;
    const query = `query?q=${solrQuery}`;
    const queryAdditions = '&wt=json&rows=1000';
    const publicOnlyQuery = `${query}${queryAdditions}&fq=capacity:public&fq=state:active`;
    const url = urlRewrite(publicOnlyQuery, '/', PROXY);


    await axios
      .get(url)
      .then((response) => {

        commit(SEARCH_METADATA_SUCCESS, {
          payload: response.data.response.docs,
        });
      })
      .catch((reason) => {
        commit(SEARCH_METADATA_ERROR, reason);
      });
  },
  async [LOAD_METADATA_CONTENT_BY_ID]({ commit }, metadataId) {
    commit(LOAD_METADATA_CONTENT_BY_ID);

    const metadatasContent = this.getters[`${METADATA_NAMESPACE}/metadatasContent`];
    const contents = Object.values(metadatasContent);

    const localEntry = contents.filter(entry => entry.name === metadataId);
    // filter() always return an array
    if (localEntry.length === 1) {
      commit(LOAD_METADATA_CONTENT_BY_ID_SUCCESS, localEntry[0]);
      return;
    }

    const url = urlRewrite(`package_show?id=${metadataId}`, API_BASE, PROXY);

    await axios.get(url).then((response) => {
      commit(LOAD_METADATA_CONTENT_BY_ID_SUCCESS, response.data.result);
    }).catch((reason) => {
      commit(LOAD_METADATA_CONTENT_BY_ID_ERROR, reason);
    });
  },
  async [BULK_LOAD_METADATAS_CONTENT]({ dispatch, commit }, config = {}) {
    commit(BULK_LOAD_METADATAS_CONTENT);

    const metadataConfig = config.metadataConfig || {};

    let url = urlRewrite('current_package_list_with_resources?limit=1000&offset=0',
                API_BASE, PROXY);

    if (process.env.NODE_ENV === 'development' && useTestdata) {
      url = './testdata/packagelist.json';
    }

    const localFileUrl = metadataConfig.localFileUrl;
    const loadLocalFile = metadataConfig.loadLocalFile;

    if (loadLocalFile && localFileUrl) {
      url = localFileUrl;
    }

    await axios.get(url)
      .then((response) => {
        // commit(BULK_LOAD_METADATAS_CONTENT_SUCCESS, response.data.response.docs, showRestrictedContent);
        commit(BULK_LOAD_METADATAS_CONTENT_SUCCESS, response.data.result);

        // make sure the existingAuthors list is up-2-date
        dispatch(METADATA_UPDATE_EXISTING_AUTHORS);

        // make sure the existingKeywords list is up-2-date
        dispatch(METADATA_UPDATE_EXISTING_KEYWORDS, config.userEditMetadataConfig);

        // for the case when loaded up on landingpage
        return dispatch(FILTER_METADATA, { selectedTagNames: [] });
      })
      .catch((reason) => {
        commit(BULK_LOAD_METADATAS_CONTENT_ERROR, reason);
      });
  },
  [UPDATE_TAGS]({ commit }, mode) {
    // if (this.getters[`${METADATA_NAMESPACE}/updatingTags`]) {
    //   return;
    // }

    const filteredContent = this.getters[`${METADATA_NAMESPACE}/filteredContent`];
    const allTags = this.getters[`${METADATA_NAMESPACE}/allTags`];

    if (!filteredContent || !allTags) {
      return;
    }

    commit(UPDATE_TAGS);

    try {
        let allWithExtras = [];

        const mergedExtraTags = getTagsMergedWithExtras(mode, allTags);
        if (mergedExtraTags) {
          const popularTags = getPopularTags(filteredContent, 'SWISS FOREST LAB', 5, filteredContent.length);
          const mergedWithPopulars = [...mergedExtraTags, ...popularTags.slice(0, 15)];

          const mergedWithoutDublicates = mergedWithPopulars.filter((item, pos, self) => self.findIndex(v => v.name === item.name) === pos);
          // tags with the same count as the content have no use, remove them
          // allWithExtras = mergedWithoutDublicates.filter((item) => { item.count >= filteredContent.length});
          allWithExtras = mergedWithoutDublicates;
        } else {
          allWithExtras = metadataTags;
        }

        const updatedTags = getEnabledTags(allWithExtras, filteredContent);
      commit(UPDATE_TAGS_SUCCESS, updatedTags);
    } catch (error) {
      commit(UPDATE_TAGS_ERROR, error);
    }
  },
  // eslint-disable-next-line consistent-return
  [FILTER_METADATA]({ dispatch, commit }, {
    selectedTagNames = [],
    mode,
  }) {
    commit(FILTER_METADATA);

    const mergedWithHiddenNames = getSelectedTagsMergedWithHidden(mode, selectedTagNames);
    if (mergedWithHiddenNames) {
      selectedTagNames = mergedWithHiddenNames;
    }
    let content = [];
    // console.log("filteredMetadataContent");

    const isSearchResultContent = this.getters[`${METADATA_NAMESPACE}/searchingMetadatasContentOK`];

    try {
      if (isSearchResultContent) {
        const searchContent = this.getters[`${METADATA_NAMESPACE}/searchedMetadatasContent`];
        const searchContentSize = contentSize(searchContent);

        if (searchContentSize > 0) {
          content = Object.values(searchContent);
        }
      } else {
        // const metadatasContent = this.getters[`${METADATA_NAMESPACE}/metadatasContent`];
        // content = Object.values(metadatasContent);
        content = this.getters[`${METADATA_NAMESPACE}/allMetadatas`];
      }

      let filteredContent = [];

      if (selectedTagNames.length > 0) {
        for (let i = 0; i < content.length; i++) {
          const entry = content[i];

          if (contentFilteredByTags(entry, selectedTagNames)) {
            filteredContent.push(entry);
          }
        }
      } else {
        filteredContent = content;
      }

      commit(FILTER_METADATA_SUCCESS, filteredContent);

      return dispatch(UPDATE_TAGS, mode);
    } catch (error) {
      commit(FILTER_METADATA_ERROR, error);
    }
  },
  [PUBLICATIONS_RESOLVE_IDS]({ commit }, { idsToResolve, resolveBaseUrl }) {
    commit(PUBLICATIONS_RESOLVE_IDS);

    const currentIdsToResolve = idsToResolve;
    const requests = [];
    currentIdsToResolve.forEach((id) => {
      const url = resolveBaseUrl + id;
      requests.push(axios.get(url));
    });

    Promise.all(requests)
      .then((responses) => {
        let resolvedPublications = {};

        for (let i = 0; i < responses.length; i++) {
          const response = responses[i];
          resolvedPublications = { ...resolvedPublications, ...response.data };
        }

        commit(PUBLICATIONS_RESOLVE_IDS_SUCCESS, {
          idsToResolve: currentIdsToResolve,
          resolvedPublications,
        });
      })
      .catch((error) => {
        commit(PUBLICATIONS_RESOLVE_IDS_ERROR, error);
      });
  },
  [EXTRACT_IDS_FROM_TEXT]({ commit }, { text, idDelimiter = '', idPrefix = '' }) {

    if (text) {

      commit(EXTRACT_IDS_FROM_TEXT);

      try {
        const regExStr = `\\${idPrefix}\\s?[a-zA-Z]+${idDelimiter}\\d+`;
        const regEx = new RegExp(regExStr, 'gm');
        const hasValidIds = text.match(regEx) || [];
        // console.log(`hasValidIds ${hasValidIds?.length}`);

        const ids = [];

        hasValidIds.forEach((match) => {
          let idOnly = match;
          if (idPrefix) {
            idOnly = idOnly.replace(idPrefix, '');
          }

          ids.push(idOnly.trim());
          // console.log(`Found match, group ${groupIndex}: ${match}`);
        });

        commit(EXTRACT_IDS_FROM_TEXT_SUCCESS, ids);
      } catch (e) {
        commit(EXTRACT_IDS_FROM_TEXT_ERROR, e);
      }
    }
  },
  async [METADATA_UPDATE_EXISTING_AUTHORS]({ commit }) {

    const authorsMap = this.getters[`${METADATA_NAMESPACE}/authorsMap`];
    const existingAuthors = Object.values(authorsMap);

    // enhance the entries that the selection button shows up on the resourceCard
    // don't do it for now to disable Author Editing
    // enhanceElementsWithStrategyEvents(existingAuthors, SELECT_EDITING_AUTHOR_PROPERTY);

    commit(METADATA_UPDATE_EXISTING_AUTHORS, existingAuthors);
  },
  async [METADATA_UPDATE_EXISTING_KEYWORDS]({ commit }, userEditMetadataConfig = {}) {

    commit(METADATA_UPDATE_EXISTING_KEYWORDS);

    const existingKeywords = this.getters[`${METADATA_NAMESPACE}/allTags`];
    // commit(METADATA_UPDATE_EXISTING_KEYWORDS, existingKeywords);

    const url = urlRewrite('tag_list', API_BASE, PROXY);

    await axios.get(url).then((response) => {

      const tags = response.data.result;

      const keywordsListWordMax = userEditMetadataConfig.keywordsListWordMax || 2;
      const filteredTags = getfilteredArray(tags, keywordsListWordMax);

      const keywordObjects = getKeywordObjects(filteredTags);

      const mergedKeywords = existingKeywords.concat(keywordObjects);

      const sortedKeywords = sortArrayObjectsAsending(mergedKeywords);

      commit(METADATA_UPDATE_EXISTING_KEYWORDS_SUCCESS, sortedKeywords);

    }).catch((reason) => {
      commit(METADATA_UPDATE_EXISTING_KEYWORDS_ERROR, reason);
    });
  },
};

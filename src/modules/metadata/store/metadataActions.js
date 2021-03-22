/**
 * metadata store actions
 *
 * @summary metadata store actions
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-07 21:14:20
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
} from '@/store/metadataMutationsConsts';

import {
  getEnabledTags,
  getPopularTags,
  contentFilteredByTags,
} from '@/factories/metadataFilterMethods';

import {
  getTagsMergedWithExtras,
  getSelectedTagsMergedWithHidden,
} from '@/factories/modeFactory';
import { urlRewrite } from '@/factories/apiFactory';

import metadataTags from '@/modules/metadata/store/metadataTags';

/* eslint-disable no-unused-vars  */
const PROXY = process.env.VUE_APP_ENVIDAT_PROXY;
const API_BASE = '/api/action/';

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

export default {
  async [SEARCH_METADATA]({ commit }, searchTerm) {
    commit(SEARCH_METADATA);

    const originalTerm = searchTerm.trim();

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
        commit(SEARCH_METADATA_SUCCESS, response.data.response.docs);
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
  async [BULK_LOAD_METADATAS_CONTENT]({ dispatch, commit }) {
    commit(BULK_LOAD_METADATAS_CONTENT);

    let url = urlRewrite('current_package_list_with_resources?limit=1000&offset=0',
                API_BASE, PROXY);

    if (process.env.NODE_ENV === 'development') {
      url = './testdata/packagelist.json';
    }

    await axios.get(url)
      .then((response) => {
        // commit(BULK_LOAD_METADATAS_CONTENT_SUCCESS, response.data.response.docs, showRestrictedContent);
        commit(BULK_LOAD_METADATAS_CONTENT_SUCCESS, response.data.result);

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
  [FILTER_METADATA]({ dispatch, commit }, { selectedTagNames, mode }) {
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
        const metadatasContent = this.getters[`${METADATA_NAMESPACE}/metadatasContent`];
        content = Object.values(metadatasContent);
      }

      const filteredContent = [];

      for (let i = 0; i < content.length; i++) {
        const entry = content[i];

        if (contentFilteredByTags(entry, selectedTagNames)) {
          filteredContent.push(entry);
        }
      }

      commit(FILTER_METADATA_SUCCESS, filteredContent);

      return dispatch(UPDATE_TAGS, mode);
    } catch (error) {
      commit(FILTER_METADATA_ERROR, error);
    }
  },
};

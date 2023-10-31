/**
 * user store actions
 *
 * @summary user store actions
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 16:51:52
 * Last modified  : 2021-08-18 10:48:15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import axios from 'axios';
import { urlRewrite } from '@/factories/apiFactory';

import { extractBodyIntoUrl, getSOLRStringForElements } from '@/factories/stringFactory';

import {
  ACTION_USER_COLLABORATOR_DATASETS,
  FETCH_USER_DATA,
  USER_GET_COLLABORATOR_DATASETS,
  USER_GET_COLLABORATOR_DATASETS_ERROR,
  USER_GET_COLLABORATOR_DATASETS_SUCCESS,
} from './userMutationsConsts';

// don't use an api base url or API_ROOT when using testdata
let API_BASE = '';
let API_ROOT = '';

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  API_ROOT = import.meta.env.VITE_API_ROOT;
}


export default {
  async [FETCH_USER_DATA]({ commit }, payload) {
    commit(payload.mutation);

    const body = payload.body || {};

    // unpack the action because it might be wrapped to provide a test url
    const actionUrl = typeof (payload.action) === 'function' ? payload.action() : payload.action;

    let url = extractBodyIntoUrl(actionUrl, body);
    url = urlRewrite(url, API_BASE, API_ROOT);

    // if the url is directly to a file it has to be a get call
    // const method = url.includes('.json') ? 'get' : 'post';

    await axios.get(url)
      .then((response) => {
        if (payload.commit) {
          commit(`${payload.mutation}_SUCCESS`, response.data.result);
        }
      })
      .catch((error) => {
        commit(`${payload.mutation}_ERROR`, error);
      });
  },
  async [USER_GET_COLLABORATOR_DATASETS]({ commit }, collaboratorIds) {
    commit(USER_GET_COLLABORATOR_DATASETS);

    if (!collaboratorIds || collaboratorIds.length <= 0) {
      commit(USER_GET_COLLABORATOR_DATASETS_SUCCESS, { datasets: [], collaboratorIds: [] });
      return;
    }

    const actionUrl = ACTION_USER_COLLABORATOR_DATASETS();
    const limit = this.state.user.collaboratorDatasetsLimit;
    const idQuery = getSOLRStringForElements('id', collaboratorIds);

    let url = extractBodyIntoUrl(actionUrl, {
      q: idQuery,
      include_private: true,
      include_drafts: true,
      rows: limit,
    });

    url = urlRewrite(url, API_BASE, API_ROOT);

    await axios.get(url)
      .then((response) => {
        if (useTestdata && typeof response.data === 'string') {
          response.data = JSON.parse(response.data);
        }
        commit(USER_GET_COLLABORATOR_DATASETS_SUCCESS,
          {
            datasets: response.data.result.results,
            collaboratorIds,
          });
      })
      .catch((error) => {
        commit(USER_GET_COLLABORATOR_DATASETS_ERROR, error);
      });
  },
};

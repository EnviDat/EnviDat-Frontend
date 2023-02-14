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

import { extractBodyIntoUrl } from '@/factories/stringFactory';

import {
  ACTION_USER_COLLABORATOR_DATASETS,
  ACTION_USER_ORGANIZATION_IDS,
  ACTION_USER_ORGANIZATIONS,
  FETCH_USER_DATA,
  USER_GET_COLLABORATOR_DATASETS,
  USER_GET_COLLABORATOR_DATASETS_ERROR,
  USER_GET_COLLABORATOR_DATASETS_SUCCESS,
  USER_GET_ORGANIZATION_IDS,
  USER_GET_ORGANIZATION_IDS_ERROR,
  USER_GET_ORGANIZATION_IDS_SUCCESS,
  USER_GET_ORGANIZATIONS,
  USER_GET_ORGANIZATIONS_ERROR,
  USER_GET_ORGANIZATIONS_RESET,
  USER_GET_ORGANIZATIONS_SUCCESS,
} from './userMutationsConsts';

// don't use an api base url or proxy when using testdata
let API_BASE = '';
let ENVIDAT_PROXY = '';

const useTestdata = import.meta.env.VITE_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  ENVIDAT_PROXY = import.meta.env.VITE_ENVIDAT_PROXY;
}

const sleep = (milliseconds) =>
  // eslint-disable-next-line no-promise-executor-return
  new Promise((resolve) => setTimeout(resolve, milliseconds));


export default {
  async [FETCH_USER_DATA]({ commit }, payload) {
    commit(payload.mutation);

    const body = payload.body || {};

    // unpack the action because it might be wrapped to provide a test url
    const actionUrl = typeof (payload.action) === 'function' ? payload.action() : payload.action;

    let url = extractBodyIntoUrl(actionUrl, body);
    url = urlRewrite(url, API_BASE, ENVIDAT_PROXY);

    // if the url is directly to a file it has to be a get call
    // const method = url.includes('.json') ? 'get' : 'post';

    await axios.get(url)
      // await axios({ method, url, body })
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

    let idQuery = 'id:(';
    for (let i = 0; i < collaboratorIds.length; i++) {
      idQuery += `"${collaboratorIds[i].id}",`;
    }
    idQuery += ')';

    let url = extractBodyIntoUrl(actionUrl, {
      q: idQuery,
      include_private: true,
      include_drafts: true,
      rows: limit,
    });

    url = urlRewrite(url, API_BASE, ENVIDAT_PROXY);

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
  async [USER_GET_ORGANIZATION_IDS]({ commit }, userId) {
    commit(USER_GET_ORGANIZATION_IDS);

    const actionUrl = ACTION_USER_ORGANIZATION_IDS();
    let url = extractBodyIntoUrl(actionUrl, { id: userId });
    url = urlRewrite(url, API_BASE, ENVIDAT_PROXY);

    if (useTestdata) {
      // ignore the parameters for testdata, because it's directly a file
      url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);
    }

    await axios.get(url)
      .then((response) => {
        commit(USER_GET_ORGANIZATION_IDS_SUCCESS, response.data.result);
      })
      .catch((error) => {
        commit(USER_GET_ORGANIZATION_IDS_ERROR, error);
      });
  },
  async [USER_GET_ORGANIZATIONS]({ commit }, ids) {
    commit(USER_GET_ORGANIZATIONS);

    if (!ids || ids.length <= 0) {
      commit(USER_GET_ORGANIZATIONS_RESET);
      return;
    }

    const actionUrl = ACTION_USER_ORGANIZATIONS();

    const requests = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];

      let url = extractBodyIntoUrl(actionUrl, {
        id,
        include_datasets: true,
        include_tags: true,
      });

      url = urlRewrite(url, API_BASE, ENVIDAT_PROXY);

      if (useTestdata) {
        // ignore the parameters for testdata, because it's directly a file
        url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);
      }

      requests.push(axios.get(url));
    }

    await Promise.all(requests)
      .then((responses) => {
        for (let i = 0; i < responses.length; i++) {
          const response = responses[i];
          commit(USER_GET_ORGANIZATIONS_SUCCESS, response.data.result);
        }
      })
      .catch((error) => {
        commit(USER_GET_ORGANIZATIONS_ERROR, error);
      });
  },
};

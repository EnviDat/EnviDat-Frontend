/**
 * user store actions
 *
 * @summary user store actions
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 16:51:52
 * Last modified  : 2020-10-08 16:09:15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import axios from 'axios';

import { urlRewrite } from '@/factories/apiFactory';

import {
  FETCH_USER_DATA,
  USER_GET_ORGANIZATION_IDS,
  USER_GET_ORGANIZATION_IDS_SUCCESS,
  USER_GET_ORGANIZATION_IDS_ERROR,
  ACTION_USER_ORGANIZATION_IDS,
  USER_GET_ORGANIZATIONS,
  USER_GET_ORGANIZATIONS_SUCCESS,
  USER_GET_ORGANIZATIONS_ERROR,
  ACTION_USER_ORGANIZATIONS,
  USER_GET_ORGANIZATIONS_DATASETS,
  USER_GET_ORGANIZATIONS_DATASETS_SUCCESS,
  USER_GET_ORGANIZATIONS_DATASETS_ERROR,
  ACTION_USER_ORGANIZATIONS_DATASETS,
} from './userMutationsConsts';

// don't use an api base url or proxy when using testdata
let API_BASE = '';
let ENVIDAT_PROXY = '';

const useTestdata = process.env.VUE_APP_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = '/api/action/';
  ENVIDAT_PROXY = process.env.VUE_APP_ENVIDAT_PROXY;  
}

function extractBodyIntoUrl(url, body) {
  const keys = Object.keys(body);

  if (keys && keys.length > 0) {
    url += '?';
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i > 0) {
        url += '&';
      }
      url += `${key}=${body[key]}`;
    }
  }

  return url;
}

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
  async [USER_GET_ORGANIZATION_IDS]({ dispatch, commit }, userId) {
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

        const organizations = this.state.user.userOrganizationNames;
        if (organizations?.length > 0) {
          dispatch(USER_GET_ORGANIZATIONS_DATASETS, organizations);
        }
      })
      .catch((error) => {
        commit(USER_GET_ORGANIZATION_IDS_ERROR, error);
      });
  },
  async [USER_GET_ORGANIZATIONS]({ commit }, ids) {
    commit(USER_GET_ORGANIZATIONS);

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
  async [USER_GET_ORGANIZATIONS_DATASETS]({ commit }, organizations) {
    commit(USER_GET_ORGANIZATIONS_DATASETS);

    const actionUrl = ACTION_USER_ORGANIZATIONS_DATASETS();
    const limit = this.state.user.userRecentOrgaDatasetsLimit;

    const requests = [];
    for (let i = 0; i < organizations.length; i++) {
      const name = organizations[i];

      let url = extractBodyIntoUrl(actionUrl, {
        q: `organization:${name}`,
        include_private: true,
        include_drafts: true,
        rows: limit,
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
          if (useTestdata && typeof response.data === 'string') {
            response.data = JSON.parse(response.data);
          }
          commit(USER_GET_ORGANIZATIONS_DATASETS_SUCCESS, response.data.result);
        }
      })
      .catch((error) => {
        commit(USER_GET_ORGANIZATIONS_DATASETS_ERROR, error);
      });

  },  
};

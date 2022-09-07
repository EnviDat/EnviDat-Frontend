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
  ACTION_USER_EDITING_UPDATE,
  FETCH_USER_DATA,
  USER_EDITING_UPDATE,
  USER_EDITING_UPDATE_ERROR,
  USER_EDITING_UPDATE_SUCCESS,
} from './userMutationsConsts';


// don't use an api base url or proxy when using testdata
let API_BASE = '';
let ENVIDAT_PROXY = '';

const useTestdata = process.env.VUE_APP_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = '/api/action/';
  ENVIDAT_PROXY = process.env.VUE_APP_ENVIDAT_PROXY;
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

    await axios.get(url, { withCredentials: true })
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
  async [USER_EDITING_UPDATE]({ commit }, { userId, firstName, lastName, email }) {

    commit(USER_EDITING_UPDATE);

    const actionUrl = ACTION_USER_EDITING_UPDATE();
    const url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);

    // the userId is the minimum, only add the other data if there is
    // data to patch
    const postData = { id: userId };

    const fullname = `${firstName} ${lastName}`.trim();

    if (fullname) {
      postData.fullname = fullname;
    }

    if (email) {
      postData.email = email;
    }

    // the adding of the apiKey into the headers is taken care of
    // via axios interceptor in @/src/main.js
    await axios.post(url, postData)
      .then((response) => {
        commit(USER_EDITING_UPDATE_SUCCESS, response?.data?.result);
      })
      .catch((reason) => {
        commit(USER_EDITING_UPDATE_ERROR, reason);
      });
  },

};

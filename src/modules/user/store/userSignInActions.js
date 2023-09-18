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
  ACTION_GET_USER_CONTEXT,
  ACTION_USER_EDITING_UPDATE,
  SIGNIN_USER_ACTION,
  GET_USER_CONTEXT,
  USER_EDITING_UPDATE,
  USER_EDITING_UPDATE_ERROR,
  USER_EDITING_UPDATE_SUCCESS,
  requestMethodsForLoginActions,
  USER_SIGNIN_NAMESPACE,
  ACTION_GET_USER_CONTEXT_TOKEN,
  ACTION_API_TOKEN,
} from './userMutationsConsts';


// don't use an api base url or API_ROOT when using testdata
let API_BASE = '';
let API_ROOT = '';

const useTestdata = import.meta?.env?.VITE_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  API_ROOT = import.meta.env.VITE_API_ROOT;
}


export default {
  async [SIGNIN_USER_ACTION]({ commit }, payload) {
    commit(payload.mutation);

    let data = payload.body || undefined;
    const action = payload.action;
    const method = requestMethodsForLoginActions(action);

    // unpack the action because it might be wrapped to provide a test url
    const actionUrl = typeof (payload.action) === 'function' ? payload.action() : payload.action;

    let url = actionUrl;
    if (method.toLowerCase() === 'get' && data) {
      url = extractBodyIntoUrl(actionUrl, data);
      // reset the data to avoid being part of the post data in the request
      data = undefined;
    }
    url = urlRewrite(url, API_BASE, API_ROOT);

    // if the url is directly to a file it has to be a get call
    // const method = url.includes('.json') ? 'get' : 'post';

    await axios.request({ url, method, data })
      .then((response) => {
        if (payload.commit) {
          commit(`${payload.mutation}_SUCCESS`, response.data.result);

          if (actionUrl === ACTION_API_TOKEN()) {
            // make an additional call with the token to get the cookie set
            const token = response.data.result.token;

            this.dispatch(`${USER_SIGNIN_NAMESPACE}/${SIGNIN_USER_ACTION}`, {
              action: ACTION_GET_USER_CONTEXT_TOKEN,
              commit: true,
              mutation: GET_USER_CONTEXT,
              body: { token },
            });
          }
        }
      })
      .catch((error) => {
        commit(`${payload.mutation}_ERROR`, error);
      });
  },
  async [USER_EDITING_UPDATE]({ commit, dispatch }, { userId, firstName, lastName, email }) {

    commit(USER_EDITING_UPDATE);

    const actionUrl = ACTION_USER_EDITING_UPDATE();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    // the userId is the minimum, only add the other data if there is
    // data to patch
    const postData = { id: userId };

    const fullName = `${firstName} ${lastName}`.trim();

    if (fullName) {
      postData.fullname = fullName;
    }

    if (email) {
      postData.email = email;
    }

    try {
      await axios.post(url, postData);

      await dispatch(SIGNIN_USER_ACTION,
        {
          action: ACTION_GET_USER_CONTEXT,
          commit: true,
          mutation: GET_USER_CONTEXT,
        });

      commit(USER_EDITING_UPDATE_SUCCESS);

    } catch (reason) {
      commit(USER_EDITING_UPDATE_ERROR, reason);
    }
  },

};

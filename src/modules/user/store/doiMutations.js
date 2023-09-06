/**
 * doi mutations to connect to the backend for the doi workflow
 *
 * @summary metadata store actions
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { getSpecificApiError } from '@/factories/notificationFactory';
import { ADD_USER_NOTIFICATION } from '@/store/mainMutationsConsts';
import {
  DOI_PUBLISH,
  DOI_REQUEST,
  DOI_RESERVE,
} from '@/modules/user/store/doiMutationsConsts';

function baseDoiCommit(state) {
  state.doiLoading = true;
  state.doiSuccess = false;
  state.doiError = null;
}

function baseDoiSuccess(state) {
  state.doiLoading = false;
  state.doiSuccess = true;
}

function baseDoiError(commit, state, reason) {
  state.doiLoading = false;
  state.doiError = reason;

  const details = 'An error occurred when changing the publication status!';
  const errObj = getSpecificApiError(details, reason);

  commit(ADD_USER_NOTIFICATION, errObj);
}

export default {
  [DOI_RESERVE](state, { key }) {
    baseDoiCommit(state);
    state[key] = null;
  },
  [`${DOI_RESERVE}_SUCCESS`](state, { key, value}) {
    baseDoiSuccess(state);
    if (key) {
      state[key] = value;
    }
  },
  [`${DOI_RESERVE}_ERROR`](state, reason) {
    baseDoiError(this.commit, state, reason);
  },
  [DOI_REQUEST](state) {
    baseDoiCommit(state);
  },
  [`${DOI_REQUEST}_SUCCESS`](state, { key, value }) {
    baseDoiSuccess(state);
    if (key) {
      state[key] = value;
    }
  },
  [`${DOI_REQUEST}_ERROR`](state, reason) {
    baseDoiError(this.commit, state, reason);
  },
  [DOI_PUBLISH](state) {
    baseDoiCommit(state);
  },
  [`${DOI_PUBLISH}_SUCCESS`](state, { key, value }) {
    baseDoiSuccess(state);
    if (key) {
      state[key] = value;
    }
  },
  [`${DOI_PUBLISH}_ERROR`](state, reason) {
    baseDoiError(this.commit, state, reason);
  },
}

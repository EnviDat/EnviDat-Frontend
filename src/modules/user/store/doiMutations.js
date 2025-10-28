/**
 * doi mutations to connect to the backend for the doi workflow
 *
 * @summary metadata store actions
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { DOI_PUBLISH, DOI_REQUEST, DOI_RESERVE } from '@/modules/user/store/doiMutationsConsts';
import { createErrorMessage } from '@/modules/user/store/mutationFactory';

function baseDoiCommit(state) {
  state.doiLoading = true;
  state.doiSuccess = false;
  state.doiError = null;
}

function baseDoiSuccess(state) {
  state.doiLoading = false;
  state.doiSuccess = true;
}

function baseDoiError(state, reason, message) {
  state.doiLoading = false;

  const errorObj = createErrorMessage(reason, message);
  state.doiError = {
    message: errorObj.message,
    details: errorObj.details,
  };
}

export default {
  [DOI_RESERVE](state, { key }) {
    baseDoiCommit(state);
    state[key] = null;
  },
  [`${DOI_RESERVE}_SUCCESS`](state, { key, value }) {
    baseDoiSuccess(state);
    if (key) {
      state[key] = value;
    }
  },
  [`${DOI_RESERVE}_ERROR`](state, reason) {
    baseDoiError(state, reason, 'DOI Reserving failed');
  },
  [DOI_REQUEST](state) {
    baseDoiCommit(state);
  },
  [`${DOI_REQUEST}_SUCCESS`](state) {
    baseDoiSuccess(state);
  },
  [`${DOI_REQUEST}_ERROR`](state, reason) {
    baseDoiError(state, reason, 'DOI Request failed');
  },
  [DOI_PUBLISH](state) {
    baseDoiCommit(state);
  },
  [`${DOI_PUBLISH}_SUCCESS`](state) {
    baseDoiSuccess(state);
  },
  [`${DOI_PUBLISH}_ERROR`](state, reason) {
    baseDoiError(state, reason, 'DOI Publishing failed');
  },
};

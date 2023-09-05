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
  DOI_RESERVED_PROPERTY,
} from '@/modules/metadata/store/doiMutationsConsts';

function baseDoiCommit(state) {
  state.doiLoading = true;
  state.doiSuccess = false;
  state.doiError = null;
}

function baseDoiSuccess(state) {
  state.doiLoading = false;
  state.doiSuccess = true;
}

function baseDoiError(state, reason) {
  state.doiLoading = false;
  state.doiError = reason;

  const details = 'An error occurred while loading the organizations!';
  const errObj = getSpecificApiError(details, reason);

  this.commit(ADD_USER_NOTIFICATION, errObj);
}

export default {

  [DOI_RESERVE](state, { key }) {
    baseDoiCommit(state);
    state[key] = null;
  },
  [`${DOI_RESERVE}_SUCCESS`](state, { key, value}) {
    baseDoiSuccess(state);
    state[key] = value;
  },
  [`${DOI_RESERVE}_ERROR`](state, reason) {
    baseDoiError(state, reason);
  },
  [DOI_REQUEST](state) {
    baseDoiCommit(state);
  },
  [`${DOI_REQUEST}_SUCCESS`](state) {
    baseDoiSuccess(state);
  },
  [`${DOI_REQUEST}_ERROR`](state, reason) {
    baseDoiError(state, reason);
  },
  [DOI_PUBLISH](state) {
    baseDoiCommit(state);
  },
  [`${DOI_PUBLISH}_SUCCESS`](state, { key, value }) {
    baseDoiSuccess(state);
  },
  [`${DOI_PUBLISH}_ERROR`](state, reason) {
    baseDoiError(state, reason);
  },
}

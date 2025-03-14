/**
 * about store mutations
 *
 * @summary about store mutations
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-29 20:54:09
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { getSpecificApiError } from '@/factories/notificationFactory';
import {
  GET_DMP,
  GET_DMP_ERROR,
  GET_DMP_SUCCESS,
  GET_GUIDELINES,
  GET_GUIDELINES_ERROR,
  GET_GUIDELINES_SUCCESS,
  GET_POLICIES,
  GET_POLICIES_ERROR,
  GET_POLICIES_SUCCESS,
  GET_IMPRINT,
  GET_IMPRINT_SUCCESS,
  GET_IMPRINT_ERROR,
} from '@/modules/about/store/aboutMutationsConsts';
import { ADD_USER_NOTIFICATION } from '@/store/mainMutationsConsts';

export default {
  [GET_GUIDELINES](state) {
    state.guidelinesloading = true;
  },
  [GET_GUIDELINES_SUCCESS](state, payload) {
    state.guidelinesMarkdown = payload;
    state.guidelinesloading = false;
  },
  [GET_GUIDELINES_ERROR](state, reason) {
    state.guidelinesloading = false;

    const details = 'An error occurred while loading the guidelines!';
    const errObj = getSpecificApiError(details, reason);
    state.guidelinesMarkdown = `${details}: ${reason}`;

    if (import.meta.env?.DEV) {
      state.guidelinesMarkdown +=
        ' \nThis is normal when developing locally on localhost:8080';
    }

    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
  [GET_POLICIES](state) {
    state.policiesLoading = true;
  },
  [GET_POLICIES_SUCCESS](state, payload) {
    state.policiesMarkdown = payload;
    state.policiesLoading = false;
  },
  [GET_POLICIES_ERROR](state, reason) {
    state.policiesLoading = false;

    const details = 'An error occurred while loading the policies!';
    const errObj = getSpecificApiError(details, reason);

    state.policiesMarkdown = `${details}: ${reason}`;

    if (import.meta.env?.DEV) {
      state.policiesMarkdown +=
        ' \nThis is normal when developing locally on localhost:8080';
    }

    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
  [GET_DMP](state) {
    state.loading = true;
  },
  [GET_DMP_SUCCESS](state, payload) {
    state.dmpMarkdown = payload;
    state.loading = false;
  },
  [GET_DMP_ERROR](state, reason) {
    state.loading = false;

    const details = 'An error occurred while loading the dmp infos!';
    const errObj = getSpecificApiError(details, reason);
    state.dmpMarkdown = `${details}: ${reason}`;

    if (import.meta.env?.DEV) {
      state.dmpMarkdown +=
        ' \nThis is normal when developing locally on localhost:8080';
    }

    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
  [GET_IMPRINT](state) {
    state.loading = true;
  },
  [GET_IMPRINT_SUCCESS](state, payload) {
    state.imprintMarkdown = payload;
    state.imprintLoading = false;
  },
  [GET_IMPRINT_ERROR](state, reason) {
    state.imprintLoading = false;

    const details = 'An error occurred while loading the imprint infos!';
    const errObj = getSpecificApiError(details, reason);
    state.imprintMarkdown = `${details}: ${reason}`;

    if (import.meta.env?.DEV) {
      state.imprintMarkdown +=
        ' \nThis is normal when developing locally on localhost:8080';
    }

    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
};

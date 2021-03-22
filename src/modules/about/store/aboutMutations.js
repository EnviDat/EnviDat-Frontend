/**
 * guidelines store mutations
 *
 * @summary guidelines store mutations
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-10-23 16:36:41
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  GET_GUIDELINES,
  GET_GUIDELINES_SUCCESS,
  GET_GUIDELINES_ERROR,
} from '@/modules/about/store/guidelinesMutationsConsts';

import {
  GET_POLICIES,
  GET_POLICIES_SUCCESS,
  GET_POLICIES_ERROR,
} from '@/modules/about/store/policiesMutationsConsts';

import {
  GET_DMP,
  GET_DMP_SUCCESS,
  GET_DMP_ERROR,
} from '@/modules/about/store/dmpMutationsConsts';

import { ADD_USER_NOTIFICATION } from '@/store/mainMutationsConsts';
import { getSpecificApiError } from '@/factories/notificationFactory';


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

    const details = 'An error occured while loading the guidelines!';
    const errObj = getSpecificApiError(details, reason);
    state.guidelinesMarkdown = `${details}: ${reason}`;

    if (process.env.NODE_ENV === 'development') {
      state.guidelinesMarkdown += ' \nThis is normal when developing locally on localhost:8080';
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

    const details = 'An error occured while loading the policies!';
    const errObj = getSpecificApiError(details, reason);

    state.policiesMarkdown = `${details}: ${reason}`;

    if (process.env.NODE_ENV === 'development') {
      state.policiesMarkdown += ' \nThis is normal when developing locally on localhost:8080';
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

    const details = 'An error occured while loading the dmp infos!';
    const errObj = getSpecificApiError(details, reason);
    state.dmpMarkdown = `${details}: ${reason}`;

    if (process.env.NODE_ENV === 'development') {
      state.dmpMarkdown += ' \nThis is normal when developing locally on localhost:8080';
    }

    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
};

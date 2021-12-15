/**
 * organizations store mutations
 *
 * @summary organizations store mutations
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51 
 * Last modified  : 2019-10-23 17:37:18
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { ADD_USER_NOTIFICATION } from '@/store/mainMutationsConsts';
import { getSpecificApiError } from '@/factories/notificationFactory';

import {
  GET_ORGANIZATIONS,
  GET_ORGANIZATIONS_SUCCESS,
  GET_ORGANIZATIONS_ERROR,
  // SET_PROJECTDETAIL_PAGE_BACK_URL,
} from './organizationsMutationsConsts';

export default {
  [GET_ORGANIZATIONS](state) {
    state.loading = true;
    state.organizations = [];
  },
  [GET_ORGANIZATIONS_SUCCESS](state, payload) {
    state.loading = false;
    state.organizations = payload;
  },
  [GET_ORGANIZATIONS_ERROR](state, reason) {
    state.loading = false;

    const details = 'An error occured while loading the policies!';
    const errObj = getSpecificApiError(details, reason);

    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
/*
  [SET_PROJECTDETAIL_PAGE_BACK_URL](state, payload) {
    state.projectsPageBackRoute = payload;
  },
  */
};

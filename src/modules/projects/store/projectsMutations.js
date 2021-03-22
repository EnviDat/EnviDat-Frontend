/**
 * projects store mutations
 *
 * @summary projects store mutations
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51 
 * Last modified  : 2019-10-23 17:37:18
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';
import { ADD_USER_NOTIFICATION } from '@/store/mainMutationsConsts';

import {
  enhanceSubprojectsFromExtras,
  enhanceProjectsDatasets,
} from '@/factories/projectsDataFactory';

import { getSpecificApiError } from '@/factories/notificationFactory';

import {
  GET_PROJECTS,
  GET_PROJECTS_SUCCESS,
  GET_PROJECTS_ERROR,
  SET_PROJECTDETAIL_PAGE_BACK_URL,
} from './projectsMutationsConsts';

export default {
  [GET_PROJECTS](state) {
    state.loading = true;
  },
  [GET_PROJECTS_SUCCESS](state, payload) {

    const enhancedProjects = enhanceSubprojectsFromExtras(payload);
    const metadatasContent = this.getters[`${METADATA_NAMESPACE}/metadatasContent`];
    const enhancedWithTags = enhanceProjectsDatasets(enhancedProjects, metadatasContent);

    state.projects = enhancedWithTags;
    state.loading = false;
  },
  [GET_PROJECTS_ERROR](state, reason) {
    state.loading = false;

    const details = 'An error occured while loading the policies!';
    const errObj = getSpecificApiError(details, reason);

    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
  [SET_PROJECTDETAIL_PAGE_BACK_URL](state, payload) {
    state.projectsPageBackRoute = payload;
  },
};

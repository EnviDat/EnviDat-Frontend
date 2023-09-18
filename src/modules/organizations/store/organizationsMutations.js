/* eslint-disable */
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
import { getSpecificApiError } from '@/factories/notificationFactory';
import { ADD_USER_NOTIFICATION } from '@/store/mainMutationsConsts';

import { enhanceMetadataFromCategories } from '@/modules/user/store/mutationFactory';
import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';
import { enhanceTagsOrganizationDatasetFromAllDatasets } from '@/factories/metadataFilterMethods';
import { USER_SIGNIN_NAMESPACE } from '@/modules/user/store/userMutationsConsts';
import { isUserGroupAdmin } from '@/factories/userEditingValidations';
import { enhanceElementsWithStrategyEvents, SELECT_EDITING_DATASET_PROPERTY } from '@/factories/strategyFactory';

import {
  GET_ALL_ORGANIZATIONS,
  GET_ALL_ORGANIZATIONS_ERROR,
  GET_ALL_ORGANIZATIONS_IDS,
  GET_ALL_ORGANIZATIONS_IDS_ERROR,
  GET_ALL_ORGANIZATIONS_IDS_SUCCESS,
  GET_ALL_ORGANIZATIONS_SUCCESS,
  GET_ORGANIZATIONS,
  GET_ORGANIZATIONS_ERROR,
  GET_ORGANIZATIONS_SUCCESS,
  ORGANIZATIONS_NAMESPACE,
  USER_GET_ORGANIZATION_IDS,
  USER_GET_ORGANIZATION_IDS_ERROR,
  USER_GET_ORGANIZATION_IDS_SUCCESS,
  USER_GET_ORGANIZATIONS,
  USER_GET_ORGANIZATIONS_ERROR,
  USER_GET_ORGANIZATIONS_RESET,
  USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE,
  USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE_SUCCESS,
  USER_GET_ORGANIZATIONS_SEARCH_SUCCESS,
  USER_GET_ORGANIZATIONS_SUCCESS,
} from './organizationsMutationsConsts';

function resetErrorObject(state) {
  state.error = null;
}

function enhanceOrganizationsWithDatasets(store, datasets) {

  const state = store.state;
  const userOrganizations = state.organizations.userOrganizations;
  const userOrganizationIds = state.organizations.userOrganizationIds;
  const userId = state[USER_SIGNIN_NAMESPACE]?.user?.id || null;
  const metadataContents = state[METADATA_NAMESPACE]?.metadatasContent || {};

  // create a new array here to "override" the state.userOrganizations via $set() so the
  // reactivity will trigger
  const userOrgas = [];

  datasets = enhanceTagsOrganizationDatasetFromAllDatasets(datasets, metadataContents);
  datasets = enhanceMetadataFromCategories(store, datasets);

  for (let i = 0; i < userOrganizationIds.length; i++) {
    const orgaId = userOrganizationIds[i];
    const orga = userOrganizations.filter((o) => o.id === orgaId)[0];
    let orgaDatasets = datasets.filter((d) => d.owner_org === orgaId);

    if (orgaDatasets.length > 0) {
      if (isUserGroupAdmin(userId, orga)) {
        orgaDatasets = enhanceElementsWithStrategyEvents(orgaDatasets, SELECT_EDITING_DATASET_PROPERTY);
      }

      orga.packages = orgaDatasets;
    }

    userOrgas.push(orga);
  }

  return userOrgas;
}

export default {
  [GET_ORGANIZATIONS](state) {
    state.loading = true;
    state.organizations = [];
  },
  [GET_ORGANIZATIONS_SUCCESS](state) {
    state.loading = false;
    // state.organizations is filled in the GET_ALL_ORGANIZATIONS_SUCCESS mutations
  },
  [GET_ORGANIZATIONS_ERROR](state, reason) {
    state.loading = false;

    const details = 'An error occurred while loading the organizations!';
    const errObj = getSpecificApiError(details, reason);

    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
  [GET_ALL_ORGANIZATIONS_IDS](state) {
    state.organizationIds = [];
  },
  [GET_ALL_ORGANIZATIONS_IDS_SUCCESS](state, payload) {
    state.organizationIds = payload;
  },
  [GET_ALL_ORGANIZATIONS_IDS_ERROR](state, reason) {
    state.error = reason;
  },
  [GET_ALL_ORGANIZATIONS](state) {
    state.organizations = [];
  },
  [GET_ALL_ORGANIZATIONS_SUCCESS](state, payload) {
    state.organizations.push(payload);
  },
  [GET_ALL_ORGANIZATIONS_ERROR](state, reason) {
    state.error = reason;
  },
  /*
  [SET_PROJECTDETAIL_PAGE_BACK_URL](state, payload) {
    state.projectsPageBackRoute = payload;
  },
  */
  [USER_GET_ORGANIZATION_IDS](state) {
    state.userOrganizationLoading = true;
    state.userOrganizationIds = [];

    state.error = null;
  },
  [USER_GET_ORGANIZATION_IDS_SUCCESS](state, payload) {
    state.userOrganizationLoading = false;

    // only use the ids because the organizations from this call
    // don't have the datasets / users included

    const orgaIds = [];

    if (payload?.length > 0 && payload instanceof Array) {
      for (let i = 0; i < payload.length; i++) {
        const orga = payload[i];
        orgaIds.push(orga.id);
      }
    }

    // use this._vm.$set() to make sure computed properties are recalulated
    this._vm.$set(state, 'userOrganizationIds', orgaIds);
    this._vm.$set(state, 'userOrganizations', payload);
  },
  [USER_GET_ORGANIZATION_IDS_ERROR](state, reason) {
    state.userOrganizationLoading = false;

    state.error = reason;
  },
  [USER_GET_ORGANIZATIONS](state) {
    state.userOrganizationLoading = true;
    state.userOrganizationError = null;
  },
  [USER_GET_ORGANIZATIONS_RESET](state) {
    state.userOrganizationLoading = false;
    state.userOrganizations = [];
    state.userOrganizationError = null;
    state.userOrgaDatasetTotal = 0;
    state.userOrgaDatasetOffset = 0;
  },
  [USER_GET_ORGANIZATIONS_SUCCESS](state, payload) {
    state.userOrganizationLoading = false;

    const datasets = payload.packages;
    const userOrgas = enhanceOrganizationsWithDatasets(this, datasets);

    // use this._vm.$set() to make sure computed properties are recalulated
    this._vm.$set(state, 'userOrganizations', userOrgas);
  },
  [USER_GET_ORGANIZATIONS_SEARCH_SUCCESS](state, payload) {
    state.userOrganizationLoading = false;

    const datasets = payload;
    const userOrgas = enhanceOrganizationsWithDatasets(this, datasets);

    // use this._vm.$set() to make sure computed properties are recalulated
    this._vm.$set(state, 'userOrganizations', userOrgas);
  },
  /**
   * result : {
   * count : 137
   * facets : {}
   * results : [datasets]
   * search_facets : {}
   * sort : "score desc, metadata_modified desc"
   * }
   *
   * @param state
   * @param payload
   */
  [USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE] (state, payload) {
    state.userOrgaDatasetTotal = payload.count;

    let datasets = payload.results;
    const datasetReturned = datasets?.length || 0;

    this.commit(`${ORGANIZATIONS_NAMESPACE}/${USER_GET_ORGANIZATIONS_SEARCH_SUCCESS}`, datasets);

    if (datasetReturned !== 0) {
      state.userOrgaDatasetOffset = state.userOrgaDatasetOffset + datasetReturned;
    } else {
      state.userOrgaDatasetOffset = 0;
    }
  },
  [USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE_SUCCESS](state) {
    state.userOrganizationLoading = false;

  },
  [USER_GET_ORGANIZATIONS_ERROR](state, reason) {
    state.userOrganizationLoading = false;

    state.userOrganizationError = reason;
  },
};

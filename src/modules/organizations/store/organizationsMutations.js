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
  GET_ALL_ORGANIZATIONS, GET_ALL_ORGANIZATIONS_ERROR,
  GET_ALL_ORGANIZATIONS_IDS,
  GET_ALL_ORGANIZATIONS_IDS_ERROR,
  GET_ALL_ORGANIZATIONS_IDS_SUCCESS,
  GET_ALL_ORGANIZATIONS_SUCCESS,
  GET_ORGANIZATIONS,
  GET_ORGANIZATIONS_ERROR,
  GET_ORGANIZATIONS_SUCCESS,
  USER_GET_ORGANIZATION_IDS,
  USER_GET_ORGANIZATION_IDS_ERROR,
  USER_GET_ORGANIZATION_IDS_SUCCESS,
  USER_GET_ORGANIZATIONS, USER_GET_ORGANIZATIONS_ERROR,
  USER_GET_ORGANIZATIONS_RESET,
  USER_GET_ORGANIZATIONS_SUCCESS,
  // SET_PROJECTDETAIL_PAGE_BACK_URL,
} from './organizationsMutationsConsts';

function resetErrorObject(state) {
  state.error = null;
}
export default {
  [GET_ORGANIZATIONS](state) {
    state.loading = true;
    state.organizations = [];
  },
  [GET_ORGANIZATIONS_SUCCESS](state, payload) {
    state.loading = false;
    state.organizations = payload;

    console.log('get_organizations');
    console.log(Object.values(state.organizations));
  },
  [GET_ORGANIZATIONS_ERROR](state, reason) {
    state.loading = false;

    const details = 'An error occured while loading the policies!';
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

    // state.organizations = ?
  },
  [GET_ALL_ORGANIZATIONS_ERROR](state, reason) {

    //
  },
  /*
  [SET_PROJECTDETAIL_PAGE_BACK_URL](state, payload) {
    state.projectsPageBackRoute = payload;
  },
  */
  [USER_GET_ORGANIZATION_IDS](state) {
    state.userOrganizationLoading = true;
    state.userOrganizationIds = [];
    state.userOrganizationNames = [];

    state.error = null;
  },
  [USER_GET_ORGANIZATION_IDS_SUCCESS](state, payload) {
    state.userOrganizationLoading = false;

    const orgaIds = [];
    const orgaNames = [];
    const orgaList = [];

    if (payload?.length > 0 && payload instanceof Array) {
      for (let i = 0; i < payload.length; i++) {
        const orga = payload[i];
        orgaIds.push(orga.id);
        orgaNames.push(orga.name);
        orgaList.push(orga);
      }
    }

    // use this._vm.$set() to make sure computed properties are recalulated
    this._vm.$set(state, 'userOrganizationIds', orgaIds);
    this._vm.$set(state, 'userOrganizationNames', orgaNames);
    this._vm.$set(state, 'userOrganizationsList', orgaList);
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
    state.userOrganizations = {};
    state.userOrganizationError = null;
  },
  [USER_GET_ORGANIZATIONS_SUCCESS](state, payload) {
    state.userOrganizationLoading = false;

    // let datasets = payload?.packages || [];
    const orgaId = payload?.id || payload?.name;

    if (payload?.packages.length > 0) {

      const metadataContents = this.state[METADATA_NAMESPACE]?.metadatasContent || {};

      payload.packages = enhanceTagsOrganizationDatasetFromAllDatasets(payload.packages, metadataContents);

      payload.packages = enhanceMetadataFromCategories(this, payload.packages);

      const userId = this.state[USER_SIGNIN_NAMESPACE]?.user?.id || null;

      // TODO - check config for dataset editing enabled

      if (isUserGroupAdmin(userId, payload)) {
        enhanceElementsWithStrategyEvents(payload.packages, SELECT_EDITING_DATASET_PROPERTY);
      }
    }

    // use this._vm.$set() to make sure computed properties are recalulated
    this._vm.$set(state.userOrganizations, orgaId, payload);
  },
  [USER_GET_ORGANIZATIONS_ERROR](state, reason) {
    state.userOrganizationLoading = false;

    state.userOrganizationError = reason;
  },
};

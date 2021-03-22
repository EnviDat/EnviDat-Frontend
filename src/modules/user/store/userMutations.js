/* eslint-disable no-underscore-dangle */
/**
* user store mutations
*
* @summary user store mutations
* @author Dominik Haas-Artho
*
* Created at     : 2020-07-14 16:51:52
 * Last modified  : 2020-10-08 17:26:21
*
* This file is subject to the terms and conditions defined in
* file 'LICENSE.txt', which is part of this source code package.
*/
// import { ADD_USER_NOTIFICATION } from '@/store/mainMutationsConsts';

// import { getSpecificApiError } from '@/factories/notificationFactory';

import { enhanceMetadatas } from '@/factories/metaDataFactory';
import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';

import {
  GET_USER_CONTEXT,
  GET_USER_CONTEXT_SUCCESS,
  GET_USER_CONTEXT_ERROR,
  USER_SIGNIN,
  USER_SIGNIN_SUCCESS,
  USER_SIGNIN_ERROR,
  REQUEST_TOKEN,
  REQUEST_TOKEN_SUCCESS,
  REQUEST_TOKEN_ERROR,
  USER_SIGNOUT,
  USER_SIGNOUT_SUCCESS,
  USER_SIGNOUT_ERROR,
  VALIDATION_ERROR,
  USER_GET_DATASETS,
  USER_GET_DATASETS_SUCCESS,
  USER_GET_DATASETS_ERROR,
  USER_GET_ORGANIZATIONS,
  USER_GET_ORGANIZATIONS_SUCCESS,
  USER_GET_ORGANIZATIONS_ERROR,
  USER_GET_ORGANIZATION_IDS,
  USER_GET_ORGANIZATION_IDS_SUCCESS,
  USER_GET_ORGANIZATION_IDS_ERROR,
  USER_GET_ORGANIZATIONS_DATASETS,
  USER_GET_ORGANIZATIONS_DATASETS_SUCCESS,
  USER_GET_ORGANIZATIONS_DATASETS_ERROR,
} from './userMutationsConsts';


function extractError(store, reason, errorProperty = 'error') {

  let type = '';
  let field = '';
  let msg = 'There was an error on the server, please try again. If it consists please contact envidat@wsl.ch.';

  const error = reason?.response?.data?.error || reason?.response?.error || reason?.error || reason;

  if (error) {
    type = error.__type;
    
    switch (type) {
      case VALIDATION_ERROR: {
        const errKey = Object.keys(error)[1];
        
        field = errKey;
        msg = error[errKey];
        break;
      }
      default: {
        msg = error;
        break;
      }
    }
  }

  store.state.user.errorField = field;
  store.state.user.errorType = type;

  store._vm.$set(store.state.user, errorProperty, msg);
}

function resetErrorObject(state) {
  state.error = null;
  state.errorType = '';
  state.errorField = '';
}

export default {
  [GET_USER_CONTEXT](state) {
    state.userLoading = true;

    resetErrorObject(state);
  },
  [GET_USER_CONTEXT_SUCCESS](state, payload) {
    state.userLoading = false;
    state.user = payload?.user || null;
  },
  [GET_USER_CONTEXT_ERROR](state, reason) {
    state.userLoading = false;

    extractError(this, reason);
  },
  [USER_SIGNIN](state) {
    state.signInLoading = true;

    resetErrorObject(state);
  },
  [USER_SIGNIN_SUCCESS](state, payload) {
    state.signInLoading = false;
    state.signInSuccess = true;
    state.user = payload.user;    
  },
  [USER_SIGNIN_ERROR](state, reason) {
    state.signInLoading = false;
    state.signInSuccess = false;
    
    extractError(this, reason);
  },
  [REQUEST_TOKEN](state) {
    state.requestLoading = true;
    state.requestSuccess = false;
    state.signInLoading = false;
    state.signInSuccess = false;

    resetErrorObject(state);
  },
  [REQUEST_TOKEN_SUCCESS](state, payload) {
    state.requestLoading = false;
    state.requestSuccess = payload && payload.includes('successful');
  },
  [REQUEST_TOKEN_ERROR](state, reason) {
    state.requestLoading = false;
    state.requestSuccess = false;
    
    extractError(this, reason);
  },
  [USER_SIGNOUT](state) {
    state.signInLoading = false;
    state.signInSuccess = false;
    state.requestLoading = false;
    state.requestSuccess = false;
    state.userLoading = true;    
    state.user = null;    

    resetErrorObject(state);
  },
  [USER_SIGNOUT_SUCCESS](state) {
    state.user = null;

    resetErrorObject(state);
  },
  [USER_SIGNOUT_ERROR](state, reason) {
    state.user = null;

    extractError(this, reason);
  },
  [USER_GET_DATASETS](state) {
    state.userLoading = true;
    state.userDatasetsError = null;

    resetErrorObject(state);
  },
  [USER_GET_DATASETS_SUCCESS](state, payload) {
    state.userLoading = false;

    const store = this;
    const { cardBGImages } = store.getters;
    const categoryCards = store.getters[`${METADATA_NAMESPACE}/categoryCards`];

    const enhancedDatasets = enhanceMetadatas(payload.datasets, cardBGImages, categoryCards);

    // use this._vm.$set() to make sure computed properties are recalulated
    this._vm.$set(state.user, 'datasets', enhancedDatasets);

    resetErrorObject(state);
  },
  [USER_GET_DATASETS_ERROR](state, reason) {
    state.userLoading = false;

    extractError(this, reason, 'userDatasetsError');
  },
  [USER_GET_ORGANIZATION_IDS](state) {
    state.userOrganizationLoading = true;
    state.userOrganizationIds = [];
    state.userOrganizationNames = [];

    resetErrorObject(state);
  },
  [USER_GET_ORGANIZATION_IDS_SUCCESS](state, payload) {
    state.userOrganizationLoading = false;

    const orgaIds = [];
    const orgaNames = [];

    if (payload?.length > 0 && payload instanceof Array) {
      for (let i = 0; i < payload.length; i++) {
        const orga = payload[i];
        orgaIds.push(orga.id);
        orgaNames.push(orga.name);
      }
    }

    // use this._vm.$set() to make sure computed properties are recalulated
    this._vm.$set(state, 'userOrganizationIds', orgaIds);
    this._vm.$set(state, 'userOrganizationNames', orgaNames);

    resetErrorObject(state);
  },
  [USER_GET_ORGANIZATION_IDS_ERROR](state, reason) {
    state.userOrganizationLoading = false;

    extractError(this, reason);
  },
  [USER_GET_ORGANIZATIONS](state) {
    state.userOrganizationLoading = true;

    resetErrorObject(state);
  },
  [USER_GET_ORGANIZATIONS_SUCCESS](state, payload) {
    state.userOrganizationLoading = false;

    const orgaId = payload.id;
    if (payload.packages?.length > 0) {

      const store = this;
      const { cardBGImages } = store.getters;
      const categoryCards = store.getters[`${METADATA_NAMESPACE}/categoryCards`];

      payload.packages = enhanceMetadatas(payload.packages, cardBGImages, categoryCards);      
    }

    this._vm.$set(state.userOrganizations, orgaId, payload);

    resetErrorObject(state);
  },
  [USER_GET_ORGANIZATIONS_ERROR](state, reason) {
    state.userOrganizationLoading = false;

    extractError(this, reason);
  },
  [USER_GET_ORGANIZATIONS_DATASETS](state) {
    state.userOrganizationLoading = true;
    state.userRecentOrgaDatasetsError = null;

    resetErrorObject(state);
  },
  [USER_GET_ORGANIZATIONS_DATASETS_SUCCESS](state, payload) {
    state.userOrganizationLoading = false;

    let recentDatasets = [];

    if (payload.results?.length > 0) {

      const store = this;
      const { cardBGImages } = store.getters;
      const categoryCards = store.getters[`${METADATA_NAMESPACE}/categoryCards`];

      recentDatasets = enhanceMetadatas(payload.results, cardBGImages, categoryCards);
    }

    if (state.userRecentOrgaDatasets?.length > 0) {
      const mergedDatasets = [...state.userRecentOrgaDatasets, ...recentDatasets];
      const uniqueArrayOfDatasets = mergedDatasets.filter((item, pos, self) => self.findIndex(v => v.id === item.id) === pos);
      recentDatasets = uniqueArrayOfDatasets;
    }

    this._vm.$set(state, 'userRecentOrgaDatasets', recentDatasets);

    resetErrorObject(state);
  },
  [USER_GET_ORGANIZATIONS_DATASETS_ERROR](state, reason) {
    state.userOrganizationLoading = false;

    extractError(this, reason, 'userRecentOrgaDatasetsError');
  },
};

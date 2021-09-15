/* eslint-disable no-underscore-dangle */
/**
* user store mutations
*
* @summary user store mutations
* @author Dominik Haas-Artho
*
* Created at     : 2020-07-14 16:51:52
 * Last modified  : 2021-08-18 10:14:35
*
* This file is subject to the terms and conditions defined in
* file 'LICENSE.txt', which is part of this source code package.
*/

import { enhanceMetadatas } from '@/factories/metaDataFactory';
import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';

import {
  EDITMETADATA_DATA_AUTHOR,
  EDITMETADATA_DATA_AUTHOR_LIST,
  EDITMETADATA_DATA_RESOURCES,
} from '@/factories/eventBus';

import {
  selectForEditing, setSelected,
  updateAuthors,
  updateResource,
} from '@/factories/userEditingFactory';

import {
  CLEAR_METADATA_EDITING,
  GET_USER_CONTEXT,
  GET_USER_CONTEXT_ERROR,
  GET_USER_CONTEXT_SUCCESS,
  METADATA_CANCEL_AUTHOR_EDITING,
  METADATA_CANCEL_RESOURCE_EDITING,
  METADATA_EDITING_SAVE_AUTHOR,
  METADATA_EDITING_SAVE_AUTHOR_ERROR,
  METADATA_EDITING_SAVE_AUTHOR_SUCCESS,
  METADATA_EDITING_SAVE_RESOURCE,
  METADATA_EDITING_SAVE_RESOURCE_ERROR,
  METADATA_EDITING_SAVE_RESOURCE_SUCCESS,
  METADATA_EDITING_SELECT_AUTHOR,
  METADATA_EDITING_SELECT_RESOURCE, METADATA_EDITING_UPDATE_EXISTING_AUTHORS,
  REQUEST_TOKEN,
  REQUEST_TOKEN_ERROR,
  REQUEST_TOKEN_SUCCESS,
  UPDATE_METADATA_EDITING,
  USER_GET_DATASETS,
  USER_GET_DATASETS_ERROR,
  USER_GET_DATASETS_SUCCESS,
  USER_GET_ORGANIZATION_IDS,
  USER_GET_ORGANIZATION_IDS_ERROR,
  USER_GET_ORGANIZATION_IDS_SUCCESS,
  USER_GET_ORGANIZATIONS,
  USER_GET_ORGANIZATIONS_DATASETS,
  USER_GET_ORGANIZATIONS_DATASETS_ERROR,
  USER_GET_ORGANIZATIONS_DATASETS_SUCCESS,
  USER_GET_ORGANIZATIONS_ERROR,
  USER_GET_ORGANIZATIONS_SUCCESS,
  USER_NAMESPACE,
  USER_SIGNIN,
  USER_SIGNIN_ERROR,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT,
  USER_SIGNOUT_ERROR,
  USER_SIGNOUT_SUCCESS,
  VALIDATION_ERROR,
} from './userMutationsConsts';


function extractError(store, reason, errorProperty = 'error') {

  let type = '';
  let field = '';
  let msg = 'There was an error on the server, please try again. If it consists please contact envidat@wsl.ch.';

  if (reason?.response?.status !== 200) {
    msg = `${reason.response.status} ${reason.response.statusText} url: ${reason.response.config?.url}`;
    store._vm.$set(store.state.user, errorProperty, msg);
    return;
  }

  const error = reason?.response?.error || reason?.error || reason;

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

    // use this._vm.$set() to make sure computed properties are recalculated
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
  [UPDATE_METADATA_EDITING](state, payload) {
    if (payload.object === EDITMETADATA_DATA_RESOURCES) {
      updateResource(this, state, payload);
    } else if (payload.object === EDITMETADATA_DATA_AUTHOR) {
      updateAuthors(this, state, payload);
    } else if (payload.object === EDITMETADATA_DATA_AUTHOR_LIST) {
      state.metadataInEditing[payload.object] = payload.data;
    } else {
      state.metadataInEditing[payload.object] = payload.data;
    }
  },
  [METADATA_EDITING_SAVE_RESOURCE](state, resource) {

    resource.loading = true;
    const updateObj = {
      object: EDITMETADATA_DATA_RESOURCES,
      data: resource,
    };

    updateResource(this, state, updateObj);

    resetErrorObject(state);
  },
  [METADATA_EDITING_SAVE_RESOURCE_SUCCESS](state, resource) {

    resource.loading = false;
    resource.existsOnlyLocal = false;
    const updateObj = {
      object: EDITMETADATA_DATA_RESOURCES,
      data: resource,
    };

    updateResource(this, state, updateObj);

    resetErrorObject(state);
  },
  [METADATA_EDITING_SAVE_RESOURCE_ERROR](state, reason) {

    extractError(this, reason);
  },
  [METADATA_EDITING_SELECT_RESOURCE](state, id) {
    const resources = this.getters[`${USER_NAMESPACE}/resources`];
    selectForEditing(this, resources, id, state.selectedResourceId, 'id');
    state.selectedResourceId = id;
  },
  [METADATA_EDITING_SELECT_AUTHOR](state, id) {
    const authors = this.getters[`${USER_NAMESPACE}/authors`];
    selectForEditing(this, authors, id, state.selectedAuthorId, 'email');
    state.selectedAuthorId = id;
  },
  [METADATA_CANCEL_RESOURCE_EDITING](state) {
    const resources = this.getters[`${USER_NAMESPACE}/resources`];
    setSelected(this, resources, state.selectedResourceId, 'id', false);
    state.selectedResourceId = '';
  },
  [METADATA_CANCEL_AUTHOR_EDITING](state) {
    const authors = this.getters[`${USER_NAMESPACE}/authors`];
    setSelected(this, authors, state.selectedAuthorId, 'email', false);
    state.selectedAuthorId = '';
  },
  [METADATA_EDITING_SAVE_AUTHOR](state, author) {

    author.loading = true;

    const updateObj = {
      object: EDITMETADATA_DATA_AUTHOR,
      data: author,
    };

    updateAuthors(this, state, updateObj);

    resetErrorObject(state);
  },
  [METADATA_EDITING_SAVE_AUTHOR_SUCCESS](state, author) {

    author.loading = false;
    author.existsOnlyLocal = false;

    const updateObj = {
      object: EDITMETADATA_DATA_AUTHOR,
      data: author,
    };

    updateAuthors(this, state, updateObj);


    resetErrorObject(state);
  },
  [METADATA_EDITING_SAVE_AUTHOR_ERROR](state, reason) {

    extractError(this, reason);
  },
  [METADATA_EDITING_UPDATE_EXISTING_AUTHORS](state, existingAuthors) {
    state.metadataInEditing[EDITMETADATA_DATA_AUTHOR_LIST].existingAuthors = existingAuthors;
  },
  [CLEAR_METADATA_EDITING](state) {
    state.metadataInEditing = {};
  },
};

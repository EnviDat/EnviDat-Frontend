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
  EDITMETADATA_AUTHOR,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_DATA_RESOURCES,
} from '@/factories/eventBus';

import {
  selectForEditing,
  setSelected,
  updateAuthors,
  updateResource,
} from '@/factories/userEditingFactory';

import {
  CLEAR_METADATA_EDITING,
  METADATA_CANCEL_AUTHOR_EDITING,
  METADATA_CANCEL_RESOURCE_EDITING,
  METADATA_EDITING_PATCH_DATASET_OBJECT,
  METADATA_EDITING_PATCH_DATASET_OBJECT_ERROR,
  METADATA_EDITING_PATCH_DATASET_OBJECT_SUCCESS,
  METADATA_EDITING_PATCH_DATASET_PROPERTY,
  METADATA_EDITING_PATCH_DATASET_PROPERTY_ERROR,
  METADATA_EDITING_PATCH_DATASET_PROPERTY_SUCCESS,
  METADATA_EDITING_SAVE_AUTHOR,
  METADATA_EDITING_SAVE_AUTHOR_ERROR,
  METADATA_EDITING_SAVE_AUTHOR_SUCCESS,
  METADATA_EDITING_SAVE_RESOURCE,
  METADATA_EDITING_SAVE_RESOURCE_ERROR,
  METADATA_EDITING_SAVE_RESOURCE_SUCCESS,
  METADATA_EDITING_SELECT_AUTHOR,
  METADATA_EDITING_SELECT_RESOURCE,
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
  VALIDATION_ERROR,
} from './userMutationsConsts';


function extractError(store, reason, errorProperty = 'error') {

  let type = '';
  let field = '';
  let msg = 'There was an error on the server, please try again. If it consists please contact envidat@wsl.ch.';

  if (reason?.response && reason.response.status !== 200) {
    msg = `${reason.response.status} ${reason.response.statusText}
          url: ${reason.response.config?.url} Message: ${reason.response.data?.error?.message} type: ${reason.response.data?.error?.__type}`;
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

function createErrorMessage(reason) {
  let msg = 'There was an error on the server, please try again. If it consists please contact envidat@wsl.ch.';
  let details = '';

  if (reason?.response) {
    msg = 'Saving failed ';
    if (reason.response.status === 403) {
      msg += ' you are not authorized';
    }
    const errorObj = reason.response?.data?.error || reason.response?.error || null;

    if (errorObj) {

      if (errorObj.__junk && errorObj.__type) {
        details += `${errorObj.__type} ${errorObj.__junk}`;
      } else {
        const errKeys = Object.keys(errorObj);
        for (let i = 0; i < errKeys.length; i++) {
          const key = errKeys[i];
          details += `${key} ${errorObj[key]} `;
        }
      }

    } else {
      details += reason.response.statusText;
    }
  } else if (reason?.message) {
    details = reason.message;
  }

  return {
    message: msg,
    details,
  };
}

function resetErrorObject(state) {
  state.error = null;
  state.errorType = '';
  state.errorField = '';
}

export default {
  [USER_GET_DATASETS](state) {
    state.userDatasetsLoading = true;
    state.userDatasetsError = null;

    resetErrorObject(state);
  },
  [USER_GET_DATASETS_SUCCESS](state, payload) {
    state.userDatasetsLoading = false;

    const store = this;
    const { cardBGImages } = store.getters;
    const categoryCards = store.getters[`${METADATA_NAMESPACE}/categoryCards`];

    const enhancedDatasets = enhanceMetadatas(payload.datasets, cardBGImages, categoryCards);

    // use this._vm.$set() to make sure computed properties are recalculated
    this._vm.$set(state.user, 'datasets', enhancedDatasets);

    resetErrorObject(state);
  },
  [USER_GET_DATASETS_ERROR](state, reason) {
    state.userDatasetsLoading = false;

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
      const categoryCards = store.getters.categoryCards;

      recentDatasets = enhanceMetadatas(payload.results, cardBGImages, categoryCards);
    }

    if (state.userRecentOrgaDatasets?.length > 0) {
      const mergedDatasets = [...state.userRecentOrgaDatasets, ...recentDatasets];
      recentDatasets = mergedDatasets.filter((item, pos, self) => self.findIndex(v => v.id === item.id) === pos);
    }

    this._vm.$set(state, 'userRecentOrgaDatasets', recentDatasets);

    resetErrorObject(state);
  },
  [USER_GET_ORGANIZATIONS_DATASETS_ERROR](state, reason) {
    state.userOrganizationLoading = false;

    extractError(this, reason, 'userRecentOrgaDatasetsError');
  },
  [UPDATE_METADATA_EDITING](state, payload) {
/*
    if (payload.object === EDITMETADATA_DATA_RESOURCES) {
      updateResource(this, state, payload);
    } else
*/

    if (payload.object === EDITMETADATA_AUTHOR) {
      updateAuthors(this, state, payload);
    } else if (payload.object === EDITMETADATA_CUSTOMFIELDS) {

      // $set() is used here to make sure any changes of the values with in the array are
      // updated
      this._vm.$set(state.metadataInEditing, EDITMETADATA_CUSTOMFIELDS, payload.data);


    } else {
      const current = state.metadataInEditing[payload.object];

      state.metadataInEditing[payload.object] = {
        ...current,
        ...payload.data,
      };
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
      object: EDITMETADATA_AUTHOR,
      data: author,
    };

    updateAuthors(this, state, updateObj);

    resetErrorObject(state);
  },
  [METADATA_EDITING_SAVE_AUTHOR_SUCCESS](state, author) {

    author.loading = false;
    author.existsOnlyLocal = false;

    const updateObj = {
      object: EDITMETADATA_AUTHOR,
      data: author,
    };

    updateAuthors(this, state, updateObj);


    resetErrorObject(state);
  },
  [METADATA_EDITING_SAVE_AUTHOR_ERROR](state, reason) {
    extractError(this, reason);
  },
  [CLEAR_METADATA_EDITING](state) {
    state.metadataInEditing = {};
  },
  [METADATA_EDITING_PATCH_DATASET_PROPERTY](state, stepKey) {
    const editingObject = state.metadataInEditing[stepKey];
    editingObject.loading = true;
  },
  [METADATA_EDITING_PATCH_DATASET_PROPERTY_SUCCESS](state, { stepKey, message }) {
    const editingObject = state.metadataInEditing[stepKey];
    editingObject.loading = false;
    editingObject.message = message;

    setTimeout(() => {
      this.commit(`${USER_NAMESPACE}/resetMessage`, stepKey);
    }, state.metadataSavingMessageTimeoutTime);
  },
  [METADATA_EDITING_PATCH_DATASET_PROPERTY_ERROR](state, { stepKey, reason }) {
    const editingObject = state.metadataInEditing[stepKey];
    editingObject.loading = false;
    const errorObj = createErrorMessage(reason);
    editingObject.error = errorObj.message;
    editingObject.errorDetails = errorObj.details;

    setTimeout(() => {
      this.commit(`${USER_NAMESPACE}/resetError`, stepKey);
    }, state.metadataSavingErrorTimeoutTime);
  },
  [METADATA_EDITING_PATCH_DATASET_OBJECT](state, stepKey) {
    const editingObject = state.metadataInEditing[stepKey];
    editingObject.loading = true;
    editingObject.message = null;
    editingObject.messageDetails = null;
    editingObject.error = null;
    editingObject.errorDetails = null;
  },
  [METADATA_EDITING_PATCH_DATASET_OBJECT_SUCCESS](state, { stepKey, message }) {

    const editingObject = state.metadataInEditing[stepKey];
    editingObject.loading = false;
    editingObject.message = message;

    setTimeout(() => {
      this.commit(`${USER_NAMESPACE}/resetMessage`, stepKey);
    }, state.metadataSavingMessageTimeoutTime);
  },
  [METADATA_EDITING_PATCH_DATASET_OBJECT_ERROR](state, { stepKey, reason }) {
    const editingObject = state.metadataInEditing[stepKey];
    editingObject.loading = false;
    const errorObj = createErrorMessage(reason);
    editingObject.error = errorObj.message;
    editingObject.errorDetails = errorObj.details;

/*
    setTimeout(() => {
      this.commit(`${USER_NAMESPACE}/resetError`, stepKey);
    }, state.metadataSavingErrorTimeoutTime);
*/
  },
  resetMessage(state, stepKey) {
    const editingObject = state.metadataInEditing[stepKey];
    editingObject.message = null;
  },
  resetError(state, stepKey) {
    const editingObject = state.metadataInEditing[stepKey];
    editingObject.error = null;
  },
};

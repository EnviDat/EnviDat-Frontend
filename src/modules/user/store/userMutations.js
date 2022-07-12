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

import {
  enhanceMetadatas,
  enhanceTags,
} from '@/factories/metaDataFactory';

import {
  selectForEditing,
  setSelected,
  updateAuthors,
  updateResource,
} from '@/factories/userEditingFactory';

import { getCollaboratorCapacity, isUserGroupAdmin } from '@/factories/userEditingValidations';

import { enhanceElementsWithStrategyEvents } from '@/factories/strategyFactory';

import { populateEditingComponents } from '@/factories/mappingFactory';

import {
  EDITMETADATA_AUTHOR,
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_NETWORK_ERROR,
  eventBus,
  SELECT_EDITING_DATASET_PROPERTY,
} from '@/factories/eventBus';

import { enhanceTagsOrganizationDatasetFromAllDatasets } from '@/factories/metadataFilterMethods';
import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';

import { SET_CONFIG } from '@/store/mainMutationsConsts';
import {
  CLEAR_METADATA_EDITING,
  METADATA_CANCEL_AUTHOR_EDITING,
  METADATA_CANCEL_RESOURCE_EDITING,
  METADATA_EDITING_LAST_DATASET,
  METADATA_EDITING_LOAD_DATASET,
  METADATA_EDITING_LOAD_DATASET_ERROR,
  METADATA_EDITING_LOAD_DATASET_SUCCESS,
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
  USER_GET_COLLABORATOR_DATASET_IDS,
  USER_GET_COLLABORATOR_DATASET_IDS_ERROR,
  USER_GET_COLLABORATOR_DATASET_IDS_SUCCESS,
  USER_GET_COLLABORATOR_DATASETS,
  USER_GET_COLLABORATOR_DATASETS_ERROR,
  USER_GET_COLLABORATOR_DATASETS_SUCCESS,
  USER_GET_DATASETS,
  USER_GET_DATASETS_ERROR,
  USER_GET_DATASETS_SUCCESS,
  USER_GET_ORGANIZATION_IDS,
  USER_GET_ORGANIZATION_IDS_ERROR,
  USER_GET_ORGANIZATION_IDS_SUCCESS,
  USER_GET_ORGANIZATIONS,
  USER_GET_ORGANIZATIONS_ERROR,
  USER_GET_ORGANIZATIONS_SUCCESS,
  USER_NAMESPACE, USER_SIGNIN_NAMESPACE,
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

/*
    if (reason.response.status !== 200) {
      eventBus.$emit(EDITMETADATA_NETWORK_ERROR,
          reason.response.status || -1,
          reason.response.statusText || '',
          reason.response.data?.error?.message || '');
    }
*/

    msg = 'Saving failed ';
    if (reason.response.status === 403) {
      msg += ' you are not authorized';
    }

    if (reason.response.status === 409) {
      msg += ' Validation Error';
    }

    const errorObj = reason.response.data?.error || reason.response.error || null;

    if (errorObj) {

      if (errorObj.__type) {
        details += `${errorObj.__type}: `;
      }

      if (errorObj.message) {
        details += errorObj.message;
      } else if (errorObj.__junk) {
        details += errorObj.__junk;
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

function enhanceMetadataFromCategories(store, metadatas) {
  let datasets = metadatas;
  const isArrayInput = Array.isArray(datasets);
  if (!isArrayInput) {
    datasets = [datasets];
  }

  const { cardBGImages, categoryCards } = store.getters;

  datasets.forEach(dataset => enhanceTags(dataset, categoryCards));

  const enhanced = enhanceMetadatas(datasets, cardBGImages, categoryCards);
  return isArrayInput ? enhanced : enhanced[0];
}

export default {
  [USER_GET_DATASETS](state) {
    state.userDatasetsLoading = true;
    state.userDatasetsError = null;

    resetErrorObject(state);
  },
  [USER_GET_DATASETS_SUCCESS](state, payload) {
    state.userDatasetsLoading = false;

    const datasets = enhanceMetadataFromCategories(this, payload.datasets);

    enhanceElementsWithStrategyEvents(datasets, SELECT_EDITING_DATASET_PROPERTY);

    // use the $set to make sure updates are triggered
    this._vm.$set(state, 'userDatasets', datasets);

    resetErrorObject(state);
  },
  [USER_GET_DATASETS_ERROR](state, reason) {
    state.userDatasetsLoading = false;

    extractError(this, reason, 'userDatasetsError');
  },
  [USER_GET_COLLABORATOR_DATASET_IDS](state) {
    state.collaboratorDatasetIdsLoading = true;
    // state.userDatasetsError = null;

    resetErrorObject(state);
  },
  [USER_GET_COLLABORATOR_DATASET_IDS_SUCCESS](state, payload) {
    state.collaboratorDatasetIdsLoading = false;

    const listOfPackageIds = payload;
    const datasetIds = [];

    for (let i = 0; i < listOfPackageIds.length; i++) {
      const entry = listOfPackageIds[i];
      datasetIds.push({
        id: entry.package_id,
        role: entry.capacity,
      });
    }

    state.collaboratorDatasetIds = datasetIds;
  },
  [USER_GET_COLLABORATOR_DATASET_IDS_ERROR](state, reason) {
    state.collaboratorDatasetIdsLoading = false;

    extractError(this, reason);
  },
  [USER_GET_COLLABORATOR_DATASETS](state) {
    state.collaboratorDatasetsLoading = false;
    state.collaboratorDatasets = [];

    resetErrorObject(state);
  },
  [USER_GET_COLLABORATOR_DATASETS_SUCCESS](state, { datasets, collaboratorIds } ) {
    state.collaboratorDatasetsLoading = false;

    for (let i = 0; i < datasets.length; i++) {
      const dSet = datasets[i];
      dSet.role = getCollaboratorCapacity(dSet.id, collaboratorIds);
    }

    datasets = enhanceMetadataFromCategories(this, datasets);

    enhanceElementsWithStrategyEvents(datasets, SELECT_EDITING_DATASET_PROPERTY);

    const collaboratorDatasets = [
      ...state.collaboratorDatasets,
      ...datasets,
    ];

    // use the $set to make sure updates are triggered
    this._vm.$set(state, 'collaboratorDatasets', collaboratorDatasets);
  },
  [USER_GET_COLLABORATOR_DATASETS_ERROR](state, reason) {
    state.collaboratorDatasetsLoading = false;

    extractError(this, reason);
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

    // let datasets = payload?.packages || [];
    const orgaId = payload?.id || payload?.name;

    if (payload?.packages.length > 0) {

      const metadataContents = this.state[METADATA_NAMESPACE]?.metadatasContent || {};

      payload.packages = enhanceTagsOrganizationDatasetFromAllDatasets(payload.packages, metadataContents);

      payload.packages = enhanceMetadataFromCategories(this, payload.packages);

      const userId = this.state[USER_SIGNIN_NAMESPACE]?.user?.id || null;

      if (isUserGroupAdmin(userId, payload)) {
        enhanceElementsWithStrategyEvents(payload.packages, SELECT_EDITING_DATASET_PROPERTY);
      }
    }

    // use this._vm.$set() to make sure computed properties are recalulated
    this._vm.$set(state.userOrganizations, orgaId, payload);

    resetErrorObject(state);
  },
  [USER_GET_ORGANIZATIONS_ERROR](state, reason) {
    state.userOrganizationLoading = false;

    extractError(this, reason, 'userOrgaDatasetsError');
  },
  [UPDATE_METADATA_EDITING](state, payload) {
/*
    if (payload.object === EDITMETADATA_DATA_RESOURCES) {
      updateResource(this, state, payload);
    } else
*/

    if (payload.object === EDITMETADATA_AUTHOR) {
      updateAuthors(this, state, payload);
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

    this.dispatch(SET_CONFIG);

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

    eventBus.$emit(EDITMETADATA_CLEAR_PREVIEW);

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

    eventBus.$emit(EDITMETADATA_CLEAR_PREVIEW);

    this.dispatch(SET_CONFIG);

    setTimeout(() => {
      this.commit(`${USER_NAMESPACE}/resetError`, stepKey);
    }, state.metadataSavingErrorTimeoutTime);
  },
  resetMessage(state, stepKey) {
    const editingObject = state.metadataInEditing[stepKey];
    editingObject.message = null;
  },
  resetError(state, stepKey) {
    const editingObject = state.metadataInEditing[stepKey];
    editingObject.error = null;
  },
  [METADATA_EDITING_LAST_DATASET](state, payload) {
    state.lastEditedDataset = payload.name;
    state.lastEditedDatasetPath = payload.path;
    state.lastEditedBackPath = payload.backPath;
  },
  [METADATA_EDITING_LOAD_DATASET](state) {
    state.loadingCurrentEditingContent = true;
    state.currentEditingContent = null;
    state.currentEditingContentError = null;
  },
  [METADATA_EDITING_LOAD_DATASET_SUCCESS](state, payload) {
    state.loadingCurrentEditingContent = false;

    // recentDatasets = enhanceMetadataFromCategories(this, payload.results);

    const currentEntry = enhanceMetadataFromCategories(this, payload);
    state.currentEditingContent = currentEntry;
//    state.currentEditingContent = Object.values(enhancedPayload)[0];

    if (currentEntry) {
//      const authorsMap = this.getters[`${METADATA_NAMESPACE}/authorsMap`];

      const { categoryCards } = this.getters;

      populateEditingComponents(this.commit, currentEntry, categoryCards);
    }
  },
  [METADATA_EDITING_LOAD_DATASET_ERROR](state, reason) {
    state.loadingCurrentEditingContent = false;
    const errorObj = createErrorMessage(reason);
    state.currentEditingContentError = errorObj.message;
  },
};

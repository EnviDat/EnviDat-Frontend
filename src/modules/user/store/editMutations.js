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

import { populateEditingComponents } from '@/factories/mappingFactory';

import {
  EDITMETADATA_AUTHOR,
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_DATA_RESOURCES,
  eventBus,
} from '@/factories/eventBus';

import { SET_CONFIG } from '@/store/mainMutationsConsts';

import {
  createErrorMessage, enhanceMetadataFromCategories,
  extractError,
} from '@/modules/user/store/mutationFactory';

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
  USER_NAMESPACE,
} from './userMutationsConsts';


function resetErrorObject(state) {
  state.error = null;
  state.errorType = '';
  state.errorField = '';
}


export default {
  [UPDATE_METADATA_EDITING](state, payload) {

    if (payload.object === EDITMETADATA_DATA_RESOURCES) {
      updateResource(this, state, payload);
    } else if (payload.object === EDITMETADATA_AUTHOR) {
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

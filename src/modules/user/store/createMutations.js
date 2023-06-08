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
  EDITMETADATA_CLEAR_PREVIEW,
  eventBus,
} from '@/factories/eventBus';

import { createErrorMessage, updateResources } from '@/modules/user/store/mutationFactory';

import {
  enhanceElementsWithStrategyEvents,
  SELECT_EDITING_RESOURCE_PROPERTY,
} from '@/factories/strategyFactory';

import {
  cleanResourceForFrontend,
  getFrontendJSONForStep,
} from '@/factories/mappingFactory';

import {
  METADATA_CREATION_RESOURCE,
  METADATA_CREATION_RESOURCE_SUCCESS,
  METADATA_CREATION_RESOURCE_ERROR,
  USER_NAMESPACE,
  METADATA_UPLOAD_FILE,
  METADATA_UPLOAD_FILE_INIT,
  METADATA_UPLOAD_FILE_SUCCESS,
  METADATA_CREATION_DATASET,
  METADATA_CREATION_DATASET_SUCCESS,
  METADATA_CREATION_DATASET_ERROR,
} from './userMutationsConsts';


export default {
  [METADATA_CREATION_RESOURCE](state) {
    // resource.loading = true;
    state.uploadLoading = true;
    state.uploadResource = null;
    state.uploadError = null;

  },
  [METADATA_CREATION_RESOURCE_SUCCESS](state, { resource, stepKey, message }) {

    // convert properties and stringified json to match the frontend structure
    resource = getFrontendJSONForStep(stepKey, resource);
    resource = cleanResourceForFrontend(resource);

    // make resource selectable
    enhanceElementsWithStrategyEvents(
      [resource],
      SELECT_EDITING_RESOURCE_PROPERTY,
      true,
    );

    resource.loading = false;
    resource.message = message;

    state.uploadResource = resource;
    state.metadataInEditing[stepKey] = resource;

    updateResources(this, state, resource)

    eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);

    setTimeout(() => {
      this.commit(`${USER_NAMESPACE}/resetMessage`, stepKey);
    }, state.metadataSavingMessageTimeoutTime);

  },
  [METADATA_CREATION_RESOURCE_ERROR](state, reason) {
    state.uploadLoading = false;

    const errorObj = createErrorMessage(reason);
    state.uploadError = {
      message: errorObj.message,
      details: errorObj.errorDetails,
    };

  },
  [METADATA_UPLOAD_FILE_INIT](state, metadataId) {
    state.uploadMetadataId = metadataId;
  },
  [METADATA_UPLOAD_FILE](state, { fileId, key}) {
    state.uploadFileId = fileId;
    state.uploadKey = key;
  },
  [METADATA_UPLOAD_FILE_SUCCESS](state) {
    state.uploadLoading = false;
    state.uploadFileId = null;
    state.uploadKey = null;
  },
/*
  [METADATA_UPLOAD_FILE_ERROR](state, { fileId, key}) {
    state.uploadFileId = fileId;
    state.uploadKey = key;
  },
*/
  [METADATA_CREATION_DATASET](state) {
    state.metadataCreationLoading = true;
    state.newMetadatasetName = null;
    state.metadataCreationError = null;

  },
  [METADATA_CREATION_DATASET_SUCCESS](state, { dataset, message }) {
    state.metadataCreationLoading = false;

    // convert properties and stringified json to match the frontend structure
    // const fDataset = getFrontendJSONNewDataset(dataset);

    state.newMetadatasetName = dataset.name;

    eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);

/*
    setTimeout(() => {
      this.commit(`${USER_NAMESPACE}/resetMessage`, stepKey);
    }, state.metadataSavingMessageTimeoutTime);
*/

  },
  [METADATA_CREATION_DATASET_ERROR](state, reason) {
    state.metadataCreationLoading = false;

    const errorObj = createErrorMessage(reason);
    state.metadataCreationError = {
      message: errorObj.message,
      details: errorObj.errorDetails,
    };

  },
};

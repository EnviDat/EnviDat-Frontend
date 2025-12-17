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

import { EDITMETADATA_CLEAR_PREVIEW, EDITMETADATA_DATA_RESOURCES, eventBus } from '@/factories/eventBus';

import { createErrorMessage, updateResources } from '@/modules/user/store/mutationFactory';

import { enhanceElementsWithStrategyEvents, SELECT_EDITING_RESOURCE_PROPERTY } from '@/factories/strategyFactory';

import { cleanResourceForFrontend, getFrontendJSONForStep } from '@/factories/mappingFactory';

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
  METADATA_UPLOAD_FILE_ERROR,
} from './userMutationsConsts';

export default {
  [METADATA_CREATION_RESOURCE](state) {
    state.uploadNewResourceLoading = true;
    state.uploadResource = null;
    state.uploadError = null;
  },
  [METADATA_CREATION_RESOURCE_SUCCESS](state, { resource, stepKey, message }) {
    state.uploadNewResourceLoading = false;

    // convert properties and stringified json to match the frontend structure
    resource = getFrontendJSONForStep(stepKey, resource);
    resource = cleanResourceForFrontend(resource);

    // make resource selectable
    enhanceElementsWithStrategyEvents([resource], SELECT_EDITING_RESOURCE_PROPERTY);

    resource.loading = false;

    state.uploadResource = resource;
    state.metadataInEditing[stepKey] = resource;

    updateResources(this, state, resource);

    eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);

    state.metadataInEditing[EDITMETADATA_DATA_RESOURCES].message = message;

    setTimeout(() => {
      this.commit(`${USER_NAMESPACE}/resetMessage`, EDITMETADATA_DATA_RESOURCES);
    }, state.metadataSavingMessageTimeoutTime);
  },
  [METADATA_CREATION_RESOURCE_ERROR](state, reason) {
    state.uploadNewResourceLoading = false;

    const errorObj = createErrorMessage(reason, 'Resource Creation failed');
    state.uploadError = {
      message: errorObj.message,
      details: errorObj.details,
    };
  },
  [METADATA_UPLOAD_FILE_INIT](state, metadataId) {
    state.uploadMetadataId = metadataId;
  },
  [METADATA_UPLOAD_FILE](state, key) {
    state.uploadLoading = true;
    state.uploadKey = key;
  },
  [METADATA_UPLOAD_FILE_SUCCESS](state) {
    state.uploadLoading = false;
    state.uploadKey = null;
  },
  [METADATA_UPLOAD_FILE_ERROR](state, reason) {
    state.uploadLoading = false;
    state.uploadError = reason;
  },
  [METADATA_CREATION_DATASET](state) {
    state.metadataCreationLoading = true;
    state.newMetadatasetName = null;
    state.metadataCreationError = null;
  },
  [METADATA_CREATION_DATASET_SUCCESS](state, { dataset }) {
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

    const errorObj = createErrorMessage(reason, 'Dataset Creation failed');
    state.metadataCreationError = {
      message: errorObj.message,
      details: errorObj.details,
    };
  },
};

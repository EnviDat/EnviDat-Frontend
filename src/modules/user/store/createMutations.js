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
  SELECT_EDITING_RESOURCE_PROPERTY,
} from '@/factories/eventBus';

import {
  extractError,
} from '@/modules/user/store/mutationFactory';

import { enhanceElementsWithStrategyEvents } from '@/factories/strategyFactory';
import { updateResource } from '@/factories/userEditingFactory';
import {
  METADATA_CREATION_RESOURCE,
  METADATA_CREATION_RESOURCE_SUCCESS,
  METADATA_CREATION_RESOURCE_ERROR,
  USER_NAMESPACE,
  METADATA_UPLOAD_FILE,
  METADATA_UPLOAD_FILE_INIT,
  METADATA_UPLOAD_FILE_SUCCESS,
} from './userMutationsConsts';


export default {
  [METADATA_CREATION_RESOURCE](state, metadataId) {
    // resource.loading = true;
    state.uploadLoading = true;
    state.uploadResource = null;

  },
  [METADATA_CREATION_RESOURCE_SUCCESS](state, { resource, stepKey, message, autoSelect }) {

    // make resource selectable
    enhanceElementsWithStrategyEvents(
      [resource],
      SELECT_EDITING_RESOURCE_PROPERTY,
      true,
    );

    resource.isSelected = autoSelect;
    resource.loading = false;
    resource.message = message;

    state.uploadResource = resource;
    state.metadataInEditing[stepKey] = resource;

    updateResource(this, state, resource)

    eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);

    setTimeout(() => {
      this.commit(`${USER_NAMESPACE}/resetMessage`, stepKey);
    }, state.metadataSavingMessageTimeoutTime);

  },
  [METADATA_CREATION_RESOURCE_ERROR](state, reason) {
    state.uploadLoading = false;

    extractError(this, reason);
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
    state.uploadMetadataId = null;
  },
/*
  [METADATA_UPLOAD_FILE_ERROR](state, { fileId, key}) {
    state.uploadFileId = fileId;
    state.uploadKey = key;
  },
*/
};

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


import {
  extractError,
} from '@/modules/user/store/mutationFactory';

import {
  METADATA_CREATION_RESOURCE,
  METADATA_CREATION_RESOURCE_SUCCESS,
  METADATA_CREATION_RESOURCE_ERROR,
  USER_NAMESPACE,
} from './userMutationsConsts';


function resetErrorObject(state) {
  state.error = null;
  state.errorType = '';
  state.errorField = '';
}


export default {
  [METADATA_CREATION_RESOURCE](state, resource) {
    resource.loading = true;
  },
  [METADATA_CREATION_RESOURCE_SUCCESS](state, { resource, stepKey, message }) {

    resource.loading = false;
    resource.message = message;
/*
    const payload = {
      object: EDITMETADATA_DATA_RESOURCES,
      data: resource,
    };

    this[EDITMETADATA_DATA_RESOURCES](state, payload);
*/

/*
    const editingObject = state.metadataInEditing[stepKey];
    editingObject.loading = false;
    editingObject.message = message;
*/

    eventBus.$emit(EDITMETADATA_CLEAR_PREVIEW);

    setTimeout(() => {
      this.commit(`${USER_NAMESPACE}/resetMessage`, stepKey);
    }, state.metadataSavingMessageTimeoutTime);

  },
  [METADATA_CREATION_RESOURCE_SUCCESS](state, reason) {

    extractError(this, reason);
  },
};

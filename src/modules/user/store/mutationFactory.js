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

import { enhanceMetadatasTitleImage } from '@/factories/metaDataFactory';

import {
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_NETWORK_ERROR,
  eventBus,
} from '@/factories/eventBus';

import { updateEditingArray } from '@/factories/userEditingFactory';

import { enhanceKeywords } from '@/factories/keywordsFactory';
import { USER_NAMESPACE, VALIDATION_ERROR } from './userMutationsConsts';


export function extractUserError(store, reason, errorProperty = 'error') {

  let type = '';
  let field = '';
  let msg = 'There was an error. Please try again. If it persists, please contact envidat@wsl.ch for assistance.';

  if (reason?.response && reason.response.status !== 200) {
    msg = `${reason.response.status} ${reason.response.statusText}
          url: ${reason.response.config?.url} Message: ${reason.response.data?.error?.message} type: ${reason.response.data?.error?.__type}`;
    store.state.user[errorProperty] = msg;
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

  store.state.user[errorProperty] = msg;
}

const defaultMessage = 'There was an error. Please try again. If it persists, please contact envidat@wsl.ch for assistance.';
export function createErrorMessage(reason, message = defaultMessage) {
  let msg = message;
  let details = '';
  let status = 500;

  if (reason?.response) {

    status = reason.response.status;

    if (status === 403) {
      msg += ' you are not authorized';
    }

    if (status === 409) {
      msg += ' Validation Error';
    }

    const errorObj = reason.response.data?.error || reason.response.error || null;

    if (errorObj) {
      const errKeys = Object.keys(errorObj);
      for (let i = 0; i < errKeys.length; i++) {
        const key = errKeys[i];
        details += `${key}: ${ JSON.stringify(errorObj[key]) } `;
      }

    } else {
      details += reason.response.statusText;
    }
  } else if (reason?.message) {
    details = reason.message;
  }


  eventBus.emit(EDITMETADATA_NETWORK_ERROR, {
    status,
    statusMessage: msg,
    details: details || '',
  });

  return {
    message: msg,
    details,
  };
}

export function enhanceMetadataFromCategories(store, metadatas) {
  let datasets = metadatas;
  const isArrayInput = Array.isArray(datasets);
  if (!isArrayInput) {
    datasets = [datasets];
  }

  datasets.forEach(dataset => enhanceKeywords(dataset.tags));

  const enhanced = enhanceMetadatasTitleImage(datasets);
  return isArrayInput ? enhanced : enhanced[0];
}

export function updateResources(store, state, newRes) {
  const resources = store.getters[`${USER_NAMESPACE}/resources`];

  const updatedResources = updateEditingArray(resources, newRes, 'id');
  state.metadataInEditing[EDITMETADATA_DATA_RESOURCES].resources = updatedResources;
}

export function updateAuthors(store, state, newAuthor) {
  const authors = state.metadataInEditing[EDITMETADATA_AUTHOR_LIST].authors;

  const updatedAuthors = updateEditingArray(authors, newAuthor, 'email');
  state.metadataInEditing[EDITMETADATA_AUTHOR_LIST].authors = updatedAuthors;
}

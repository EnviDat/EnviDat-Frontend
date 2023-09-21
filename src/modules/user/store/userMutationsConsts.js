/**
 * @summary user store mutations constants
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 16:38:28
 * Last modified  : 2021-08-18 09:42:39
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

const useTestdata = import.meta?.env?.VITE_USE_TESTDATA === 'true';

export const GET_USER_LIST = 'GET_USER_LIST';
export const GET_USER_LIST_ERROR = 'GET_USER_LIST_ERROR';
export const GET_USER_LIST_SUCCESS = 'GET_USER_LIST_SUCCESS';

export const ACTION_GET_USER_LIST = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/user_list.json';
  }

  return 'user_list';
};

export const GET_USER_CONTEXT = 'GET_USER_CONTEXT';
export const GET_USER_CONTEXT_ERROR = 'GET_USER_CONTEXT_ERROR';
export const GET_USER_CONTEXT_SUCCESS = 'GET_USER_CONTEXT_SUCCESS';

/**
 * (old) endpoint to get the user information
 * @returns {string}
 * @constructor
 */
export const ACTION_OLD_GET_USER_CONTEXT = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/envidat_context_user_show.json';
  }

  return 'envidat_context_user_show';
};

export const USER_SIGNIN = 'USER_SIGNIN';
export const USER_SIGNIN_ERROR = 'USER_SIGNIN_ERROR';
export const USER_SIGNIN_SUCCESS = 'USER_SIGNIN_SUCCESS';

/**
 * (old) endpoint for the signin with the token from the email
 * @returns {string}
 * @constructor
 */
export const ACTION_OLD_USER_SIGNIN = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/passwordless_user_login.json';
  }

  return 'passwordless_user_login';
};

export const REQUEST_TOKEN = 'REQUEST_TOKEN';
export const REQUEST_TOKEN_ERROR = 'REQUEST_TOKEN_ERROR';
export const REQUEST_TOKEN_SUCCESS = 'REQUEST_TOKEN_SUCCESS';

/**
 * (old) endpoint to request login token
 * @returns {string}
 * @constructor
 */
export const ACTION_OLD_REQUEST_TOKEN = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/passwordless_perform_reset.json';
  }

  return 'passwordless_perform_reset';
};

/**
 * endpoint to get the users information
 * (JWT style signin)
 *
 * @returns {string}
 * @constructor
 */
export const ACTION_GET_USER_CONTEXT_TOKEN = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/passwordless_get_user.json';
  }

  return 'passwordless_get_user';
};

/*
export const API_TOKEN = 'API_TOKEN';
export const API_TOKEN_ERROR = 'API_TOKEN_ERROR';
export const API_TOKEN_SUCCESS = 'API_TOKEN_SUCCESS';
*/

/**
 * endpoint to sign in with the token received via email
 *
 * @returns {string}
 * @constructor
 */
export const ACTION_USER_SIGNIN_TOKEN = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/passwordless_request_api_token.json';
  }

  return 'passwordless_request_api_token';
};

/*
export const RESET_KEY = 'RESET_KEY';
export const RESET_KEY_ERROR = 'RESET_KEY_ERROR';
export const RESET_KEY_SUCCESS = 'RESET_KEY_SUCCESS';
*/

/**
 * endpoint to request a new token via email
 *
 * @returns {string}
 * @constructor
 */
export const ACTION_RESET_TOKEN = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/passwordless_request_reset_key.json';
  }

  return 'passwordless_request_reset_key';
};

export const USER_SIGNOUT = 'USER_SIGNOUT';
export const USER_SIGNOUT_ERROR = 'USER_SIGNOUT_ERROR';
export const USER_SIGNOUT_SUCCESS = 'USER_SIGNOUT_SUCCESS';

export const ACTION_OLD_USER_SIGNOUT = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/passwordless_user_logout.json';
  }

  return 'passwordless_user_logout';
};

export const ACTION_USER_SIGNOUT_REVOKE_TOKEN = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/passwordless_revoke_api_token.json';
  }

  return 'passwordless_revoke_api_token';
};

export const VALIDATION_ERROR = 'Validation Error';
export const NOT_AUTHORIZED_ERROR = 'NotAuthorized';

export const FETCH_USER_DATA = 'FETCH_USER_DATA';
export const SIGNIN_USER_ACTION = 'SIGNIN_USER_ACTION';

export const ACTION_COLLABORATOR_DATASET_IDS = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/package_collaborator_list_for_user.json';
  }

  return 'package_collaborator_list_for_user';
};

export const USER_GET_COLLABORATOR_DATASET_IDS = 'USER_GET_COLLABORATOR_DATASET_IDS';
export const USER_GET_COLLABORATOR_DATASET_IDS_ERROR = 'USER_GET_COLLABORATOR_DATASET_IDS_ERROR';
export const USER_GET_COLLABORATOR_DATASET_IDS_SUCCESS = 'USER_GET_COLLABORATOR_DATASET_IDS_SUCCESS';

export const ACTION_USER_COLLABORATOR_DATASETS = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/collaborator_search.json';
  }

  return 'package_search';
};

export const USER_GET_COLLABORATOR_DATASETS = 'USER_GET_COLLABORATOR_DATASETS';
export const USER_GET_COLLABORATOR_DATASETS_ERROR = 'USER_GET_COLLABORATOR_DATASETS_ERROR';
export const USER_GET_COLLABORATOR_DATASETS_SUCCESS = 'USER_GET_COLLABORATOR_DATASETS_SUCCESS';

export const ACTION_USER_SHOW = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/user_show.json';
    // return './testdata/unknow_file.json'; // to test error handling
  }

  return 'user_show';
};

export const USER_GET_DATASETS = 'USER_GET_DATASETS';
export const USER_GET_DATASETS_ERROR = 'USER_GET_DATASETS_ERROR';
export const USER_GET_DATASETS_SUCCESS = 'USER_GET_DATASETS_SUCCESS';

export const USER_EDITING_UPDATE = 'USER_EDITING_UPDATE';
export const USER_EDITING_UPDATE_SUCCESS = 'USER_EDITING_UPDATE_SUCCESS';
export const USER_EDITING_UPDATE_ERROR = 'USER_EDITING_UPDATE_ERROR';

export const ACTION_USER_EDITING_UPDATE = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/user_patch.json';
  }

  return 'user_update';
};

export const UPDATE_METADATA_EDITING = 'UPDATE_METADATA_EDITING';
export const CLEAR_METADATA_EDITING = 'CLEAR_METADATA_EDITING';

export const METADATA_EDITING_SELECT_RESOURCE = 'METADATA_EDITING_SELECT_RESOURCE';
export const METADATA_CANCEL_RESOURCE_EDITING = 'METADATA_CANCEL_RESOURCE_EDITING';
export const METADATA_EDITING_SAVE_RESOURCE = 'METADATA_EDITING_SAVE_RESOURCE';
export const METADATA_EDITING_SAVE_RESOURCE_ERROR = 'METADATA_EDITING_SAVE_RESOURCE_ERROR';
export const METADATA_EDITING_SAVE_RESOURCE_SUCCESS = 'METADATA_EDITING_SAVE_RESOURCE_SUCCESS';

export const METADATA_EDITING_SELECT_AUTHOR = 'METADATA_EDITING_SELECT_AUTHOR';
export const METADATA_CANCEL_AUTHOR_EDITING = 'METADATA_CANCEL_AUTHOR_EDITING';
export const METADATA_EDITING_SAVE_AUTHOR = 'METADATA_EDITING_SAVE_AUTHOR';
export const METADATA_EDITING_SAVE_AUTHOR_ERROR = 'METADATA_EDITING_SAVE_AUTHOR_ERROR';
export const METADATA_EDITING_SAVE_AUTHOR_SUCCESS = 'METADATA_EDITING_SAVE_AUTHOR_SUCCESS';


export const METADATA_EDITING_PATCH_DATASET_OBJECT = 'METADATA_EDITING_PATCH_DATASET_OBJECT';
export const METADATA_EDITING_PATCH_DATASET_OBJECT_ERROR = 'METADATA_EDITING_PATCH_DATASET_OBJECT_ERROR';
export const METADATA_EDITING_PATCH_DATASET_OBJECT_SUCCESS = 'METADATA_EDITING_PATCH_DATASET_OBJECT_SUCCESS';

export const METADATA_EDITING_PATCH_RESOURCE = 'METADATA_EDITING_PATCH_RESOURCE';
export const METADATA_EDITING_PATCH_RESOURCE_ERROR = 'METADATA_EDITING_PATCH_RESOURCE_ERROR';
export const METADATA_EDITING_PATCH_RESOURCE_SUCCESS = 'METADATA_EDITING_PATCH_RESOURCE_SUCCESS';

export const ACTION_METADATA_EDITING_PATCH_RESOURCE = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/resource_patch.json';
  }

  return 'resource_patch';
};

export const METADATA_EDITING_REMOVE_AUTHOR = 'METADATA_EDITING_REMOVE_AUTHOR';

export const ACTION_METADATA_EDITING_PATCH_DATASET = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/package_patch.json';
  }

  return 'package_patch';
};

export const METADATA_EDITING_PATCH_DATASET_ORGANIZATION = 'METADATA_EDITING_PATCH_DATASET_ORGANIZATION';

export const ACTION_METADATA_EDITING_PATCH_DATASET_ORGANIZATION = () => {
  if (import.meta?.env?.DEV && useTestdata) {
    return './testdata/package_owner_org_update.json';
  }

  return 'package_owner_org_update';
};

export const METADATA_EDITING_LOAD_DATASET = 'METADATA_EDITING_LOAD_DATASET';
export const METADATA_EDITING_LOAD_DATASET_ERROR = 'METADATA_EDITING_LOAD_DATASET_ERROR';
export const METADATA_EDITING_LOAD_DATASET_SUCCESS = 'METADATA_EDITING_LOAD_DATASET_SUCCESS';

export const METADATA_EDITING_LAST_DATASET = 'METADATA_EDITING_LAST_DATASET';

export const ACTION_METADATA_CREATION_RESOURCE = () => {
  if (process.env.NODE_ENV === 'development' && useTestdata) {
    return './testdata/resource_create.json';
  }

  return 'resource_create';
};

export const METADATA_CREATION_RESOURCE = 'METADATA_CREATION_RESOURCE';
export const METADATA_CREATION_RESOURCE_ERROR = 'METADATA_CREATION_RESOURCE_ERROR';
export const METADATA_CREATION_RESOURCE_SUCCESS = 'METADATA_CREATION_RESOURCE_SUCCESS';

export const METADATA_UPLOAD_FILE_INIT = 'METADATA_UPLOAD_FILE_INIT';
export const METADATA_UPLOAD_FILE = 'METADATA_UPLOAD_FILE';
export const METADATA_UPLOAD_FILE_ERROR = 'METADATA_UPLOAD_FILE_ERROR';
export const METADATA_UPLOAD_FILE_SUCCESS = 'METADATA_UPLOAD_FILE_SUCCESS';

export const ACTION_METADATA_DELETE_RESOURCE = () => {
  if (process.env.NODE_ENV === 'development' && useTestdata) {
    return './testdata/resource_delete.json';
  }

  return 'resource_delete';
};

export const METADATA_DELETE_RESOURCE = 'METADATA_DELETE_RESOURCE';
export const METADATA_DELETE_RESOURCE_ERROR = 'METADATA_DELETE_RESOURCE_ERROR';
export const METADATA_DELETE_RESOURCE_SUCCESS = 'METADATA_DELETE_RESOURCE_SUCCESS';

export const USER_NAMESPACE = 'user';
export const USER_SIGNIN_NAMESPACE = 'userSignIn';

export const METADATA_CREATION_DATASET = 'METADATA_CREATION_DATASET';
export const METADATA_CREATION_DATASET_ERROR = 'METADATA_CREATION_DATASET_ERROR';
export const METADATA_CREATION_DATASET_SUCCESS = 'METADATA_CREATION_DATASET_SUCCESS';

export const ACTION_METADATA_CREATION_DATASET = () => {
  if (process.env.NODE_ENV === 'development' && useTestdata) {
    return './testdata/package_create.json';
  }

  return 'package_create';
};

const requests = {
  get:[
    ACTION_GET_USER_CONTEXT_TOKEN,
    ACTION_OLD_GET_USER_CONTEXT,
    ACTION_OLD_USER_SIGNIN,
    ACTION_USER_SIGNOUT_REVOKE_TOKEN,
    ACTION_OLD_USER_SIGNOUT,
  ],
  post: [
    ACTION_OLD_REQUEST_TOKEN,
    ACTION_RESET_TOKEN,
    ACTION_USER_SIGNIN_TOKEN,
  ],
}

export function requestMethodsForLoginActions(action) {

  const keys = Object.keys(requests);
  const matches = keys.filter((key) => requests[key].includes(action));

  return matches[0];
}

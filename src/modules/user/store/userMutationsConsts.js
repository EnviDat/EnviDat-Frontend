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

const useTestdata = import.meta.env.VITE_USE_TESTDATA === 'true';

export const GET_USER_CONTEXT = 'GET_USER_CONTEXT';
export const GET_USER_CONTEXT_ERROR = 'GET_USER_CONTEXT_ERROR';
export const GET_USER_CONTEXT_SUCCESS = 'GET_USER_CONTEXT_SUCCESS';
export const ACTION_GET_USER_CONTEXT = () => {
  if (import.meta.env.DEV && useTestdata) {
    return './testdata/envidat_context_user_show.json';
  }

  return 'envidat_context_user_show';
};

export const USER_SIGNIN = 'USER_SIGNIN';
export const USER_SIGNIN_ERROR = 'USER_SIGNIN_ERROR';
export const USER_SIGNIN_SUCCESS = 'USER_SIGNIN_SUCCESS';
export const ACTION_USER_SIGNIN = () => {
  if (import.meta.env.DEV && useTestdata) {
    return './testdata/passwordless_user_login.json';
  }

  return 'passwordless_user_login';
};

export const REQUEST_TOKEN = 'REQUEST_TOKEN';
export const REQUEST_TOKEN_ERROR = 'REQUEST_TOKEN_ERROR';
export const REQUEST_TOKEN_SUCCESS = 'REQUEST_TOKEN_SUCCESS';
export const ACTION_REQUEST_TOKEN = () => {
  if (import.meta.env.DEV && useTestdata) {
    return './testdata/passwordless_perform_reset.json';
  }

  return 'passwordless_perform_reset';
};

export const USER_SIGNOUT = 'USER_SIGNOUT';
export const USER_SIGNOUT_ERROR = 'USER_SIGNOUT_ERROR';
export const USER_SIGNOUT_SUCCESS = 'USER_SIGNOUT_SUCCESS';
export const ACTION_USER_SIGNOUT = () => {
  if (import.meta.env.DEV && useTestdata) {
    return './testdata/passwordless_user_logout.json';
  }

  return 'passwordless_user_logout';
};

export const VALIDATION_ERROR = 'Validation Error';
export const NOT_AUTHORIZED_ERROR = 'NotAuthorized';

export const FETCH_USER_DATA = 'FETCH_USER_DATA';

export const ACTION_COLLABORATOR_DATASET_IDS = () => {
  if (import.meta.env.DEV && useTestdata) {
    return './testdata/package_collaborator_list_for_user.json';
  }

  return 'package_collaborator_list_for_user';
};

export const USER_GET_COLLABORATOR_DATASET_IDS =
  'USER_GET_COLLABORATOR_DATASET_IDS';
export const USER_GET_COLLABORATOR_DATASET_IDS_ERROR =
  'USER_GET_COLLABORATOR_DATASET_IDS_ERROR';
export const USER_GET_COLLABORATOR_DATASET_IDS_SUCCESS =
  'USER_GET_COLLABORATOR_DATASET_IDS_SUCCESS';

export const ACTION_USER_COLLABORATOR_DATASETS = () => {
  if (import.meta.env.DEV && useTestdata) {
    return './testdata/collaborator_search.json';
  }

  return 'package_search';
};

export const USER_GET_COLLABORATOR_DATASETS = 'USER_GET_COLLABORATOR_DATASETS';
export const USER_GET_COLLABORATOR_DATASETS_ERROR =
  'USER_GET_COLLABORATOR_DATASETS_ERROR';
export const USER_GET_COLLABORATOR_DATASETS_SUCCESS =
  'USER_GET_COLLABORATOR_DATASETS_SUCCESS';

export const ACTION_USER_SHOW = () => {
  if (import.meta.env.DEV && useTestdata) {
    return './testdata/user_show.json';
    // return './testdata/unknow_file.json'; // to test error handling
  }

  return 'user_show';
};

export const USER_GET_DATASETS = 'USER_GET_DATASETS';
export const USER_GET_DATASETS_ERROR = 'USER_GET_DATASETS_ERROR';
export const USER_GET_DATASETS_SUCCESS = 'USER_GET_DATASETS_SUCCESS';

export const ACTION_USER_ORGANIZATION_IDS = () => {
  if (import.meta.env.DEV && useTestdata) {
    return './testdata/organization_list_for_user.json';
  }

  return 'organization_list_for_user';
};

export const USER_GET_ORGANIZATION_IDS = 'USER_GET_ORGANIZATION_IDS';
export const USER_GET_ORGANIZATION_IDS_ERROR = 'USER_GET_ORGANIZATION_ERROR';
export const USER_GET_ORGANIZATION_IDS_SUCCESS =
  'USER_GET_ORGANIZATION_SUCCESS';

export const ACTION_USER_ORGANIZATIONS = () => {
  if (import.meta.env.DEV && useTestdata) {
    return './testdata/organization_show.json';
  }

  return 'organization_show';
};

export const USER_GET_ORGANIZATIONS = 'USER_GET_ORGANIZATIONS';
export const USER_GET_ORGANIZATIONS_ERROR = 'USER_GET_ORGANIZATIONS_ERROR';
export const USER_GET_ORGANIZATIONS_SUCCESS = 'USER_GET_ORGANIZATIONS_SUCCESS';
export const USER_GET_ORGANIZATIONS_RESET = 'USER_GET_ORGANIZATIONS_RESET';

export const USER_EDITING_UPDATE = 'USER_EDITING_UPDATE';
export const USER_EDITING_UPDATE_SUCCESS = 'USER_EDITING_UPDATE_SUCCESS';
export const USER_EDITING_UPDATE_ERROR = 'USER_EDITING_UPDATE_ERROR';

export const ACTION_USER_EDITING_UPDATE = () => {
  if (import.meta.env.DEV && useTestdata) {
    return './testdata/user_patch.json';
  }

  return 'user_update';
};

export const LOAD_METADATA_ENTRY_INTO_EDITING =
  'LOAD_METADATA_ENTRY_INTO_EDITING';
export const UPDATE_METADATA_EDITING = 'UPDATE_METADATA_EDITING';
export const CLEAR_METADATA_EDITING = 'CLEAR_METADATA_EDITING';

export const METADATA_EDITING_SELECT_RESOURCE =
  'METADATA_EDITING_SELECT_RESOURCE';
export const METADATA_CANCEL_RESOURCE_EDITING =
  'METADATA_CANCEL_RESOURCE_EDITING';
export const METADATA_EDITING_SAVE_RESOURCE = 'METADATA_EDITING_SAVE_RESOURCE';
export const METADATA_EDITING_SAVE_RESOURCE_ERROR =
  'METADATA_EDITING_SAVE_RESOURCE_ERROR';
export const METADATA_EDITING_SAVE_RESOURCE_SUCCESS =
  'METADATA_EDITING_SAVE_RESOURCE_SUCCESS';

export const METADATA_EDITING_SELECT_AUTHOR = 'METADATA_EDITING_SELECT_AUTHOR';
export const METADATA_CANCEL_AUTHOR_EDITING = 'METADATA_CANCEL_AUTHOR_EDITING';
export const METADATA_EDITING_SAVE_AUTHOR = 'METADATA_EDITING_SAVE_AUTHOR';
export const METADATA_EDITING_SAVE_AUTHOR_ERROR =
  'METADATA_EDITING_SAVE_AUTHOR_ERROR';
export const METADATA_EDITING_SAVE_AUTHOR_SUCCESS =
  'METADATA_EDITING_SAVE_AUTHOR_SUCCESS';

export const METADATA_EDITING_PATCH_DATASET_PROPERTY =
  'METADATA_EDITING_PATCH_DATASET_PROPERTY';
export const METADATA_EDITING_PATCH_DATASET_PROPERTY_ERROR =
  'METADATA_EDITING_PATCH_DATASET_PROPERTY_ERROR';
export const METADATA_EDITING_PATCH_DATASET_PROPERTY_SUCCESS =
  'METADATA_EDITING_PATCH_DATASET_PROPERTY_SUCCESS';

export const METADATA_EDITING_PATCH_DATASET_OBJECT =
  'METADATA_EDITING_PATCH_DATASET_OBJECT';
export const METADATA_EDITING_PATCH_DATASET_OBJECT_ERROR =
  'METADATA_EDITING_PATCH_DATASET_OBJECT_ERROR';
export const METADATA_EDITING_PATCH_DATASET_OBJECT_SUCCESS =
  'METADATA_EDITING_PATCH_DATASET_OBJECT_SUCCESS';

export const METADATA_EDITING_REMOVE_AUTHOR = 'METADATA_EDITING_REMOVE_AUTHOR';

export const ACTION_METADATA_EDITING_PATCH_DATASET = () => {
  if (import.meta.env.DEV && useTestdata) {
    return './testdata/package_patch.json';
  }

  return 'package_patch';
};

export const METADATA_EDITING_PATCH_DATASET_ORGANIZATION =
  'METADATA_EDITING_PATCH_DATASET_ORGANIZATION';

export const ACTION_METADATA_EDITING_PATCH_DATASET_ORGANIZATION = () => {
  if (import.meta.env.DEV && useTestdata) {
    return './testdata/package_owner_org_update.json';
  }

  return 'package_owner_org_update';
};

export const METADATA_EDITING_LOAD_DATASET = 'METADATA_EDITING_LOAD_DATASET';
export const METADATA_EDITING_LOAD_DATASET_ERROR =
  'METADATA_EDITING_LOAD_DATASET_ERROR';
export const METADATA_EDITING_LOAD_DATASET_SUCCESS =
  'METADATA_EDITING_LOAD_DATASET_SUCCESS';

export const METADATA_EDITING_LAST_DATASET = 'METADATA_EDITING_LAST_DATASET';

export const USER_NAMESPACE = 'user';
export const USER_SIGNIN_NAMESPACE = 'userSignIn';

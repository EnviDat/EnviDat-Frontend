/**
 * @summary organizations store mutations constants
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-10-23 16:47:32
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

export const GET_ORGANIZATIONS = 'GET_ORGANIZATIONS';
export const GET_ORGANIZATIONS_SUCCESS = 'GET_ORGANIZATIONS_SUCCESS';
export const GET_ORGANIZATIONS_ERROR = 'GET_ORGANIZATIONS_ERROR';
// export const SET_ORGANIZATIONS_PAGE_BACK_URL = 'SET_ORGANIZATIONS_PAGE_BACK_URL';

export const GET_ALL_ORGANIZATIONS_IDS = 'GET_ALL_ORGANIZATIONS_IDS';
export const GET_ALL_ORGANIZATIONS_IDS_SUCCESS = 'GET_ALL_ORGANIZATIONS_IDS_SUCCESS';
export const GET_ALL_ORGANIZATIONS_IDS_ERROR = 'GET_ALL_ORGANIZATIONS_IDS_ERROR';

export const GET_ALL_ORGANIZATIONS = 'GET_ALL_ORGANIZATIONS';
export const GET_ALL_ORGANIZATIONS_SUCCESS = 'GET_ALL_ORGANIZATIONS_SUCCESS';
export const GET_ALL_ORGANIZATIONS_ERROR = 'GET_ALL_ORGANIZATIONS_ERROR';

export const ACTION_GET_ORGANIZATIONS = () => {
  if (import.meta.env?.DEV && useTestdata) {
    return './testdata/organization_list.json';
  }

  return 'organization_list';
};
export const ORGANIZATIONS_NAMESPACE = 'organizations';
export const ACTION_USER_ORGANIZATION_IDS = () => {
  if (import.meta.env?.DEV && useTestdata) {
    return './testdata/organization_list_for_user.json';
  }

  return 'organization_list_for_user';
};
export const USER_GET_ORGANIZATION_IDS = 'USER_GET_ORGANIZATION_IDS';
export const USER_GET_ORGANIZATION_IDS_ERROR = 'USER_GET_ORGANIZATION_ERROR';
export const USER_GET_ORGANIZATION_IDS_SUCCESS = 'USER_GET_ORGANIZATION_SUCCESS';
export const ACTION_GET_ORGANIZATION = () => {
  if (import.meta.env?.DEV && useTestdata) {
    return './testdata/organization_show.json';
  }

  return 'organization_show';
};
export const USER_GET_ORGANIZATIONS = 'USER_GET_ORGANIZATIONS';
export const USER_GET_ORGANIZATIONS_ERROR = 'USER_GET_ORGANIZATIONS_ERROR';
export const USER_GET_ORGANIZATIONS_SUCCESS = 'USER_GET_ORGANIZATIONS_SUCCESS';
export const USER_GET_ORGANIZATIONS_RESET = 'USER_GET_ORGANIZATIONS_RESET';


export const USER_GET_ORGANIZATIONS_SEARCH = 'USER_GET_ORGANIZATIONS_SEARCH';
export const USER_GET_ORGANIZATIONS_SEARCH_SUCCESS = 'USER_GET_ORGANIZATIONS_SEARCH_SUCCESS';

export const ACTION_USER_GET_ORGANIZATIONS_SEARCH = () => {
  if (import.meta.env?.DEV && useTestdata) {
    return './testdata/organization_search.json';
  }

  return 'package_search';
};

export const USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE = 'USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE';
export const USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE_SUCCESS = 'USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE_SUCCESS';

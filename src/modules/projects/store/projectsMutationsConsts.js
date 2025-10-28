/**
 * @summary projects store mutations constants
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

export const GET_PROJECTS = 'GET_PROJECTS';
export const GET_PROJECTS_SUCCESS = 'GET_PROJECTS_SUCCESS';
export const GET_PROJECTS_ERROR = 'GET_PROJECTS_ERROR';
export const SET_PROJECTDETAIL_PAGE_BACK_URL = 'SET_PROJECTDETAIL_PAGE_BACK_URL';

export const ACTION_GET_PROJECTS = () => {
  if (import.meta.env?.MODE === 'development' && useTestdata) {
    return './testdata/group_list.json';
  }

  return 'group_list?all_fields=true&include_groups=true&include_extras=true&include_datasets=true';
};

export const PROJECTS_NAMESPACE = 'projects';

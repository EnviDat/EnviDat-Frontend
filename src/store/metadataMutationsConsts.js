/**
 * @summary metadata store mutations constants
 * @author Dominik Haas-Artho
 *
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

export const BULK_LOAD_METADATAS_CONTENT = 'BULK_LOAD_METADATAS_CONTENT';
export const BULK_LOAD_METADATAS_CONTENT_SUCCESS =
  'BULK_LOAD_METADATAS_CONTENT_SUCCESS';
export const BULK_LOAD_METADATAS_CONTENT_ERROR =
  'BULK_LOAD_METADATAS_CONTENT_ERROR';

export const ACTION_BULK_LOAD_METADATAS_CONTENT = () => {
  if (import.meta.env?.MODE === 'development' && useTestdata) {
    return './testdata/packagelist.json';
  }

  return 'current_package_list_with_resources?limit=1000&offset=0';
};

export const LOAD_METADATA_CONTENT_BY_ID = 'LOAD_METADATA_CONTENT_BY_ID';
export const LOAD_METADATA_CONTENT_BY_ID_SUCCESS =
  'LOAD_METADATA_CONTENT_BY_ID_SUCCESS';
export const LOAD_METADATA_CONTENT_BY_ID_ERROR =
  'LOAD_METADATA_CONTENT_BY_ID_ERROR';

export const ACTION_LOAD_METADATA_CONTENT_BY_ID = () => {
  if (import.meta.env?.MODE === 'development' && useTestdata) {
    return './testdata/package_show.json';
  }

  return 'package_show';
};

export const CLEAN_CURRENT_METADATA = 'CLEAN_CURRENT_METADATA';

export const SEARCH_METADATA = 'SEARCH_METADATA';
export const SEARCH_METADATA_SUCCESS = 'SEARCH_METADATA_SUCCESS';
export const SEARCH_METADATA_ERROR = 'SEARCH_METADATA_ERROR';
export const CLEAR_SEARCH_METADATA = 'CLEAR_SEARCH_METADATA';

export const ACTION_SEARCH_METADATA = () => {
  if (import.meta.env?.MODE === 'development' && useTestdata) {
    return './testdata/query.json';
  }

  return 'query';
};

export const UPDATE_TAGS = 'UPDATE_TAGS';
export const UPDATE_TAGS_SUCCESS = 'UPDATE_TAGS_SUCCESS';
export const UPDATE_TAGS_ERROR = 'UPDATE_TAGS_ERROR';

export const FILTER_METADATA = 'FILTER_METADATA';
export const FILTER_METADATA_SUCCESS = 'FILTER_METADATA_SUCCESS';
export const FILTER_METADATA_ERROR = 'FILTER_METADATA_ERROR';

export const SWISSFL_MODE = 'swissfl';
export const SWISSFL_MODE_EXTRAS_KEY = 'swissFL_type';

export const EDNA_MODE = 'edna';
export const EDNA_MODE_EXTRAS_KEY = 'edna_type';

export const FOREST_3D = 'forest3d';
export const FOREST_3D_EXTRAS_KEY = 'forest3d_type';
export const FOREST_3D_URL =
  'https://forest3d.os.zhdk.cloud.switch.ch/forest3d/data.json';

export const PIN_METADATA = 'PIN_METADATA';
export const CLEAR_PINNED_METADATA = 'CLEAR_PINNED_METADATA';
export const SET_DETAIL_PAGE_BACK_URL = 'SET_DETAIL_PAGE_BACK_URL';
export const SET_ABOUT_PAGE_BACK_URL = 'SET_ABOUT_PAGE_BACK_URL';
export const METADATA_UPDATE_EXISTING_TITLE = 'METADATA_UPDATE_EXISTING_TITLE';

export const METADATA_NAMESPACE = 'metadata';

export const LISTCONTROL_LIST_ACTIVE = 0;
export const LISTCONTROL_MAP_ACTIVE = 1;
export const LISTCONTROL_COMPACT_LAYOUT_ACTIVE = 2;

export const METADATA_UPDATE_EXISTING_AUTHORS =
  'METADATA_UPDATE_EXISTING_AUTHORS';
export const METADATA_UPDATE_AN_EXISTING_AUTHOR =
  'METADATA_UPDATE_AN_EXISTING_AUTHOR';

export const METADATA_UPDATE_EXISTING_KEYWORDS =
  'METADATA_UPDATE_EXISTING_KEYWORDS';
export const METADATA_UPDATE_EXISTING_KEYWORDS_SUCCESS =
  'METADATA_UPDATE_EXISTING_KEYWORDS_SUCCESS';
export const METADATA_UPDATE_EXISTING_KEYWORDS_ERROR =
  'METADATA_UPDATE_EXISTING_KEYWORDS_ERROR';

export const ACTION_METADATA_UPDATE_EXISTING_KEYWORDS = () => {
  if (import.meta.env?.MODE === 'development' && useTestdata) {
    return './testdata/tag_list.json';
  }

  return 'tag_list';
};

export const METADATA_REVIEW_STORE = 'METADATA_REVIEW_STORE';
export const EDIT_DATASET_STORE = 'EDIT_DATASET_STORE';

export const ACTION_METADATA_REVIEW = () => {
  if (import.meta.env?.MODE === 'development' && useTestdata) {
    return './testdata/review.json';
  }

  return 'review';
};

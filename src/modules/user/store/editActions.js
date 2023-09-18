/**
 * user store actions
 *
 * @summary user store actions
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 16:51:52
 * Last modified  : 2021-08-18 10:48:15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import axios from 'axios';
import { urlRewrite } from '@/factories/apiFactory';

import {
  getBackendJSONForStep,
  mapFrontendToBackend,
  populateEditingComponents,
  stringifyResourceForBackend,
} from '@/factories/mappingFactory';

import {
  LOAD_METADATA_CONTENT_BY_ID,
  METADATA_NAMESPACE,
} from '@/store/metadataMutationsConsts';

import { EDITMETADATA_AUTHOR_LIST } from '@/factories/eventBus';

import {
  ACTION_METADATA_EDITING_PATCH_DATASET,
  ACTION_METADATA_EDITING_PATCH_DATASET_ORGANIZATION,
  ACTION_METADATA_EDITING_PATCH_RESOURCE,
  METADATA_EDITING_LOAD_DATASET,
  METADATA_EDITING_PATCH_DATASET_OBJECT,
  METADATA_EDITING_PATCH_DATASET_OBJECT_ERROR,
  METADATA_EDITING_PATCH_DATASET_OBJECT_SUCCESS,
  METADATA_EDITING_PATCH_DATASET_ORGANIZATION,
  METADATA_EDITING_PATCH_RESOURCE,
  METADATA_EDITING_PATCH_RESOURCE_ERROR,
  METADATA_EDITING_PATCH_RESOURCE_SUCCESS,
  METADATA_EDITING_REMOVE_AUTHOR,
  METADATA_EDITING_SAVE_AUTHOR,
  METADATA_EDITING_SAVE_AUTHOR_SUCCESS,
  USER_NAMESPACE,
} from './userMutationsConsts';

// don't use an api base url or API_ROOT when using testdata
let API_BASE = '';
let API_ROOT = '';

const useTestdata = import.meta?.env?.VITE_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  API_ROOT = import.meta.env.VITE_API_ROOT;
}

export default {
  async [METADATA_EDITING_SAVE_AUTHOR]({ commit, dispatch }, { data: author, id }) {
    commit(METADATA_EDITING_SAVE_AUTHOR, author);

    const newAuthorList = this.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_AUTHOR_LIST);

    await dispatch(METADATA_EDITING_PATCH_DATASET_OBJECT, {
      stepKey: EDITMETADATA_AUTHOR_LIST,
      data: newAuthorList,
      id });

    commit(METADATA_EDITING_SAVE_AUTHOR_SUCCESS, author);

  },
  [METADATA_EDITING_REMOVE_AUTHOR]({ commit, dispatch }, { data, id }) {
    commit(METADATA_EDITING_REMOVE_AUTHOR, data);

    const newAuthorList = this.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_AUTHOR_LIST);

    dispatch(METADATA_EDITING_PATCH_DATASET_OBJECT, {
      stepKey: EDITMETADATA_AUTHOR_LIST,
      data: newAuthorList,
      id });
  },
  async [METADATA_EDITING_LOAD_DATASET]({ dispatch }, metadataId) {

    // defining the commitMethod has the effect that mutations of this
    // module are being used with the output of the action from the metadata module
    await dispatch(`${METADATA_NAMESPACE}/${LOAD_METADATA_CONTENT_BY_ID}`, {
      metadataId,
      commitMethod: `${USER_NAMESPACE}/${METADATA_EDITING_LOAD_DATASET}`,
    },
    { root: true },
    );

  },
  async [METADATA_EDITING_PATCH_DATASET_OBJECT]({ commit }, { stepKey, data, id }) {

    commit(METADATA_EDITING_PATCH_DATASET_OBJECT, stepKey);

    const categoryCards = this.state.categoryCards;

    const actionUrl = ACTION_METADATA_EDITING_PATCH_DATASET();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    const postData = mapFrontendToBackend(stepKey, data);
    postData.id = id;

    await axios.post(url, postData,
      {
        headers: {
          // Authorization: apiKey,
        },
      })
      .then((response) => {
        commit(METADATA_EDITING_PATCH_DATASET_OBJECT_SUCCESS, {
          stepKey,
          message: 'Changes saved',
          // details: `Changes saved ${stepKey} data for ${id}`,
        });

        populateEditingComponents(commit, response.data.result, categoryCards);
      })
      .catch((reason) => {
        commit(METADATA_EDITING_PATCH_DATASET_OBJECT_ERROR, {
          stepKey,
          reason,
        });
      });
  },
  async [METADATA_EDITING_PATCH_RESOURCE]({ commit }, { stepKey, data }) {

    commit(METADATA_EDITING_PATCH_RESOURCE, data);

    const actionUrl = ACTION_METADATA_EDITING_PATCH_RESOURCE();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    // create a local copy to avoid mutation of vuex store objects / properties
    const localData = { ...data };
    const cleaned = getBackendJSONForStep(stepKey, localData);
    const postData = stringifyResourceForBackend(cleaned);

    await axios.post(url, postData)
      .then((response) => {

        commit(METADATA_EDITING_PATCH_RESOURCE_SUCCESS, {
          stepKey,
          resource: response.data.result,
          message: 'Resource saved',
          // details: `Changes saved ${stepKey} data for ${id}`,
        });

      })
      .catch((reason) => {
        commit(METADATA_EDITING_PATCH_RESOURCE_ERROR, {
          stepKey,
          reason,
        });
      });
  },
  async [METADATA_EDITING_PATCH_DATASET_ORGANIZATION]({ commit }, { stepKey, id, data }) {

    commit(METADATA_EDITING_PATCH_DATASET_OBJECT, stepKey);

    const apiKey = this.state.userSignIn.user?.apikey || null;
    const categoryCards = this.state.categoryCards;

    const actionUrl = ACTION_METADATA_EDITING_PATCH_DATASET_ORGANIZATION();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    const postData = {
      id,
      organization_id: data.organizationId,
    };

    await axios.post(url, postData,
      {
        headers: {
          Authorization: apiKey,
        },
      })
      .then((response) => {
        commit(METADATA_EDITING_PATCH_DATASET_OBJECT_SUCCESS, {
          stepKey,
          message: 'Organization changed',
          // details: `Changes saved ${stepKey} data for ${id}`,
        });

        if (response?.data?.result) {
          populateEditingComponents(commit, response.data.result, categoryCards);
        }
      })
      .catch((reason) => {
        commit(METADATA_EDITING_PATCH_DATASET_OBJECT_ERROR, {
          stepKey,
          reason,
        });
      });
  },
};

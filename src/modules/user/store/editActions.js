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
  mapFrontendToBackend,
  populateEditingComponents,
} from '@/factories/mappingFactory';

import {
  LOAD_METADATA_CONTENT_BY_ID,
  METADATA_NAMESPACE,
} from '@/store/metadataMutationsConsts';

import {
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_DATA_RESOURCES,
} from '@/factories/eventBus';

import {
  ACTION_METADATA_EDITING_PATCH_DATASET,
  ACTION_METADATA_EDITING_PATCH_DATASET_ORGANIZATION,
  METADATA_EDITING_LOAD_DATASET,
  METADATA_EDITING_PATCH_DATASET_OBJECT,
  METADATA_EDITING_PATCH_DATASET_OBJECT_ERROR,
  METADATA_EDITING_PATCH_DATASET_OBJECT_SUCCESS,
  METADATA_EDITING_PATCH_DATASET_ORGANIZATION,
  METADATA_EDITING_REMOVE_AUTHOR,
  METADATA_EDITING_SAVE_AUTHOR,
  METADATA_EDITING_SAVE_AUTHOR_SUCCESS,
  METADATA_EDITING_SAVE_RESOURCE,
  METADATA_EDITING_SAVE_RESOURCE_SUCCESS,
  USER_NAMESPACE,
} from './userMutationsConsts';

// don't use an api base url or proxy when using testdata
let API_BASE = '';
let ENVIDAT_PROXY = '';

const useTestdata = import.meta.env.VITE_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  ENVIDAT_PROXY = import.meta.env.VITE_ENVIDAT_PROXY;
}

const sleep = (milliseconds) =>
  // eslint-disable-next-line no-promise-executor-return
  new Promise((resolve) => setTimeout(resolve, milliseconds));


export default {
  async [METADATA_EDITING_SAVE_RESOURCE]({ commit, dispatch }, { stepKey, data, id }) {
    const resource = data;
    // saving of this resource into the list of resources happens here:
    commit(METADATA_EDITING_SAVE_RESOURCE, resource);

    const metadataId = id;
    const resources = this.getters[`${USER_NAMESPACE}/resources`];

    // after saving the resource to the list in the state
    // call the action to save it in the backend
    await dispatch(METADATA_EDITING_PATCH_DATASET_OBJECT, {
      stepKey: EDITMETADATA_DATA_RESOURCES,
      data: { resources },
      id: metadataId,
    });

    commit(METADATA_EDITING_SAVE_RESOURCE_SUCCESS, resource);
  },
  async [METADATA_EDITING_SAVE_AUTHOR]({ commit }, author) {
    commit(METADATA_EDITING_SAVE_AUTHOR, author);

    await sleep(2000);

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
/*
  async [METADATA_EDITING_PATCH_DATASET_PROPERTY]({ commit }, { stepKey, id, property, value}) {

    commit(METADATA_EDITING_PATCH_DATASET_PROPERTY, stepKey);

    // eslint-disable-next-line no-unreachable
    const apiKey = this.state.userSignIn.user?.apikey || null;

    const actionUrl = ACTION_METADATA_EDITING_PATCH_DATASET();
    let url = actionUrl;
    url = urlRewrite(url, API_BASE, ENVIDAT_PROXY);

    if (useTestdata) {
      // ignore the parameters for testdata, because it's directly a file
      url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);
    }
    const snakeCaseProperty = toSnakeCase(property);

    await axios.post(url, {
      id,
      [snakeCaseProperty]: value,
      },
      {
        headers: {
          Authorization: apiKey,
        },
      })
      .then((response) => {
        commit(METADATA_EDITING_PATCH_DATASET_PROPERTY_SUCCESS, {
          stepKey,
          message: `${property} saved ${response.data.result[property]}`,
        });
      })
      .catch((reason) => {
        commit(METADATA_EDITING_PATCH_DATASET_PROPERTY_ERROR, {
          stepKey,
          reason,
        });
      });
  },
*/
  async [METADATA_EDITING_PATCH_DATASET_OBJECT]({ commit }, { stepKey, data, id }) {

    commit(METADATA_EDITING_PATCH_DATASET_OBJECT, stepKey);

    // const apiKey = this.state.userSignIn.user?.apikey || null;
    const categoryCards = this.state.categoryCards;

    const actionUrl = ACTION_METADATA_EDITING_PATCH_DATASET();
    const url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);

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

        const authorsMap = this.getters[`${METADATA_NAMESPACE}/authorsMap`];
        populateEditingComponents(commit, response.data.result, categoryCards, authorsMap);
      })
      .catch((reason) => {
        commit(METADATA_EDITING_PATCH_DATASET_OBJECT_ERROR, {
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
    const url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);

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
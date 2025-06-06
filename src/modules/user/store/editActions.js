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
  getFrontendJSONForStep,
  markResourceDeprecated,
  mapFrontendToBackend,
  populateEditingComponents,
  stringifyResourceForBackend,
  deprecatedResourceChanged,
} from '@/factories/mappingFactory';

import {
  LOAD_METADATA_CONTENT_BY_ID,
  METADATA_NAMESPACE,
} from '@/store/metadataMutationsConsts';

import {
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_DATA_RESOURCE,
} from '@/factories/eventBus';

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

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

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
  async [METADATA_EDITING_LOAD_DATASET]({ dispatch }, { metadataId, forceBackendReload = false }) {

    // defining the commitMethod has the effect that mutations of this
    // module are being used with the output of the action from the metadata module
    await dispatch(`${METADATA_NAMESPACE}/${LOAD_METADATA_CONTENT_BY_ID}`, {
      metadataId,
      commitMethod: `${USER_NAMESPACE}/${METADATA_EDITING_LOAD_DATASET}`,
      forceBackendReload,
    },
    { root: true },
    );

  },
  async [METADATA_EDITING_PATCH_DATASET_OBJECT]({ commit }, { stepKey, data, id }) {

    commit(METADATA_EDITING_PATCH_DATASET_OBJECT, stepKey);

    const actionUrl = ACTION_METADATA_EDITING_PATCH_DATASET();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    const postData = mapFrontendToBackend(stepKey, data);
    postData.id = id;
    console.log('about to post version to dataset');
    await axios.post(url, postData,
      {
        headers: {
          // Authorization: apiKey,
        },
      })
      .then((response) => {
        populateEditingComponents(commit, response.data.result);

        commit(METADATA_EDITING_PATCH_DATASET_OBJECT_SUCCESS, {
          stepKey,
          message: 'Changes saved',
          // details: `Changes saved ${stepKey} data for ${id}`,
        });
      })
      .catch((reason) => {
        commit(METADATA_EDITING_PATCH_DATASET_OBJECT_ERROR, {
          stepKey,
          reason,
        });
      });
  },
  async [METADATA_EDITING_PATCH_RESOURCE]({ commit, dispatch }, { stepKey, data }) {

    commit(METADATA_EDITING_PATCH_RESOURCE, data);

    const actionUrl = ACTION_METADATA_EDITING_PATCH_RESOURCE();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    // create a local copy to avoid mutation of vuex store objects / properties
    const localData = { ...data };
    const isDeprecated = localData.deprecated;
    const cleaned = getBackendJSONForStep(stepKey, localData);
    const postData = stringifyResourceForBackend(cleaned);

    try {
      const response = await axios.post(url, postData);
      const resource = getFrontendJSONForStep(EDITMETADATA_DATA_RESOURCE, response.data.result);
      const resourceId  =  resource.id;

      const customFieldsData = this.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_CUSTOMFIELDS);

      if (customFieldsData) {
        // HACK: Due to the lack of proper mapping in the frontend
        // and the inability to change the schema in the backend
        // the mapping of the deprecated field is performed here in a very inefficient and unmaintainable way
        // The counterpart is found in  mappingFactory -> populateEditingResources
        // change this ASAP (move to centralised mapping, or simply adjust backend)!

        if (deprecatedResourceChanged(resourceId, isDeprecated, customFieldsData.customFields)) {
          customFieldsData.customFields = markResourceDeprecated(resourceId, isDeprecated, customFieldsData.customFields);

          await dispatch(METADATA_EDITING_PATCH_DATASET_OBJECT, {
            data: customFieldsData,
            stepKey: EDITMETADATA_CUSTOMFIELDS,
            id: resource.packageId,
          });
        }

      }
      commit(METADATA_EDITING_PATCH_RESOURCE_SUCCESS, {
        stepKey,
        resource: response.data.result,
        message: 'Resource saved',
        // details: `Changes saved ${stepKey} data for ${id}`,
      });

    } catch(reason) {
      commit(METADATA_EDITING_PATCH_RESOURCE_ERROR, {
        stepKey,
        reason,
      });
    }
  },
  async [METADATA_EDITING_PATCH_DATASET_ORGANIZATION]({ commit }, { stepKey, id, data }) {

    commit(METADATA_EDITING_PATCH_DATASET_OBJECT, stepKey);

    const apiKey = this.state.userSignIn.user?.apikey || null;

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
          populateEditingComponents(commit, response.data.result);
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

/**
 * doi actions to connect to the backend for the doi workflow
 *
 * @summary metadata store actions
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import axios from 'axios';

import {
  DOI_API_ACTIONS,
  DOI_PUBLISH,
  ACTION_DOI_PUBLISH,
  DOI_REQUEST,
  ACTION_DOI_REQUEST,
  DOI_RESERVE,
  ACTION_DOI_RESERVE,
  DOI_RESERVED_PROPERTY,
} from '@/modules/user/store/doiMutationsConsts';

import { urlRewrite } from '@/factories/apiFactory';
import { extractBodyIntoUrl } from '@/factories/stringFactory';
import { METADATA_EDITING_LOAD_DATASET } from '@/modules/user/store/userMutationsConsts';

const API_ROOT = import.meta.env.VITE_API_ROOT;
const API_DOI_BASE = import.meta.env.VITE_API_DOI_BASE_URL || '/doi-api/datacite/';

async function reloadMetadataForEditing(dispatch, metadataId) {
  await dispatch(METADATA_EDITING_LOAD_DATASET, { metadataId, forceBackendReload: true });
}

export default {
  async [DOI_API_ACTIONS]({ dispatch }, { data: { doiAction, metadataId } }) {
    await dispatch(doiAction, metadataId);
  },
  async [DOI_RESERVE]({ dispatch, commit }, metadataId) {
    commit(DOI_RESERVE, { key: DOI_RESERVED_PROPERTY });

    const actionUrl = ACTION_DOI_RESERVE();
    let url = extractBodyIntoUrl(actionUrl, { 'package-id': metadataId });
    url = urlRewrite(url, API_DOI_BASE, API_ROOT);

    try {
      const response = await axios.get(url);
      const result = response.data.result;
      const reservedDOI = result?.data?.id;

      // reload the metadata entry to get the changes to the publicationState
      await reloadMetadataForEditing(dispatch, metadataId);

      commit(`${DOI_RESERVE}_SUCCESS`, {
        key: DOI_RESERVED_PROPERTY,
        value: reservedDOI,
      });
    } catch (error) {
      commit(`${DOI_RESERVE}_ERROR`, error);
    }
  },
  async [DOI_REQUEST]({ dispatch, commit }, metadataId) {
    commit(DOI_REQUEST);

    const actionUrl = ACTION_DOI_REQUEST();
    let url = extractBodyIntoUrl(actionUrl, { 'package-id': metadataId });
    url = urlRewrite(url, API_DOI_BASE, API_ROOT);

    try {
      await axios.get(url);

      // reload the metadata entry to get the changes to the publicationState
      await reloadMetadataForEditing(dispatch, metadataId);

      commit(`${DOI_REQUEST}_SUCCESS`);
    } catch (error) {
      commit(`${DOI_REQUEST}_ERROR`, error);
    }
  },
  async [DOI_PUBLISH]({ dispatch, commit }, metadataId) {
    commit(DOI_PUBLISH);

    const actionUrl = ACTION_DOI_PUBLISH();
    let url = extractBodyIntoUrl(actionUrl, { 'package-id': metadataId });
    url = urlRewrite(url, API_DOI_BASE, API_ROOT);

    try {
      await axios.get(url);

      // reload the metadata entry to get the changes to the publicationState
      await reloadMetadataForEditing(dispatch, metadataId);

      commit(`${DOI_PUBLISH}_SUCCESS`);
    } catch (error) {
      commit(`${DOI_PUBLISH}_ERROR`, error);
    }
  },
};

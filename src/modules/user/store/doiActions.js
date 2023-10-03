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

const API_DOI_BASE = import.meta.env.VITE_API_DOI_BASE_URL;
const API_DOI_ROOT = import.meta.env.VITE_DOI_API_ROOT;

export default {
  async [DOI_API_ACTIONS]({ dispatch }, { data: { event, metadataId } }) {
    await dispatch(event, metadataId);
  },
  async [DOI_RESERVE]({ commit }, metadataId) {
    commit(DOI_RESERVE, { key: DOI_RESERVED_PROPERTY })

    const actionUrl = ACTION_DOI_RESERVE();
    let url = extractBodyIntoUrl(actionUrl, { 'package-id': metadataId });
    url = urlRewrite(url, API_DOI_BASE, API_DOI_ROOT);

    try {
      const response = await axios.get(url);
      const result = response.data.result;
      const reservedDOI = result?.data?.id;

      commit(`${DOI_RESERVE}_SUCCESS`, {
        key: DOI_RESERVED_PROPERTY,
        value: reservedDOI,
      });
    } catch(error) {
      commit(`${DOI_RESERVE}_ERROR`, error);
    }

  },
  async [DOI_REQUEST]({ commit }, metadataId) {
    commit(DOI_REQUEST)

    const actionUrl = ACTION_DOI_REQUEST();
    let url = extractBodyIntoUrl(actionUrl, { 'package-id': metadataId });
    url = urlRewrite(url, API_DOI_BASE, API_DOI_ROOT);

    try {
      await axios.get(url);
      commit(`${DOI_REQUEST}_SUCCESS`);
    } catch(error) {
      commit(`${DOI_REQUEST}_ERROR`, error);
    }

  },
  async [DOI_PUBLISH]({ commit }, metadataId) {
    commit(DOI_PUBLISH)

    const actionUrl = ACTION_DOI_PUBLISH();
    let url = extractBodyIntoUrl(actionUrl, { 'package-id': metadataId });
    url = urlRewrite(url, API_DOI_BASE, API_DOI_ROOT);

    try {
      await axios.get(url);
      commit(`${DOI_PUBLISH}_SUCCESS`);
    } catch(error) {
      commit(`${DOI_PUBLISH}_ERROR`, error);
    }

  },
}

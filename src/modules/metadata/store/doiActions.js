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
  DOI_PUBLISH,
  DOI_PUBLISH_ACTION,
  DOI_REQUEST,
  DOI_REQUEST_ACTION,
  DOI_RESERVE,
  DOI_RESERVE_ACTION, DOI_RESERVED_PROPERTY,
} from '@/modules/metadata/store/doiMutationsConsts';

import { urlRewrite } from '@/factories/apiFactory';
import { extractBodyIntoUrl } from '@/factories/stringFactory';

const API_ROOT = import.meta.env.VITE_API_ROOT;
const API_DOI_BASE = import.meta.env.VITE_API_DOI_BASE_URL || '/doi-api/datacite/';


export default {
  async [DOI_RESERVE]({ commit }, metadataId) {
    commit(DOI_RESERVE, { key: DOI_RESERVED_PROPERTY })

    const actionUrl = DOI_RESERVE_ACTION();
    let url = extractBodyIntoUrl(actionUrl, { 'package-id': metadataId });
    url = urlRewrite(url, API_DOI_BASE, API_ROOT);

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

    const actionUrl = DOI_REQUEST_ACTION();
    let url = extractBodyIntoUrl(actionUrl, { 'package-id': metadataId });
    url = urlRewrite(url, API_DOI_BASE, API_ROOT);

    try {
      const response = await axios.get(url);
      commit(`${DOI_REQUEST}_SUCCESS`, response.data.result);
    } catch(error) {
      commit(`${DOI_REQUEST}_ERROR`, error);
    }

  },
  async [DOI_PUBLISH]({ commit }, metadataId) {
    commit(DOI_PUBLISH)

    const actionUrl = DOI_PUBLISH_ACTION();
    let url = extractBodyIntoUrl(actionUrl, { 'package-id': metadataId });
    url = urlRewrite(url, API_DOI_BASE, API_ROOT);

    try {
      const response = await axios.get(url);
      commit(`${DOI_PUBLISH}_SUCCESS`, response.data.result);
    } catch(error) {
      commit(`${DOI_PUBLISH}_ERROR`, error);
    }

  },
}

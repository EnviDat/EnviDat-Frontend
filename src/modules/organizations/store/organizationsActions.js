/**
 * organizations store actions
 *
 * @summary organizations store actions
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51 
 * Last modified  : 2020-11-03 22:04:06
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import axios from 'axios';
import { urlRewrite } from '@/factories/apiFactory';

import {
  GET_ORGANIZATIONS,
  GET_ORGANIZATIONS_SUCCESS,
  GET_ORGANIZATIONS_ERROR,
} from './organizationsMutationsConsts';


const API_BASE = process.env.VUE_APP_API_BASE_URL || '/api/action/';
const ENVIDAT_PROXY = process.env.VUE_APP_ENVIDAT_PROXY;


export default {
  // eslint-disable-next-line no-unused-vars
  async [GET_ORGANIZATIONS]({ commit }) {
    commit(GET_ORGANIZATIONS);

    const url = urlRewrite(
      'organization_list?all_fields=true',
      API_BASE,
      ENVIDAT_PROXY,
    );

    // if (this.getters[`${METADATA_NAMESPACE}/metadatasContentSize`] === 0) {
    //   const metadataConfig = this.state.config.metadataConfig;
    //   await dispatch(`${METADATA_NAMESPACE}/${BULK_LOAD_METADATAS_CONTENT}`,
    //     metadataConfig,
    //     { root: true });
    // }

    // if (process.env.NODE_ENV === 'development') {
    //   url = './testdata/projects.json';
    // }

/*
    const localFileUrl = projectsConfig.localFileUrl;
    const loadLocalFile = projectsConfig.loadLocalFile;

    if (loadLocalFile && localFileUrl) {
      url = localFileUrl;
    }
*/

    await axios.get(url)
      .then((response) => {
        commit(GET_ORGANIZATIONS_SUCCESS, response.data.result);
      })
      .catch((reason) => {
        commit(GET_ORGANIZATIONS_ERROR, reason);
      });
  },
};

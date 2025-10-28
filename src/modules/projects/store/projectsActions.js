/**
 * projects store actions
 *
 * @summary projects store actions
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

import { ACTION_GET_PROJECTS, GET_PROJECTS, GET_PROJECTS_ERROR, GET_PROJECTS_SUCCESS } from './projectsMutationsConsts';

let API_BASE = '';
let API_ROOT = '';

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = import.meta.env?.VITE_API_BASE_URL;
  API_ROOT = import.meta.env?.VITE_API_ROOT;
}
export default {
  // eslint-disable-next-line no-unused-vars
  async [GET_PROJECTS]({ dispatch, commit }, projectsConfig = {}) {
    commit(GET_PROJECTS);

    let url = urlRewrite(ACTION_GET_PROJECTS(), API_BASE, API_ROOT);

    // if (this.getters[`${METADATA_NAMESPACE}/metadatasContentSize`] === 0) {
    //   const metadataConfig = this.state.config.metadataConfig;
    //   await dispatch(`${METADATA_NAMESPACE}/${BULK_LOAD_METADATAS_CONTENT}`,
    //     metadataConfig,
    //     { root: true });
    // }

    // if (import.meta.env?.MODE === 'development') {
    //   url = './testdata/projects.json';
    // }

    const localFileUrl = projectsConfig.localFileUrl;
    const loadLocalFile = projectsConfig.loadLocalFile;

    if (loadLocalFile && localFileUrl) {
      url = localFileUrl;
    }

    await axios
      .get(url)
      .then((response) => {
        commit(GET_PROJECTS_SUCCESS, response.data.result);
      })
      .catch((reason) => {
        commit(GET_PROJECTS_ERROR, reason);
      });
  },
};

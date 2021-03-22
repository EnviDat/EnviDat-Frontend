/**
 * projects store actions
 *
 * @summary projects store actions
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51 
 * Last modified  : 2019-11-20 14:52:54
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import axios from 'axios';


import {
  METADATA_NAMESPACE,
} from '@/store/metadataMutationsConsts';
import { urlRewrite } from '@/factories/apiFactory';

import {
  GET_PROJECTS,
  GET_PROJECTS_SUCCESS,
  GET_PROJECTS_ERROR,
} from './projectsMutationsConsts';

const API_BASE = '/api/action/';
const ENVIDAT_PROXY = process.env.VUE_APP_ENVIDAT_PROXY;


export default {
  async [GET_PROJECTS]({ dispatch, commit }) {
    commit(GET_PROJECTS);

    let url = urlRewrite(
      'group_list?all_fields=true&include_groups=true&include_extras=true&include_datasets=true',
      API_BASE,
      ENVIDAT_PROXY,
    );

    if (this.getters[`${METADATA_NAMESPACE}/metadatasContentSize`] === 0) {
      await dispatch(`${METADATA_NAMESPACE}/BULK_LOAD_METADATAS_CONTENT`, null, { root: true });      
    }

    if (process.env.NODE_ENV === 'development') {
      url = './testdata/projects.json';
    }

    await axios.get(url)
      .then((response) => {
        commit(GET_PROJECTS_SUCCESS, response.data.result);
      })
      .catch((reason) => {
        commit(GET_PROJECTS_ERROR, reason);
      });
  },
};

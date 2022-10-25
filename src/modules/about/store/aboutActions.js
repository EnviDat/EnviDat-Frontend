/**
 * about store actions
 *
 * @summary about store actions
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-10-23 16:34:51
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import axios from 'axios';

import {
  GET_DMP,
  GET_DMP_ERROR,
  GET_DMP_SUCCESS,
  GET_GUIDELINES,
  GET_GUIDELINES_ERROR,
  GET_GUIDELINES_SUCCESS,
  GET_POLICIES,
  GET_POLICIES_ERROR,
  GET_POLICIES_SUCCESS,
} from '@/modules/about/store/aboutMutationsConsts';

const staticRoot = import.meta.env.VITE_ENVIDAT_STATIC_ROOT;
const useTestdata = import.meta.env.VITE_USE_TESTDATA === 'true';

export default {
  [GET_GUIDELINES]({ commit }) {
    commit(GET_GUIDELINES);

    let url = `${staticRoot}/guidelines/guidelines.md?nocache=${new Date().getTime()}`;

    if (import.meta.env.DEV && useTestdata) {
      url = './testdata/guidelines.md';
    }

    axios.get(url)
      .then((response) => {
        commit(GET_GUIDELINES_SUCCESS, response.data);
      })
      .catch(reason => {
        commit(GET_GUIDELINES_ERROR, reason);
      });
  },
  [GET_POLICIES]({ commit }) {
    commit(GET_POLICIES);

    let url = `${staticRoot}/policies/policies.md?nocache=${new Date().getTime()}`;

    if (import.meta.env.DEV && useTestdata) {
      url = './testdata/policies.md';
    }

    axios
      .get(url)
      .then(response => {
        commit(GET_POLICIES_SUCCESS, response.data);
      })
      .catch(reason => {
        commit(GET_POLICIES_ERROR, reason);
      });
  },
  [GET_DMP]({ commit }) {
    commit(GET_DMP);

    let url = `${staticRoot}/guidelines/dmp.md?nocache=${new Date().getTime()}`;

    if (import.meta.env.DEV && useTestdata) {
      url = './testdata/dmp.md';
    }

    axios
      .get(url)
      .then(response => {
        commit(GET_DMP_SUCCESS, response.data);
      })
      .catch(reason => {
        commit(GET_DMP_ERROR, reason);
      });
  },
};

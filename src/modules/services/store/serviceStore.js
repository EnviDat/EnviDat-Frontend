/**
 * community store module
 *
 * @summary community vuex store
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import axios from 'axios';
import { getSpecificApiError } from '@/factories/notificationFactory';
import { ADD_USER_NOTIFICATION } from '@/store/mainMutationsConsts';
import {
  GET_SERVICE_LIST,
  GET_SERVICE_LIST_ERROR,
  GET_SERVICE_LIST_SUCCESS,
} from '@/modules/services/store/serviceMutationsConsts';

const serviceState = {
  loadingList: false,
  list: [],
};

const staticRoot = process.env.VITE_ENVIDAT_STATIC_ROOT;
const useTestdata = process.env.VITE_USE_TESTDATA === 'true';

export const service = {
  namespaced: true,
  state: serviceState,
  mutations: {
    [GET_SERVICE_LIST](state) {
      state.loadingList = true;
    },
    [GET_SERVICE_LIST_SUCCESS](state, payload) {
      state.list = payload;
      state.loadingList = false;
    },
    [GET_SERVICE_LIST_ERROR](state, reason) {
      state.loadingList = false;

      const details = 'An error occurred while loading the list of blog posts!';
      const errObj = getSpecificApiError(details, reason);

      this.commit(ADD_USER_NOTIFICATION, errObj);
    },
  },
  actions: {
    [GET_SERVICE_LIST]({ commit }) {
      commit(GET_SERVICE_LIST);

      let url = `${staticRoot}/service/servicelist.json?nocache=${new Date().getTime()}`;

      if (process.env.NODE_ENV === 'development' && useTestdata) {
        url = './testdata/servicelist.json';
      }

      axios.get(url)
        .then((response) => {
          commit(GET_SERVICE_LIST_SUCCESS, response.data);
        })
        .catch((reason) => {
          commit(GET_SERVICE_LIST_ERROR, reason);
        });
    },
  },
};

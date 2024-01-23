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
  GET_INTEGRATION_LIST,
  GET_INTEGRATION_LIST_ERROR,
  GET_INTEGRATION_LIST_SUCCESS,
} from '@/modules/integration/store/integrationMutationsConsts';

const integrationState = {
  loadingList: false,
  list: [],
};

const staticRoot = process.env.VITE_STATIC_ROOT;
const useTestdata = process.env.VITE_USE_TESTDATA === 'true';

export const integration = {
  namespaced: true,
  state: integrationState,
  mutations: {
    [GET_INTEGRATION_LIST](state) {
      state.loadingList = true;
    },
    [GET_INTEGRATION_LIST_SUCCESS](state, payload) {
      state.list = payload;
      state.loadingList = false;
    },
    [GET_INTEGRATION_LIST_ERROR](state, reason) {
      state.loadingList = false;

      const details = 'An error occurred while loading the list of blog posts!';
      const errObj = getSpecificApiError(details, reason);

      this.commit(ADD_USER_NOTIFICATION, errObj);
    },
  },
  actions: {
    [GET_INTEGRATION_LIST]({ commit }) {
      commit(GET_INTEGRATION_LIST);

      let url = `${staticRoot}/integration/integrationlist.json?nocache=${new Date().getTime()}`;

      if (import.meta.env?.DEV && useTestdata) {
        url = './testdata/integrationlist.json';
      }

      axios.get(url)
        .then((response) => {
          commit(GET_INTEGRATION_LIST_SUCCESS, response.data);
        })
        .catch((reason) => {
          commit(GET_INTEGRATION_LIST_ERROR, reason);
        });
    },
  },
};

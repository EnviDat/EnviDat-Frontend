/**
 * blog page store module
 *
 * @summary blog vuex store
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import axios from 'axios';
import { getSpecificApiError } from '@/factories/notificationFactory';
import { ADD_USER_NOTIFICATION } from '@/store/mainMutationsConsts';
import {
  GET_COMMUNITY_LIST,
  GET_COMMUNITY_LIST_ERROR,
  GET_COMMUNITY_LIST_SUCCESS,
} from '@/modules/community/store/communityMutationsConsts';

const community = {
  loadingList: false,
  list: [],
};

const staticRoot = process.env.VUE_APP_ENVIDAT_STATIC_ROOT;

export const blog = {
  namespaced: true,
  state: community,
  mutations: {
    [GET_COMMUNITY_LIST](state) {
      state.loadingList = true;
    },
    [GET_COMMUNITY_LIST_SUCCESS](state, payload) {
      state.list = payload;
      state.loadingList = false;
    },
    [GET_COMMUNITY_LIST_ERROR](state, reason) {
      state.loadingList = false;

      const details = 'An error occurred while loading the list of blog posts!';
      const errObj = getSpecificApiError(details, reason);

      this.commit(ADD_USER_NOTIFICATION, errObj);
    },
  },
  actions: {
    [GET_COMMUNITY_LIST]({ commit }) {
      commit(GET_COMMUNITY_LIST);

      const url = `${staticRoot}/community/communitylist.json?nocache=${new Date().getTime()}`;

      axios.get(url)
        .then((response) => {
          commit(GET_COMMUNITY_LIST_SUCCESS, response.data);
        })
        .catch((reason) => {
          commit(GET_COMMUNITY_LIST_ERROR, reason);
        });
    },
  },
};

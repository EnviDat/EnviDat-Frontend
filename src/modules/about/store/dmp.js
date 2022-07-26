/**
 * dmp store module
 *
 * @summary dmp store
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-10-23 16:34:51
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import axios from 'axios';

import { getSpecificApiError } from '@/factories/notificationFactory';
import {
  GET_DMP,
  GET_DMP_ERROR,
  GET_DMP_SUCCESS,
} from '@/modules/about/store/dmpMutationsConsts';
import { ADD_USER_NOTIFICATION } from '@/store/mainMutationsConsts';

const actions = {
  [GET_DMP]({ commit }) {
    commit(GET_DMP);

    let url = `${process.env.VITE_ENVIDAT_STATIC_ROOT}/guidelines/dmp.md?nocache=${new Date().getTime()}`;
    if (process.env.NODE_ENV === 'development') {
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

const mutations = {
  [GET_DMP](state) {
    state.loading = true;
  },
  [GET_DMP_SUCCESS](state, payload) {
    state.dmpMarkdown = payload;
    state.loading = false;
  },
  [GET_DMP_ERROR](state, reason) {
    state.loading = false;

    const details = 'An error occurred while loading the dmp infos!';
    const errObj = getSpecificApiError(details, reason);
    state.dmpMarkdown = `${details}: ${reason}`;

    if (import.meta.env.DEV) {
      state.dmpMarkdown +=
        ' \nThis is normal when developing locally on localhost:8080';
    }

    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
};

const dmpState = {
  dmpMarkdown: null,
  loading: false,
};

export const dmp = {
  namespaced: true,
  state: dmpState,
  getters: {
    dmpMarkdown: state => state.dmpMarkdown,
    loading: state => state.loading,
  },
  mutations,
  actions,
};

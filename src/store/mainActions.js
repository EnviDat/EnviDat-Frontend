/**
 * @summary main store actions
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51 
 * Last modified  : 2019-10-23 17:36:56
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import axios from 'axios';

import {
  SET_CONFIG,
  SET_CONFIG_SUCCESS,
  SET_CONFIG_ERROR,
  CHECK_FRONTEND_VERSION,
} from '@/store/mainMutationsConsts';

const configURL = process.env.VUE_APP_CONFIG_URL;

export default {
  [SET_CONFIG]({ commit }) {
    if (configURL && configURL !== 'NULL') {
      const url = `${configURL}?nocache=${new Date().getTime()}`;

      axios.get(url)
        .then((response) => {
          try {
            let config;
            if (typeof (response.data) === 'string') {
              config = JSON.parse(response.data);
            } else {
              config = response.data;
            }

            commit(SET_CONFIG_SUCCESS, config);

            if (config.version) {
              commit(CHECK_FRONTEND_VERSION, config.version);
            }
          } catch (error) {
            console.error(`tried loading config, error: ${error}`);
          }
        })
        .catch((reason) => {
          commit(SET_CONFIG_ERROR, reason);
        });
    }
  },
};

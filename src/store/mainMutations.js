/* eslint-disable no-underscore-dangle */
/**
 * @summary main store mutations
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-11-03 12:32:35
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { getSpecificApiError } from '@/factories/notificationFactory';

import categoryCards from '@/store/categoryCards';

import {
  ADD_USER_NOTIFICATION,
  CHECK_FRONTEND_VERSION,
  HIDE_NOTIFICATIONS,
  SET_APP_BACKGROUND,
  SET_APP_SCROLL_POSITION,
  SET_BROWSE_SCROLL_POSITION,
  SET_CONFIG,
  SET_CONFIG_ERROR,
  SET_CONFIG_SUCCESS,
  SET_CONTROLS,
  SET_CURRENT_PAGE,
  SET_JPG_ASSETS,
  SET_WEBP_ASSETS,
  SET_WEBP_SUPPORT,
  TRIM_NOTIFICATIONS,
} from './mainMutationsConsts';

function disablingCategoryCards(config) {
  const signinDisabled = config?.maintenanceConfig?.signinDisabled || false;

  if (signinDisabled) {
    for (let i = 0; i < categoryCards.length; i++) {
      const card = categoryCards[i];
      const cardType = card.type.toLowerCase();

      if (cardType.includes('login') || cardType.includes('signin')) {
        card.disabled = true;
      }
    }
  }
}

export default {
  [SET_APP_BACKGROUND](state, bgImg) {
    console.log('dentro store');
    state.appBGImage = bgImg;
  },
  [SET_WEBP_SUPPORT](state, isSupported) {
    state.webpIsSupported = isSupported;
  },
  [SET_WEBP_ASSETS](state, assets) {
    state.webpAssets = assets;
  },
  [SET_JPG_ASSETS](state, assets) {
    state.jpgAssets = assets;
  },
  [SET_CURRENT_PAGE](state, page) {
    state.currentPage = page;
  },
  [SET_CONTROLS](state, payload) {
    state.controls = payload;
  },
  [SET_APP_SCROLL_POSITION](state, payload) {
    state.appScrollPosition = payload;
  },
  [SET_BROWSE_SCROLL_POSITION](state, payload) {
    state.browseScrollPosition = payload;
  },
  [SET_CONFIG](state) {
    state.loadingConfig = false;
  },
  [SET_CONFIG_SUCCESS](state, payload) {
    state.loadingConfig = false;
    state.config = payload;

    disablingCategoryCards(state.config);
  },
  [SET_CONFIG_ERROR](state, reason) {
    state.loadingConfig = true;
    const notificationObj = getSpecificApiError(
      'Config could not be loaded!',
      reason,
    );
    this.commit(ADD_USER_NOTIFICATION, notificationObj);
  },
  [CHECK_FRONTEND_VERSION](state, version) {
    if (version > import.meta.env.VITE_VERSION) {
      state.outdatedVersion = true;
      state.newVersion = version;
    }
  },
  [TRIM_NOTIFICATIONS](state) {
    if (!state.notifications) return;

    const keys = Object.keys(state.notifications);
    const trimedNots = {};

    for (let i = 0; i < state.maxNotifications; i++) {
      const k = keys[i];
      trimedNots[k] = state.notifications[k];
    }

    state.notifications = trimedNots;
  },
  [HIDE_NOTIFICATIONS](state, key) {
    if (!state.notifications || !state.notifications[key]) return;

    state.notifications[key].show = false;
  },
  [ADD_USER_NOTIFICATION](state, notificationObj) {
    const key = `${notificationObj.message}_${notificationObj.details.length}`;
    notificationObj.key = key;

    if (!state.notifications[key]) {
      state.notifications[key] = notificationObj;
    } else {
      const existingNotification = state.notifications[key];
      if (existingNotification.details !== notificationObj.details) {
        state.notifications[key] = notificationObj;
      }
    }
  },
};

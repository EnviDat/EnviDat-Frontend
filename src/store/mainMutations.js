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

import { Object } from 'core-js';
import { getSpecificApiError } from '@/factories/notificationFactory';
import globalMethods from '@/factories/globalMethods';

import {
  SET_APP_BACKGROUND,
  SET_WEBP_SUPPORT,
  SET_WEBP_ASSETS,
  SET_CARD_IMAGES,
  UPDATE_CATEGORYCARD_IMAGES,
  SET_CURRENT_PAGE,
  ADD_CARD_IMAGES,
  ADD_ICON_IMAGE,
  SET_CONTROLS,
  SET_APP_SCROLL_POSITION,
  SET_BROWSE_SCROLL_POSITION,
  SET_CONFIG,
  SET_CONFIG_SUCCESS,
  SET_CONFIG_ERROR,
  CHECK_FRONTEND_VERSION,
  ADD_USER_NOTIFICATION,
  TRIM_NOTIFICATIONS,
  HIDE_NOTIFICATIONS,
} from './mainMutationsConsts';

function disablingCategoryCards(config, categoryCards) {
  if (!categoryCards) {
    return;
  }

  const signinDisabled = config && config.maintenanceConfig && config.maintenanceConfig.signinDisabled;

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
    state.appBGImage = bgImg;
  },
  [SET_WEBP_SUPPORT](state, isSupported) {
    state.webpIsSupported = isSupported;
  },
  [SET_WEBP_ASSETS](state, assets) {
    state.webpAssets = assets;
  },
  [SET_CARD_IMAGES](state, assets) {
    state.cardBGImages = assets;
  },
  [UPDATE_CATEGORYCARD_IMAGES](state) {
    // enhance the category cards dynamically with either webp or jpg images based
    // on what the browser supports
    const updatedCards = [];

    for (let i = 0; i < state.categoryCards.length; i++) {
      const cardInfo = state.categoryCards[i];
      cardInfo.img = globalMethods.methods.mixinMethods_getWebpImage(cardInfo.imgPath, state);
      updatedCards.push(cardInfo);
    }

    this._vm.$set(state, 'categoryCards', updatedCards);
  },
  [SET_CURRENT_PAGE](state, page) {
    state.currentPage = page;
  },
  [ADD_CARD_IMAGES](state, payload) {
    // state.cardBGImages[payload.key] = payload.value;
    this._vm.$set(state.cardBGImages, payload.key, payload.value);
  },
  [ADD_ICON_IMAGE](state, payload) {
    // state.cardBGImages[payload.key] = payload.value;
    this._vm.$set(state.iconImages, payload.key, payload.value);
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

    disablingCategoryCards(state.config, state.categoryCards);
  },
  [SET_CONFIG_ERROR](state, reason) {
    state.loadingConfig = true;
    const notificationObj = getSpecificApiError('Config could not ge loaded!', reason);
    this.commit(ADD_USER_NOTIFICATION, notificationObj);
  },
  [CHECK_FRONTEND_VERSION](state, version) {
    if (version > process.env.VUE_APP_VERSION) {
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
      this._vm.$set(state.notifications, key, notificationObj);
    } else {
      const existingNotification = state.notifications[key];
      if (existingNotification.details !== notificationObj.details) {
        this._vm.$set(state.notifications, key, notificationObj);
      }
    }
  },
};

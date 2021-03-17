/**
 * main vuex store module it contains all other store modules.
 *
 * @summary main vuex store
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-11-24 13:36:23
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import Vue from 'vue';
import Vuex from 'vuex';
import createPersist from 'vuex-localstorage';

import { about } from '@/modules/about/store/aboutStore';
import { projects } from '@/modules/projects/store/projectsStore';
import { metadata } from '@/modules/metadata/store/metadataStore';

import mutations from '@/store/mainMutations';
import actions from '@/store/mainActions';

import {
  SET_WEBP_SUPPORT,
  SET_WEBP_ASSETS,
  SET_CARD_IMAGES,
  UPDATE_CATEGORYCARD_IMAGES,
} from '@/store/mainMutationsConsts';

import { checkWebpFeatureAsync } from '@/factories/enhancementsFactory';
import { getCardBackgrounds } from '@/factories/metaDataFactory';

import { LISTCONTROL_MAP_ACTIVE } from '@/store/metadataMutationsConsts';
import globalMethods from '@/factories/globalMethods';
import categoryCards from './categoryCards';

const errReport = process.env.VUE_APP_ERROR_REPORTING_ENABLED;
// the check for 'NULL' is needed because simply nothing will not work
let errorReportingEnabled = false;

if (typeof errReport === 'string') {
  errorReportingEnabled = errReport.toLowerCase() === 'true';
}

const jpgAssetPaths = require.context('../assets/', true, /\.jpg$/);
const jpgAssets = globalMethods.methods.mixinMethods_importImages(jpgAssetPaths);

const iconImgPath = require.context('../assets/icons/', false, /\.png$/);
const iconImages = globalMethods.methods.mixinMethods_importImages(iconImgPath);

Vue.use(Vuex);

const initialState = {
  webpIsSupported: false,
  currentPage: '',
  // use a './' before the img for the img name for the local path
  appBGImage: '',
  webpAssets: null,
  jpgAssets,
  cardBGImages: null,
  iconImages,
  /**
   * static category cards for the suggestions of search categories
   */
  categoryCards,
  /**
   * default "list controls" for the metdata list
   */
  defaultControls: [LISTCONTROL_MAP_ACTIVE],
  appScrollPosition: 0,
  browseScrollPosition: 0,
  outdatedVersion: false,
  newVersion: process.env.VUE_APP_VERSION,
  // config can be overloaded from the backend
  loadingConfig: false,
  config: { errorReportingEnabled },
  notifications: {},
  maxNotifications: 6,
};

const store = new Vuex.Store({
  strict: true,
  state: initialState,
  getters: {
    currentPage: state => state.currentPage,
    appBGImage: state => state.appBGImage,
    cardBGImages: state => state.cardBGImages,
    iconImages: state => state.iconImages,
    aboutText: state => state.aboutText,
    defaultControls: state => state.defaultControls,
    appScrollPosition: state => state.appScrollPosition,
    browseScrollPosition: state => state.browseScrollPosition,
    outdatedVersion: state => state.outdatedVersion,
    newVersion: state => state.newVersion,
    config: state => state.config,
    notifications: state => state.notifications,
    maxNotifications: state => state.maxNotifications,
  },
  mutations,
  actions,
  modules: {
    metadata,
    about,
    projects,
  },
});

function loadImages(isSupported = false) {

  store.commit(SET_WEBP_SUPPORT, isSupported);

  const cardBGImages = getCardBackgrounds(isSupported);

  if (cardBGImages) {
    store.commit(SET_CARD_IMAGES, cardBGImages);
  }

  const webpAssetPaths = isSupported ? require.context('../assets/', true, /\.webp$/) : null;
  const webpAssets = webpAssetPaths ? globalMethods.methods.mixinMethods_importImages(webpAssetPaths) : null;
  if (webpAssets) {
    store.commit(SET_WEBP_ASSETS, webpAssets);
  }

  store.commit(UPDATE_CATEGORYCARD_IMAGES);

}

if (process.env.NODE_ENV === 'test') {
  loadImages();
} else {
  checkWebpFeatureAsync('lossy', (feature, isSupported) => {
    loadImages(isSupported);
  });

  const persistPlugin = createPersist({
    namespace: 'metadata',
    // using this.state seems to prevent a double allocation of the metadata.state
    // but the whole state is part of the localStorage (sessionStorage)
    initialState: store.state.metadata,
    // use sessionStorage which expires once the browser is closed
    provider: sessionStorage,
    // ONE_WEEK
    // expires: 7 * 24 * 60 * 60 * 1e3,
  });

  store.plugins = [persistPlugin];
}


export default store;

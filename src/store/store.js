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

import {
  checkWebpFeatureAsync,
  loadImages,
} from '@/factories/enhancementsFactory';
import globalMethods from '@/factories/globalMethods';
import { about } from '@/modules/about/store/aboutStore';
import { blog } from '@/modules/blog/store/blogStore';
import { geoservices } from '@/modules/metadata/components/Geoservices/geoservicesStore';
import { metadata } from '@/modules/metadata/store/metadataStore';
import { organizations } from '@/modules/organizations/store/organizationsStore';
import { projects } from '@/modules/projects/store/projectsStore';
import { userSignIn } from '@/modules/user/store/userSignInStore';
import { user } from '@/modules/user/store/userStore';
import localStoragePlugin from '@/store/localStorage';
import actions from '@/store/mainActions';
import mutations from '@/store/mainMutations';
import { LISTCONTROL_MAP_ACTIVE } from '@/store/metadataMutationsConsts';

import categoryCards from './categoryCards';

const jpgAssetPaths = import.meta.glob('../assets/*.jpg');
const jpgAssets = globalMethods.methods.mixinMethods_importImages(jpgAssetPaths);

const iconImgPath = import.meta.glob('../assets/icons/*.png');
const iconImages = globalMethods.methods.mixinMethods_importImages(iconImgPath);

/*
const errReport = import.meta.env.VITE_ERROR_REPORTING_ENABLED;
// the check for 'NULL' is needed because simply nothing will not work
let errorReportingEnabled = false;

if (typeof errReport === 'string') {
  errorReportingEnabled = errReport.toLowerCase() === 'true';
}
*/

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
  newVersion: import.meta.env.VITE_VERSION,
  // config can be overloaded from the backend
  loadingConfig: false,
  config: {},
  notifications: {},
  maxNotifications: 6,
};

const modules = {
  metadata,
  about,
  projects,
  geoservices,
  user,
  userSignIn,
  organizations,
  blog,
};

function createStore() {
  return new Vuex.Store({
    strict: true,
    state: initialState,
    getters: {
      currentPage: state => state.currentPage,
      appBGImage: state => state.appBGImage,
      cardBGImages: state => state.cardBGImages,
      iconImages: state => state.iconImages,
      aboutText: state => state.aboutText,
      categoryCards: state => state.categoryCards,
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
    modules,
    plugins: [localStoragePlugin.plugin],
  });
}

// eslint-disable-next-line import/no-mutable-exports
let store = null;

try {
  store = createStore();
} catch (e) {
  if (e instanceof SyntaxError) {
    // if there is an error for the initial loading
    // Syntax Error from parsing the json

    console.log('restoreState error');
    console.log(e);

    // clear it to make sure the app boots with a clean state
    window.localStorage.clear();

    console.info('cleared local storage');

    store = createStore();
  }
}

if (import.meta.env.NODE_ENV === 'test') {
  loadImages(store);
} else {
  checkWebpFeatureAsync('lossy', (feature, isSupported) => {
    loadImages(store, isSupported);
  });
}

export default store;

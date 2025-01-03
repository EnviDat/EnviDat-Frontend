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

import Vuex from 'vuex';

import { metadata } from '@/modules/metadata/store/metadataStore';
import { user } from '@/modules/user/store/userStore';
import { userSignIn } from '@/modules/user/store/userSignInStore';
import { matomo } from '@/modules/matomo/store/matomoStore';

import mutations from '@/store/mainMutations';
import actions from '@/store/mainActions';

import { LISTCONTROL_MAP_ACTIVE } from '@/store/metadataMutationsConsts';

import { importStoreModule } from '@/factories/enhancementsFactory';


import categoryCards from './categoryCards';

const moduleImportMap = {
  metadata: () => import('@/modules/metadata/store/metadataStore'),
  user: () => import('@/modules/user/store/userStore'),
  userSignIn: () => import('@/modules/user/store/userSignInStore'),
  blog: () => import('@/modules/blog/store/blogStore'),
  integration: () => import('@/modules/integration/store/integrationStore'),
  service: () => import('@/modules/services/store/serviceStore'),
  projects: () => import('@/modules/projects/store/projectsStore'),
}

/*
const errReport = process.env.VITE_ERROR_REPORTING_ENABLED;
// the check for 'NULL' is needed because simply nothing will not work
let errorReportingEnabled = false;

if (typeof errReport === 'string') {
  errorReportingEnabled = errReport.toLowerCase() === 'true';
}
*/

let storeRef;

const initialState = {
  appBGImage: '',
  currentPage: '',
  /**
   * default "list controls" for the metdata list
   */
  categoryCards,
  defaultControls: [LISTCONTROL_MAP_ACTIVE],
  appScrollPosition: 0,
  browseScrollPosition: 0,
  outdatedVersion: false,
  newVersion: process.env.VITE_VERSION,
  // config can be overloaded from the backend
  loadingConfig: false,
  config: {},
  notifications: {},
  maxNotifications: 6,
  asyncLoadStoreModule: async (module) => {
    const importFun = moduleImportMap[module];

    if (!importFun) {
      throw new Error(`Error lazyLoadStoreModule, not import defined for ${module}`);
    }

    return importStoreModule(storeRef, module, importFun);
  },
};

const preloadedModules = {
  metadata,
  user,
  userSignIn,
  matomo,
};

function createStore() {
  return new Vuex.Store({
    // strict is for getting error about the state mutations outside of mutations
    // is very performance heavy, don't use it in production!
    strict: false, // process.env.NODE_ENV !== 'production',
    state: initialState,
    getters: {
      appBGImage: state => state.appBGImage,
      currentPage: state => state.currentPage,
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
    modules: preloadedModules,
    plugins: [],
  });
}

// eslint-disable-next-line import/no-mutable-exports
let store;

try {
  store = createStore();
  storeRef = store

} catch (e) {
  if (e instanceof SyntaxError) {
    // if there is an error for the initial loading
    // Syntax Error from parsing the json

    console.error('restoreState error');
    console.error(e);

    store = createStore();
    storeRef = store;
  } else {
    console.error(e);
  }
}


export default store;

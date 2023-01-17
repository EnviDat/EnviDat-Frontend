// noinspection JSUnusedGlobalSymbols
/* eslint-disable object-property-newline */
/* eslint-disable import/no-extraneous-dependencies */
/**
 * @summary story of all the Navigation components for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-08-12 15:40:12
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import TheNavigation from '@/components/Navigation/TheNavigation.vue';
import TheNavigationToolbar from '@/components/Navigation/TheNavigationToolbar.vue';

import { SWISSFL_MODE } from '@/store/metadataMutationsConsts';

import {
  navigationItems,
  userMenuItems,
} from '@/store/navigationState';

import { NAVIGATION_VIEWS } from './storybookFolder';

const dominikHaas = {
  fullName: 'Dominik Haas',
  email: 'dominik.haas@wsl.ch',
  firstName: 'dominik',
  lastName: 'Haas',
  id: '929b0bc7-bfe7-4248-b90c-21f547ffe9d9',
};

/*
const methods = {
  onMenuClick: action('clicked on menu'),
  onSearchClick: action('clicked on search'),
  onLoginClick: action('clicked on login'),
};
*/
const appVersion = import.meta.env.VITE_VERSION;

export default {
  title: `${NAVIGATION_VIEWS} / Redesigned Navigation`,
  decorators: [],
  parameters: {},
};

export const Menu = () => ({
  components: { TheNavigation },
  template: `
  <v-container>
    <the-navigation :navigationItems="navigationItems"
                    :version="appVersion" />

    <p v-for="(item, index) in navigationItems"
        :key="index"
        v-show="item.active"
        style="margin: 100px;" >
      {{ item.title }}
    </p>
  </v-container>
  `,
  data: () => ({
    navigationItems,
    appVersion,
  }),
  // methods,
});

export const ToolbarwithMode = () => ({
  components: { TheNavigationToolbar },
  template: `
      <the-navigation-toolbar :mode="SWISSFL_MODE"
            />`,
  // methods,
  data: () => ({
    SWISSFL_MODE,
  }),
});

export const ToolbarSignedin = () => ({
  components: { TheNavigationToolbar },
  template: `
    <the-navigation-toolbar :signedInUser="dominikHaas"
                            :userNavigationItems="userMenuItems"
          />`,
  // methods,
  data: () => ({
    dominikHaas,
    userMenuItems,
  }),
});

export const MenuAndToolbar = () => ({
  components: { TheNavigation, TheNavigationToolbar },
  template: `
    <div>
      <the-navigation :navigationItems="navigationItems" />

      <the-navigation-toolbar :signedInUser="dominikHaas"
                              :userNavigationItems="userMenuItems" />
    </div>
  `,
  data: () => ({
    dominikHaas,
    navigationItems,
    userMenuItems,
  }),
  // methods,
});

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

// /* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import TheNavigation from '@/components/Navigation/TheNavigation.vue';
import TheNavigationToolbar from '@/components/Navigation/TheNavigationToolbar.vue';

import { SWISSFL_MODE } from '@/store/metadataMutationsConsts';

import {
  navigationItems,
  userMenuItems,
} from '@/store/navigationState';

const dominikHaas = {
  fullname: 'Haas', apikey: 'a_secrect_thing', email: 'dominik.haas@wsl.ch', name: 'dominik', id: '929b0bc7-bfe7-4248-b90c-21f547ffe9d9',
};

const methods = {
  onMenuClick: action('clicked on menu'),
  onSearchClick: action('clicked on search'),
  onLoginClick: action('clicked on login'),
};
const appVersion = process.env.VUE_APP_VERSION;


storiesOf('5 Navigation / Redesigned Navigation', module)
  .add('Menu', () => ({
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
  methods,
}))
.add('Toolbar with Mode', () => ({
  components: { TheNavigationToolbar },
  template: `
      <the-navigation-toolbar :mode="SWISSFL_MODE"
                              v-on:menuClick="onMenuClick"
                              v-on:searchClick="onSearchClick"
                              v-on:loginClick="onLoginClick"
            />`,
  methods,
  data: () => ({
    SWISSFL_MODE,
  }),
}))
.add('Toolbar signed in', () => ({
  components: { TheNavigationToolbar },
  template: `
    <the-navigation-toolbar :signedInUser="dominikHaas"
                            :userNavigationItems="userMenuItems"
                            v-on:menuClick="onMenuClick"
                            v-on:searchClick="onSearchClick"
                            v-on:loginClick="onLoginClick"
          />`,
  methods,
  data: () => ({
    dominikHaas,
    userMenuItems,
  }),
}))
.add('Menu & Toolbar', () => ({
  components: { TheNavigation, TheNavigationToolbar },
  template: `
    <the-navigation :navigationItems="navigationItems" />

    <the-navigation-toolbar :signedInUser="dominikHaas"
                            :userNavigationItems="userMenuItems"
                            v-on:menuClick="onMenuClick"
                            v-on:searchClick="onSearchClick"
                            v-on:loginClick="onLoginClick" />
  `,
  data: () => ({
    dominikHaas,
    navigationItems,
    userMenuItems,
  }),  
  methods,
}));

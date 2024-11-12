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

import {
  navigationItems,
  userMenuItems,
} from '@/store/navigationState';


const dominikHaas = {
  fullName: 'Dominik Haas',
  email: 'dominik.haas@wsl.ch',
  firstName: 'dominik',
  lastName: 'Haas',
  id: '929b0bc7-bfe7-4248-b90c-21f547ffe9d9',
};

const appVersion = import.meta.env.VITE_VERSION;

export default {
  title: '5 Navigation / Navigation',
  component: TheNavigation,
};

export const Empty = { args: {} };



export const Menu = {
  args: {
    navigationItems,
    version: appVersion,
  },
};


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
});

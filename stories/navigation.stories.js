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

import { navigationItems, useUserMenuItems } from '@/store/navigationState';

import TextBanner from '@/components/Layouts/TextBanner.vue';
import BaseCitationView from '@/components/BaseElements/BaseCitationView.vue';
import relatedPublicCitationTesting from './js/relatedPublicCitation';

const dominikHaas = {
  fullName: 'Dominik Haas',
  email: 'dominik.haas@wsl.ch',
  firstName: 'dominik',
  lastName: 'Haas',
  id: '929b0bc7-bfe7-4248-b90c-21f547ffe9d9',
};

const appVersion = import.meta.env.VITE_VERSION;

const keys = Object.keys(relatedPublicCitationTesting);

const pubCitation = relatedPublicCitationTesting[keys[1]];

const citation = {
  citation: pubCitation.citation.WSL,
  abstract: pubCitation.abstract,
  doi: pubCitation.doi,
  doiUrl: `https://www.doi.org/${pubCitation.doi}`,
};

export default {
  title: '5 Navigation / Menu And Toolbar',
  component: TheNavigation,
};

export const Empty = { args: {} };

export const Menu = {
  args: {
    navigationItems,
    version: appVersion,
  },
};

const changeMainLayout = (parentRefs) => {
  let currentStyle =
    parentRefs['storyWrapper--v-main'].$el.getAttribute('style');
  // console.log('navigationStory refs currentStyle', currentStyle);
  currentStyle += '--v-layout-left: 60px !important;';
  // currentStyle = currentStyle.replace('--v-layout-left: 0px;', '--v-layout-left: 60px !important;');
  parentRefs['storyWrapper--v-main'].$el.setAttribute('style', currentStyle);
  // console.log('new style', parentRefs['storyWrapper--v-main'].$el.getAttribute('style'));
};

export const MenuAndToolbar = () => ({
  components: { TheNavigation, TheNavigationToolbar },
  template: `
    <!--  teleport to the storybookHead which is defined in the StoryWrapper.vue -->
    <teleport defer to=".v-application__wrap">
      <the-navigation :navigationItems="navigationItems" />

      <the-navigation-toolbar :signedInUser="dominikHaas"
                              :userNavigationItems="userMenuItems" />
    </teleport>

    <v-container fluid style="position: relative;">
      <v-row style="height: 100vh;">
        <v-col>
          Page content stuff
        </v-col>
      </v-row>
    </v-container>
  `,
  inject: ['getStorybookAppRefs'],
  mounted() {
    setTimeout(() => {
      const parentRefs = this.getStorybookAppRefs();
      this.changeMainLayout(parentRefs);
    }, 500);
  },
  methods: {
    changeMainLayout,
  },
  data: () => ({
    dominikHaas,
    navigationItems,
    userMenuItems: useUserMenuItems(),
  }),
});

export const MenuToolbarAndBanners = () => ({
  components: { TheNavigation, TheNavigationToolbar, TextBanner },
  template: `
    <!--  teleport to the storybookHead which is defined in the StoryWrapper.vue -->
      <teleport defer to=".v-application__wrap">
        <the-navigation :navigationItems="navigationItems" />

        <the-navigation-toolbar :signedInUser="dominikHaas"
                                :userNavigationItems="userMenuItems" />
      </teleport>

      <v-container
          fluid
          style="position: relative"
      >
        <v-row style="height: 100vh;">
          <v-col>
            Page content stuff
          </v-col>
        </v-row>

        <TextBanner
            style="position: absolute; top: 0; left: 0; z-index: 1101; width: 100%; background-color: orange;"
            title="Maintenance Message"
            text="On Wednesday 29th March, between 9 and 12, EnviDat is undergoing the planned annual physical checkup. EnviDat can be accessed in <strong>read-only mode</strong>. Data download, upload and <strong>user data management functionalities will be disabled</strong>."
            confirm-text="Okay"
        />

        <TextBanner
            id="cookieBanner"
            style="position: absolute; bottom: 0; left: 0; z-index: 1101; width: 100%; background-color: lightseagreen;"
            text="On envidat.ch, cookies are used to enhance your experience and provide features when you're signed in. These cookies are 'technical only' and we ANONYMOUSLY track usage (e.g. page views and downloads)."
            icon="cookie"
            deniedText="Okay"
        />

      </v-container>
  `,
  inject: ['getStorybookAppRefs'],
  mounted() {
    setTimeout(() => {
      const parentRefs = this.getStorybookAppRefs();
      this.changeMainLayout(parentRefs);
    }, 500);
  },
  methods: {
    changeMainLayout,
  },
  data: () => ({
    storybookAppRefs: null,
    dominikHaas,
    navigationItems,
    userMenuItems: useUserMenuItems(),
  }),
});

export const MenuToolbarAndCitation = () => ({
  components: { TheNavigation, TheNavigationToolbar, BaseCitationView },
  template: `
    <!--  teleport to the storybookHead which is defined in the StoryWrapper.vue -->
      <teleport defer to=".v-application__wrap">
        <the-navigation :navigationItems="navigationItems" />

        <the-navigation-toolbar :signedInUser="dominikHaas"
                                :userNavigationItems="userMenuItems" />
      </teleport>

      <v-container
          fluid
          style="position: relative"
      >
        <v-row style="height: 100vh;">
          <v-col>
            <BaseCitationView v-bind="citation" />
          </v-col>
        </v-row>

      </v-container>
  `,
  inject: ['getStorybookAppRefs'],
  mounted() {
    setTimeout(() => {
      const parentRefs = this.getStorybookAppRefs();
      this.changeMainLayout(parentRefs);
    }, 500);
  },
  methods: {
    changeMainLayout,
  },
  data: () => ({
    storybookAppRefs: null,
    dominikHaas,
    navigationItems,
    userMenuItems: useUserMenuItems(),
    citation,
  }),
});

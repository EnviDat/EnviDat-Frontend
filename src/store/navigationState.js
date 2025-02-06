/* eslint-disable object-curly-newline */

import {
  BROWSE_PATH,
  BROWSE_PAGENAME,
  PROJECTS_PATH,
  PROJECTS_PAGENAME,
  PROJECT_DETAIL_PAGENAME,
  ABOUT_PATH,
  ABOUT_PAGENAME,
  USER_SIGNOUT_PATH,
  USER_DASHBOARD_PAGENAME,
  USER_DASHBOARD_PATH,
  BLOG_PATH,
  BLOG_PAGENAME,
  INTEGRATION_PATH,
  INTEGRATION_PAGENAME,
  SERVICE_PATH,
  SERVICE_PAGENAME, ORGANIZATIONS_PATH, ORGANIZATIONS_PAGENAME,
} from '@/router/routeConsts';

import {
  mdiEarth, mdiBookOpenPageVariant, mdiPencilRuler, mdiFileTree, mdiLibraryShelves,
  mdiMagnify, mdiMenuRight, mdiPound, mdiInformation, mdiBookshelf, mdiAccountArrowRight,
} from '@mdi/js';

// const domain = import.meta.env.VITE_DOMAIN;
const appVersion = import.meta.env.VITE_VERSION;

export const navigationItems = [
  // { title: 'Home', icon: 'envidat', toolTip: 'Back to the start page', active: false, path: LANDING_PATH, pageName: LANDING_PAGENAME },
  {
    title: 'Explore',
    icon: mdiMagnify,
    toolTip: 'Explore research data',
    active: false,
    path: BROWSE_PATH,
    pageName: BROWSE_PAGENAME,
    disabled: false,
  },
  {
    title: 'Projects',
    icon: mdiLibraryShelves,
    toolTip: 'Overview of the research projects on Envidat',
    active: false,
    path: PROJECTS_PATH,
    pageName: PROJECTS_PAGENAME,
    subpages: [PROJECT_DETAIL_PAGENAME],
    disabled: false,
  },
  {
    title: 'Organizations',
    icon: mdiFileTree,
    toolTip: 'Overview of the organizations of WSL',
    active: false,
    path: ORGANIZATIONS_PATH,
    pageName: ORGANIZATIONS_PAGENAME,
    disabled: false,
  },
  {
    title: 'Tools & Services',
    icon: mdiPencilRuler,
    toolTip: 'Research data tools and services',
    active: false,
    path: SERVICE_PATH,
    pageName: SERVICE_PAGENAME,
    disabled: false,
  },
  {
    title: 'Integrations',
    icon: mdiEarth,
    toolTip: 'EnviDat is integrated in the various research data platforms',
    active: false,
    path: INTEGRATION_PATH,
    pageName: INTEGRATION_PAGENAME,
    disabled: false,
  },
  {
    title: 'Blog',
    icon: mdiBookOpenPageVariant,
    toolTip: 'News and articles from the EnviDat team',
    active: false,
    path: BLOG_PATH,
    pageName: BLOG_PAGENAME,
    disabled: false,
  },
  {
    title: 'About',
    icon: mdiInformation,
    toolTip: 'Information about EnviDat',
    active: false,
    path: ABOUT_PATH,
    pageName: ABOUT_PAGENAME,
    disabled: false,
  },
  {
    title: `Version: ${appVersion}`,
    icon: mdiPound,
    toolTip: `Version: ${appVersion}`,
    active: false,
    path: '',
    pageName: '',
    disabled: false,
  },
  {
    // title: 'Menu',
    icon: mdiMenuRight,
    active: false,
    disabled: false,
    isMenuIcon: true,
  },
];

export const userMenuItems = [
  { title: 'Dashboard', icon: mdiBookshelf, toolTip: 'My Dashboard', active: false, path: USER_DASHBOARD_PATH, pageName: USER_DASHBOARD_PAGENAME },
  // { title: 'Create Dataset', icon: 'add_cricle_outline', toolTip: 'Create a new dataset', active: false, path: 'createDataset', pageName: 'CreateDataset' },
  // { title: 'Edit Profile', icon: 'edit', toolTip: 'Edit profile', active: false, path: 'profile', pageName: 'EditProfile' },
  { title: 'Sign out', icon: mdiAccountArrowRight , toolTip: 'Sign out', active: false, path: USER_SIGNOUT_PATH, pageName: '' },
];

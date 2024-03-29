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
  SERVICE_PAGENAME,
} from '@/router/routeConsts';

const domain = import.meta.env.VITE_DOMAIN;

export const navigationItems = [
  // { title: 'Home', icon: 'envidat', toolTip: 'Back to the start page', active: false, path: LANDING_PATH, pageName: LANDING_PAGENAME },
  {
    title: 'Explore',
    icon: 'search',
    toolTip: 'Explore research data',
    active: false,
    path: BROWSE_PATH,
    pageName: BROWSE_PAGENAME,
    disabled: false,
  },
  {
    title: 'Projects',
    icon: 'library_books',
    toolTip: 'Overview of the research projects on Envidat',
    active: false,
    path: PROJECTS_PATH,
    pageName: PROJECTS_PAGENAME,
    subpages: [PROJECT_DETAIL_PAGENAME],
    disabled: false,
  },
  {
    title: 'Organizations',
    icon: 'account_tree',
    toolTip: 'Overview of the different organizations',
    active: false,
    path: `${domain}/organization`,
    pageName: 'external',
    disabled: false,
  },
/*
  {
    title: 'Sign In',
    icon: 'person',
    toolTip: 'Sign in to manage your research data',
    active: false,
    path: USER_SIGNIN_PATH,
    pageName: USER_SIGNIN_PAGENAME,
    disabled: false,
  },
*/
  {
    title: 'Tools & Services',
    icon: 'design_services',
    toolTip: 'Research data tools and services',
    active: false,
    path: SERVICE_PATH,
    pageName: SERVICE_PAGENAME,
    disabled: false,
  },
  {
    title: 'Community Integration',
    icon: 'public',
    toolTip: 'EnviDat is integrated in the various research data platforms',
    active: false,
    path: INTEGRATION_PATH,
    pageName: INTEGRATION_PAGENAME,
    disabled: false,
  },
  {
    title: 'Blog',
    icon: 'auto_stories',
    toolTip: 'News and articles from the EnviDat team',
    active: false,
    path: BLOG_PATH,
    pageName: BLOG_PAGENAME,
    disabled: false,
  },
  {
    title: 'About',
    icon: 'info',
    toolTip: 'Information about EnviDat',
    active: false,
    path: ABOUT_PATH,
    pageName: ABOUT_PAGENAME,
    disabled: false,
  },
  {
    title: 'Menu',
    icon: 'menu',
    active: false,
    disabled: false,
  },
];

export const userMenuItems = [
  { title: 'Dashboard', icon: 'dashboard', toolTip: 'My Dashboard', active: false, path: USER_DASHBOARD_PATH, pageName: USER_DASHBOARD_PAGENAME },
  // { title: 'Create Dataset', icon: 'add_cricle_outline', toolTip: 'Create a new dataset', active: false, path: 'createDataset', pageName: 'CreateDataset' },
  // { title: 'Edit Profile', icon: 'edit', toolTip: 'Edit profile', active: false, path: 'profile', pageName: 'EditProfile' },
  { title: 'Sign out', icon: 'logout', toolTip: 'Sign out', active: false, path: USER_SIGNOUT_PATH, pageName: '' },
];

/* eslint-disable object-curly-newline */

import {
  // LANDING_PATH,
  // LANDING_PAGENAME,
  BROWSE_PATH,
  BROWSE_PAGENAME,
  PROJECTS_PATH,
  PROJECTS_PAGENAME,
  PROJECT_DETAIL_PAGENAME,
  ABOUT_PATH,
  ABOUT_PAGENAME,
  USER_SIGNIN_PATH,
  USER_SIGNIN_PAGENAME,
  USER_SIGNOUT_PATH,
} from '@/router/routeConsts';

export const navigationItems = [
  // { title: 'Home', icon: 'envidat', toolTip: 'Back to the start page', active: false, path: LANDING_PATH, pageName: LANDING_PAGENAME },
  { title: 'Explore', icon: 'search', toolTip: 'Explore research data', active: false, path: BROWSE_PATH, pageName: BROWSE_PAGENAME },
  { title: 'Projects', icon: 'library_books', toolTip: 'Overview of the research projects on envidat', active: false, path: PROJECTS_PATH, pageName: PROJECTS_PAGENAME, subpages: [PROJECT_DETAIL_PAGENAME] },
  { title: 'Organizations', icon: 'account_tree', toolTip: 'Overview of the different organizations', active: false, path: 'https://www.envidat.ch/organization', pageName: 'external' },
  // { title: 'Guidelines', icon: 'local_library', toolTip: 'Guidlines about the creation of metadata', active: false, path: GUIDELINES_PATH, pageName: GUIDELINES_PAGENAME },
  // { title: 'Policies', icon: 'policy', toolTip: 'The rules of EnviDat', active: false, path: POLICIES_PATH, pageName: POLICIES_PAGENAME },
  // { title: 'DMP', icon: 'menu_book', toolTip: 'Template for a Data Management Plan', active: false, path: DMP_PATH, pageName: DMP_PAGENAME },
  { title: 'Sign In', icon: 'person', toolTip: 'Sign in to management research data', active: false, path: USER_SIGNIN_PATH, pageName: USER_SIGNIN_PAGENAME },
  { title: 'About', icon: 'info', toolTip: 'What is EnviDat? Who is behind EnviDat?', active: false, path: ABOUT_PATH, pageName: ABOUT_PAGENAME },
  // { title: 'Contact', icon: 'contact_support', toolTip: 'Do you need support?', active: false },
  { title: 'Menu', icon: 'menu', active: false },
];

export const userMenuItems = [
  { title: 'Dashboard', icon: 'dashboard', toolTip: 'My Dashboard', active: false, path: 'dashboard', pageName: 'UserDashboard' },
  // { title: 'Create Dataset', icon: 'add_cricle_outline', toolTip: 'Create a new dataset', active: false, path: 'createDataset', pageName: 'CreateDataset' },
  // { title: 'Edit Profile', icon: 'edit', toolTip: 'Edit profile', active: false, path: 'profile', pageName: 'EditProfile' },
  { title: 'Sign out', icon: 'logout', toolTip: 'Sign out', active: false, path: USER_SIGNOUT_PATH, pageName: '' },
];

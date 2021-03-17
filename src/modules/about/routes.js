import {
  ABOUT_PATH,
  ABOUT_PAGENAME,
  POLICIES_PATH,
  GUIDELINES_PATH,
  DMP_PATH,
} from '@/router/routeConsts';

export const aboutRoutes = [
  {
    path: `${ABOUT_PATH}/:tab`,
    name: ABOUT_PAGENAME,
    component: () => import(/* webpackPrefetch: true, webpackChunkName: "aboutPage" */ '@/modules/about/components/AboutPage'),
  },
  {
    path: ABOUT_PATH,
    // redirect from onyl /about to /about/about for consistency
    // with the defined :tab parameter above
    redirect: `${ABOUT_PATH}${ABOUT_PATH}`,
  },
  {
    path: POLICIES_PATH,
    redirect: `${ABOUT_PATH}${POLICIES_PATH}`,
  },
  {
    path: GUIDELINES_PATH,
    redirect: `${ABOUT_PATH}${GUIDELINES_PATH}`,
  },
  {
    path: DMP_PATH,
    redirect: `${ABOUT_PATH}${DMP_PATH}`,
  },
];

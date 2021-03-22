import {
  LANDING_PATH,
  LANDING_PAGENAME,
} from '@/router/routeConsts';

export const homeRoutes = [
  {
    path: LANDING_PATH,
    name: LANDING_PAGENAME,
    component: () => import(/* webpackPrefetch: true, webpackChunkName: "landingPage" */ '@/modules/home/components/LandingPage'),
  },
];

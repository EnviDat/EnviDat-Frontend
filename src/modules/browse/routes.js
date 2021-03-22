import {
  BROWSE_PATH,
  BROWSE_PAGENAME,
} from '@/router/routeConsts';

export const browseRoutes = [
  {
    path: BROWSE_PATH,
    name: BROWSE_PAGENAME,
    component: () => import(/* webpackPrefetch: true, webpackChunkName: "browsePage" */ '@/modules/browse/BrowsePage'),
  },
];

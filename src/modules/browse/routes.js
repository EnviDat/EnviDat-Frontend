import { BROWSE_PAGENAME,BROWSE_PATH } from '@/router/routeConsts';

export const browseRoutes = [
  {
    path: BROWSE_PATH,
    name: BROWSE_PAGENAME,
    component: () => import('@/modules/browse/BrowsePage.vue'),
  },
];

import {
  BROWSE_PAGENAME,
  BROWSE_PATH,
} from '@/router/routeConsts';

const BrowsePage = () => import('@/modules/browse/BrowsePage.vue');

export const browseRoutes = [
  {
    path: BROWSE_PATH,
    name: BROWSE_PAGENAME,
    component: BrowsePage,
  },
];

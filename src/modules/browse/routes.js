import {
  BROWSE_PAGENAME,
  BROWSE_PATH,
  BROWSE_MODE_PATH,
  BROWSE_MODE_PAGENAME,
} from '@/router/routeConsts';

const BrowsePage = () => import('@/modules/browse/BrowsePage.vue');
const BrowseMode = () => import('@/modules/browse/BrowseMode.vue');

export const browseRoutes = [
  {
    path: BROWSE_PATH,
    name: BROWSE_PAGENAME,
    component: BrowsePage,
  },
  {
    path: BROWSE_MODE_PATH,
    name: BROWSE_MODE_PAGENAME,
    component: BrowseMode,
  },
];

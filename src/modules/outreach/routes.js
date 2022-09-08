import {
  COMMUNITY_PAGENAME,
  COMMUNITY_PATH,
} from '@/router/routeConsts';

export const communityRoutes = [
  {
    path: COMMUNITY_PATH,
    name: COMMUNITY_PAGENAME,
    component: () => import(/* webpackPrefetch: true, webpackChunkName: "communityPage" */ '@/modules/community/components/CommunityPage'),
  },
];

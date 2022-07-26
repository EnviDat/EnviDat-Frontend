import { LANDING_PAGENAME,LANDING_PATH } from '@/router/routeConsts';

export const homeRoutes = [
  {
    path: LANDING_PATH,
    name: LANDING_PAGENAME,
    component: () => import('@/modules/home/components/LandingPage.vue'),
  },
];

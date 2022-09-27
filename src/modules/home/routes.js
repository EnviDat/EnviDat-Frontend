import {
  LANDING_PAGENAME,
  LANDING_PATH,
} from '@/router/routeConsts';

const LandingPage = () => import('@/modules/home/components/LandingPage.vue');

export const homeRoutes = [
  {
    path: LANDING_PATH,
    name: LANDING_PAGENAME,
    component: LandingPage,
  },
];

import { LANDING_PAGENAME, LANDING_PATH } from '@/router/routeConsts';
import store from '@/store/store';

const LandingPage = () => import('@/modules/home/components/LandingPage.vue');

const beforeEnter = async (to, from, next) => {
  await store.state.asyncLoadStoreModule('blog');
  next();
};

export const homeRoutes = [
  {
    path: LANDING_PATH,
    name: LANDING_PAGENAME,
    component: LandingPage,
    beforeEnter,
  },
];

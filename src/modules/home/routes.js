import {
  LANDING_PAGENAME,
  LANDING_PATH,
} from '@/router/routeConsts';
import store from '@/store/store';
import { SET_CURRENT_PAGE } from '@/store/mainMutationsConsts.js';

const LandingPage = () => import('@/modules/home/components/LandingPage.vue');

const beforeEnter = async (to, from, next)=> {
  await store.state.asyncLoadStoreModule('blog');
  store.commit(SET_CURRENT_PAGE, LANDING_PAGENAME);
  next();
}

export const homeRoutes = [
  {
    path: LANDING_PATH,
    name: LANDING_PAGENAME,
    component: LandingPage,
    beforeEnter,
  },
];

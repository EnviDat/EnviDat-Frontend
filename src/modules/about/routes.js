import {
  ABOUT_PAGENAME,
  ABOUT_PATH,
  DMP_PATH,
  GUIDELINES_PATH,
  POLICIES_PATH,
} from '@/router/routeConsts';
import { importStoreModule } from '@/factories/enhancementsFactory';
import store from '@/store/store';

const AboutPage = () => import('@/modules/about/components/AboutPage.vue');

export const aboutRoutes = [
  {
    path: `${ABOUT_PATH}/:tab`,
    name: ABOUT_PAGENAME,
    component: AboutPage,
    // props: true,
    beforeEnter: (to, from, next) => {
      const importFun = () => import('@/modules/about/store/aboutStore');
      importStoreModule(store, 'about', importFun)
        .then(() => { next() });
    },
  },
  {
    path: ABOUT_PATH,
    // redirect from onyl /about to /about/about for consistency
    // with the defined :tab parameter above
    redirect: `${ABOUT_PATH}${ABOUT_PATH}`,
  },
  {
    path: POLICIES_PATH,
    redirect: `${ABOUT_PATH}${POLICIES_PATH}`,
  },
  {
    path: GUIDELINES_PATH,
    redirect: `${ABOUT_PATH}${GUIDELINES_PATH}`,
  },
  {
    path: DMP_PATH,
    redirect: `${ABOUT_PATH}${DMP_PATH}`,
  },
];

import { INTEGRATION_PAGENAME, INTEGRATION_PATH } from '@/router/routeConsts';
import store from '@/store/store';

const IntegrationPage = () => import('@/modules/integration/components/IntegrationPage.vue');

const beforeEnter = async (to, from, next) => {
  await store.state.asyncLoadStoreModule('integration');
  next();
};

export const integrationRoutes = [
  {
    path: INTEGRATION_PATH,
    name: INTEGRATION_PAGENAME,
    component: IntegrationPage,
    beforeEnter,
  },
];

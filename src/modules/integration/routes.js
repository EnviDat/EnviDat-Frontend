import {
  INTEGRATION_PAGENAME,
  INTEGRATION_PATH,
} from '@/router/routeConsts';
import { importStoreModule } from '@/factories/enhancementsFactory';
import store from '@/store/store';

const IntegrationPage = () => import('@/modules/integration/components/IntegrationPage.vue');

const beforeEnter = (to, from, next)=> {
  const moduleKey = 'integration';
  const importFun = () => import('@/modules/integration/store/integrationStore');
  importStoreModule(store, moduleKey, importFun).then(() => { next() });
}

export const integrationRoutes = [
  {
    path: INTEGRATION_PATH,
    name: INTEGRATION_PAGENAME,
    component: IntegrationPage,
    beforeEnter,
  },
];

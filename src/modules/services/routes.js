import {
  SERVICE_PAGENAME,
  SERVICE_PATH,
} from '@/router/routeConsts';
import { importStoreModule } from '@/factories/enhancementsFactory';
import store from '@/store/store';

const ServicePage = () => import('@/modules/services/components/ServicePage.vue');

const beforeEnter = (to, from, next)=> {
  const moduleKey = 'service';
  const importFun = () => import('@/modules/services/store/serviceStore');
  importStoreModule(store, moduleKey, importFun).then(() => { next() });
}

export const serviceRoutes = [
  {
    path: SERVICE_PATH,
    name: SERVICE_PAGENAME,
    component: ServicePage,
    beforeEnter,
  },
];

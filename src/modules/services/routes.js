import {
  SERVICE_PAGENAME,
  SERVICE_PATH,
} from '@/router/routeConsts';
import store from '@/store/store';

const ServicePage = () => import('@/modules/services/components/ServicePage.vue');

const beforeEnter = async (to, from, next)=> {
  await store.state.asyncLoadStoreModule('service');
  next();
}

export const serviceRoutes = [
  {
    path: SERVICE_PATH,
    name: SERVICE_PAGENAME,
    component: ServicePage,
    beforeEnter,
  },
];

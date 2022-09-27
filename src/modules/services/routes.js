import {
  SERVICE_PAGENAME,
  SERVICE_PATH,
} from '@/router/routeConsts';

const ServicePage = () => import('@/modules/services/components/ServicePage.vue');

export const serviceRoutes = [
  {
    path: SERVICE_PATH,
    name: SERVICE_PAGENAME,
    component: ServicePage,
  },
];

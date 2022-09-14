import {
  SERVICE_PAGENAME,
  SERVICE_PATH,
} from '@/router/routeConsts';

export const serviceRoutes = [
  {
    path: SERVICE_PATH,
    name: SERVICE_PAGENAME,
    component: () => import(/* webpackPrefetch: true, webpackChunkName: "servicePage" */ '@/modules/services/components/ServicePage'),
  },
];

import {
  INTEGRATION_PAGENAME,
  INTEGRATION_PATH,
} from '@/router/routeConsts';

export const integrationRoutes = [
  {
    path: INTEGRATION_PATH,
    name: INTEGRATION_PAGENAME,
    component: () => import(/* webpackPrefetch: true, webpackChunkName: "integrationPage" */ '@/modules/integration/components/IntegrationPage'),
  },
];

import {
  INTEGRATION_PAGENAME,
  INTEGRATION_PATH,
} from '@/router/routeConsts';

const IntegrationPage = () => import('@/modules/integration/components/IntegrationPage.vue');

export const integrationRoutes = [
  {
    path: INTEGRATION_PATH,
    name: INTEGRATION_PAGENAME,
    component: IntegrationPage,
  },
];

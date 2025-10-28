import { ORGANIZATIONS_PAGENAME, ORGANIZATIONS_PATH } from '@/router/routeConsts';

const OrganizationPage = () => import('@/modules/organizations/components/OrganizationPage.vue');

export const organizationsRoutes = [
  {
    path: `${ORGANIZATIONS_PATH}/:organization?`,
    name: ORGANIZATIONS_PAGENAME,
    component: OrganizationPage,
  },
];

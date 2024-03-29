/**
 * routes for the user module
 *
 * @summary routes of user module
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 14:20:05
 * Last modified  : 2021-07-29 09:41:31
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  METADATA_CREATION_PAGENAME,
  METADATA_CREATION_PATH,
  METADATAEDIT_PAGENAME,
  METADATAEDIT_PATH,
  USER_DASHBOARD_PAGENAME,
  USER_DASHBOARD_PATH,
  USER_SIGNIN_PAGENAME,
  USER_SIGNIN_PATH,
} from '@/router/routeConsts';

const SigninPage = () => import('@/modules/user/components/SigninPage.vue');
const DashboardPage = () => import('@/modules/user/components/DashboardPage.vue');
const MetadataEditPage = () => import('@/modules/user/components/MetadataEditPage.vue');
const MetadataCreationPage = () => import('@/modules/user/components/MetadataCreationPage.vue');

export const userRoutes = [
  {
    path: USER_SIGNIN_PATH,
    name: USER_SIGNIN_PAGENAME,
    component: SigninPage,
  },
  {
    path: USER_DASHBOARD_PATH,
    name: USER_DASHBOARD_PAGENAME,
    component: DashboardPage,
  },
  {
    path: METADATAEDIT_PATH,
    name: METADATAEDIT_PAGENAME,
    component: MetadataEditPage,
    children: [
      {
        path: `${METADATAEDIT_PATH}/:metadataid/:step?/:substep?`,
        name: METADATAEDIT_PAGENAME,
        component: MetadataEditPage,
      },
    ],
  },
  {
    path: METADATA_CREATION_PATH,
    name: METADATA_CREATION_PAGENAME,
    component: MetadataCreationPage,
    children: [
      {
        path: `${METADATA_CREATION_PATH}/:step?/:substep?`,
        name: METADATA_CREATION_PAGENAME,
        component: MetadataCreationPage,
      },
    ],
  },
];

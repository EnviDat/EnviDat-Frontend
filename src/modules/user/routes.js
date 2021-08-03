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
  USER_SIGNIN_PATH,
  USER_SIGNIN_PAGENAME,
  USER_DASHBOARD_PATH,
  USER_DASHBOARD_PAGENAME,
  METADATAEDIT_PATH,
  METADATAEDIT_PAGENAME,
} from '@/router/routeConsts';

export const userRoutes = [
  {
    path: USER_SIGNIN_PATH,
    name: USER_SIGNIN_PAGENAME,
    component: () => import(/* webpackPrefetch: true, webpackChunkName: "signinPage" */ '@/modules/user/components/SigninPage'),
  },
  {
    path: '/user/:id',
    name: 'user',
    component: () => import(/* webpackPrefetch: true, webpackChunkName: "userModule" */ '@/modules/user/UserModule'),
    children: [
      {
        path: USER_DASHBOARD_PATH,
        name: USER_DASHBOARD_PAGENAME,
        component: () => import(/* webpackPrefetch: true, webpackChunkName: "dashboardPage" */ '@/modules/user/components/DashboardPage'),
      },
    ],
  },
  {
    path: METADATAEDIT_PATH,
    name: METADATAEDIT_PAGENAME,
    component: () => import(/* webpackPrefetch: true, webpackChunkName: "metadataEditPage" */ '@/modules/user/components/MetadataEditPage'),
  },
];

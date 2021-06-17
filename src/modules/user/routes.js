/**
 * routes for the user module
 *
 * @summary routes of user module
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 14:20:05 
 * Last modified  : 2020-08-12 16:11:24
 * 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  USER_SIGNIN_PATH,
  USER_SIGNIN_PAGENAME,
  USER_DASHBOARD_PATH,
  USER_DASHBOARD_PAGENAME,
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
    component: () => import(/* webpackPrefetch: true, webpackChunkName: "signinPage" */ '@/modules/user/UserModule'),
    children: [
      {
        path: USER_DASHBOARD_PATH,
        name: USER_DASHBOARD_PAGENAME,
        component: () => import(/* webpackPrefetch: true, webpackChunkName: "dashboardPage" */ '@/modules/user/components/DashboardPage'),
      },
    ],
  },
];

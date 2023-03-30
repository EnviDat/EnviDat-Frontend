/**
 * main vue-router file. it lists all the possible routes.
 *
 * @summary list of the routes
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:33:32
 * Last modified  : 2021-01-27 07:23:55
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable prefer-template */
import Vue from 'vue';
import Router from 'vue-router';
import {
  GCMD_PATH,
  GCMD_PAGENAME,
  REPORT_PATH,
  REPORT_PAGENAME,
  PAGENOTFOUND_PAGENAME,
} from '@/router/routeConsts';

import { homeRoutes } from '@/modules/home/routes';
import { browseRoutes } from '@/modules/browse/routes';
import { metadataRoutes } from '@/modules/metadata/routes';
import { projectsRoutes } from '@/modules/projects/routes';
import { aboutRoutes } from '@/modules/about/routes';

import { userRoutes } from '@/modules/user/routes';
import { blogRoutes } from '@/modules/blog/routes';
import { integrationRoutes } from '@/modules/integration/routes';
import { serviceRoutes } from '@/modules/services/routes';

const ReportPage = () => import('@/components/Pages/ReportPage.vue');
const GCMDPage = () => import('@/components/Pages/GCMDPage.vue');
const NotFoundPage = () => import('@/components/Pages/PageNotFound.vue');

Vue.use(Router);

const START = '/';
const trailingSlashRE = /\/?$/;
const routes = [
  {
    path: GCMD_PATH,
    name: GCMD_PAGENAME,
    component: GCMDPage,
  },
  {
    path: REPORT_PATH,
    name: REPORT_PAGENAME,
    component: ReportPage,
  },
  /* The not found route needs to be last in the list! */
  {
    path: '/:catchAll(.*)',
    name: PAGENOTFOUND_PAGENAME,
    component: NotFoundPage,
  },
];


export default new Router({
  routes: [
    ...homeRoutes,
    ...browseRoutes,
    ...metadataRoutes,
    ...projectsRoutes,
    ...aboutRoutes,
    ...userRoutes,
    ...blogRoutes,
    ...integrationRoutes,
    ...serviceRoutes,
    ...routes,
  ],
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(() => {
          if (savedPosition) {
            return savedPosition;
          }

          return { x: 0, y: 0 };
        });
      }, 450);
    });
  },
  // methods is available as this.$router.options.isObjectEqual
  isObjectEqual(a, b) {
    // if (a === void 0) a = {};
    // if (b === void 0) b = {};
    if (a === null) a = {};
    if (b === null) b = {};

    // handle null value #1566
    if (!a || !b) { return a === b; }

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) {
      return false;
    }

    return aKeys.every((key) => {
      const aVal = a[key];
      const bVal = b[key];
      // check nested equality
      if (typeof aVal === 'object' && typeof bVal === 'object') {
        return this.isObjectEqual(aVal, bVal);
      }
      return String(aVal) === String(bVal);
    });
  },
  // methods is available as this.$router.options.isSameRoute
  isSameRoute(a, b) {
    if (b === START) {
      return a === b;
    }

    if (!b) {
      return false;
    }

    if (a.path && b.path) {
      return (
        a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '')
        && a.hash === b.hash
        && this.isObjectEqual(a.query, b.query)
      );
    }

    if (a.name && b.name) {
      return (
        a.name === b.name
        && a.hash === b.hash
        && this.isObjectEqual(a.query, b.query)
        && this.isObjectEqual(a.params, b.params)
      );
    }

    return false;
  },
});

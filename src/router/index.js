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
import {
  createRouter,
  createWebHashHistory,
} from 'vue-router';

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
import { serviceRoutes } from '@/modules/services/routes';
import { integrationRoutes } from '@/modules/integration/routes';
import { aboutRoutes } from '@/modules/about/routes';
import { trackEvent } from '@/utils/matomoTracking';
import { userRoutes } from '@/modules/user/routes';
import { blogRoutes } from '@/modules/blog/routes';
import { organizationsRoutes } from '@/modules/organizations/routes';

const gcmdPage = () => import('@/components/Pages/GCMDPage.vue');
const reportPage = () => import('@/components/Pages/ReportPage.vue');
const pageNotFound = () => import('@/components/Pages/PageNotFound.vue');

const START = '/';
const trailingSlashRE = /\/?$/;
const routes = [
  {
    path: GCMD_PATH,
    name: GCMD_PAGENAME,
    component: gcmdPage,
  },
  {
    path: REPORT_PATH,
    name: REPORT_PAGENAME,
    component: reportPage,
  },
  /* The not found route needs to be last in the list! */
  {
    path: '/:pathMatch(.*)*',
    name: PAGENOTFOUND_PAGENAME,
    component: pageNotFound,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...homeRoutes,
    ...browseRoutes,
    ...metadataRoutes,
    ...projectsRoutes,
    ...organizationsRoutes,
    ...aboutRoutes,
    ...userRoutes,
    ...serviceRoutes,
    ...integrationRoutes,
    ...blogRoutes,
    ...routes,
  ],
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(() => {
          if (savedPosition) {
            return savedPosition;
          }

          return { left: 0, top: 0 };
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
    if (!a || !b) {
      return a === b;
    }

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) {
      return false;
    }

    return aKeys.every(key => {
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
        a.path.replace(trailingSlashRE, '') ===
          b.path.replace(trailingSlashRE, '') &&
        a.hash === b.hash &&
        this.isObjectEqual(a.query, b.query)
      );
    }

    if (a.name && b.name) {
      return (
        a.name === b.name &&
        a.hash === b.hash &&
        this.isObjectEqual(a.query, b.query) &&
        this.isObjectEqual(a.params, b.params)
      );
    }

    return false;
  },
  /**
   * Changes the route via this.$router.push();
   * The search and tag parameter are added as query parameters.
   * urlSubPath is added as the path.
   *
   * @param {Object} route
   * @param {Object} router
   * @param {String} basePath the path of the route
   * @param {String} search search term
   * @param {String} tags encoded string
   * @param {String} mode which defines the mode for the special view
   * @param {Array} pins array of ids for the pinned metadatas
   * @param {String} isAuthorSearch if true the search term will only be compared against authors
   */
  additiveChangeRoute(route, routerObj, basePath, search, tags, mode = undefined, pins = undefined, isAuthorSearch = undefined) {
    const query = {};
    Object.assign(query, route.query);

    if (search !== undefined) {
      query.search = search;
    }

    if (tags !== undefined) {
      query.tags = tags;
    }

    if (mode !== undefined) {
      query.mode = mode;
    }

    if (pins !== undefined) {
      query.pins = pins;
    }

    if (isAuthorSearch !== undefined) {
      query.isAuthorSearch = typeof isAuthorSearch !== 'string' ? isAuthorSearch.toString() : isAuthorSearch;
    }

    routerObj.push({
      path: basePath,
      query,
    });
  },
});

router.beforeEach((to, from, next) => {
  trackEvent('PageView', 'Visit', to.path);
  next();
});

export default router;

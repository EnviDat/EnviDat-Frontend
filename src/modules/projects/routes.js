import {
  PROJECTS_PATH,
  PROJECTS_PAGENAME,
  PROJECT_DETAIL_PATH,
  PROJECT_DETAIL_PAGENAME,
} from '@/router/routeConsts';

export const projectsRoutes = [
  {
    path: PROJECTS_PATH,
    name: PROJECTS_PAGENAME,
    component: () => import(/* webpackPrefetch: true, webpackChunkName: "projectsPage" */ '@/modules/projects/components/ProjectsPage'),
  },
  {
    path: `${PROJECT_DETAIL_PATH}/:id`,
    name: PROJECT_DETAIL_PAGENAME,
    component: () => import(/* webpackPrefetch: true, webpackChunkName: "projectDetailPage" */ '@/modules/projects/components/ProjectDetailPage'),
  },
];

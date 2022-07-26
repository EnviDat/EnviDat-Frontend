import {
  PROJECT_DETAIL_PAGENAME,
  PROJECT_DETAIL_PATH,
  PROJECTS_PAGENAME,
  PROJECTS_PATH,
} from '@/router/routeConsts';

export const projectsRoutes = [
  {
    path: PROJECTS_PATH,
    name: PROJECTS_PAGENAME,
    component: () => import('@/modules/projects/components/ProjectsPage.vue'),
  },
  {
    path: `${PROJECT_DETAIL_PATH}/:id`,
    name: PROJECT_DETAIL_PAGENAME,
    component: () =>
      import('@/modules/projects/components/ProjectDetailPage.vue'),
  },
];

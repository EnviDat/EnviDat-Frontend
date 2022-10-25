import {
  PROJECT_DETAIL_PAGENAME,
  PROJECT_DETAIL_PATH,
  PROJECTS_PAGENAME,
  PROJECTS_PATH,
} from '@/router/routeConsts';

const ProjectsPage = () => import('@/modules/projects/components/ProjectsPage.vue');
const ProjectDetailPage = () => import('@/modules/projects/components/ProjectDetailPage.vue');

export const projectsRoutes = [
  {
    path: PROJECTS_PATH,
    name: PROJECTS_PAGENAME,
    component: ProjectsPage,
  },
  {
    path: `${PROJECT_DETAIL_PATH}/:id`,
    name: PROJECT_DETAIL_PAGENAME,
    component: ProjectDetailPage,
  },
];

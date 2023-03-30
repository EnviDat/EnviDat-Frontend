import {
  PROJECT_DETAIL_PAGENAME,
  PROJECT_DETAIL_PATH,
  PROJECTS_PAGENAME,
  PROJECTS_PATH,
} from '@/router/routeConsts';

import { importStoreModule } from '@/factories/enhancementsFactory';
import store from '@/store/store';

const ProjectsPage = () => import('@/modules/projects/components/ProjectsPage.vue');
const ProjectDetailPage = () => import('@/modules/projects/components/ProjectDetailPage.vue');

const beforeEnter = (to, from, next)=> {
  const moduleKey = 'projects';
  const importFun = () => import('@/modules/projects/store/projectsStore');
  importStoreModule(store, moduleKey, importFun).then(() => { next() });
}

export const projectsRoutes = [
  {
    path: PROJECTS_PATH,
    name: PROJECTS_PAGENAME,
    component: ProjectsPage,
    beforeEnter,
  },
  {
    path: `${PROJECT_DETAIL_PATH}/:id`,
    name: PROJECT_DETAIL_PAGENAME,
    component: ProjectDetailPage,
    beforeEnter,
  },
];

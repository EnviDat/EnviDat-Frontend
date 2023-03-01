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

export const projectsRoutes = [
  {
    path: PROJECTS_PATH,
    name: PROJECTS_PAGENAME,
    component: ProjectsPage,
    beforeEnter: (to, from, next) => {
      const importFun = () => import('@/modules/projects/store/projectsStore');
      importStoreModule(store, 'projects', importFun)
        .then(() => { next() });
    },
  },
  {
    path: `${PROJECT_DETAIL_PATH}/:id`,
    name: PROJECT_DETAIL_PAGENAME,
    component: ProjectDetailPage,
    beforeEnter: (to, from, next) => {
      const importFun = () => import('@/modules/projects/store/projectsStore');
      importStoreModule(store, 'projects', importFun)
        .then(() => { next() });
    },
  },
];

import {
  BLOG_PAGENAME,
  BLOG_PATH,
} from '@/router/routeConsts';
import { importStoreModule } from '@/factories/enhancementsFactory';
import store from '@/store/store';

const BlogPage = () => import('@/modules/blog/components/BlogPage.vue');
const beforeEnter = (to, from, next)=> {
  const moduleKey = 'blog';
  const importFun = () => import('@/modules/blog/store/blogStore');
  importStoreModule(store, moduleKey, importFun).then(() => { next() });
}

export const blogRoutes = [
  {
    path: `${BLOG_PATH}`,
    name: BLOG_PAGENAME,
    component: BlogPage,
    beforeEnter,
    children: [
      {
        path: `${BLOG_PATH}/:post`,
        name: BLOG_PAGENAME,
        component: BlogPage,
        beforeEnter,
      },
    ],
  },
];

import {
  BLOG_PAGENAME,
  BLOG_PATH,
} from '@/router/routeConsts';
// import { importStoreModule } from '@/factories/enhancementsFactory';
import store from '@/store/store';

const BlogPage = () => import('@/modules/blog/components/BlogPage.vue');

/*
const beforeEnter = async (to, from, next)=> {
  const moduleKey = 'blog';
  const importFun = () => import('@/modules/blog/store/blogStore');
  await importStoreModule(store, moduleKey, importFun);
  next();
}
*/

const beforeEnter = async (to, from, next)=> {
  await store.state.asyncLoadStoreModule('blog');
  next();
}

export const blogRoutes = [
  {
    path: `${BLOG_PATH}/:post?`,
    name: BLOG_PAGENAME,
    component: BlogPage,
    beforeEnter,
  },
];

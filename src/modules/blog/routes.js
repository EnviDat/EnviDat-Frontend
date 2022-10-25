import {
  BLOG_PAGENAME,
  BLOG_PATH,
} from '@/router/routeConsts';

const BlogPage = () => import('@/modules/blog/components/BlogPage.vue');

export const blogRoutes = [
  {
    path: `${BLOG_PATH}`,
    name: BLOG_PAGENAME,
    component: BlogPage,
    children: [
      {
        path: `${BLOG_PATH}/:post`,
        name: BLOG_PAGENAME,
        component: BlogPage,
      },
    ],
  },
];
